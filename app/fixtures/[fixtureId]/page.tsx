import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import FixtureStatusBadge from "@/components/fixtures/fixture-status-badge";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getFixtureById } from "@/lib/db";
import {
  formatLondonDate,
  formatLondonDateTime,
  formatLondonTime,
} from "@/lib/fixtures/datetime";
import { formatTeamLabel } from "@/lib/fixtures/team-label";

export default function FixtureDetailPage({
  params,
}: PageProps<"/fixtures/[fixtureId]">) {
  return (
    <Suspense
      fallback={<div aria-busy="true" className="min-h-64 rounded-md bg-white" />}
    >
      <FixtureDetail params={params} />
    </Suspense>
  );
}

type FixtureDetailProps = {
  params: PageProps<"/fixtures/[fixtureId]">["params"];
};

async function FixtureDetail({ params }: FixtureDetailProps) {
  await connection();
  const { fixtureId } = await params;

  const fixture = await getFixtureById(fixtureId);
  if (!fixture) {
    notFound();
  }

  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";
  if (fixture.status === "draft" && !isAdmin) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <Link
        className="text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
        href="/fixtures"
      >
        ← Back to fixtures
      </Link>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-slate-500">
              {formatLondonDate(fixture.date)}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-club-950">
              {fixture.opponent}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{fixture.venue}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Badge variant={fixture.homeOrAway === "home" ? "club" : "neutral"}>
              {fixture.homeOrAway === "home" ? "Home" : "Away"}
            </Badge>
            <FixtureStatusBadge status={fixture.status} />
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
          <DetailItem label="Date" value={formatLondonDate(fixture.date)} />
          <DetailItem label="Kick-off" value={formatLondonTime(fixture.date)} />
          <DetailItem label="Venue" value={fixture.venue} />
          <DetailItem
            label="Team"
            value={formatTeamLabel(fixture.gender, fixture.teamNumber)}
          />
          <DetailItem
            label="Signup deadline"
            value={formatLondonDateTime(fixture.availabilityDeadline)}
          />
        </dl>
      </Card>

      {isAdmin ? (
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-club-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-club-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
          href={`/fixtures/${fixtureId}/edit`}
        >
          Edit fixture
        </Link>
      ) : null}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-800">{value}</dd>
    </div>
  );
}
