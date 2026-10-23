import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const membershipEntrySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    addedBy: { type: String, required: true },
  },
  { timestamps: true, collection: "membership_allowlist" }
);

export type MembershipEntry = InferSchemaType<typeof membershipEntrySchema>;

export const MembershipEntryModel: Model<MembershipEntry> =
  (models.MembershipEntry as Model<MembershipEntry> | undefined) ??
  model<MembershipEntry>("MembershipEntry", membershipEntrySchema);
