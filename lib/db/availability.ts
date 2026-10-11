import mongoose from "mongoose";

import { connectToDatabase } from "./connection";
import {
  AvailabilityResponseModel,
  type AvailabilityStatus,
} from "./models/availability-response";

export async function upsertAvailability(input: {
  playerId: string;
  fixtureId: string;
  status: AvailabilityStatus;
  note?: string | null;
}) {
  await connectToDatabase();
  return AvailabilityResponseModel.findOneAndUpdate(
    { playerId: input.playerId, fixtureId: input.fixtureId },
    { $set: { status: input.status, note: input.note ?? null } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  ).lean();
}

export async function listResponsesForFixture(fixtureId: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(fixtureId)) {
    return [];
  }
  return AvailabilityResponseModel.find({ fixtureId }).sort({ updatedAt: 1 }).lean();
}

export async function listPlayerResponses(playerId: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(playerId)) {
    return [];
  }
  return AvailabilityResponseModel.find({ playerId }).lean();
}
