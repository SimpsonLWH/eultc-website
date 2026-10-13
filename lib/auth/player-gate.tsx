import type { ReactNode } from "react";
import { connection } from "next/server";
import { getCurrentUser } from "./index";

export async function PlayerGate({ children }: { children: ReactNode }) {
  await connection();
  const user = await getCurrentUser();

  if (user && !user.playerId) {
    return (
      <section
        aria-labelledby="not-listed-title"
        className="mx-auto max-w-xl rounded-md border border-slate-200 bg-white p-6 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase text-club-700">Clubhouse access</p>
        <h1 id="not-listed-title" className="mt-2 text-2xl font-semibold text-club-950">
          You’re not on the list yet
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ask a captain to add your email address to the club player list, then sign in again.
        </p>
        <p className="mt-4 text-sm font-medium text-slate-700">Signed in as {user.email}</p>
      </section>
    );
  }

  return children;
}