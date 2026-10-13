import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import FixtureCard from "@/components/fixtures/fixture-card";
import { getCurrentUser } from "@/lib/auth";
import { listFixtures } from "@/lib/db";

// Configure the shared placeholder shell for the season fixture list.
export default function FixturesPage() {
  return (
    <Suspense fallback={<FixturesSkeleton />}>
      <FixturesContent />
    </Suspense>
  );
}

async function FixturesContent() {
  await connection();

  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  const [upcoming, past] = await Promise.all([
    listFixtures("upcoming", { includeDrafts: isAdmin }),
    listFixtures("past", { includeDrafts: isAdmin }),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-club-700">
            Match operations
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
            Fixtures
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            The season schedule, home and away, with the signup deadline for
            each matchweek.
          </p>
        </div>
        {isAdmin ? (
          <Link
            className="inline-flex min-h-10 items-center justify-center self-start rounded-md bg-club-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-club-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600 sm:self-auto"
            href="/fixtures/new"
          >
            New fixture
          </Link>
        ) : null}
      </header>

      <FixtureSection
        emptyText="No upcoming fixtures yet."
        fixtures={upcoming}
        showEditLink={isAdmin}
        title="Upcoming"
      />
      <FixtureSection
        emptyText="No past fixtures yet."
        fixtures={past}
        showEditLink={isAdmin}
        title="Past"
      />
    </div>
  );
}

type FixtureSectionProps = {
  title: string;
  emptyText: string;
  fixtures: Awaited<ReturnType<typeof listFixtures>>;
  showEditLink: boolean;
};

function FixtureSection({
  title,
  emptyText,
  fixtures,
  showEditLink,
}: FixtureSectionProps) {
  return (
    <section aria-label={title} className="space-y-4">
      <h2 className="text-lg font-semibold text-club-950">{title}</h2>
      {fixtures.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
          {emptyText}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {fixtures.map((fixture) => (
            <FixtureCard
              key={String(fixture._id)}
              fixture={{
                id: String(fixture._id),
                opponent: fixture.opponent,
                date: fixture.date,
                venue: fixture.venue,
                homeOrAway: fixture.homeOrAway,
                gender: fixture.gender,
                teamNumber: fixture.teamNumber,
                availabilityDeadline: fixture.availabilityDeadline,
                status: fixture.status,
              }}
              showEditLink={showEditLink}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FixturesSkeleton() {
  return (
    <div aria-busy="true" className="space-y-8">
      <div className="h-28 max-w-3xl rounded-md bg-white" />
      <div className="space-y-4">
        <div className="h-6 w-32 rounded bg-white" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-44 rounded-md bg-white" />
          <div className="h-44 rounded-md bg-white" />
        </div>
      </div>
    </div>
  );
}
