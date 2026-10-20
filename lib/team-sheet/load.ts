import { listFixtures, listResponsesForFixtures } from "@/lib/db";
import {
  groupFixturesIntoMatchweeks,
  resolveDisplayMatchweek,
  type FixtureWithId,
  type Matchweek,
} from "@/lib/selection/matchweek";

export type DisplayMatchweek = {
  matchweek: Matchweek<FixtureWithId>;
  lastPlayed: boolean;
};

/**
 * The matchweek the live sheet shows: the next upcoming one, falling back to
 * the most recent past one. When several matchweeks share the resolved date
 * (for example men's and women's fixtures the same day), prefer the group
 * that has responses so a live week surfaces first.
 */
export async function loadDisplayMatchweek(): Promise<DisplayMatchweek | null> {
  const fixtures = await listFixtures("all");
  const matchweeks = groupFixturesIntoMatchweeks(fixtures);
  const resolved = resolveDisplayMatchweek(matchweeks);
  if (!resolved) {
    return null;
  }

  const sameDate = matchweeks.filter(
    (group) => group.date.getTime() === resolved.date.getTime()
  );
  const preferred =
    sameDate.length > 1 ? ((await firstWithResponses(sameDate)) ?? resolved) : resolved;

  return {
    matchweek: preferred,
    lastPlayed: preferred.date.getTime() < Date.now(),
  };
}

async function firstWithResponses(
  groups: Matchweek<FixtureWithId>[]
): Promise<Matchweek<FixtureWithId> | null> {
  for (const group of groups) {
    const responses = await listResponsesForFixtures(
      group.fixtures.map((fixture) => String(fixture._id))
    );
    if (responses.length > 0) {
      return group;
    }
  }
  return null;
}
