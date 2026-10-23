"use client";

import { useActionState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { signUpAction, type SignUpState } from "./actions";

export default function SignUpForm({ inviteCode }: { inviteCode: string }) {
  const [state, action, pending] = useActionState<SignUpState, FormData>(
    signUpAction,
    null
  );
  const values = state?.values;

  return (
    <form action={action} className="space-y-4">
      <input name="invite" type="hidden" value={inviteCode} />
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
          Full name
        </label>
        <Input
          autoComplete="name"
          autoFocus
          defaultValue={values?.name}
          id="name"
          name="name"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
          Email address
        </label>
        <Input
          autoComplete="email"
          defaultValue={values?.email}
          id="email"
          name="email"
          placeholder="Use the email on your paid membership"
          required
          type="email"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Password
        </label>
        <Input
          autoComplete="new-password"
          id="password"
          minLength={12}
          name="password"
          required
          type="password"
        />
        <p className="mt-1 text-xs leading-5 text-muted">
          Use at least 12 characters.
        </p>
      </div>
      <div>
        <label
          htmlFor="confirmation"
          className="mb-2 block text-sm font-medium text-ink"
        >
          Confirm password
        </label>
        <Input
          autoComplete="new-password"
          id="confirmation"
          minLength={12}
          name="confirmation"
          required
          type="password"
        />
      </div>
      {state?.error ? (
        <p aria-live="polite" className="text-sm font-medium text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-xs leading-5 text-muted">
        Your email must match the paid membership list. Registration does not
        add you to the BUCS player roster.
      </p>
    </form>
  );
}
