import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import EmptyState from "@/components/team-sheet/empty-state";
import MatchweekSheet, {
  type PlayerDirectory,
} from "@/components/team-sheet/matchweek-sheet";
import { requireUser } from "@/lib/auth";
import {
  getFixtureById,
  listFixtures,
  listRankings,
  listResponsesForFixtures,
} from "@/lib/db";
import {
  buildMatchweekSelection,
  groupFixturesIntoMatchweeks,
  matchweekKey,
} from "@/lib/selection/matchweek";

export const metadata: Metadata = {
  title: "Team sheet",
};

// Session-gated route: opt out of instant-navigation validation (Next 16,
// Cache Components).
export const instant = false;

export default function FixtureTeamSheetPage({
  params,
}: {
  params: PageProps<"/fixtures/[fixtureId]/team-sheet">["params"];
}) {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="min-h-64 rounded-surface squircle bg-surface"
        />
      }
    >
      <FixtureTeamSheet params={params} />
    </Suspense>
  );
}

async function FixtureTeamSheet({
  params,
}: {
  params: PageProps<"/fixtures/[fixtureId]/team-sheet">["params"];
}) {
  await connection();
  const user = await requireUser();
  const { fixtureId } = await params;

  const fixture = await getFixtureById(fixtureId);
  if (!fixture) {
    notFound();
  }
  if (fixture.status === "draft" && user.role !== "admin") {
    notFound();
  }

  const [fixtures, players] = await Promise.all([
    listFixtures("all"),
    listRankings(),
  ]);
  const matchweek =
    groupFixturesIntoMatchweeks(fixtures).find(
      (group) => group.key === matchweekKey(fixture.date, fixture.gender)
    ) ?? null;

  if (!matchweek) {
    return (
      <div className="space-y-6">
        <Link
          className="text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
          href={`/fixtures/${fixtureId}`}
        >
          ← Back to fixture
        </Link>
        <EmptyState
          title="No published sheet for this fixture"
          description="The sheet shows once this fixture's matchweek has published teams to display."
        />
      </div>
    );
  }

  const responses = await listResponsesForFixtures(
    matchweek.fixtures.map((item) => String(item._id))
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
      fixtureId: String(response.fixtureId),
      status: response.status,
    })),
  });
  const playersById: PlayerDirectory = new Map(
    players.map((player) => [
      player.id,
      { name: player.name, rankingPosition: player.rankingPosition },
    ])
  );
  const now = new Date();

  return (
    <div className="space-y-6">
      <Link
        className="text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
        href={`/fixtures/${fixtureId}`}
      >
        ← Back to fixture
      </Link>
      <MatchweekSheet
        matchweek={matchweek}
        selection={selection}
        playersById={playersById}
        currentPlayerId={user.playerId}
        isAdmin={user.role === "admin"}
        focusFixtureId={fixtureId}
        lastPlayed={matchweek.date.getTime() < now.getTime()}
      />
    </div>
  );
}
