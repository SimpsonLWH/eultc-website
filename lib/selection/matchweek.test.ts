import { describe, expect, it } from "vitest";

import type { TeamGender } from "@/lib/db/models/fixture";

import {
  buildMatchweekSelection,
  groupFixturesIntoMatchweeks,
  resolveDisplayMatchweek,
  type Matchweek,
  type MatchweekFixture,
  type MatchweekResponse,
} from "./matchweek";
import type { SelectionPlayer } from "./build-selection";

// Factories keep individual tests focused on the matchweek rule under test.
function makeFixture(
  gender: TeamGender,
  teamNumber: number,
  date: Date,
  overrides: Partial<MatchweekFixture> = {}
): MatchweekFixture & { _id: string } {
  return {
    _id: `fixture-${gender}-${teamNumber}`,
    gender,
    teamNumber,
    date,
    status: "open",
    ...overrides,
  };
}

function makePlayer(
  rankingPosition: number,
  overrides: Partial<SelectionPlayer> = {}
): SelectionPlayer {
  return {
    id: `player-${rankingPosition}`,
    name: `Player ${rankingPosition}`,
    rankingPosition,
    isActive: true,
    ...overrides,
  };
}

function makePlayers(count: number): SelectionPlayer[] {
  return Array.from({ length: count }, (_, index) => makePlayer(index + 1));
}

function available(
  playerId: string,
  fixtureId = "fixture-male-1"
): MatchweekResponse {
  return { playerId, fixtureId, status: "available" };
}

function allAvailable(
  players: SelectionPlayer[],
  matchweek: Matchweek<MatchweekFixture & { _id: string }>
): MatchweekResponse[] {
  return matchweek.fixtures.flatMap((fixture) =>
    players.map((player) => available(player.id, fixture._id))
  );
}

const WEDNESDAY = new Date("2026-11-04T14:00:00.000Z");

describe("groupFixturesIntoMatchweeks", () => {
  it("groups same-day same-gender fixtures and orders teams by teamNumber", () => {
    const groups = groupFixturesIntoMatchweeks([
      makeFixture("male", 2, WEDNESDAY),
      makeFixture("male", 1, WEDNESDAY),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].fixtures.map((fixture) => fixture.teamNumber)).toEqual([1, 2]);
  });

  it("splits men's and women's fixtures on the same day into separate matchweeks", () => {
    const groups = groupFixturesIntoMatchweeks([
      makeFixture("female", 1, WEDNESDAY),
      makeFixture("male", 1, WEDNESDAY),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.gender).sort()).toEqual(["female", "male"]);
  });

  it("excludes draft and cancelled fixtures", () => {
    const groups = groupFixturesIntoMatchweeks([
      makeFixture("male", 1, WEDNESDAY, { status: "draft" }),
      makeFixture("male", 2, WEDNESDAY, { status: "cancelled" }),
      makeFixture("male", 3, WEDNESDAY, { status: "open" }),
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0].fixtures).toHaveLength(1);
    expect(groups[0].fixtures[0].teamNumber).toBe(3);
  });

  it("keys the London calendar date, not the UTC date", () => {
    const lateNight = new Date("2026-11-04T23:30:00.000Z"); // 23:30 in London
    const afterMidnight = new Date("2026-11-05T00:30:00.000Z"); // 00:30 next London day

    const groups = groupFixturesIntoMatchweeks([
      makeFixture("male", 1, afterMidnight),
      makeFixture("male", 2, lateNight),
    ]);

    expect(groups).toHaveLength(2);
  });

  it("returns matchweeks sorted by kick-off date", () => {
    const groups = groupFixturesIntoMatchweeks([
      makeFixture("male", 1, new Date("2026-12-02T14:00:00.000Z")),
      makeFixture("male", 1, new Date("2026-11-04T14:00:00.000Z")),
    ]);

    expect(groups.map((group) => group.fixtures[0].date)).toEqual([
      new Date("2026-11-04T14:00:00.000Z"),
      new Date("2026-12-02T14:00:00.000Z"),
    ]);
  });
});

