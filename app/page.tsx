export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-16">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
          EULTC
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">
          BUCS team selection, in one place
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-600">
          Edinburgh University Lawn Tennis Club. The beta replaces the weekly availability form
          and organiser spreadsheet with one workflow: sign up, select teams and publish the live
          team sheet.
        </p>
      </header>

      <section className="mt-10 border-t border-neutral-200 pt-8">
        <h2 className="text-sm font-medium text-neutral-900">In the beta</h2>
        <ul className="mt-4 grid gap-2 text-sm text-neutral-600 sm:grid-cols-2">
          <li>Weekly availability signup</li>
          <li>Ranking-based team selection</li>
          <li>Live published team sheet</li>
          <li>Fixtures and rankings</li>
        </ul>
      </section>

      <footer className="mt-10 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
        First version in build. Availability, selection and team sheets are not live yet.
      </footer>
    </main>
  );
}
