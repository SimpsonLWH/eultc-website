import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// The only application roles accepted by the T02 authorization table.
export const USER_ROLES = ["player", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

const userRoleSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true, enum: [...USER_ROLES], default: "player" },
    // Store an auth-provider subject when one is available; sparse allows unlinked rows.
    authUserId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true, collection: "user_roles" }
);

export type UserRoleDoc = InferSchemaType<typeof userRoleSchema>;

// Reuse this model on reload so Mongoose does not register the collection twice.
export const UserRoleModel: Model<UserRoleDoc> =
  (models.UserRole as Model<UserRoleDoc> | undefined) ??
  model<UserRoleDoc>("UserRole", userRoleSchema);