describe("buildMatchweekSelection", () => {
  it("fills two teams strongest-first from eight available players", () => {
    const matchweek = groupFixturesIntoMatchweeks([
      makeFixture("male", 2, WEDNESDAY),
      makeFixture("male", 1, WEDNESDAY),
    ])[0];
    const players = makePlayers(8);

    const selection = buildMatchweekSelection({
      matchweek,
      players,
      responses: allAvailable(players, matchweek),
    });

    expect(selection.result.teams).toHaveLength(2);
    expect(selection.result.teams[0].slots.map((slot) => slot.playerId)).toEqual([
      "player-1",
      "player-2",
      "player-3",
      "player-4",
    ]);
    expect(selection.result.teams[1].slots.map((slot) => slot.playerId)).toEqual([
      "player-5",
      "player-6",
      "player-7",
      "player-8",
    ]);
    expect(selection.result.incomplete).toBe(false);
    expect(selection.result.unfilledSlots).toBe(0);
    expect(selection.availablePlayerCount).toBe(8);
    expect(selection.respondedPlayerCount).toBe(8);
    expect(selection.unavailablePlayerCount).toBe(0);
  });

  it("shows one filled and three unfilled slots on the second team with five available", () => {
    const matchweek = groupFixturesIntoMatchweeks([
      makeFixture("male", 2, WEDNESDAY),
      makeFixture("male", 1, WEDNESDAY),
    ])[0];
    const players = makePlayers(5);

    const selection = buildMatchweekSelection({
      matchweek,
      players,
      responses: allAvailable(players, matchweek),
    });

    expect(selection.result.teams[1].slots.map((slot) => slot.playerId)).toEqual([
      "player-5",
      null,
      null,
      null,
    ]);
    expect(selection.result.incomplete).toBe(true);
    expect(selection.result.unfilledSlots).toBe(3);
    expect(selection.respondedPlayerCount).toBe(5);
  });

  it("returns an incomplete empty selection when nobody has signed up", () => {
    const matchweek = groupFixturesIntoMatchweeks([
      makeFixture("male", 1, WEDNESDAY),
    ])[0];

    const selection = buildMatchweekSelection({
      matchweek,
      players: makePlayers(8),
      responses: [],
    });

    expect(selection.result.teams).toHaveLength(1);
    expect(selection.result.teams[0].slots).toEqual([
      { seed: 1, playerId: null },
      { seed: 2, playerId: null },
      { seed: 3, playerId: null },
      { seed: 4, playerId: null },
    ]);
    expect(selection.result.incomplete).toBe(true);
    expect(selection.respondedPlayerCount).toBe(0);
  });

  it("deduplicates conflicting answers for one fixture, available wins", () => {
    const matchweek = groupFixturesIntoMatchweeks([
      makeFixture("male", 2, WEDNESDAY),
      makeFixture("male", 1, WEDNESDAY),
    ])[0];
    const players = makePlayers(4);

    const selection = buildMatchweekSelection({
      matchweek,
      players,
      responses: [
        available("player-1", "fixture-male-1"),
        {
          playerId: "player-1",
          fixtureId: "fixture-male-1",
          status: "unavailable",
        },
        available("player-2", "fixture-male-1"),
      ],
    });

    expect(selection.respondedPlayerCount).toBe(2);
    expect(selection.availablePlayerCount).toBe(2);
    expect(
      selection.result.teams[0].slots.map((slot) => slot.playerId)
    ).toEqual(["player-1", "player-2", null, null]);
  });

  it("does not carry availability from one fixture into another", () => {
    const matchweek = groupFixturesIntoMatchweeks([
      makeFixture("male", 2, WEDNESDAY),
      makeFixture("male", 1, WEDNESDAY),
    ])[0];
    const players = makePlayers(9);

    const selection = buildMatchweekSelection({
      matchweek,
      players,
      responses: [
        ...[1, 2, 3, 4, 5].map((rank) =>
          available(`player-${rank}`, "fixture-male-1")
        ),
        ...[6, 7, 8, 9].map((rank) =>
          available(`player-${rank}`, "fixture-male-2")
        ),
      ],
    });

    expect(selection.result.teams[0].slots.map((slot) => slot.playerId)).toEqual([
      "player-1",
      "player-2",
      "player-3",
      "player-4",
    ]);
    expect(selection.result.teams[1].slots.map((slot) => slot.playerId)).toEqual([
      "player-6",
      "player-7",
      "player-8",
      "player-9",
    ]);
    expect(selection.reserves).toEqual([
      { position: 1, playerId: "player-5" },
      { position: 2, playerId: null },
      { position: 3, playerId: null },
      { position: 4, playerId: null },
    ]);
  });

  it("excludes a player whose rank is not eligible for that team", () => {
    const matchweek = groupFixturesIntoMatchweeks([
      makeFixture("male", 5, WEDNESDAY),
    ])[0];
    const players = [makePlayer(1), ...makePlayers(20).slice(16)];

    const selection = buildMatchweekSelection({
      matchweek,
      players,
      responses: players.map((player) =>
        available(player.id, "fixture-male-5")
      ),
    });

    expect(selection.result.teams[0].slots.map((slot) => slot.playerId)).toEqual([
      "player-17",
      "player-18",
      "player-19",
      "player-20",
    ]);
  });

  it("maps non-contiguous team numbers in fixture order", () => {
    const matchweek = groupFixturesIntoMatchweeks([
      makeFixture("male", 5, WEDNESDAY),
      makeFixture("male", 1, WEDNESDAY),
      makeFixture("male", 3, WEDNESDAY),
    ])[0];
    const players = makePlayers(20);

    const selection = buildMatchweekSelection({
      matchweek,
      players,
      responses: [
        ...[1, 2, 3, 4].map((rank) =>
          available(`player-${rank}`, "fixture-male-1")
        ),
        ...[9, 10, 11, 12].map((rank) =>
          available(`player-${rank}`, "fixture-male-3")
        ),
        ...[17, 18, 19, 20].map((rank) =>
          available(`player-${rank}`, "fixture-male-5")
        ),
      ],
    });

    expect(
      selection.result.teams.map((team) =>
        team.slots.map((slot) => slot.playerId)
      )
    ).toEqual([
      ["player-1", "player-2", "player-3", "player-4"],
      ["player-9", "player-10", "player-11", "player-12"],
      ["player-17", "player-18", "player-19", "player-20"],
    ]);
    expect(selection.result.teams.map((team) => team.teamNumber)).toEqual([
      1, 3, 5,
    ]);
  });

  it("adds the four highest-ranked remaining available players as reserves", () => {
    const date = new Date("2026-11-04T14:00:00.000Z");
    const matchweek = groupFixturesIntoMatchweeks(
      [1, 2, 3, 4, 5].map((teamNumber) =>
        makeFixture("male", teamNumber, date)
      )
    )[0];
    const players = makePlayers(25);

    const selection = buildMatchweekSelection({
      matchweek,
      players,
      responses: allAvailable(players, matchweek),
    });

    expect(selection.reserves).toEqual([
      { position: 1, playerId: "player-21" },
      { position: 2, playerId: "player-22" },
      { position: 3, playerId: "player-23" },
      { position: 4, playerId: "player-24" },
    ]);
    const selectedIds = selection.result.teams.flatMap((team) =>
      team.slots.flatMap((slot) => (slot.playerId ? [slot.playerId] : []))
    );
    expect(new Set(selectedIds).size).toBe(selectedIds.length);
    expect(selectedIds).not.toContain("player-21");
  });

  it("is deterministic when fixtures, players and responses arrive shuffled", () => {
    const date = new Date("2026-11-04T14:00:00.000Z");
    const fixtures = [
      makeFixture("male", 2, date),
      makeFixture("male", 1, date),
    ];
    const players = makePlayers(10);
    const preparedMatchweek = groupFixturesIntoMatchweeks(fixtures)[0];
    const baseline = buildMatchweekSelection({
      matchweek: preparedMatchweek,
      players,
      responses: allAvailable(players, preparedMatchweek),
    });

    const shuffled = buildMatchweekSelection({
      matchweek: groupFixturesIntoMatchweeks([...fixtures].reverse())[0],
      players: [...players].reverse(),
      responses: allAvailable(players, preparedMatchweek).reverse(),
    });

    expect(shuffled).toEqual(baseline);
  });
});

