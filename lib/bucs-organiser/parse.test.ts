import { describe, expect, it } from "vitest";

import {
  parseFixtureRows,
  parseRankingRows,
  type PreviewFixture,
  type PreviewPlayer,
} from "./parse";

function rankingRows(count: number): unknown[][] {
  return [
    ["Rank", "Name", "Responded?"],
    ...Array.from({ length: count }, (_, index) => [
      index + 1,
      ` Player ${index + 1} `,
      "",
    ]),
  ];
}

function fixtureRows(): unknown[][] {
  const counts = [4, 5, 4, 5, 3, 5, 1, 5, 3];
  const cupWeeks = new Set([9]);
  const rows: unknown[][] = [["Match Week", "Match Date", "M1", "M2", "M3", "M4", "M5"]];

  for (const [index, count] of counts.entries()) {
    const matchWeek = index + 1;
    const teams = Array.from({ length: 5 }, (_, teamIndex) => {
      if (teamIndex >= count) {
        return "No Fixture";
      }
      if (cupWeeks.has(matchWeek) && teamIndex >= 1) {
        return "Cup Tie";
      }
      return `Opponent ${matchWeek}-${teamIndex + 1} - ${teamIndex % 2 === 0 ? "Home" : "Away"}`;
    });

    rows.push([
      matchWeek,
      matchWeek === 2
        ? new Date("2026-07-10T00:00:00.000Z")
        : matchWeek === 6
          ? new Date("2026-04-11T00:00:00.000Z")
          : "14/10/26",
      ...teams,
    ]);
  }

  return rows;
}

function fixtureAt(fixtures: PreviewFixture[], matchWeek: number, teamNumber: number) {
  return fixtures.find(
    (fixture) => fixture.matchWeek === matchWeek && fixture.teamNumber === teamNumber
  );
}

describe("parseRankingRows", () => {
  it("parses 39 contiguous ranks, trims names and creates preview-only identities", () => {
    const players: PreviewPlayer[] = parseRankingRows(rankingRows(39));

    expect(players).toHaveLength(39);
    expect(players.map((player) => player.rank)).toEqual(
      Array.from({ length: 39 }, (_, index) => index + 1)
    );
    expect(players[0]).toEqual({
      rank: 1,
      name: "Player 1",
      previewEmail: "preview-rank-01@preview.invalid",
    });
    expect(players[38].previewEmail).toBe("preview-rank-39@preview.invalid");
  });

  it("rejects duplicate ranks", () => {
    const rows = rankingRows(2);
    rows[1][0] = 2;

    expect(() => parseRankingRows(rows)).toThrow(/rank 1/i);
  });

  it("rejects a rank gap", () => {
    const rows = rankingRows(2);
    rows[2][0] = 3;

    expect(() => parseRankingRows(rows)).toThrow(/rank 2/i);
  });

  it("rejects an empty or malformed ranking row", () => {
    const rows = rankingRows(2);
    rows[1][1] = "   ";

    expect(() => parseRankingRows(rows)).toThrow(/name/i);
  });
});

describe("parseFixtureRows", () => {
  it("imports 33 complete fixtures and reports two skipped cup ties", () => {
    const result = parseFixtureRows(fixtureRows());

    expect(result.fixtures).toHaveLength(33);
    expect(result.skippedCupTies).toEqual([
      { matchWeek: 9, teamNumber: 2 },
      { matchWeek: 9, teamNumber: 3 },
    ]);
    expect(fixtureAt(result.fixtures, 1, 1)).toEqual({
      matchWeek: 1,
      date: "2026-09-30",
      teamNumber: 1,
      opponent: "Opponent 1-1",
      homeOrAway: "home",
    });
  });

  it("uses canonical UK matchweek dates for ambiguous source cells", () => {
    const result = parseFixtureRows(fixtureRows());

    expect(fixtureAt(result.fixtures, 2, 1)?.date).toBe("2026-10-07");
    expect(fixtureAt(result.fixtures, 6, 1)?.date).toBe("2026-11-04");
  });

  it("rejects a fixture without a home or away suffix", () => {
    const rows = fixtureRows();
    rows[1][2] = "Opponent without direction";

    expect(() => parseFixtureRows(rows)).toThrow(/home or away/i);
  });

  it("rejects an unknown matchweek", () => {
    const rows = fixtureRows();
    rows[1][0] = 10;

    expect(() => parseFixtureRows(rows)).toThrow(/matchweek 10/i);
  });
});
