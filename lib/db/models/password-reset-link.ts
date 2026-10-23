import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const passwordResetLinkSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    url: { type: String, default: "" },
    createdBy: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 0 },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: "password_reset_links" }
);

export type PasswordResetLink = InferSchemaType<
  typeof passwordResetLinkSchema
>;

export const PasswordResetLinkModel: Model<PasswordResetLink> =
  (models.PasswordResetLink as Model<PasswordResetLink> | undefined) ??
  model<PasswordResetLink>("PasswordResetLink", passwordResetLinkSchema);
