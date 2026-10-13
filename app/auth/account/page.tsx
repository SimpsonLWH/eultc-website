import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <section className="rounded-md border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold text-club-950">Your account</h1>
      <p className="mt-3 text-sm text-slate-600">Signed in as {user.email}</p>
      <p className="mt-1 text-sm text-slate-600">Role: {user.role}</p>
    </section>
  );
}