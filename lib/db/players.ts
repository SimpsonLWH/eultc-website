import mongoose from "mongoose";

import { connectToDatabase } from "./connection";
import { PlayerModel } from "./models/player";

export async function listRankings() {
  await connectToDatabase();
  return PlayerModel.find({ isActive: true }).sort({ rankingPosition: 1 }).lean();
}

export async function getPlayerById(id: string) {
  await connectToDatabase();
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return PlayerModel.findById(id).lean();
}

export async function getPlayerByEmail(email: string) {
  await connectToDatabase();
  return PlayerModel.findOne({ email: email.toLowerCase().trim() }).lean();
}
