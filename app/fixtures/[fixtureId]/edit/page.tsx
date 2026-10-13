import Link from "next/link";
import { notFound } from "next/navigation";

import FixtureForm from "@/components/fixtures/fixture-form";
import Card from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getFixtureById } from "@/lib/db";
import {
  formatLondonDateInput,
  formatLondonTimeInput,
} from "@/lib/fixtures/datetime";
import type { FixtureFormValues } from "@/lib/fixtures/validate";

import { updateFixtureAction } from "../../actions";

// The session check blocks this page on purpose; opt out of instant-navigation
// validation (Next 16, Cache Components) and keep it a blocking route.
export const instant = false;

export default async function EditFixturePage({
  params,
}: PageProps<"/fixtures/[fixtureId]/edit">) {
  const { fixtureId } = await params;
  await requireAdmin();

  const fixture = await getFixtureById(fixtureId);
  if (!fixture) {
    notFound();
  }

  const defaultValues: FixtureFormValues = {
    opponent: fixture.opponent,
    venue: fixture.venue,
    date: formatLondonDateInput(fixture.date),
    time: formatLondonTimeInput(fixture.date),
    deadlineDate: formatLondonDateInput(fixture.availabilityDeadline),
    deadlineTime: formatLondonTimeInput(fixture.availabilityDeadline),
    homeOrAway: fixture.homeOrAway,
    teamsPlaying: String(fixture.teamsPlaying),
    status: fixture.status,
  };

  const action = updateFixtureAction.bind(null, fixtureId);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          className="text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
          href={`/fixtures/${fixtureId}`}
        >
          ← Back to fixture
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-club-950 sm:text-3xl">
          Edit fixture
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Update {fixture.opponent} or change the status to open, close or
          cancel signups. All dates and times are UK club time.
        </p>
      </div>

      <Card>
        <FixtureForm
          action={action}
          cancelHref={`/fixtures/${fixtureId}`}
          defaultValues={defaultValues}
          submitLabel="Save changes"
        />
      </Card>
    </div>
  );
}
