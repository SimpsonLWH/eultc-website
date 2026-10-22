// Present a fixture's response totals as an accessible link to its tracker.
import Link from "next/link";

import Card from "@/components/ui/card";

// Keep fixture summary fields serializable and independent of Mongoose documents.
export type SelectionFixtureSummary = {
  fixture: {
    id: string;
    opponent: string;
    date: Date;
    venue: string;
    homeOrAway: "home" | "away";
    gender: "male" | "female";
    teamNumber: number;
  };
  available: number;
  unavailable: number;
  noResponse: number;
};

// Show home/away context alongside the headline response counts.
export default function SelectionFixtureCard({
  summary,
}: {
  summary: SelectionFixtureSummary;
}) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-slate-500">
            {new Intl.DateTimeFormat("en-GB", {
              timeZone: "Europe/London",
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }).format(summary.fixture.date)}
          </p>
          <h2 className="mt-1 text-base font-semibold text-club-950">
            {summary.fixture.opponent}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{summary.fixture.venue}</p>
        </div>
        <span className="shrink-0 rounded-full bg-club-50 px-3 py-1 text-xs font-semibold uppercase text-club-800">
          {summary.fixture.homeOrAway === "home" ? "Home" : "Away"}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
        <div>
          <dt className="text-xs text-slate-500">Available</dt>
          <dd className="mt-1 text-lg font-semibold text-club-800">
            {summary.available}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Unavailable</dt>
          <dd className="mt-1 text-lg font-semibold text-court-600">
            {summary.unavailable}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">No response</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-700">
            {summary.noResponse}
          </dd>
        </div>
      </dl>

      <Link
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-md bg-club-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-club-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
        href={`/selection/${summary.fixture.id}`}
      >
        Open tracker
      </Link>
    </Card>
  );
}
