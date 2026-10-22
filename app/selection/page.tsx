// Keep the captain workspace request-rendered so fixture and response counts stay fresh.
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import SelectionFixtureCard from "@/components/selection/selection-fixture-card";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import {
  listFixtures,
  listRankings,
  listResponsesForFixtures,
} from "@/lib/db";

// Disable instant-navigation validation because this route depends on session authorization.
export const instant = false;

// Authorize at request time before exposing any fixture summary or response count.
export default async function SelectionPage() {
  // Session reads use request-specific cryptographic data and must not run during prerendering.
  await connection();
  const user = await getCurrentUser();
  if (user && user.role !== "admin") {
    redirect("/team-sheet");
  }
  await requireAdmin();

  return (
    <Suspense fallback={<SelectionSkeleton />}>
      <SelectionContent />
    </Suspense>
  );
}

// Load only accepting or recently closed fixtures after enforcing captain access.
async function SelectionContent() {
  const [allFixtures, players] = await Promise.all([
    listFixtures("all", { includeDrafts: true }),
    listRankings(),
  ]);
  const now = new Date().getTime();
  const recentCutoff = now - 7 * 24 * 60 * 60 * 1000;
  const fixtures = allFixtures.filter((fixture) => {
    const acceptingResponses =
      fixture.status === "open" && fixture.availabilityDeadline.getTime() > now;
    // updatedAt provides the existing closest available definition of when a fixture was closed.
    const recentlyClosed =
      fixture.status === "closed" && fixture.updatedAt.getTime() >= recentCutoff;
    return acceptingResponses || recentlyClosed;
  });
  const activePlayerIds = new Set(players.map((player) => player.id));
  // Load all visible fixture answers in one uncached query for current counts.
  const responses = await listResponsesForFixtures(
    fixtures.map((fixture) => String(fixture._id))
  );
  const responsesByFixture = new Map<string, typeof responses>();
  for (const response of responses) {
    const playerId = String(response.playerId);
    if (!activePlayerIds.has(playerId)) {
      continue;
    }
    const fixtureId = String(response.fixtureId);
    const fixtureResponses = responsesByFixture.get(fixtureId) ?? [];
    fixtureResponses.push(response);
    responsesByFixture.set(fixtureId, fixtureResponses);
  }
  const summaries = fixtures.map((fixture) => {
    const fixtureResponses = responsesByFixture.get(String(fixture._id)) ?? [];
    const available = fixtureResponses.filter(
      (response) => response.status === "available"
    ).length;
    const unavailable = fixtureResponses.filter(
      (response) => response.status === "unavailable"
    ).length;

    return {
      fixture: {
        id: String(fixture._id),
        opponent: fixture.opponent,
        date: fixture.date,
        venue: fixture.venue,
        homeOrAway: fixture.homeOrAway,
        gender: fixture.gender,
        teamNumber: fixture.teamNumber,
      },
      available,
      unavailable,
      noResponse: players.length - fixtureResponses.length,
    };
  });

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase text-club-700">
          Match operations
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
          Response tracker
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review availability responses and find active players who have not
          replied.
        </p>
      </header>

      {summaries.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
          No fixtures are accepting responses or were closed in the last seven
          days.
        </p>
      ) : (
        <section aria-label="Fixtures" className="grid gap-4 sm:grid-cols-2">
          {summaries.map((summary) => (
            <SelectionFixtureCard key={summary.fixture.id} summary={summary} />
          ))}
        </section>
      )}

      <Link
        className="inline-flex text-sm font-semibold text-club-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
        href="/fixtures"
      >
        View all fixtures
      </Link>
    </div>
  );
}

// Reserve the shape of the fixture list until request-time data is ready.
function SelectionSkeleton() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="h-24 max-w-2xl rounded-md bg-white" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-44 rounded-md bg-white" />
        <div className="h-44 rounded-md bg-white" />
      </div>
    </div>
  );
}
