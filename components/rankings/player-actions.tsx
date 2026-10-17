"use client";

import { useActionState } from "react";

import {
  movePlayerAction,
  setPlayerActiveAction,
  type RankingActionResult,
} from "@/app/rankings/actions";
import Button from "@/components/ui/button";

type MovePlayerControlsProps = {
  playerId: string;
  playerName: string;
  isFirst: boolean;
  isLast: boolean;
};

// Keep both ordering actions beside the row while reporting save failures inline.
export function MovePlayerControls({
  playerId,
  playerName,
  isFirst,
  isLast,
}: MovePlayerControlsProps) {
  const [state, formAction, pending] = useActionState<
    RankingActionResult,
    FormData
  >(movePlayerAction, null);

  return (
    <form action={formAction} className="min-w-0">
      <input name="playerId" type="hidden" value={playerId} />
      <div className="flex flex-wrap gap-2">
        <Button
          aria-label={`Move ${playerName} up`}
          className="min-h-9 px-3"
          disabled={pending || isFirst}
          name="direction"
          type="submit"
          value="up"
          variant="secondary"
        >
          Move up
        </Button>
        <Button
          aria-label={`Move ${playerName} down`}
          className="min-h-9 px-3"
          disabled={pending || isLast}
          name="direction"
          type="submit"
          value="down"
          variant="secondary"
        >
          Move down
        </Button>
      </div>
      {state?.error ? (
        <p className="mt-2 text-sm font-medium text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

type PlayerStatusButtonProps = {
  playerId: string;
  playerName: string;
  isActive: boolean;
};

// Persist either side of the inactive roster without leaving the rankings page.
export function PlayerStatusButton({
  playerId,
  playerName,
  isActive,
}: PlayerStatusButtonProps) {
  const [state, formAction, pending] = useActionState<
    RankingActionResult,
    FormData
  >(setPlayerActiveAction, null);
  const nextActive = !isActive;

  return (
    <form action={formAction} className="min-w-0">
      <input name="playerId" type="hidden" value={playerId} />
      <input name="isActive" type="hidden" value={String(nextActive)} />
      <Button
        aria-label={`${nextActive ? "Reactivate" : "Deactivate"} ${playerName}`}
        className="min-h-9 px-3"
        disabled={pending}
        type="submit"
        variant={nextActive ? "secondary" : "quiet"}
      >
        {pending
          ? "Saving…"
          : nextActive
            ? "Reactivate"
            : "Deactivate"}
      </Button>
      {state?.error ? (
        <p className="mt-2 text-sm font-medium text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
