import Link from "next/link";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { formatLondonDate } from "@/lib/fixtures/datetime";
import { formatTeamLabel } from "@/lib/fixtures/team-label";
import {
  SEEDS_PER_TEAM,
  type SelectionTeam,
} from "@/lib/selection/build-selection";
import type {
  FixtureWithId,
  Matchweek,
  MatchweekSelection,
} from "@/lib/selection/matchweek";
import TeamCard from "./team-card";

export type PlayerDirectory = Map<
  string,
  { name: string; rankingPosition: number }
>;

type MatchweekSheetProps = {
  matchweek: Matchweek<FixtureWithId>;
  selection: MatchweekSelection;
  playersById: PlayerDirectory;
  currentPlayerId: string | null;
  isAdmin: boolean;
  focusFixtureId?: string | null;
  lastPlayed?: boolean;
};

// The live sheet for one matchweek: date, signup counts and one team per fixture.
export default function MatchweekSheet({
  matchweek,
  selection,
  playersById,
  currentPlayerId,
  isAdmin,
  focusFixtureId = null,
  lastPlayed = false,
}: MatchweekSheetProps) {
  const { result, respondedPlayerCount, availablePlayerCount } = selection;
  const capacity = matchweek.fixtures.length * SEEDS_PER_TEAM;
  const teamLabels = matchweek.fixtures
    .map((fixture) => formatTeamLabel(fixture.gender, fixture.teamNumber))
    .join(" · ");
  const currentUserSlot = findCurrentUserSlot(
    result.teams,
    matchweek.fixtures,
    currentPlayerId
  );
  const incompleteTeams = result.teams.filter(
    (team) => team.slots.some((slot) => slot.playerId === null)
  );

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase text-club-700">
              Matchweek
            </p>
            {lastPlayed ? <Badge>Last played</Badge> : null}
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
            {formatLondonDate(matchweek.date)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {teamLabels}
          </p>
          <p className="mt-2 text-sm font-medium text-ink" aria-live="polite">
            {respondedPlayerCount} of {capacity} signed up · {availablePlayerCount}{" "}
            available
          </p>
        </div>
        {currentUserSlot ? (
          <Badge variant="club" className="self-start sm:self-auto">
            You: {currentUserSlot.teamLabel}, seed {currentUserSlot.seed}
          </Badge>
        ) : null}
      </header>

      {isAdmin && incompleteTeams.length > 0 && respondedPlayerCount > 0 ? (
        <div
          role="status"
          className="rounded-surface squircle border border-club-300 bg-club-100 p-4"
        >
          <p className="text-sm font-semibold text-club-950">
            {incompleteTeams
              .map((team) => {
                const fixture = matchweek.fixtures[team.teamNumber - 1];
                const unfilled = team.slots.filter(
                  (slot) => slot.playerId === null
                ).length;
                return `${formatTeamLabel(fixture.gender, fixture.teamNumber)} has ${unfilled} unfilled ${unfilled === 1 ? "slot" : "slots"}`;
              })
              .join(" · ")}{" "}
            · {respondedPlayerCount} of {capacity} signed up
          </p>
          <Link
            href="/selection"
            className="mt-2 inline-block text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
          >
            Open response tracker
          </Link>
        </div>
      ) : null}

      {respondedPlayerCount === 0 ? (
        <Card>
          <div className="rounded-control squircle bg-surface-muted p-5 text-center">
            <h2 className="font-semibold text-club-950">No availability yet</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Teams appear here as soon as players sign up. Check back after
              the deadline for the published sheet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {result.teams.map((team) => {
            const fixture = matchweek.fixtures[team.teamNumber - 1];
            const isFocus =
              focusFixtureId !== null &&
              String(fixture._id) === focusFixtureId;

            return (
              <TeamCard
                key={team.teamNumber}
                fixture={fixture}
                team={team}
                playersById={playersById}
                currentPlayerId={currentPlayerId}
                isFocus={isFocus}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function findCurrentUserSlot(
  teams: SelectionTeam[],
  fixtures: FixtureWithId[],
  currentPlayerId: string | null
): { teamLabel: string; seed: number } | null {
  if (currentPlayerId === null) {
    return null;
  }

  for (const team of teams) {
    const slot = team.slots.find(
      (candidate) => candidate.playerId === currentPlayerId
    );
    if (slot && slot.playerId !== null) {
      const fixture = fixtures[team.teamNumber - 1];
      return {
        teamLabel: formatTeamLabel(fixture.gender, fixture.teamNumber),
        seed: slot.seed,
      };
    }
  }

  return null;
}
