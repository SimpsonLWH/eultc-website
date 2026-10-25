import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { FixtureWithId } from "@/lib/selection/matchweek";

import MatchweekSheet, { type PlayerDirectory } from "./matchweek-sheet";

const DATE = new Date("2026-11-04T13:00:00.000Z");

const fixture: FixtureWithId = {
  _id: "fixture-1",
  opponent: "Preview Opponent",
  date: DATE,
  venue: "Preview venue",
  homeOrAway: "home",
  gender: "male",
  teamNumber: 1,
  availabilityDeadline: new Date("2026-11-03T20:00:00.000Z"),
  status: "open",
  createdAt: new Date("2026-10-01T12:00:00.000Z"),
  updatedAt: new Date("2026-10-01T12:00:00.000Z"),
};

const playersById: PlayerDirectory = new Map(
  Array.from({ length: 8 }, (_, index) => [
    `player-${index + 1}`,
    { name: `Player ${index + 1}`, rankingPosition: index + 1 },
  ])
);

describe("MatchweekSheet", () => {
  it("shows a responded-player summary and four reserve slots", () => {
    const html = renderToStaticMarkup(
      <MatchweekSheet
        currentPlayerId={null}
        isAdmin
        matchweek={{
          key: "2026-11-04|male",
          gender: "male",
          date: DATE,
          fixtures: [fixture],
        }}
        playersById={playersById}
        selection={{
          result: {
            teams: [
              {
                teamNumber: 1,
                slots: [1, 2, 3, 4].map((seed) => ({
                  seed,
                  playerId: `player-${seed}`,
                })),
              },
            ],
            incomplete: false,
            unfilledSlots: 0,
          },
          reserves: [5, 6, 7, 8].map((rank) => ({
            position: rank - 4,
            playerId: `player-${rank}`,
          })),
          respondedPlayerCount: 8,
          availablePlayerCount: 8,
          unavailablePlayerCount: 0,
        }}
      />
    );

    expect(html).toContain("8 players responded");
    expect(html).toContain("8 available");
    expect(html).toContain("Reserves");
    expect(html).toContain("Reserve 1");
    expect(html).toContain("Player 5");
    expect(html).toContain("Reserve 4");
    expect(html).toContain("Player 8");
  });
});
