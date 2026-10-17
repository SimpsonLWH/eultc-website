import mongoose from "mongoose";

import { connectToDatabase } from "./connection";
import {
  AvailabilityResponseModel,
  type AvailabilityStatus,
} from "./models/availability-response";

// Create or replace one player's response for a fixture; the compound index guarantees one row.
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
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true, runValidators: true }
  ).lean();
}

// Fetch a player's submitted responses for their availability history.
export async function listPlayerResponses(playerId: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(playerId)) {
    return [];
  }
  return AvailabilityResponseModel.find({ playerId }).lean();
}
