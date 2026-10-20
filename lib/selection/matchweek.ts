import { formatLondonDateInput } from "../fixtures/datetime";
import type { FixtureStatus, TeamGender } from "../db/models/fixture";

import {
  buildSelection,
  type SelectionPlayer,
  type SelectionResponse,
  type SelectionResult,
} from "./build-selection";

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
  /** Distinct players with any response across the matchweek's fixtures. */
  respondedPlayerCount: number;
  availablePlayerCount: number;
  unavailablePlayerCount: number;
};

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

/**
 * Build the T07 selection for one matchweek.
 *
 * Responses are merged per player across the group's fixtures: a player who
 * answered several fixtures is counted once, and "available" wins when their
 * answers disagree. Callers must scope `responses` to the group's fixtures.
 */
export function buildMatchweekSelection<T extends MatchweekFixture>(input: {
  matchweek: Matchweek<T>;
  players: SelectionPlayer[];
  responses: SelectionResponse[];
}): MatchweekSelection {
  const statusByPlayer = new Map<string, SelectionResponse["status"]>();
  for (const response of input.responses) {
    const existing = statusByPlayer.get(response.playerId);
    if (!existing || response.status === "available") {
      statusByPlayer.set(response.playerId, response.status);
    }
  }

  const mergedResponses: SelectionResponse[] = [...statusByPlayer].map(
    ([playerId, status]) => ({ playerId, status })
  );

  const result = buildSelection({
    players: input.players,
    responses: mergedResponses,
    teamsPlaying: input.matchweek.fixtures.length,
  });

  const availablePlayerCount = [...statusByPlayer.values()].filter(
    (status) => status === "available"
  ).length;

  return {
    result,
    respondedPlayerCount: statusByPlayer.size,
    availablePlayerCount,
    unavailablePlayerCount: statusByPlayer.size - availablePlayerCount,
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
