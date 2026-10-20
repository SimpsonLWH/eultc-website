import { requireUser } from "@/lib/auth";

// Session checks block this page on purpose; opt out of instant-navigation
// validation (Next 16, Cache Components) and keep it a blocking route.
export const instant = false;

// Example protected page showing the signed-in identity and assigned club role.
export default async function AccountPage() {
  const user = await requireUser();

  return (
    <section className="rounded-surface squircle border border-line bg-surface p-6">
      <h1 className="text-2xl font-semibold text-club-950">Your account</h1>
      <p className="mt-3 text-sm text-muted">Signed in as {user.email}</p>
      <p className="mt-1 text-sm text-muted">Role: {user.role}</p>
    </section>
  );
}
