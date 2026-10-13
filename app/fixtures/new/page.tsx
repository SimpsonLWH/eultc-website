import Link from "next/link";

import FixtureForm from "@/components/fixtures/fixture-form";
import Card from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { emptyFixtureFormValues } from "@/lib/fixtures/validate";

import { createFixtureAction } from "../actions";

export default async function NewFixturePage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          className="text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
          href="/fixtures"
        >
          ← Back to fixtures
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-club-950 sm:text-3xl">
          New fixture
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add a match, home or away, and set the signup deadline. All dates and
          times are UK club time.
        </p>
      </div>

      <Card>
        <FixtureForm
          action={createFixtureAction}
          cancelHref="/fixtures"
          defaultValues={emptyFixtureFormValues}
          submitLabel="Create fixture"
        />
      </Card>
    </div>
  );
}
