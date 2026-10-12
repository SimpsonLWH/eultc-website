import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  buildSelection,
  type BuildSelectionInput,
  type SelectionPlayer,
  type SelectionResponse,
  type SelectionResult,
} from "./build-selection";

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

function available(playerId: string): SelectionResponse {
  return { playerId, status: "available" };
}

function unavailable(playerId: string): SelectionResponse {
  return { playerId, status: "unavailable" };
}

function allAvailable(players: SelectionPlayer[]): SelectionResponse[] {
  return players.map((player) => available(player.id));
}

function slotsById(result: SelectionResult): (string | null)[][] {
  return result.teams.map((team) => team.slots.map((slot) => slot.playerId));
}

describe("buildSelection", () => {
  it("fills teams by rank, strongest first (12 players, N=3)", () => {
    const players = makePlayers(12);

    const result = buildSelection({
      // Shuffled input order: the mapping must depend only on the data.
      players: [...players].reverse(),
      responses: allAvailable(players).reverse(),
      teamsPlaying: 3,
    });

    expect(result).toEqual({
      teams: [
        {
          teamNumber: 1,
          slots: [
            { seed: 1, playerId: "player-1" },
            { seed: 2, playerId: "player-2" },
            { seed: 3, playerId: "player-3" },
            { seed: 4, playerId: "player-4" },
          ],
        },
        {
          teamNumber: 2,
          slots: [
            { seed: 1, playerId: "player-5" },
            { seed: 2, playerId: "player-6" },
            { seed: 3, playerId: "player-7" },
            { seed: 4, playerId: "player-8" },
          ],
        },
        {
          teamNumber: 3,
          slots: [
            { seed: 1, playerId: "player-9" },
            { seed: 2, playerId: "player-10" },
            { seed: 3, playerId: "player-11" },
            { seed: 4, playerId: "player-12" },
          ],
        },
      ],
      incomplete: false,
      unfilledSlots: 0,
    });
  });

  it("places a lone rank-36 signup at team 1 seed 1", () => {
    const players = makePlayers(36);
    const lonePlayer = players[35];

    const result = buildSelection({
      players,
      responses: [
        ...players.slice(0, 35).map((player) => unavailable(player.id)),
        available(lonePlayer.id),
      ],
      teamsPlaying: 1,
    });

    expect(result.teams).toEqual([
      {
        teamNumber: 1,
        slots: [
          { seed: 1, playerId: "player-36" },
          { seed: 2, playerId: null },
          { seed: 3, playerId: null },
          { seed: 4, playerId: null },
        ],
      },
    ]);
    expect(result.incomplete).toBe(true);
    expect(result.unfilledSlots).toBe(3);
  });

  it("fills a partial final team when fewer than 4xN sign up", () => {
    const players = makePlayers(6);

    const result = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: 2,
    });

    expect(slotsById(result)).toEqual([
      ["player-1", "player-2", "player-3", "player-4"],
      ["player-5", "player-6", null, null],
    ]);
    expect(result.incomplete).toBe(true);
    expect(result.unfilledSlots).toBe(2);
  });

  it("returns empty teams flagged incomplete when nobody signs up", () => {
    const players = makePlayers(2);

    const result = buildSelection({
      players,
      responses: [],
      teamsPlaying: 2,
    });

    expect(slotsById(result)).toEqual([
      [null, null, null, null],
      [null, null, null, null],
    ]);
    expect(result.incomplete).toBe(true);
    expect(result.unfilledSlots).toBe(8);
    expect(result.teams[0].teamNumber).toBe(1);
    expect(result.teams[1].teamNumber).toBe(2);
  });

  it("orders by ranking position across ranking gaps", () => {
    const players = [makePlayer(36), makePlayer(9), makePlayer(2), makePlayer(5)];

    const result = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: 1,
    });

    expect(slotsById(result)).toEqual([
      ["player-2", "player-5", "player-9", "player-36"],
    ]);
    expect(result.incomplete).toBe(false);
  });

  it("breaks ranking ties by name, then id", () => {
    const players = [
      { id: "c-1", name: "Zoe", rankingPosition: 7, isActive: true },
      { id: "b-2", name: "Amelia", rankingPosition: 7, isActive: true },
      { id: "a-1", name: "Amelia", rankingPosition: 7, isActive: true },
      { id: "d-1", name: "Bea", rankingPosition: 7, isActive: true },
      makePlayer(8),
    ];

    const result = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: 1,
    });

    // Rank 8 must not jump ahead of any rank-7 player.
    expect(slotsById(result)).toEqual([
      ["a-1", "b-2", "d-1", "c-1"],
    ]);
  });

  it("handles N=1", () => {
    const players = makePlayers(20);

    const result = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: 1,
    });

    expect(result.teams).toHaveLength(1);
    expect(slotsById(result)).toEqual([
      ["player-1", "player-2", "player-3", "player-4"],
    ]);
    expect(result.incomplete).toBe(false);
    expect(result.unfilledSlots).toBe(0);
  });

  it("handles N=10 and drops players beyond 4xN", () => {
    const players = makePlayers(45);

    const result = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: 10,
    });

    expect(result.teams).toHaveLength(10);
    expect(result.teams[9]).toEqual({
      teamNumber: 10,
      slots: [
        { seed: 1, playerId: "player-37" },
        { seed: 2, playerId: "player-38" },
        { seed: 3, playerId: "player-39" },
        { seed: 4, playerId: "player-40" },
      ],
    });
    const selectedIds = result.teams.flatMap((team) =>
      team.slots.map((slot) => slot.playerId)
    );
    expect(selectedIds).toHaveLength(40);
    expect(selectedIds).not.toContain("player-41");
    expect(result.incomplete).toBe(false);
    expect(result.unfilledSlots).toBe(0);
  });

  it("excludes players who responded unavailable", () => {
    const players = makePlayers(6);

    const result = buildSelection({
      players,
      responses: [
        available("player-1"),
        unavailable("player-2"),
        available("player-3"),
        unavailable("player-4"),
        available("player-5"),
        available("player-6"),
      ],
      teamsPlaying: 2,
    });

    expect(slotsById(result)).toEqual([
      ["player-1", "player-3", "player-5", "player-6"],
      [null, null, null, null],
    ]);
    expect(result.unfilledSlots).toBe(4);
  });

  it("excludes inactive players even when they responded available", () => {
    const players = [
      makePlayer(1),
      makePlayer(2, { isActive: false }),
      makePlayer(3),
    ];

    const result = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: 1,
    });

    expect(slotsById(result)).toEqual([
      ["player-1", "player-3", null, null],
    ]);
    expect(result.incomplete).toBe(true);
    expect(result.unfilledSlots).toBe(2);
  });

  it("does not double-count duplicate responses", () => {
    const players = makePlayers(3);

    const result = buildSelection({
      players,
      responses: [
        available("player-1"),
        available("player-1"),
        unavailable("player-2"),
        available("player-2"),
        available("player-3"),
      ],
      teamsPlaying: 1,
    });

    // A duplicate pair (even a conflicting one) counts the player once.
    expect(slotsById(result)).toEqual([
      ["player-1", "player-2", "player-3", null],
    ]);
    expect(result.unfilledSlots).toBe(1);
  });

  it("ignores responses for players who are not in the rankings list", () => {
    const players = [makePlayer(1)];

    const result = buildSelection({
      players,
      responses: [available("player-1"), available("player-unknown")],
      teamsPlaying: 1,
    });

    expect(slotsById(result)).toEqual([
      ["player-1", null, null, null],
    ]);
    expect(result.unfilledSlots).toBe(3);
  });

  it("treats N=0 (and invalid N) as no teams to select", () => {
    const players = makePlayers(5);

    const zeroTeams = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: 0,
    });

    expect(zeroTeams).toEqual({ teams: [], incomplete: false, unfilledSlots: 0 });

    const invalidTeams = buildSelection({
      players,
      responses: allAvailable(players),
      teamsPlaying: Number.NaN,
    });

    expect(invalidTeams).toEqual({
      teams: [],
      incomplete: false,
      unfilledSlots: 0,
    });
  });

  it("returns identical output regardless of input order", () => {
    const players = [
      makePlayer(1),
      makePlayer(2),
      makePlayer(3),
      makePlayer(4),
      makePlayer(5),
      makePlayer(6, { isActive: false }),
      makePlayer(2, { id: "player-2b", name: "Amelia" }),
      makePlayer(1, { id: "player-1b", name: "Aaron" }),
    ];
    const responses = [
      available("player-1"),
      available("player-1b"),
      available("player-2b"),
      available("player-3"),
      unavailable("player-4"),
      available("player-5"),
    ];

    const baseline = buildSelection({ players, responses, teamsPlaying: 2 });
    const permutations: BuildSelectionInput[] = [
      {
        players: [...players].reverse(),
        responses: [...responses].reverse(),
        teamsPlaying: 2,
      },
      {
        players: [...players].sort((a, b) => (a.id < b.id ? 1 : -1)),
        responses: [...responses].sort((a, b) => (a.playerId < b.playerId ? 1 : -1)),
        teamsPlaying: 2,
      },
      {
        players: [...players.slice(3), ...players.slice(0, 3)],
        responses: [...responses.slice(2), ...responses.slice(0, 2)],
        teamsPlaying: 2,
      },
    ];

    for (const permutation of permutations) {
      expect(buildSelection(permutation)).toEqual(baseline);
    }
  });

  it("does not mutate its inputs", () => {
    const players = makePlayers(6);
    const responses = allAvailable(players);
    const playersBefore = structuredClone(players);
    const responsesBefore = structuredClone(responses);

    buildSelection({ players, responses, teamsPlaying: 2 });

    expect(players).toEqual(playersBefore);
    expect(responses).toEqual(responsesBefore);
  });

  it("has no database imports", () => {
    const source = readFileSync(
      new URL("./build-selection.ts", import.meta.url),
      "utf8"
    );

    expect(source).not.toMatch(/lib\/db/);
    expect(source).not.toMatch(/mongoose/);
  });
});
