import { connectToDatabase } from "./connection";
import { UserRoleModel } from "./models/user-role";

// Find the separately stored T02 authorization record for a normalized email.
export async function getUserRoleByEmail(email: string) {
  await connectToDatabase();
  return UserRoleModel.findOne({ email: email.toLowerCase().trim() }).lean();
}
