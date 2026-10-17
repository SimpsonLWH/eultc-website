import Badge from "@/components/ui/badge";
import type { RankingAccount } from "@/lib/rankings/ranking";
import {
  MovePlayerControls,
  PlayerStatusButton,
} from "./player-actions";

type RankingsListProps = {
  canEdit: boolean;
  currentPlayerId: string;
  players: RankingAccount[];
};

// Show the ordered club list; captain controls stay attached to the relevant row.
export default function RankingsList({
  canEdit,
  currentPlayerId,
  players,
}: RankingsListProps) {
  return (
    <ol aria-label="Club ranking" className="divide-y divide-slate-100">
      {players.map((player, index) => {
        const isCurrentPlayer = player.id === currentPlayerId;

        return (
          <li
            className={`flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between ${
              isCurrentPlayer ? "rounded-md bg-club-50/70 px-3" : "px-1"
            }`}
            key={player.id}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-label={`Rank ${player.rankingPosition}`}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-club-800 text-sm font-semibold text-white"
              >
                {player.rankingPosition}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-club-950">
                  {player.name}
                  {isCurrentPlayer ? (
                    <Badge className="ml-2 align-middle" variant="club">
                      You
                    </Badge>
                  ) : null}
                </p>
                <p className="text-xs text-slate-500">
                  {player.isActive ? "Active player" : "Inactive player"}
                </p>
              </div>
            </div>

            {canEdit ? (
              <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                <MovePlayerControls
                  isFirst={index === 0}
                  isLast={index === players.length - 1}
                  playerId={player.id}
                  playerName={player.name}
                />
                <PlayerStatusButton
                  isActive={player.isActive}
                  playerId={player.id}
                  playerName={player.name}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
