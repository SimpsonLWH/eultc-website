import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Keep response values aligned with the options presented in availability forms.
export const AVAILABILITY_STATUSES = ["available", "unavailable"] as const;
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

const availabilityResponseSchema = new Schema(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    fixtureId: { type: Schema.Types.ObjectId, ref: "Fixture", required: true },
    status: { type: String, required: true, enum: [...AVAILABILITY_STATUSES] },
    note: { type: String, trim: true, maxlength: 140, default: null },
  },
  { timestamps: true, collection: "availability_responses" }
  // A player can answer each fixture once; updates replace the existing response.
);

availabilityResponseSchema.index({ playerId: 1, fixtureId: 1 }, { unique: true });
availabilityResponseSchema.index({ fixtureId: 1 });

export type AvailabilityResponse = InferSchemaType<typeof availabilityResponseSchema>;

// Reuse the compiled model during Next.js hot reloads to avoid model overwrite errors.
export const AvailabilityResponseModel: Model<AvailabilityResponse> =
  (models.AvailabilityResponse as Model<AvailabilityResponse> | undefined) ??
  model<AvailabilityResponse>("AvailabilityResponse", availabilityResponseSchema);
