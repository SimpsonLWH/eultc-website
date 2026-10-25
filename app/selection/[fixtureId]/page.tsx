// Render one fresh response tracker after checking admin access for this request.
import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

import ResponseTracker from "@/components/selection/response-tracker";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { playersEligibleForTeam } from "@/lib/availability/eligibility";
import {
  getFixtureById,
  listRankings,
  listResponsesForFixture,
} from "@/lib/db";
import { formatLondonDateTime } from "@/lib/fixtures/datetime";
import { formatTeamLabel } from "@/lib/fixtures/team-label";

// Disable instant-navigation validation because this route depends on session authorization.
export const instant = false;

// Authorize at request time before looking up this fixture or its responses.
export default async function FixtureSelectionPage(
  props: PageProps<"/selection/[fixtureId]">
) {
  // Session reads use request-specific cryptographic data and must not run during prerendering.
  await connection();
  const user = await getCurrentUser();
  if (user && user.role !== "admin") {
    redirect("/team-sheet");
  }
  await requireAdmin();

  return (
    <Suspense fallback={<TrackerSkeleton />}>
      <FixtureSelectionContent params={props.params} />
    </Suspense>
  );
}

// Build ranked response and no-response lists using only active roster members.
async function FixtureSelectionContent({
  params,
}: {
  params: PageProps<"/selection/[fixtureId]">["params"];
}) {
  const { fixtureId } = await params;
  const fixture = await getFixtureById(fixtureId);
  if (!fixture) {
    notFound();
  }

  const [players, responses] = await Promise.all([
    listRankings(),
    listResponsesForFixture(fixtureId),
  ]);
  const eligiblePlayers = playersEligibleForTeam(players, fixture.teamNumber);
  const eligiblePlayerIds = new Set(
    eligiblePlayers.map((player) => player.id)
  );
  const responseByPlayer = new Map(
    responses
      .filter((response) => eligiblePlayerIds.has(String(response.playerId)))
      .map((response) => [String(response.playerId), response])
  );
  const rankedPlayers = eligiblePlayers.map((player) => ({
    id: player.id,
    rank: player.rankingPosition,
    name: player.name,
    response: responseByPlayer.get(player.id) ?? null,
  }));
  const respondedPlayers = rankedPlayers.flatMap((player) =>
    player.response
      ? [
          {
            id: player.id,
            rank: player.rank,
            name: player.name,
            status: player.response.status,
            note: player.response.note ?? null,
            updatedAt: player.response.updatedAt,
          },
        ]
      : []
  );
  const noResponsePlayers = rankedPlayers
    .filter((player) => player.response === null)
    .map(({ id, rank, name }) => ({ id, rank, name }));
  const available = respondedPlayers.filter(
    (player) => player.status === "available"
  ).length;
  const unavailable = respondedPlayers.filter(
    (player) => player.status === "unavailable"
  ).length;

  return (
    <div className="space-y-6">
      <Link
        className="inline-flex text-sm font-semibold text-club-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
        href="/selection"
      >
        ← Back to response tracker
      </Link>

      <header className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-slate-500">
              {formatLondonDateTime(fixture.date)} ·{" "}
              {formatTeamLabel(fixture.gender, fixture.teamNumber)}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
              {fixture.opponent}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{fixture.venue}</p>
          </div>
          <span className="rounded-full bg-club-50 px-3 py-1 text-xs font-semibold uppercase text-club-800">
            {fixture.homeOrAway === "home" ? "Home fixture" : "Away fixture"}
          </span>
        </div>
      </header>

      <ResponseTracker
        available={available}
        unavailable={unavailable}
        noResponse={noResponsePlayers.length}
        total={eligiblePlayers.length}
        respondedPlayers={respondedPlayers}
        noResponsePlayers={noResponsePlayers}
      />
    </div>
  );
}

// Keep loading feedback consistent with the responsive response sections.
function TrackerSkeleton() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-6 w-48 rounded bg-white" />
      <div className="h-36 rounded-md bg-white" />
      <div className="h-72 rounded-md bg-white" />
    </div>
  );
}
