import { connectToDatabase } from "./connection";
import { UserRoleModel } from "./models/user-role";

// List captain accounts in a stable order for admin tooling and dev sign-in.
export async function listAdmins() {
  await connectToDatabase();
  return UserRoleModel.find({ role: "admin" }).sort({ email: 1 }).lean();
}

// Find the separately stored T02 authorization record for a normalized email.
export async function getUserRoleByEmail(email: string) {
  await connectToDatabase();
  return UserRoleModel.findOne({ email: email.toLowerCase().trim() }).lean();
}
