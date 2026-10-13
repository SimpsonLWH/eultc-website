import Link from "next/link";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import type { FixtureStatus, HomeOrAway } from "@/lib/db/models/fixture";
import { formatLondonDateTime } from "@/lib/fixtures/datetime";

import FixtureStatusBadge from "./fixture-status-badge";

export type FixtureCardData = {
  id: string;
  opponent: string;
  date: Date;
  venue: string;
  homeOrAway: HomeOrAway;
  teamsPlaying: number;
  availabilityDeadline: Date;
  status: FixtureStatus;
};

type FixtureCardProps = {
  fixture: FixtureCardData;
  showEditLink?: boolean;
};

const linkClasses =
  "text-sm font-semibold text-club-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600";

export default function FixtureCard({
  fixture,
  showEditLink = false,
}: FixtureCardProps) {
  const teamLabel =
    fixture.teamsPlaying === 1 ? "1 team" : `${fixture.teamsPlaying} teams`;

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-500">
            {formatLondonDateTime(fixture.date)}
          </p>
          <h3 className="mt-1 text-base font-semibold text-club-950">
            {fixture.opponent}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{fixture.venue}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge variant={fixture.homeOrAway === "home" ? "club" : "neutral"}>
            {fixture.homeOrAway === "home" ? "Home" : "Away"}
          </Badge>
          <FixtureStatusBadge status={fixture.status} />
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
        {teamLabel} · Signup closes{" "}
        {formatLondonDateTime(fixture.availabilityDeadline)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link className={linkClasses} href={`/fixtures/${fixture.id}`}>
          View fixture
        </Link>
        {showEditLink ? (
          <Link className={linkClasses} href={`/fixtures/${fixture.id}/edit`}>
            Edit
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
