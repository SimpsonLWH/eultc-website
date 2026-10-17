import type { RankingAccount } from "@/lib/rankings/ranking";
import { PlayerStatusButton } from "./player-actions";

type InactivePlayersProps = {
  players: RankingAccount[];
};

// Captain-only history of roster members who are currently outside selection.
export default function InactivePlayers({ players }: InactivePlayersProps) {
  if (players.length === 0) {
    return (
      <p className="mt-4 text-sm leading-6 text-slate-600">
        There are no inactive roster players.
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-slate-100">
      {players.map((player) => (
        <li
          className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          key={player.id}
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">{player.name}</p>
            <p className="truncate text-xs text-slate-500">{player.email}</p>
          </div>
          <PlayerStatusButton
            isActive={false}
            playerId={player.id}
            playerName={player.name}
          />
        </li>
      ))}
    </ul>
  );
}
