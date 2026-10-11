import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Reserved for a published team sheet (distinct from the live computed sheet).
// V1 renders computed teams and does not write here yet.
const teamSelectionSchema = new Schema(
  {
    fixtureId: { type: Schema.Types.ObjectId, ref: "Fixture", required: true },
    teamNumber: { type: Number, required: true, min: 1 },
    seedPosition: { type: Number, required: true, min: 1, max: 4 },
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
  },
  { timestamps: true, collection: "team_selections" }
);

teamSelectionSchema.index(
  { fixtureId: 1, teamNumber: 1, seedPosition: 1 },
  { unique: true }
);

export type TeamSelection = InferSchemaType<typeof teamSelectionSchema>;

export const TeamSelectionModel: Model<TeamSelection> =
  (models.TeamSelection as Model<TeamSelection> | undefined) ??
  model<TeamSelection>("TeamSelection", teamSelectionSchema);
