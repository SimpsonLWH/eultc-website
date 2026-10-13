import { describe, expect, it } from "vitest";

import {
  fixtureFormValuesFromFormData,
  validateFixtureForm,
  type FixtureFormValues,
} from "./validate";

const baseValues: FixtureFormValues = {
  opponent: "University of Glasgow",
  venue: "Garscube Sports Complex",
  date: "2026-10-21",
  time: "13:00",
  deadlineDate: "2026-10-20",
  deadlineTime: "20:00",
  homeOrAway: "away",
  gender: "female",
  teamNumber: "2",
  status: "open",
};

function values(overrides: Partial<FixtureFormValues> = {}): FixtureFormValues {
  return { ...baseValues, ...overrides };
}

describe("validateFixtureForm", () => {
  it("accepts a complete valid fixture", () => {
    const result = validateFixtureForm(values());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.opponent).toBe("University of Glasgow");
      // 21 October 2026 is still BST, so 13:00 London is 12:00 UTC.
      expect(result.value.date.toISOString()).toBe("2026-10-21T12:00:00.000Z");
      expect(result.value.availabilityDeadline.toISOString()).toBe(
        "2026-10-20T19:00:00.000Z"
      );
      expect(result.value.homeOrAway).toBe("away");
      expect(result.value.gender).toBe("female");
      expect(result.value.teamNumber).toBe(2);
      expect(result.value.status).toBe("open");
    }
  });

  it("requires opponent and venue", () => {
    const result = validateFixtureForm(values({ opponent: "  ", venue: "" }));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.opponent).toBeTruthy();
      expect(result.errors.venue).toBeTruthy();
    }
  });

  it("accepts team-number bounds and rejects everything else", () => {
    expect(validateFixtureForm(values({ teamNumber: "1" })).ok).toBe(true);
    expect(validateFixtureForm(values({ teamNumber: "10" })).ok).toBe(true);

    for (const teamNumber of ["0", "11", "4.5", "", "four"]) {
      const result = validateFixtureForm(values({ teamNumber }));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.teamNumber).toBeTruthy();
      }
    }
  });

  it("rejects genders outside the fixture schema enum", () => {
    const result = validateFixtureForm(values({ gender: "mixed" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.gender).toBeTruthy();
    }
  });

  it("rejects a deadline that is not strictly before kick-off", () => {
    const equal = validateFixtureForm(
      values({ deadlineDate: "2026-10-21", deadlineTime: "13:00" })
    );
    expect(equal.ok).toBe(false);
    if (!equal.ok) {
      expect(equal.errors.deadlineTime).toBeTruthy();
    }

    const after = validateFixtureForm(
      values({ deadlineDate: "2026-10-22", deadlineTime: "09:00" })
    );
    expect(after.ok).toBe(false);
  });

  it("rejects bad dates and times", () => {
    expect(validateFixtureForm(values({ date: "2026-02-30" })).ok).toBe(false);
    expect(validateFixtureForm(values({ time: "25:00" })).ok).toBe(false);
    expect(validateFixtureForm(values({ deadlineDate: "" })).ok).toBe(false);
  });

  it("rejects values outside the schema enums", () => {
    expect(validateFixtureForm(values({ homeOrAway: "neutral" })).ok).toBe(
      false
    );
    expect(validateFixtureForm(values({ status: "postponed" })).ok).toBe(false);
  });
});

describe("fixtureFormValuesFromFormData", () => {
  it("reads and trims form fields, defaulting missing ones to empty", () => {
    const formData = new FormData();
    formData.set("opponent", "  Heriot-Watt University ");
    formData.set("teamNumber", "2");
    formData.set("gender", "female");

    const parsed = fixtureFormValuesFromFormData(formData);

    expect(parsed.opponent).toBe("Heriot-Watt University");
    expect(parsed.teamNumber).toBe("2");
    expect(parsed.gender).toBe("female");
    expect(parsed.venue).toBe("");
    expect(parsed.status).toBe("");
  });
});
