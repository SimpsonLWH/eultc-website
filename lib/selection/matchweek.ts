import { formatLondonDateInput } from "../fixtures/datetime";
import { eligibleTeams } from "../availability/eligibility";
import type { FixtureStatus, TeamGender } from "../db/models/fixture";

import {
  type SelectionPlayer,
  type SelectionResponse,
  type SelectionResult,
  type SelectionSlot,
  type SelectionTeam,
} from "./build-selection";
import type { Fixture } from "../db/models/fixture";

/**
 * T08 - matchweek rules.
 *
 * A matchweek is every published fixture sharing a London kick-off date and
 * gender. Selection runs across the group: the strongest-first T07 engine
 * fills N teams of four, one team per fixture, ordered by teamNumber.
 */

/** The minimal fixture shape needed to group and select a matchweek. */
export type MatchweekFixture = {
  date: Date;
  gender: TeamGender;
  teamNumber: number;
  status: FixtureStatus;
};

export type Matchweek<T extends MatchweekFixture = MatchweekFixture> = {
  /** Stable grouping key: London kick-off date plus gender. */
  key: string;
  gender: TeamGender;
  /** Kick-off date shared by every fixture in the group. */
  date: Date;
  /** Fixtures ordered by teamNumber ascending, so team 1 is fixtures[0]. */
  fixtures: T[];
};

export type MatchweekSelection = {
  result: SelectionResult;
  /** Four ordered reserve slots after the selected teams. */
  reserves: SelectionReserve[];
  /** Distinct players with any response across the matchweek's fixtures. */
  respondedPlayerCount: number;
  availablePlayerCount: number;
  unavailablePlayerCount: number;
};

export type MatchweekResponse = SelectionResponse & {
  fixtureId: string;
};

export type SelectionReserve = {
  position: number;
  playerId: string | null;
};

/** A persisted fixture document: schema fields plus its stored id. */
export type FixtureWithId = Fixture & { _id: unknown };

/** Grouping key uses the London wall-clock date, not the UTC date. */
export function matchweekKey(date: Date, gender: TeamGender): string {
  return `${formatLondonDateInput(date)}|${gender}`;
}

/**
 * Group fixtures into matchweeks, excluding drafts and cancelled fixtures.
 * Teams within a group are ordered by teamNumber; groups by kick-off date.
 */
export function groupFixturesIntoMatchweeks<T extends MatchweekFixture>(
  fixtures: T[]
): Matchweek<T>[] {
  const groups = new Map<string, Matchweek<T>>();
  for (const fixture of fixtures) {
    if (fixture.status === "draft" || fixture.status === "cancelled") {
      continue;
    }
    const key = matchweekKey(fixture.date, fixture.gender);
    const existing = groups.get(key);
    if (existing) {
      existing.fixtures.push(fixture);
    } else {
      groups.set(key, {
        key,
        gender: fixture.gender,
        date: fixture.date,
        fixtures: [fixture],
      });
    }
  }

  for (const group of groups.values()) {
    group.fixtures.sort((a, b) => a.teamNumber - b.teamNumber);
  }

  return [...groups.values()].sort(
    (a, b) =>
      a.date.getTime() - b.date.getTime() || a.gender.localeCompare(b.gender)
  );
}

function compareByRank(a: SelectionPlayer, b: SelectionPlayer): number {
  if (a.rankingPosition !== b.rankingPosition) {
    return a.rankingPosition - b.rankingPosition;
  }
  return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
}

function emptyReserveSlots(): SelectionReserve[] {
  return Array.from({ length: 4 }, (_, index) => ({
    position: index + 1,
    playerId: null,
  }));
}

/**
 * Build the T07 selection for one matchweek.
 *
 * Availability is scoped to the fixture it answers. A player is considered
 * only for fixtures their rank allows, can be selected once, and unavailable
 * responses never remove an available answer for the same fixture.
 */
export function buildMatchweekSelection<
  T extends MatchweekFixture & { _id: unknown },
