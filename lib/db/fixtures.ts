import mongoose, { type FilterQuery } from "mongoose";

import { connectToDatabase } from "./connection";
import {
  FixtureModel,
  type Fixture,
  type FixtureStatus,
  type HomeOrAway,
} from "./models/fixture";

export type FixtureScope = "upcoming" | "past" | "all";

export type FixtureListOptions = {
  /** Admins can see drafts; everyone else gets the published schedule. */
  includeDrafts?: boolean;
};

export type FixtureInput = {
  opponent: string;
  date: Date;
  venue: string;
  homeOrAway: HomeOrAway;
  teamsPlaying: number;
  availabilityDeadline: Date;
  status: FixtureStatus;
};

export async function listFixtures(
  scope: FixtureScope = "all",
  options: FixtureListOptions = {}
) {
  await connectToDatabase();
  const now = new Date();
  const filter: FilterQuery<Fixture> = {};

  if (!options.includeDrafts) {
    filter.status = { $ne: "draft" };
  }

  if (scope === "upcoming") {
    return FixtureModel.find({ ...filter, date: { $gte: now } })
      .sort({ date: 1 })
      .lean();
  }
  if (scope === "past") {
    return FixtureModel.find({ ...filter, date: { $lt: now } })
      .sort({ date: -1 })
      .lean();
  }
  return FixtureModel.find(filter).sort({ date: 1 }).lean();
}

export async function listOpenFixtures(now = new Date()) {
  await connectToDatabase();
  return FixtureModel.find({ status: "open", availabilityDeadline: { $gt: now } })
    .sort({ date: 1 })
    .lean();
}

export async function getFixtureById(id: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return FixtureModel.findById(id).lean();
}

export async function createFixture(input: FixtureInput) {
  await connectToDatabase();
  const fixture = await FixtureModel.create(input);
  return fixture.toObject();
}

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
