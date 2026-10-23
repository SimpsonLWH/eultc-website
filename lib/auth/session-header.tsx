import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { getCurrentUser } from "./index";
import { auth } from "./config";

// Clear the Better Auth session and return the user to the sign-in page.
async function signOutAction() {
  "use server";
  await auth.api.signOut({ headers: await headers() });
  redirect("/sign-in");
}

// Render the identity from the server session, or a sign-in link for anonymous visitors.
export async function SessionHeader() {
  // Keep this request-specific session read out of the static prerender.
  await connection();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex min-h-10 items-center rounded-control squircle bg-club-700 px-4 text-sm font-semibold text-white hover:bg-club-800"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <span className="hidden max-w-40 truncate text-sm text-muted sm:inline">
        {user.name}
      </span>
      <Badge variant={user.role === "admin" ? "danger" : "club"}>
        {user.role ?? "Not listed"}
      </Badge>
      <form action={signOutAction}>
        <Button
          className="px-2 whitespace-nowrap sm:px-3"
          type="submit"
          variant="quiet"
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
