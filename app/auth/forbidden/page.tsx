import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <section className="mx-auto max-w-xl rounded-md border border-slate-200 bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase text-court-600">403 · Restricted</p>
      <h1 className="mt-2 text-2xl font-semibold text-club-950">Admin access required</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your account does not have permission to view this page.
      </p>
      <Link className="mt-5 inline-flex text-sm font-semibold text-club-700 underline" href="/">
        Return to clubhouse
      </Link>
    </section>
  );
}