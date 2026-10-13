import { connection } from "next/server";
import Link from "next/link";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { getCurrentUser } from "./index";
import { signOut } from "./config";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/sign-in" });
}

export async function SessionHeader() {
  await connection();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex min-h-10 items-center rounded-md bg-club-700 px-4 text-sm font-semibold text-white hover:bg-club-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <span className="hidden max-w-40 truncate text-sm text-slate-600 sm:inline">
        {user.name}
      </span>
      <Badge variant={user.role === "admin" ? "court" : "club"}>
        {user.role ?? "Not listed"}
      </Badge>
      <form action={signOutAction}>
        <Button className="px-2 sm:px-3" type="submit" variant="quiet">
          Sign out
        </Button>
      </form>
    </div>
  );
}