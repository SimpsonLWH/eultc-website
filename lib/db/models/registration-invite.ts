import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const registrationInviteSchema = new Schema(
  {
    _id: { type: String, required: true },
    code: { type: String, required: true },
    rotatedBy: { type: String, required: true },
    rotatedAt: { type: Date, required: true },
  },
  { collection: "registration_invites" }
);

export type RegistrationInvite = InferSchemaType<typeof registrationInviteSchema>;

export const RegistrationInviteModel: Model<RegistrationInvite> =
  (models.RegistrationInvite as Model<RegistrationInvite> | undefined) ??
  model<RegistrationInvite>("RegistrationInvite", registrationInviteSchema);
