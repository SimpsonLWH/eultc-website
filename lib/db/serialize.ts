type SortableFixture = {
  _id: unknown;
  opponent: string;
  date: Date;
  venue: string;
  homeOrAway: string;
  teamsPlaying: number;
  availabilityDeadline: Date;
  status: string;
};

type SortablePlayer = {
  _id: unknown;
  name: string;
  rankingPosition: number;
  email?: string;
};

// Convert Mongoose values into stable JSON primitives for API responses.
export function serializeFixture(fixture: SortableFixture) {
  return {
    id: String(fixture._id),
    opponent: fixture.opponent,
    date: fixture.date.toISOString(),
    venue: fixture.venue,
    homeOrAway: fixture.homeOrAway,
    teamsPlaying: fixture.teamsPlaying,
    availabilityDeadline: fixture.availabilityDeadline.toISOString(),
    status: fixture.status,
  };
}

// Member-facing rankings intentionally omit email addresses.
export function serializeRankedPlayer(player: SortablePlayer) {
  return {
    id: String(player._id),
    name: player.name,
    rankingPosition: player.rankingPosition,
  };
}