describe("resolveDisplayMatchweek", () => {
  it("prefers the next upcoming matchweek", () => {
    const groups = groupFixturesIntoMatchweeks([
      makeFixture("male", 1, new Date("2026-11-11T14:00:00.000Z")),
      makeFixture("male", 1, new Date("2026-10-28T14:00:00.000Z")),
    ]);

    const resolved = resolveDisplayMatchweek(groups, new Date("2026-11-05T12:00:00.000Z"));

    expect(resolved?.fixtures[0].date).toEqual(new Date("2026-11-11T14:00:00.000Z"));
  });

  it("falls back to the most recent past matchweek when none is upcoming", () => {
    const groups = groupFixturesIntoMatchweeks([
      makeFixture("male", 1, new Date("2026-10-28T14:00:00.000Z")),
      makeFixture("male", 1, new Date("2026-10-21T14:00:00.000Z")),
    ]);

    const resolved = resolveDisplayMatchweek(groups, new Date("2026-11-05T12:00:00.000Z"));

    expect(resolved?.fixtures[0].date).toEqual(new Date("2026-10-28T14:00:00.000Z"));
  });

  it("returns null when there are no matchweeks", () => {
    expect(resolveDisplayMatchweek([], new Date("2026-11-05T12:00:00.000Z"))).toBeNull();
  });
});
