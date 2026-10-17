import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import FixtureResponseCard from "@/components/availability/fixture-response-card";
import { requireUser } from "@/lib/auth";
import { getActivePlayerById, listFixtures, listPlayerResponses } from "@/lib/db";
import { eligibleTeams } from "@/lib/availability/eligibility";

// Keep request-specific session/database reads behind a streamed loading state.
export default function AvailabilityPage() {
  return (
    <Suspense fallback={<AvailabilitySkeleton />}>
      <AvailabilityContent />
    </Suspense>
  );
}

// Load the signed-in player's rank, fixtures, and saved answers together.
async function AvailabilityContent() {
  await connection();
  const user = await requireUser();
  const playerId = user.playerId;

  if (!playerId) {
    redirect("/auth/not-listed");
  }

  const player = await getActivePlayerById(playerId);
  if (!player) {
    redirect("/auth/not-listed");
  }

  const [fixtures, responses] = await Promise.all([
    listFixtures("all"),
    listPlayerResponses(playerId),
  ]);
  const now = new Date();
  const responsesByFixture = new Map(
    responses.map((response) => [String(response.fixtureId), response])
  );

  // Show live signup cards and keep a saved answer visible after its fixture locks.
  const openFixtures = fixtures.filter(
    (fixture) =>
      fixture.status === "open" && fixture.availabilityDeadline.getTime() > now.getTime()
  );
  const lockedFixtures = fixtures.filter((fixture) => {
    const hasResponse = responsesByFixture.has(String(fixture._id));
    const isLocked =
      fixture.status !== "open" || fixture.availabilityDeadline.getTime() <= now.getTime();
    return hasResponse && isLocked;
  });
  const answeredOpenCount = openFixtures.filter((fixture) =>
    responsesByFixture.has(String(fixture._id))
  ).length;
  const nextFixture = fixtures.find(
    (fixture) => fixture.date.getTime() >= now.getTime() && fixture.status !== "cancelled"
  );

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase text-club-700">Match operations</p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
          Weekly availability
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Tell the captains whether you can play each matchweek.
        </p>
        <p className="mt-3 text-sm font-medium text-slate-700" aria-live="polite">
          {openFixtures.length} open {openFixtures.length === 1 ? "fixture" : "fixtures"}, {" "}
          {answeredOpenCount} answered
        </p>
      </header>

      {openFixtures.length === 0 ? (
        <section className="rounded-md border border-dashed border-slate-300 bg-white p-5">
          <h2 className="font-semibold text-club-950">No open signup right now</h2>
          {nextFixture ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Next fixture: {nextFixture.opponent} on {formatFixtureDate(nextFixture.date)}. Its
              signup opening time has not been set.
            </p>
          ) : null}
        </section>
      ) : null}

      {openFixtures.length > 0 ? (
        <section aria-label="Open fixtures" className="space-y-4">
          {openFixtures.map((fixture) => (
            <FixtureResponseCard
              key={String(fixture._id)}
              fixtureId={String(fixture._id)}
              fixture={fixture}
              eligible={eligibleTeams(player.rankingPosition).includes(fixture.teamNumber)}
              savedResponse={responsesByFixture.get(String(fixture._id)) ?? null}
              locked={false}
            />
          ))}
        </section>
      ) : null}

      {lockedFixtures.length > 0 ? (
        <section aria-label="Locked responses" className="space-y-4">
          <h2 className="text-lg font-semibold text-club-950">Your locked responses</h2>
          {lockedFixtures.map((fixture) => (
            <FixtureResponseCard
              key={String(fixture._id)}
              fixtureId={String(fixture._id)}
              fixture={fixture}
              eligible={eligibleTeams(player.rankingPosition).includes(fixture.teamNumber)}
              savedResponse={responsesByFixture.get(String(fixture._id)) ?? null}
              locked
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}

// Format dates in the club's timezone, matching the fixture pages.
function formatFixtureDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

// Reserve stable space while the server resolves session and fixture data.
function AvailabilitySkeleton() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-24 max-w-2xl rounded-md bg-white" />
      <div className="h-52 rounded-md bg-white" />
    </div>
  );
}
