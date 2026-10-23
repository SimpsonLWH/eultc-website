"use client";

import { useActionState } from "react";

import {
  addPaidMembersAction,
  type MembersActionState,
} from "@/app/members/actions";
import Button from "@/components/ui/button";
import RemovePaidMemberButton from "./remove-paid-member-button";

export default function PaidMembersManager({
  members,
}: {
  members: Array<{ createdAt: string; email: string }>;
}) {
  const [state, action, pending] = useActionState<
    MembersActionState,
    FormData
  >(addPaidMembersAction, null);

  return (
    <div className="space-y-5">
      <form action={action} className="space-y-3">
        <label
          className="block text-sm font-medium text-ink"
          htmlFor="paid-emails"
        >
          Add paid emails
        </label>
        <textarea
          className="min-h-28 w-full rounded-control squircle border border-control bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-club-600 focus:outline-2 focus:outline-club-200"
          id="paid-emails"
          name="emails"
          placeholder={"one@example.com\ntwo@example.com"}
          required
        />
        <Button disabled={pending} type="submit">
          {pending ? "Adding emails…" : "Add to paid list"}
        </Button>
        {state?.error ? (
          <p
            aria-live="polite"
            className="text-sm font-medium text-red-700"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
        {state?.message ? (
          <p aria-live="polite" className="text-sm font-medium text-club-800">
            {state.message}
          </p>
        ) : null}
      </form>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink">Active paid emails</h3>
          <span className="text-xs text-muted">{members.length}</span>
        </div>
        {members.length > 0 ? (
          <ul className="mt-3 divide-y divide-line rounded-control squircle border border-line">
            {members.map((member) => (
              <li
                key={member.email}
                className="flex items-center justify-between gap-3 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{member.email}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Added {new Date(member.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <RemovePaidMemberButton email={member.email} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">No paid emails imported yet.</p>
        )}
      </div>
    </div>
  );
}
