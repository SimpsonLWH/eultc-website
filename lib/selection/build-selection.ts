/**
 * T07 - ranked selection engine.
 *
 * Pure and database-free: callers adapt stored players and availability
 * responses into the input shapes below. See TASKS.md for the product rules.
 */

export const SEEDS_PER_TEAM = 4;

export type SelectionPlayer = {
  id: string;
  name: string;
  rankingPosition: number;
  isActive: boolean;
};

export type SelectionResponse = {
  playerId: string;
  status: "available" | "unavailable";
};

export type BuildSelectionInput = {
  /** The full rankings list. */
  players: SelectionPlayer[];
  /** Availability answers for one fixture; duplicates are tolerated. */
  responses: SelectionResponse[];
  /** Number of teams playing this week (N). */
  teamsPlaying: number;
};

export type SelectionSlot = {
  /** 1-4, strongest first. */
  seed: number;
  /** Player id, or null when the slot could not be filled. */
  playerId: string | null;
};

export type SelectionTeam = {
  /** 1-based team number. */
  teamNumber: number;
  /** Always four slots, seeds 1 to 4; unfilled slots have a null playerId. */
  slots: SelectionSlot[];
};

export type SelectionResult = {
  teams: SelectionTeam[];
  /** True when at least one slot could not be filled. */
  incomplete: boolean;
  /** 4 x teamsPlaying minus the number of players who were selected. */
  unfilledSlots: number;
};

function compareStrings(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

/**
 * Ranking order: rankingPosition ascending, then name, then id. The name/id
 * tiebreak is a deterministic contract so tied rankings never depend on the
 * order the callers happen to pass players in.
 */
function compareByRank(a: SelectionPlayer, b: SelectionPlayer): number {
  if (a.rankingPosition !== b.rankingPosition) {
    return a.rankingPosition - b.rankingPosition;
  }
  return compareStrings(a.name, b.name) || compareStrings(a.id, b.id);
}

/**
 * Select this week's BUCS teams.
 *
 * Only active players with at least one "available" response are eligible.
 * Duplicate responses never double-count, and if duplicates disagree the
 * presence of an "available" answer wins. Eligible players are ordered by
 * rank; the top 4 x N fill team 1 seeds 1-4 (strongest player is team 1
 * seed 1), then team 2 seeds 1-4, and so on. Short weeks return partially
 * filled teams with `incomplete: true` and a non-zero `unfilledSlots`.
 */
export function buildSelection({
  players,
  responses,
  teamsPlaying,
}: BuildSelectionInput): SelectionResult {
  // A Set deduplicates responses; any available answer makes a player eligible.
  const availablePlayerIds = new Set<string>();
  for (const response of responses) {
    if (response.status === "available") {
      availablePlayerIds.add(response.playerId);
    }
  }

  // Filter and sort a new array so the caller's rankings list is never mutated.
  const eligible = players
    .filter((player) => player.isActive && availablePlayerIds.has(player.id))
    .sort(compareByRank);

  const teamCount = Number.isFinite(teamsPlaying)
    ? Math.max(0, Math.floor(teamsPlaying))
    : 0;
  const teams: SelectionTeam[] = [];
  let selected = 0;

  // Fill each team completely before starting the next team's seed 1.
  for (let teamNumber = 1; teamNumber <= teamCount; teamNumber += 1) {
    const slots: SelectionSlot[] = [];
    for (let seed = 1; seed <= SEEDS_PER_TEAM; seed += 1) {
      const player = eligible[selected];
      slots.push({ seed, playerId: player ? player.id : null });
      if (player) {
        selected += 1;
      }
    }
    teams.push({ teamNumber, slots });
  }

  // Report every empty position so short selection weeks are explicit to callers.
  const unfilledSlots = SEEDS_PER_TEAM * teamCount - selected;

  return { teams, incomplete: unfilledSlots > 0, unfilledSlots };
}
