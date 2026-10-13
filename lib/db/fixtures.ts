import mongoose from "mongoose";

import { connectToDatabase } from "./connection";
import {
  FixtureModel,
  type FixtureStatus,
  type HomeOrAway,
} from "./models/fixture";

export type FixtureScope = "upcoming" | "past" | "all";

export type FixtureInput = {
  opponent: string;
  date: Date;
  venue: string;
  homeOrAway: HomeOrAway;
  teamsPlaying: number;
  availabilityDeadline: Date;
  status: FixtureStatus;
};

// Apply consistent chronological ordering for each requested part of the schedule.
export async function listFixtures(scope: FixtureScope = "all") {
  await connectToDatabase();
  const now = new Date();

  if (scope === "upcoming") {
    return FixtureModel.find({ date: { $gte: now } }).sort({ date: 1 }).lean();
  }
  if (scope === "past") {
    return FixtureModel.find({ date: { $lt: now } }).sort({ date: -1 }).lean();
  }
  return FixtureModel.find({}).sort({ date: 1 }).lean();
}

// Availability is open only while the fixture status and deadline both allow responses.
export async function listOpenFixtures(now = new Date()) {
  await connectToDatabase();
  return FixtureModel.find({ status: "open", availabilityDeadline: { $gt: now } })
    .sort({ date: 1 })
    .lean();
}

// Invalid ObjectIds are treated as not-found rather than thrown as cast errors.
export async function getFixtureById(id: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return FixtureModel.findById(id).lean();
}

// Create and return a plain object so callers do not depend on a live Mongoose document.
export async function createFixture(input: FixtureInput) {
  await connectToDatabase();
  const fixture = await FixtureModel.create(input);
  return fixture.toObject();
}

// Validate partial updates through the schema and return null for invalid or missing ids.
export async function updateFixture(id: string, input: Partial<FixtureInput>) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return FixtureModel.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  ).lean();
}
