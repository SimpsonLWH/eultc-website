"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import { addPlayerAction, type AddPlayerState } from "@/app/rankings/actions";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { emptyAddPlayerValues } from "@/lib/rankings/validate";

// Render field errors and reset cleanly after the server confirms the addition.
export default function AddPlayerForm() {
  const [state, formAction, pending] = useActionState<
    AddPlayerState,
    FormData
  >(addPlayerAction, null);
  const values = state?.values ?? emptyAddPlayerValues;
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="mt-5 space-y-4" noValidate>
      <div aria-live="polite">
        {state?.error ? (
          <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
            {state.error}
          </p>
        ) : null}
        {state?.message ? (
          <p className="rounded-md bg-club-50 p-3 text-sm font-medium text-club-800">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          error={errors.name}
          id="ranking-player-name"
          label="Player name"
        >
          <Input
            aria-describedby={
              errors.name ? "ranking-player-name-error" : undefined
            }
            aria-invalid={errors.name ? true : undefined}
            autoComplete="name"
            defaultValue={values.name}
            id="ranking-player-name"
            name="name"
            required
          />
        </Field>
        <Field error={errors.email} id="ranking-player-email" label="Email">
          <Input
            aria-describedby={
              errors.email ? "ranking-player-email-error" : undefined
            }
            aria-invalid={errors.email ? true : undefined}
            autoComplete="email"
            defaultValue={values.email}
            id="ranking-player-email"
            name="email"
            required
            type="email"
          />
        </Field>
      </div>

      <Field
        error={errors.position}
        hint="Leave blank to add at the bottom, or enter 1 to move to the top."
        id="ranking-player-position"
        label="Position (optional)"
      >
        <Input
          aria-describedby={
            errors.position
              ? "ranking-player-position-error"
              : "ranking-player-position-hint"
          }
          aria-invalid={errors.position ? true : undefined}
          defaultValue={values.position}
          id="ranking-player-position"
          inputMode="numeric"
          min={1}
          name="position"
          placeholder="e.g. 3"
          step={1}
          type="number"
        />
      </Field>

      <Button disabled={pending} type="submit">
        {pending ? "Adding player…" : "Add player"}
      </Button>
    </form>
  );
}

type FieldProps = {
  children: ReactNode;
  error?: string;
  hint?: string;
  id: string;
  label: string;
};

function Field({ children, error, hint, id, label }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1 text-xs text-slate-500" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1 text-sm font-medium text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
