import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const USER_ROLES = ["player", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const userRoleSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true, enum: [...USER_ROLES], default: "player" },
    // Filled in by T03 once sign-in exists; sparse unique so many rows can be unset.
    authUserId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true, collection: "user_roles" }
);

export type UserRoleDoc = InferSchemaType<typeof userRoleSchema>;

export const UserRoleModel: Model<UserRoleDoc> =
  (models.UserRole as Model<UserRoleDoc> | undefined) ??
  model<UserRoleDoc>("UserRole", userRoleSchema);
