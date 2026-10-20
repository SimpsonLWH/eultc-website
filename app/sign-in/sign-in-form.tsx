"use client";

import { useActionState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { signInWithEmail, type SignInState } from "./actions";

// Bind the server action to a small client form so pending and error states update immediately.
export default function SignInForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signInWithEmail,
    null
  );

  // Do not render a credential form when the provider is unavailable in production.
  if (!enabled) {
    return (
      <p className="rounded-surface squircle bg-canvas p-4 text-sm leading-6 text-muted">
        Email sign-in is not enabled in this environment.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
          Email address
        </label>
        <Input
          autoComplete="email"
          autoFocus
          id="email"
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </div>
      {state?.error ? (
        <p aria-live="polite" className="text-sm font-medium text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Continue with email"}
      </Button>
      <p className="text-xs leading-5 text-muted">
        Development login creates a local session; no email is sent. Use an email seeded in the
        player list.
      </p>
    </form>
  );
}