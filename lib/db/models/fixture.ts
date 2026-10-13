import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Literal unions keep API and database fixture values in sync.
export const HOME_OR_AWAY = ["home", "away"] as const;
export type HomeOrAway = (typeof HOME_OR_AWAY)[number];

export const FIXTURE_STATUSES = ["draft", "open", "closed", "cancelled"] as const;
export type FixtureStatus = (typeof FIXTURE_STATUSES)[number];

const fixtureSchema = new Schema(
  {
    opponent: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true, trim: true },
    homeOrAway: { type: String, required: true, enum: [...HOME_OR_AWAY] },
    teamsPlaying: { type: Number, required: true, min: 1, max: 10 },
    availabilityDeadline: { type: Date, required: true },
    status: { type: String, required: true, enum: [...FIXTURE_STATUSES], default: "draft" },
  },
  { timestamps: true, collection: "fixtures" }
  // The date index supports schedule queries and chronological sorting.
);

fixtureSchema.index({ date: 1 });

export type Fixture = InferSchemaType<typeof fixtureSchema>;

// Reuse the existing model during development reloads.
export const FixtureModel: Model<Fixture> =
  (models.Fixture as Model<Fixture> | undefined) ??
  model<Fixture>("Fixture", fixtureSchema);