>(input: {
  matchweek: Matchweek<T>;
  players: SelectionPlayer[];
  responses: MatchweekResponse[];
}): MatchweekSelection {
  const fixturesById = new Map(
    input.matchweek.fixtures.map((fixture) => [String(fixture._id), fixture])
  );
  const playersById = new Map(
    input.players
      .filter((player) => player.isActive)
      .map((player) => [player.id, player])
  );
  const sortedPlayers = [...playersById.values()].sort(compareByRank);
  const statusByFixture = new Map<
    string,
    Map<string, SelectionResponse["status"]>
  >();
  const respondedPlayerIds = new Set<string>();
  const availablePlayerIds = new Set<string>();

  for (const response of input.responses) {
    const fixture = fixturesById.get(response.fixtureId);
    const player = playersById.get(response.playerId);
    if (
      !fixture ||
      !player ||
      !eligibleTeams(player.rankingPosition).includes(fixture.teamNumber)
    ) {
      continue;
    }

    const fixtureResponses =
      statusByFixture.get(response.fixtureId) ??
      new Map<string, SelectionResponse["status"]>();
    const existing = fixtureResponses.get(response.playerId);
    if (!existing || response.status === "available") {
      fixtureResponses.set(response.playerId, response.status);
    }
    statusByFixture.set(response.fixtureId, fixtureResponses);
    respondedPlayerIds.add(response.playerId);
    if (response.status === "available") {
      availablePlayerIds.add(response.playerId);
    }
  }

  const selectedPlayerIds = new Set<string>();
  const teams: SelectionTeam[] = input.matchweek.fixtures.map(
    (fixture, fixtureIndex) => {
      const availableForFixture = statusByFixture.get(String(fixture._id));
      const eligible = sortedPlayers
        .filter(
          (player) =>
            !selectedPlayerIds.has(player.id) &&
            availableForFixture?.get(player.id) === "available"
        )
        .slice(0, 4);
      const slots: SelectionSlot[] = Array.from(
        { length: 4 },
        (_, seedIndex) => {
          const player = eligible[seedIndex];
          if (player) {
            selectedPlayerIds.add(player.id);
          }
          return {
            seed: seedIndex + 1,
            playerId: player?.id ?? null,
          };
        }
      );
      return { teamNumber: fixtureIndex + 1, slots };
    }
  );

  const selectedCount = selectedPlayerIds.size;
  const unfilledSlots = input.matchweek.fixtures.length * 4 - selectedCount;
  const result: SelectionResult = {
    teams,
    incomplete: unfilledSlots > 0,
    unfilledSlots,
  };

  const reserves = emptyReserveSlots();
  const remainingAvailable = sortedPlayers
    .filter(
      (player) =>
        availablePlayerIds.has(player.id) && !selectedPlayerIds.has(player.id)
    )
    .slice(0, reserves.length);
  for (const [index, player] of remainingAvailable.entries()) {
    reserves[index] = { position: index + 1, playerId: player.id };
  }

  return {
    result,
    reserves,
    respondedPlayerCount: respondedPlayerIds.size,
    availablePlayerCount: availablePlayerIds.size,
    unavailablePlayerCount: respondedPlayerIds.size - availablePlayerIds.size,
  };
}

/**
 * The matchweek the main sheet shows: the next upcoming one, falling back to
 * the most recent past one, or null when no published fixture exists.
 */
export function resolveDisplayMatchweek<T extends MatchweekFixture>(
  matchweeks: Matchweek<T>[],
  now = new Date()
): Matchweek<T> | null {
  const upcoming = matchweeks.find(
    (group) => group.date.getTime() >= now.getTime()
  );
  if (upcoming) {
    return upcoming;
  }

  for (let index = matchweeks.length - 1; index >= 0; index -= 1) {
    if (matchweeks[index].date.getTime() < now.getTime()) {
      return matchweeks[index];
    }
  }

  return null;
}
