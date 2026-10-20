import { eligibleTeams } from "../availability/eligibility";
import type { FixtureStatus } from "@/lib/db/models/fixture";

/** The fixture fields the dashboard needs to resolve the next match. */
export type DashboardFixture = {
  date: Date;
  teamNumber: number;
  status: FixtureStatus;
  availabilityDeadline: Date;
};

/**
 * The earliest upcoming, non-cancelled fixture whose team number is within
 * the player's eligible band (own team or stronger, per T05's rule).
 */
export function selectNextEligibleFixture<T extends DashboardFixture>(
  fixtures: T[],
  rank: number,
  now = new Date()
): T | null {
  const eligible = new Set(eligibleTeams(rank));

  return (
    fixtures
      .filter(
        (fixture) =>
          fixture.status !== "cancelled" &&
          fixture.date.getTime() >= now.getTime()
      )
      .sort(
        (a, b) =>
          a.date.getTime() - b.date.getTime() || a.teamNumber - b.teamNumber
      )
      .find((fixture) => eligible.has(fixture.teamNumber)) ?? null
  );
}

/** Signup is open only while the fixture is open and its deadline is ahead. */
export function isSignupOpen(
  fixture: Pick<DashboardFixture, "status" | "availabilityDeadline">,
  now = new Date()
): boolean {
  return (
    fixture.status === "open" &&
    fixture.availabilityDeadline.getTime() > now.getTime()
  );
}
