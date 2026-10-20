import { requireAdmin } from "@/lib/auth";

// Session checks block this page on purpose; opt out of instant-navigation
// validation (Next 16, Cache Components) and keep it a blocking route.
export const instant = false;

// This route demonstrates an admin-only page guarded on the server.
export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <section className="rounded-surface squircle border border-line bg-surface p-6">
      <h1 className="text-2xl font-semibold text-club-950">Admin workspace</h1>
      <p className="mt-3 text-sm text-muted">Signed in as {user.email}</p>
    </section>
  );
}
