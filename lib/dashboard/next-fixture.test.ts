import { describe, expect, it } from "vitest";

import type { FixtureStatus } from "@/lib/db/models/fixture";

import {
  isSignupOpen,
  selectNextEligibleFixture,
  type DashboardFixture,
} from "./next-fixture";

const NOW = new Date("2026-11-05T12:00:00.000Z");

function makeFixture(
  teamNumber: number,
  date: Date,
  overrides: Partial<DashboardFixture> = {}
): DashboardFixture {
  return {
    teamNumber,
    date,
    status: "open",
    availabilityDeadline: new Date("2026-11-10T20:00:00.000Z"),
    ...overrides,
  };
}

describe("selectNextEligibleFixture", () => {
  it("picks the earliest upcoming fixture the rank is eligible for", () => {
    const fixtures = [
      makeFixture(3, new Date("2026-11-06T14:00:00.000Z")),
      makeFixture(1, new Date("2026-11-08T14:00:00.000Z")),
      makeFixture(1, new Date("2026-11-07T14:00:00.000Z")),
    ];

    // Rank 3 is eligible for teams 1 and 2 only.
    const next = selectNextEligibleFixture(fixtures, 3, NOW);

    expect(next?.teamNumber).toBe(1);
    expect(next?.date).toEqual(new Date("2026-11-07T14:00:00.000Z"));
  });

  it("skips cancelled fixtures", () => {
    const fixtures = [
      makeFixture(1, new Date("2026-11-06T14:00:00.000Z"), {
        status: "cancelled",
      }),
      makeFixture(1, new Date("2026-11-07T14:00:00.000Z")),
    ];

    const next = selectNextEligibleFixture(fixtures, 1, NOW);

    expect(next?.date).toEqual(new Date("2026-11-07T14:00:00.000Z"));
  });

  it("skips fixtures whose team number is outside the rank's eligible teams", () => {
    const fixtures = [
      makeFixture(2, new Date("2026-11-06T14:00:00.000Z")),
    ];

    // Rank 1 can only represent team 1, so a team 2 fixture is skipped...
    expect(
      selectNextEligibleFixture(fixtures, 1, NOW)
    ).toBeNull();
    // ...and the player's own team fixture is picked.
    expect(
      selectNextEligibleFixture(
        [makeFixture(1, new Date("2026-11-06T14:00:00.000Z"))],
        1,
        NOW
      )?.teamNumber
    ).toBe(1);
  });

  it("returns null when nothing is upcoming and eligible", () => {
    // Rank 12's band covers teams 1-3; only team 4 has a fixture.
    expect(
      selectNextEligibleFixture(
        [makeFixture(4, new Date("2026-11-06T14:00:00.000Z"))],
        12,
        NOW
      )
    ).toBeNull();
    expect(selectNextEligibleFixture([], 1, NOW)).toBeNull();
    // Past fixtures never count as "next".
    expect(
      selectNextEligibleFixture(
        [makeFixture(1, new Date("2026-11-04T14:00:00.000Z"))],
        1,
        NOW
      )
    ).toBeNull();
  });
});

describe("isSignupOpen", () => {
  it("is open only while status is open and the deadline is in the future", () => {
    const open = makeFixture(1, new Date("2026-11-08T14:00:00.000Z"));
    const closedStatus = makeFixture(1, new Date("2026-11-08T14:00:00.000Z"), {
      status: "closed" as FixtureStatus,
    });
    const pastDeadline = makeFixture(1, new Date("2026-11-08T14:00:00.000Z"), {
      availabilityDeadline: new Date("2026-11-04T20:00:00.000Z"),
    });

    expect(isSignupOpen(open, NOW)).toBe(true);
    expect(isSignupOpen(closedStatus, NOW)).toBe(false);
    expect(isSignupOpen(pastDeadline, NOW)).toBe(false);
  });
});
