import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import EmptyState from "@/components/team-sheet/empty-state";
import MatchweekSheet, {
  type PlayerDirectory,
} from "@/components/team-sheet/matchweek-sheet";
import { requireUser } from "@/lib/auth";
import {
  listRankings,
  listResponsesForFixtures,
} from "@/lib/db";
import {
  buildMatchweekSelection,
} from "@/lib/selection/matchweek";
import { loadDisplayMatchweek } from "@/lib/team-sheet/load";

export const metadata: Metadata = {
  title: "Team sheet",
};

// Session-gated route: opt out of instant-navigation validation (Next 16,
// Cache Components). The skeleton still streams, but the branch on the
// session cannot be rendered during validation.
export const instant = false;

// Team sheets stay inside the club: sign-in is required before the page renders.
export default function TeamSheetPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="min-h-64 rounded-surface squircle bg-surface"
        />
      }
    >
      <TeamSheetContent />
    </Suspense>
  );
}

async function TeamSheetContent() {
  await connection();
  const user = await requireUser();

  const [display, players] = await Promise.all([
    loadDisplayMatchweek(),
    listRankings(),
  ]);

  if (!display) {
    return (
      <EmptyState
        title="No matchweeks yet"
        description="The team sheet appears here once the captains publish a fixture. Check the fixture list for what's coming up."
      />
    );
  }

  const { matchweek, lastPlayed } = display;
  const responses = await listResponsesForFixtures(
    matchweek.fixtures.map((fixture) => String(fixture._id))
  );
  const selection = buildMatchweekSelection({
    matchweek,
    players: players.map((player) => ({
      id: player.id,
      name: player.name,
      rankingPosition: player.rankingPosition,
      isActive: player.isActive,
    })),
    responses: responses.map((response) => ({
      playerId: String(response.playerId),
      status: response.status,
    })),
  });
  const playersById: PlayerDirectory = new Map(
    players.map((player) => [
      player.id,
      { name: player.name, rankingPosition: player.rankingPosition },
    ])
  );

  return (
    <MatchweekSheet
      matchweek={matchweek}
      selection={selection}
      playersById={playersById}
      currentPlayerId={user.playerId}
      isAdmin={user.role === "admin"}
      lastPlayed={lastPlayed}
    />
  );
}
