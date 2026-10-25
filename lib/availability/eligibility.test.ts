import { describe, expect, it } from "vitest";

import { playersEligibleForTeam } from "./eligibility";

const players = [
  { id: "rank-1", rankingPosition: 1 },
  { id: "rank-4", rankingPosition: 4 },
  { id: "rank-5", rankingPosition: 5 },
  { id: "rank-8", rankingPosition: 8 },
  { id: "rank-39", rankingPosition: 39 },
];

describe("playersEligibleForTeam", () => {
  it("lets every ranked player answer fixtures for stronger teams", () => {
    expect(playersEligibleForTeam(players, 1).map((player) => player.id)).toEqual([
      "rank-1",
      "rank-4",
      "rank-5",
      "rank-8",
      "rank-39",
    ]);
    expect(playersEligibleForTeam(players, 2).map((player) => player.id)).toEqual([
      "rank-5",
      "rank-8",
      "rank-39",
    ]);
  });

  it("excludes players whose own team is weaker than the fixture team", () => {
    expect(playersEligibleForTeam(players, 5).map((player) => player.id)).toEqual([
      "rank-39",
    ]);
  });
});
