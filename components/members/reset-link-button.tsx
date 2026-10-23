"use client";

import { useActionState, useState } from "react";

import {
  generateResetLinkAction,
  type MembersActionState,
} from "@/app/members/actions";
import Button from "@/components/ui/button";

export default function ResetLinkButton({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<
    MembersActionState,
    FormData
  >(generateResetLinkAction, null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  async function copyResetLink() {
    if (!state?.resetUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(state.resetUrl);
      setCopyMessage("Reset link copied.");
    } catch {
      setCopyMessage("Could not copy the link. Select it manually.");
    }
  }

  return (
    <div className="space-y-2">
      <form action={action}>
        <input name="userId" type="hidden" value={userId} />
        <Button disabled={pending} type="submit" variant="secondary">
          {pending ? "Generating…" : "Generate reset link"}
        </Button>
      </form>
      {state?.error ? (
        <p className="text-xs font-medium text-red-700">{state.error}</p>
      ) : null}
      {state?.resetUrl ? (
        <div className="w-full">
          <input
            aria-label={`Password reset link for ${state.resetEmail ?? "member"}`}
            className="min-h-9 w-full rounded-control squircle border border-control bg-surface px-2 py-1 font-mono text-[0.7rem] text-ink"
            readOnly
            value={state.resetUrl}
          />
          <div className="mt-2 flex items-center gap-2">
            <Button onClick={copyResetLink} type="button" variant="quiet">
              Copy
            </Button>
            {copyMessage ? (
              <span aria-live="polite" className="text-xs text-muted">
                {copyMessage}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
