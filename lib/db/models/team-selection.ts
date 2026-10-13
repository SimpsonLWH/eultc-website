import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Persist a published team sheet separately from the live computed selection result.
const teamSelectionSchema = new Schema(
  {
    fixtureId: { type: Schema.Types.ObjectId, ref: "Fixture", required: true },
    teamNumber: { type: Number, required: true, min: 1 },
    seedPosition: { type: Number, required: true, min: 1, max: 4 },
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
  },
  { timestamps: true, collection: "team_selections" }
);

// A player can occupy each team position only once per fixture.
teamSelectionSchema.index(
  { fixtureId: 1, teamNumber: 1, seedPosition: 1 },
  { unique: true }
);

export type TeamSelection = InferSchemaType<typeof teamSelectionSchema>;

// Reuse the compiled model during development reloads.
export const TeamSelectionModel: Model<TeamSelection> =
  (models.TeamSelection as Model<TeamSelection> | undefined) ??
  model<TeamSelection>("TeamSelection", teamSelectionSchema);
