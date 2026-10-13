"use client";

import Link from "next/link";
import { useActionState } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import type { FixtureActionState } from "@/app/fixtures/actions";
import type {
  FixtureFieldErrors,
  FixtureFormValues,
} from "@/lib/fixtures/validate";

const HOME_OR_AWAY_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "away", label: "Away" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (hidden from players)" },
  { value: "open", label: "Open (accepting signups)" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
];

type FixtureFormProps = {
  action: (
    state: FixtureActionState,
    formData: FormData
  ) => Promise<FixtureActionState>;
  defaultValues: FixtureFormValues;
  submitLabel: string;
  cancelHref: string;
};

export default function FixtureForm({
  action,
  defaultValues,
  submitLabel,
  cancelHref,
}: FixtureFormProps) {
  const [state, formAction, pending] = useActionState<
    FixtureActionState,
    FormData
  >(action, null);

  const values = state?.values ?? defaultValues;
  const errors: FixtureFieldErrors = state?.errors ?? {};
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div aria-live="polite">
        {hasErrors ? (
          <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
            Please fix the highlighted fields and try again.
          </p>
        ) : null}
      </div>

      <TextField
        defaultValue={values.opponent}
        error={errors.opponent}
        id="opponent"
        label="Opponent"
        name="opponent"
        required
      />
      <TextField
        defaultValue={values.venue}
        error={errors.venue}
        id="venue"
        label="Venue"
        name="venue"
        required
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          defaultValue={values.homeOrAway}
          error={errors.homeOrAway}
          id="homeOrAway"
          label="Home or away"
          name="homeOrAway"
          options={HOME_OR_AWAY_OPTIONS}
        />
        <SelectField
          defaultValue={values.status}
          error={errors.status}
          id="status"
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-slate-700">
          Match date and time (UK club time)
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            defaultValue={values.date}
            error={errors.date}
            id="date"
            label="Date"
            name="date"
            required
            type="date"
          />
          <TextField
            defaultValue={values.time}
            error={errors.time}
            id="time"
            label="Kick-off"
            name="time"
            required
            type="time"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-slate-700">
          Signup deadline (UK club time)
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            defaultValue={values.deadlineDate}
            error={errors.deadlineDate}
            id="deadlineDate"
            label="Date"
            name="deadlineDate"
            required
            type="date"
          />
          <TextField
            defaultValue={values.deadlineTime}
            error={errors.deadlineTime}
            id="deadlineTime"
            label="Time"
            name="deadlineTime"
            required
            type="time"
          />
        </div>
      </fieldset>

      <TextField
        defaultValue={values.teamsPlaying}
        error={errors.teamsPlaying}
        id="teamsPlaying"
        inputMode="numeric"
        label="Teams playing (1-10)"
        max={10}
        min={1}
        name="teamsPlaying"
        required
        step={1}
        type="number"
      />

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-5">
        <Button disabled={pending} type="submit">
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Link
          className="text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
          href={cancelHref}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

type FieldChromeProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

function FieldChrome({ id, label, error, children }: FieldChromeProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-sm font-medium text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function TextField({ id, label, error, ...props }: TextFieldProps) {
  return (
    <FieldChrome error={error} id={id} label={label}>
      <Input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        id={id}
        {...props}
      />
    </FieldChrome>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
} & SelectHTMLAttributes<HTMLSelectElement>;

function SelectField({
  id,
  label,
  error,
  options,
  ...props
}: SelectFieldProps) {
  return (
    <FieldChrome error={error} id={id} label={label}>
      <Select
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        id={id}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FieldChrome>
  );
}
