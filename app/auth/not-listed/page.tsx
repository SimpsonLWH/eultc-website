// Explain how an authenticated email can request access without creating a player row.
export default function NotListedPage() {
  return (
    <section className="mx-auto max-w-xl rounded-md border border-slate-200 bg-white p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase text-club-700">Clubhouse access</p>
      <h1 className="mt-2 text-2xl font-semibold text-club-950">You’re not on the list yet</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Ask a captain to add your email address to the club player list, then sign in again.
      </p>
    </section>
  );
}