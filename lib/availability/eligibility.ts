// Four consecutive ranking positions form each team, with rank 1 at team 1.
const PLAYERS_PER_TEAM = 4;

/** Return team 1 through the player's own ranked team; lower team numbers are stronger. */
export function eligibleTeams(rank: number): number[] {
  // Invalid rankings cannot authorize any team.
  if (!Number.isInteger(rank) || rank < 1) {
    return [];
  }

  const ownTeam = Math.ceil(rank / PLAYERS_PER_TEAM);

  // Players may represent their own team or any higher-ranked team, never a lower-ranked one.
  return Array.from({ length: ownTeam }, (_, index) => index + 1);
}