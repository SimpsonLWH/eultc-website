"use client";

import { useActionState, useState } from "react";

import {
  rotateInviteAction,
  type MembersActionState,
} from "@/app/members/actions";
import Button from "@/components/ui/button";

export default function InviteManager({ inviteUrl }: { inviteUrl: string | null }) {
  const [state, action, pending] = useActionState<
    MembersActionState,
    FormData
  >(rotateInviteAction, null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  async function copyInvite() {
    if (!inviteUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyMessage("Link copied.");
    } catch {
      setCopyMessage("Could not copy the link. Select it manually.");
    }
  }

  return (
    <div className="space-y-4">
      {inviteUrl ? (
        <div>
          <label
            className="mb-2 block text-sm font-medium text-ink"
            htmlFor="registration-invite"
          >
            Current registration link
          </label>
          <input
            className="min-h-10 w-full rounded-control squircle border border-control bg-surface px-3 py-2 font-mono text-xs text-ink focus:border-club-600 focus:outline-2 focus:outline-club-200"
            id="registration-invite"
            readOnly
            value={inviteUrl}
          />
          <Button
            className="mt-3"
            onClick={copyInvite}
            type="button"
            variant="secondary"
          >
            Copy link
          </Button>
          {copyMessage ? (
            <p aria-live="polite" className="mt-2 text-xs text-muted">
              {copyMessage}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="rounded-control squircle bg-surface-muted p-4 text-sm leading-6 text-muted">
          No registration link exists yet. Create one before inviting members.
        </p>
      )}
      <form action={action}>
        <Button disabled={pending} type="submit" variant="secondary">
          {pending
            ? "Rotating link…"
            : inviteUrl
              ? "Rotate registration link"
              : "Create registration link"}
        </Button>
      </form>
      {state?.error ? (
        <p aria-live="polite" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}
      {state?.message ? (
        <p aria-live="polite" className="text-sm font-medium text-club-800">
          {state.message}
        </p>
      ) : null}
      <p className="text-xs leading-5 text-muted">
        Rotating immediately invalidates the previous link. Existing accounts
        are not removed.
      </p>
    </div>
  );
}
