import type { ReactNode } from "react";
import { connection } from "next/server";
import { getCurrentUser } from "./index";

// Show an access explanation for unknown emails while anonymous shell routes remain public.
export async function PlayerGate({ children }: { children: ReactNode }) {
  // Better Auth reads request headers, so defer this check to the current request.
  await connection();
  const user = await getCurrentUser();

  if (user && user.role !== "admin" && !user.playerId) {
    // Never create a roster entry from sign-in; a captain must add the player.
    return (
      <section
        aria-labelledby="not-listed-title"
        className="mx-auto max-w-xl rounded-surface squircle border border-line bg-surface p-6 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase text-club-700">Clubhouse access</p>
        <h1 id="not-listed-title" className="mt-2 text-2xl font-semibold text-club-950">
          You’re not on the list yet
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Ask a captain to add your email address to the club player list, then sign in again.
        </p>
        <p className="mt-4 text-sm font-medium text-ink">Signed in as {user.email}</p>
      </section>
    );
  }

  return children;
}
