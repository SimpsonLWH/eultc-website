import mongoose from "mongoose";

import { connectToDatabase } from "./connection";
import { PlayerModel } from "./models/player";
import { listRankingAccounts } from "./rankings";
import { partitionRankingAccounts } from "@/lib/rankings/ranking";

// Return active roster players only; captain accounts stay outside member rankings.
export async function listRankings() {
  const accounts = await listRankingAccounts();
  return partitionRankingAccounts(accounts).active;
}

// Resolve a player by Mongo id after rejecting malformed ids.
export async function getPlayerById(id: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return PlayerModel.findById(id).lean();
}

// Availability and team workflows should treat deactivated members as absent.
export async function getActivePlayerById(id: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return PlayerModel.findOne({ _id: id, isActive: true }).lean();
}

// Normalize email before lookup so callers may pass mixed-case addresses.
export async function getPlayerByEmail(email: string) {
  await connectToDatabase();
  return PlayerModel.findOne({ email: email.toLowerCase().trim() }).lean();
}
