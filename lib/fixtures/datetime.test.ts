import { describe, expect, it } from "vitest";

import {
  formatLondonDate,
  formatLondonDateInput,
  formatLondonDateTime,
  formatLondonTime,
  formatLondonTimeInput,
  londonWallTimeToUtc,
} from "./datetime";

describe("londonWallTimeToUtc", () => {
  it("keeps winter wall times unchanged (GMT, UTC+0)", () => {
    expect(londonWallTimeToUtc("2026-01-15", "13:00")?.toISOString()).toBe(
      "2026-01-15T13:00:00.000Z"
    );
  });

  it("shifts summer wall times back an hour (BST, UTC+1)", () => {
    expect(londonWallTimeToUtc("2026-06-15", "13:00")?.toISOString()).toBe(
      "2026-06-15T12:00:00.000Z"
    );
  });

  it("resolves the ambiguous fall-back hour to the first occurrence", () => {
    // Clocks go back on 25 October 2026: 01:30 happens twice, take the BST one.
    expect(londonWallTimeToUtc("2026-10-25", "01:30")?.toISOString()).toBe(
      "2026-10-25T00:30:00.000Z"
    );
  });

  it("rejects wall times inside the spring-forward gap", () => {
    // Clocks jump from 01:00 to 02:00 on 29 March 2026, so 01:30 never exists.
    expect(londonWallTimeToUtc("2026-03-29", "01:30")).toBeNull();
    expect(londonWallTimeToUtc("2026-03-29", "02:00")?.toISOString()).toBe(
      "2026-03-29T01:00:00.000Z"
    );
  });

  it("handles midnight without the Intl hour-24 quirk", () => {
    expect(londonWallTimeToUtc("2026-01-15", "00:15")?.toISOString()).toBe(
      "2026-01-15T00:15:00.000Z"
    );
  });

  it("rejects malformed dates and times", () => {
    const cases: Array<[string, string]> = [
      ["2026-02-30", "10:00"],
      ["2026-13-01", "10:00"],
      ["not-a-date", "10:00"],
      ["2026-05-01", "25:00"],
      ["2026-05-01", "10:60"],
      ["2026-05-01", "10"],
      ["", ""],
    ];

    for (const [date, time] of cases) {
      expect(londonWallTimeToUtc(date, time)).toBeNull();
    }
  });
});

describe("London formatting", () => {
  it("formats dates, times and input values in club time", () => {
    // 12:00 UTC on 14 October 2026 is 13:00 BST in London.
    const instant = new Date("2026-10-14T12:00:00.000Z");

    expect(formatLondonDate(instant)).toBe("Wed 14 Oct");
    expect(formatLondonTime(instant)).toBe("13:00");
    expect(formatLondonDateTime(instant)).toBe("Wed 14 Oct, 13:00");
    expect(formatLondonDateInput(instant)).toBe("2026-10-14");
    expect(formatLondonTimeInput(instant)).toBe("13:00");
  });
});
