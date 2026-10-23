"use client";

import { useActionState } from "react";

import {
  removePaidMemberAction,
  type MembersActionState,
} from "@/app/members/actions";
import Button from "@/components/ui/button";

export default function RemovePaidMemberButton({ email }: { email: string }) {
  const [state, action, pending] = useActionState<
    MembersActionState,
    FormData
  >(removePaidMemberAction, null);

  return (
    <div className="text-right">
      <form action={action}>
        <input name="email" type="hidden" value={email} />
        <Button
          className="px-2 text-red-700"
          disabled={pending}
          type="submit"
          variant="quiet"
        >
          {pending ? "Removing…" : "Remove"}
        </Button>
      </form>
      {state?.error ? (
        <p className="mt-1 max-w-48 text-xs font-medium text-red-700">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
