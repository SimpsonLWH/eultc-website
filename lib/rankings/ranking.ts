/**
 * Pure ranking-order helpers.
 *
 * The database keeps every player's ranking position unique. Active players
 * occupy positions 1..N, inactive roster players follow, and captain/admin
 * accounts are kept outside the member ranking. These helpers only reshape
 * arrays; persistence lives in lib/db/rankings.ts.
 */

export type RankingAccount = {
  id: string;
  name: string;
  email: string;
  rankingPosition: number;
  isActive: boolean;
  isAdmin: boolean;
};

export type RankingPartition = {
  active: RankingAccount[];
  inactive: RankingAccount[];
  admins: RankingAccount[];
};

export type RankingPositionUpdate = {
  id: string;
  rankingPosition: number;
  isActive: boolean;
};

// Keep ordering deterministic even if stored positions are temporarily unusual.
function compareAccounts(a: RankingAccount, b: RankingAccount): number {
  if (a.rankingPosition !== b.rankingPosition) {
    return a.rankingPosition - b.rankingPosition;
  }
  if (a.name !== b.name) {
    return a.name < b.name ? -1 : 1;
  }
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

// Separate member rankings from captain tooling; admin rows never enter either list.
export function partitionRankingAccounts(
  accounts: RankingAccount[]
): RankingPartition {
  const ordered = [...accounts].sort(compareAccounts);

  return {
    active: ordered.filter((account) => !account.isAdmin && account.isActive),
    inactive: ordered.filter((account) => !account.isAdmin && !account.isActive),
    admins: ordered.filter((account) => account.isAdmin),
  };
}

// Move one active player by one slot without mutating the caller's array.
export function moveActivePlayer(
  active: RankingAccount[],
  playerId: string,
  direction: "up" | "down"
): RankingAccount[] {
  const next = [...active];
  const index = next.findIndex((account) => account.id === playerId);
  if (index < 0) {
    return next;
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= next.length) {
    return next;
  }

  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next;
}

// Insert into a validated 1-based position, or append when position is null.
export function insertActivePlayer(
  active: RankingAccount[],
  player: RankingAccount,
  position: number | null
): RankingAccount[] {
  const next = [...active];
  const index =
    position === null
      ? next.length
      : Math.min(Math.max(position - 1, 0), next.length);
  next.splice(index, 0, player);
  return next;
}

// Assign contiguous positions after active, inactive, then admin accounts.
export function buildPositionUpdates({
  active,
  inactive,
  admins,
}: RankingPartition): RankingPositionUpdate[] {
  return [...active, ...inactive, ...admins].map((account, index) => ({
    id: account.id,
    rankingPosition: index + 1,
    isActive: account.isActive,
  }));
}
