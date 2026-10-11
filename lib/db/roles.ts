import { connectToDatabase } from "./connection";
import { UserRoleModel } from "./models/user-role";

export async function getUserRoleByEmail(email: string) {
  await connectToDatabase();
  return UserRoleModel.findOne({ email: email.toLowerCase().trim() }).lean();
}

export async function isAdminEmail(email: string) {
  const role = await getUserRoleByEmail(email);
  return role?.role === "admin";
}
