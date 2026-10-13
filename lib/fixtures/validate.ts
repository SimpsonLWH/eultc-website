import type { FixtureInput } from "@/lib/db/fixtures";
import type {
  FixtureStatus,
  HomeOrAway,
  TeamGender,
} from "@/lib/db/models/fixture";

import { londonWallTimeToUtc } from "./datetime";

// Mirrors the schema enums in lib/db/models/fixture.ts. Kept as plain arrays so
// this module stays free of Mongoose imports and is cheap to unit test.
const HOME_OR_AWAY_VALUES = [
  "home",
  "away",
] as const satisfies readonly HomeOrAway[];

// Mirror the model enum while keeping this validation module independent of Mongoose.
const TEAM_GENDER_VALUES = ["male", "female"] as const satisfies readonly TeamGender[];

const FIXTURE_STATUS_VALUES = [
  "draft",
  "open",
  "closed",
  "cancelled",
] as const satisfies readonly FixtureStatus[];

export type FixtureFormValues = {
  opponent: string;
  venue: string;
  date: string;
  time: string;
  deadlineDate: string;
  deadlineTime: string;
  homeOrAway: string;
  gender: string;
  teamNumber: string;
  status: string;
};

export type FixtureFieldErrors = Partial<
  Record<keyof FixtureFormValues, string>
>;

export type FixtureValidation =
  | { ok: true; value: FixtureInput }
  | { ok: false; errors: FixtureFieldErrors };

export const emptyFixtureFormValues: FixtureFormValues = {
  opponent: "",
  venue: "",
  date: "",
  time: "",
  deadlineDate: "",
  deadlineTime: "",
  homeOrAway: "home",
  gender: "male",
  teamNumber: "1",
  status: "open",
};

const timePattern = /^(\d{2}):(\d{2})$/;

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function fixtureFormValuesFromFormData(
  formData: FormData
): FixtureFormValues {
  return {
    opponent: readText(formData, "opponent"),
    venue: readText(formData, "venue"),
    date: readText(formData, "date"),
    time: readText(formData, "time"),
    deadlineDate: readText(formData, "deadlineDate"),
    deadlineTime: readText(formData, "deadlineTime"),
    homeOrAway: readText(formData, "homeOrAway"),
    gender: readText(formData, "gender"),
    teamNumber: readText(formData, "teamNumber"),
    status: readText(formData, "status"),
  };
}

function timeIsWellFormed(value: string): boolean {
  const match = timePattern.exec(value);
  return (
    match !== null && Number(match[1]) < 24 && Number(match[2]) < 60
  );
}

export function validateFixtureForm(
  values: FixtureFormValues
): FixtureValidation {
  const errors: FixtureFieldErrors = {};

  const opponent = values.opponent.trim();
  if (!opponent) {
    errors.opponent = "Enter an opponent.";
  }

  const venue = values.venue.trim();
  if (!venue) {
    errors.venue = "Enter a venue.";
  }

  // Noon always exists in the UK, so it isolates the date from DST edges.
  const dateIsReal = londonWallTimeToUtc(values.date, "12:00") !== null;
  const matchAt = londonWallTimeToUtc(values.date, values.time);
  if (!dateIsReal) {
    errors.date = "Enter a real date.";
  } else if (!matchAt) {
    errors.time = timeIsWellFormed(values.time)
      ? "That time does not exist in the UK on this date. Pick another time."
      : "Enter a kick-off time like 13:00.";
  }

  const deadlineDateIsReal =
    londonWallTimeToUtc(values.deadlineDate, "12:00") !== null;
  const deadlineAt = londonWallTimeToUtc(
    values.deadlineDate,
    values.deadlineTime
  );
  if (!deadlineDateIsReal) {
    errors.deadlineDate = "Enter a real date.";
  } else if (!deadlineAt) {
    errors.deadlineTime = timeIsWellFormed(values.deadlineTime)
      ? "That time does not exist in the UK on this date. Pick another time."
      : "Enter a deadline time like 20:00.";
  } else if (matchAt && deadlineAt.getTime() >= matchAt.getTime()) {
    errors.deadlineTime = "The deadline must be before the match starts.";
  }

  const teamNumberRaw = values.teamNumber.trim();
  const teamNumber = /^\d+$/.test(teamNumberRaw)
    ? Number(teamNumberRaw)
    : Number.NaN;
  if (!Number.isInteger(teamNumber) || teamNumber < 1 || teamNumber > 10) {
    errors.teamNumber = "Enter a team number from 1 to 10.";
  }

  if (!(TEAM_GENDER_VALUES as readonly string[]).includes(values.gender)) {
    errors.gender = "Choose men's or women's team.";
  }

  if (!(HOME_OR_AWAY_VALUES as readonly string[]).includes(values.homeOrAway)) {
    errors.homeOrAway = "Choose home or away.";
  }

  if (!(FIXTURE_STATUS_VALUES as readonly string[]).includes(values.status)) {
    errors.status = "Choose a status.";
  }

  if (Object.keys(errors).length > 0 || !matchAt || !deadlineAt) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      opponent,
      venue,
      date: matchAt,
      availabilityDeadline: deadlineAt,
      homeOrAway: values.homeOrAway as HomeOrAway,
      gender: values.gender as TeamGender,
      teamNumber,
      status: values.status as FixtureStatus,
    },
  };
}
