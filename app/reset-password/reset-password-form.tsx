"use client";

import Link from "next/link";
import { useActionState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { resetPasswordAction, type ResetPasswordState } from "./actions";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<
    ResetPasswordState,
    FormData
  >(resetPasswordAction, null);

  if (state?.message) {
    return (
      <div className="space-y-4">
        <p
          aria-live="polite"
          className="rounded-surface squircle bg-club-50 p-4 text-sm font-medium text-club-800"
        >
          {state.message}
        </p>
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-control squircle bg-club-700 px-4 text-sm font-semibold text-white hover:bg-club-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
          href="/sign-in"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input name="token" type="hidden" value={token} />
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-ink"
        >
          New password
        </label>
        <Input
          autoComplete="new-password"
          autoFocus
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
          Confirm new password
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
        {pending ? "Saving password…" : "Set new password"}
      </Button>
    </form>
  );
}
