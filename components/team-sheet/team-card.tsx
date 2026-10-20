import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { formatLondonTime } from "@/lib/fixtures/datetime";
import { formatTeamLabel } from "@/lib/fixtures/team-label";
import type { SelectionTeam } from "@/lib/selection/build-selection";
import type { FixtureWithId, PlayerDirectory } from "./matchweek-sheet";

type TeamCardProps = {
  fixture: FixtureWithId;
  team: SelectionTeam;
  playersById: PlayerDirectory;
  currentPlayerId: string | null;
  isFocus?: boolean;
};

// One team inside a matchweek sheet: fixture context plus four seed rows.
export default function TeamCard({
  fixture,
  team,
  playersById,
  currentPlayerId,
  isFocus = false,
}: TeamCardProps) {
  return (
    <Card
      aria-label={`${formatTeamLabel(fixture.gender, fixture.teamNumber)} team sheet`}
      className={isFocus ? "ring-2 ring-club-600" : ""}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-club-700">
            {formatTeamLabel(fixture.gender, fixture.teamNumber)}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-club-950">
            {fixture.opponent}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {fixture.venue} · Kick-off {formatLondonTime(fixture.date)}
          </p>
        </div>
        <Badge variant={fixture.homeOrAway === "home" ? "club" : "neutral"}>
          {fixture.homeOrAway === "home" ? "Home" : "Away"}
        </Badge>
      </div>

      <ol className="mt-5 divide-y divide-line border-t border-line">
        {team.slots.map((slot) => {
          const player =
            slot.playerId === null ? null : playersById.get(slot.playerId);
          const isOwnRow =
            slot.playerId !== null && slot.playerId === currentPlayerId;

          return (
            <li
              key={slot.seed}
              className={`flex items-center justify-between gap-3 py-3 ${
                isOwnRow
                  ? "rounded-control squircle bg-club-100 px-3 ring-1 ring-inset ring-club-300"
                  : ""
              }`}
            >
              <span className="w-14 shrink-0 text-xs font-semibold uppercase text-muted">
                Seed {slot.seed}
              </span>
              {player ? (
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="min-w-0 truncate text-sm font-medium text-ink">
                    {player.name}
                  </span>
                  <span className="text-xs font-semibold text-muted">
                    #{player.rankingPosition}
                  </span>
                  {isOwnRow ? <Badge variant="club">You</Badge> : null}
                </span>
              ) : (
                <span className="flex-1 text-sm italic text-muted">
                  Unfilled slot
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
