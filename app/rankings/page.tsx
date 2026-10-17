import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import AddPlayerForm from "@/components/rankings/add-player-form";
import InactivePlayers from "@/components/rankings/inactive-players";
import RankingsList from "@/components/rankings/rankings-list";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { listRankingAccounts } from "@/lib/db";
import { partitionRankingAccounts } from "@/lib/rankings/ranking";

export const metadata: Metadata = {
  title: "Club rankings",
};

// Session-gated route: skip instant-navigation validation while keeping a streamed skeleton.
export const instant = false;

export default function RankingsPage() {
  return (
    <Suspense fallback={<RankingsSkeleton />}>
      <RankingsContent />
    </Suspense>
  );
}

async function RankingsContent() {
  await connection();
  const user = await requireUser();
  const accounts = await listRankingAccounts();
  const { active, inactive } = partitionRankingAccounts(accounts);
  const canEdit = user.role === "admin";

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-club-700">
            Clubhouse
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
            Club rankings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            The ordered list captains use when selecting teams each matchweek.
          </p>
        </div>
        {canEdit ? <Badge variant="club">Captain view</Badge> : null}
      </header>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-club-950">
              Current ranking
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Stronger players appear first. Rank changes apply to the next team
              selection load.
            </p>
          </div>
          <Badge>{active.length} active</Badge>
        </div>

        {active.length > 0 ? (
          <div className="mt-5">
            <RankingsList
              canEdit={canEdit}
              currentPlayerId={user.playerId ?? ""}
              players={active}
            />
          </div>
        ) : (
          <div className="mt-5 rounded-md border border-dashed border-slate-300 bg-slate-50 p-5">
            <p className="font-semibold text-club-950">
              No active rankings yet
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {canEdit
                ? "Add the first player below to start the club ranking."
                : "A captain can add the first player to the ranking."}
            </p>
          </div>
        )}
      </Card>

      {canEdit ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div>
              <h2 className="text-lg font-semibold text-club-950">
                Add a player
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                New players join the active list and can sign in with the email
                you enter.
              </p>
            </div>
            <AddPlayerForm />
          </Card>

          <Card>
            <div>
              <h2 className="text-lg font-semibold text-club-950">
                Inactive players
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Inactive players stay out of availability and selection. Their
                past availability answers are kept.
              </p>
            </div>
            <InactivePlayers players={inactive} />
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function RankingsSkeleton() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-24 max-w-2xl rounded-md bg-white" />
      <div className="h-80 rounded-md bg-white" />
    </div>
  );
}
