import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import type { AvailabilityResponse } from "@/lib/db/models/availability-response";
import type { Fixture } from "@/lib/db/models/fixture";
import { formatLondonDateTime } from "@/lib/fixtures/datetime";
import { formatTeamLabel } from "@/lib/fixtures/team-label";
import FixtureResponseForm from "./fixture-response-form";

type FixtureResponseCardProps = {
  fixtureId: string;
  fixture: Fixture;
  eligible: boolean;
  savedResponse: AvailabilityResponse | null;
  locked: boolean;
};

// Show match context and the editable or final saved answer for one fixture.
export default function FixtureResponseCard({
  fixtureId,
  fixture,
  eligible,
  savedResponse,
  locked,
}: FixtureResponseCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted">
            {formatLondonDateTime(fixture.date)}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-club-950">{fixture.opponent}</h2>
          <p className="mt-1 text-sm text-muted">{fixture.venue}</p>
        </div>
        <Badge variant={fixture.homeOrAway === "home" ? "club" : "neutral"}>
          {fixture.homeOrAway === "home" ? "Home" : "Away"}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        {formatTeamLabel(fixture.gender, fixture.teamNumber)} · Signup closes{" "}
        {formatLondonDateTime(fixture.availabilityDeadline)}
      </p>

      {locked ? (
        <div className="mt-5 rounded-surface squircle bg-canvas p-4" role="status">
          <p className="text-sm font-semibold text-ink">
            Signup locked{fixture.status === "cancelled" ? " · Fixture cancelled" : ""}
          </p>
          {savedResponse ? (
            <p className="mt-1 text-sm text-muted">
              You said {savedResponse.status}
              {savedResponse.updatedAt
                ? `, updated ${formatLondonDateTime(savedResponse.updatedAt)}`
                : ""}
              {savedResponse.note ? `. Note: ${savedResponse.note}` : ""}.
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted">No answer was saved before signup closed.</p>
          )}
        </div>
      ) : (
        <FixtureResponseForm
          fixtureId={fixtureId}
          eligible={eligible}
          savedStatus={savedResponse?.status ?? null}
          savedNote={savedResponse?.note ?? ""}
        />
      )}
    </Card>
  );
}