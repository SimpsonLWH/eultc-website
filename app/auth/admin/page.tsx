import { requireAdmin } from "@/lib/auth";

// Session checks block this page on purpose; opt out of instant-navigation
// validation (Next 16, Cache Components) and keep it a blocking route.
export const instant = false;

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <section className="rounded-md border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-club-950">Admin workspace</h1>
      <p className="mt-3 text-sm text-slate-600">Signed in as {user.email}</p>
    </section>
  );
}
