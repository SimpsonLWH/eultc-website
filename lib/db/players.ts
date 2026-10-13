import mongoose from "mongoose";

import { connectToDatabase } from "./connection";
import { PlayerModel } from "./models/player";

// Return active players ordered by their published club ranking.
export async function listRankings() {
  await connectToDatabase();
  return PlayerModel.find({ isActive: true }).sort({ rankingPosition: 1 }).lean();
}

// Resolve a player by Mongo id after rejecting malformed ids.
export async function getPlayerById(id: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return PlayerModel.findById(id).lean();
}

// Normalize email before lookup so callers may pass mixed-case addresses.
export async function getPlayerByEmail(email: string) {
  await connectToDatabase();
  return PlayerModel.findOne({ email: email.toLowerCase().trim() }).lean();
}
