import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const playerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rankingPosition: { type: Number, required: true, unique: true, min: 1 },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "players" }
);

export type Player = InferSchemaType<typeof playerSchema>;

export const PlayerModel: Model<Player> =
  (models.Player as Model<Player> | undefined) ?? model<Player>("Player", playerSchema);
