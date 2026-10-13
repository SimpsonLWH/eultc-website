"use client";

import { useActionState } from "react";

import Button from "@/components/ui/button";
import type { AvailabilityStatus } from "@/lib/db/models/availability-response";
import {
  saveAvailabilityAnswer,
  type AvailabilityActionState,
} from "@/app/availability/actions";

type FixtureResponseFormProps = {
  fixtureId: string;
  eligibleTeams: number[];
  savedStatus: AvailabilityStatus | null;
  savedNote: string;
};

// Use pressed buttons for one-tap answers while keeping form status accessible by keyboard.
export default function FixtureResponseForm({
  fixtureId,
  eligibleTeams,
  savedStatus,
  savedNote,
}: FixtureResponseFormProps) {
  const [state, formAction, pending] = useActionState<
    AvailabilityActionState,
    FormData
  >(saveAvailabilityAnswer, null);
  const currentStatus = state?.status ?? savedStatus;

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <input type="hidden" name="fixtureId" value={fixtureId} />
      <p className="text-sm leading-6 text-slate-600">
        Eligible teams for your ranking: {eligibleTeams.join(", ")}. Your answer is for the fixture;
        no team assignment is saved.
      </p>
      {eligibleTeams.length === 0 ? (
        <p className="text-sm font-medium text-slate-600" role="note">
          Your ranked team is not included in this fixture, so signup is unavailable.
        </p>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-800">Can you play?</legend>
        <div className="grid grid-cols-2 gap-3">
          {(["available", "unavailable"] as const).map((answer) => (
            <Button
              key={answer}
              aria-pressed={currentStatus === answer}
              className="w-full capitalize"
              disabled={pending || eligibleTeams.length === 0}
              name="status"
              type="submit"
              value={answer}
              variant={currentStatus === answer ? "primary" : "secondary"}
            >
              {answer}
            </Button>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-medium text-slate-700" htmlFor={`note-${fixtureId}`}>
        Optional note
        <textarea
          className="mt-2 min-h-20 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-club-600 focus:outline-2 focus:outline-club-200"
          id={`note-${fixtureId}`}
          maxLength={140}
          name="note"
          placeholder="Add a short note for the captains"
          defaultValue={savedNote}
          disabled={eligibleTeams.length === 0}
        />
      </label>

      {state?.error ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.message ? (
        <p className="text-sm font-medium text-emerald-800" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}