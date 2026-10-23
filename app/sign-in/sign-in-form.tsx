"use client";

import { useActionState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { signInWithPassword, type SignInState } from "./actions";

export default function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signInWithPassword,
    null
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
          Email address
        </label>
        <Input
          autoComplete="email"
          autoFocus
          defaultValue={state?.email}
          id="email"
          name="email"
          placeholder="name@example.com"
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
          autoComplete="current-password"
          id="password"
          minLength={12}
          name="password"
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
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-xs leading-5 text-muted">
        Forgotten your password? Ask a captain to generate a one-time reset
        link.
      </p>
    </form>
  );
}
