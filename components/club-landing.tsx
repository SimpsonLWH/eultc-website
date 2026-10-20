import Image from "next/image";
import Link from "next/link";

import ImageFrame from "@/components/ui/image-frame";

// Semester 1 sessions, taken from the club's schedule posters.
const weeklySchedule = [
  { day: "Monday", sessions: ["Social tennis · 17:30–19:30"] },
  {
    day: "Wednesday",
    sessions: [
      "Beginners · 13:00–14:00",
      "Intermediate · 14:00–15:00",
      "Advanced · 15:00–16:00",
    ],
  },
  {
    day: "Thursday",
    sessions: ["Social tennis · 15:30–16:30", "Beginners · 16:30–17:30"],
  },
  { day: "Friday", sessions: ["Intermediate & advanced · 18:00–19:30"] },
  { day: "Saturday", sessions: ["Social tennis · 16:00–18:00"] },
  { day: "Sunday", sessions: ["Run club & cardio tennis · alternating weeks"] },
];

// A club-owned link list: the socials and forms members actually use, not the
// affiliate stream from the public Linktree.
const clubLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/eultc",
    description: "Matchdays, socials and club photos.",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/eultc",
    description: "News and event updates.",
  },
  {
    label: "ClubSpark (LTA)",
    href: "https://clubspark.lta.org.uk/EdinburghUniversity",
    description: "Court bookings and club membership.",
  },
  {
    label: "EUSU membership",
    href: "https://www.eusu.ed.ac.uk/organisation/tennis",
    description: "Join through the University Sports Union.",
  },
  {
    label: "Box leagues",
    href: "https://forms.cloud.microsoft/e/9FDrNpcx2X",
    description: "Sign up for the club box leagues.",
  },
  {
    label: "Coaching interest",
    href: "https://forms.cloud.microsoft/e/2p0Kn1JaPV",
    description: "Register interest in club coaching.",
  },
];

const runClubDates = "Oct 4, Oct 18, Nov 1, Nov 15, Nov 29";
const cardioDates = "Sep 27, Oct 11, Oct 25, Nov 8, Nov 22";

// The public face of the club: schedule, run club and links, with one way in for members.
export default function ClubLanding() {
  return (
    <div className="space-y-9 sm:space-y-11">
      <section className="rounded-float squircle bg-club-950 px-5 py-9 text-club-50 sm:px-10 sm:py-14">
        <Image
          src="/eultc-badge.png"
          alt=""
          width={72}
          height={72}
          className="size-14 sm:size-[4.5rem]"
        />
        <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-club-300 uppercase">
          Edinburgh University Lawn Tennis Club
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.01em] text-cream sm:text-4xl">
          Tennis at the Meadows, all year round
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-club-100 sm:text-base">
          Social tennis, coaching and BUCS teams. Members sign in to set weekly
          availability, watch the team sheet take shape and check the fixture
          list.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/sign-in"
            className="inline-flex min-h-11 items-center rounded-control squircle bg-cream px-5 text-sm font-semibold text-club-950 transition-colors hover:bg-club-100"
          >
            Member sign in
          </Link>
          <a
            href="#club-links"
            className="inline-flex min-h-11 items-center rounded-control squircle border border-white/25 px-5 text-sm font-semibold text-club-50 transition-colors hover:bg-white/10"
          >
            Club links
          </a>
        </div>
      </section>

      <section aria-label="Club photo">
        <ImageFrame ratio="3/1" />
      </section>

      <section aria-labelledby="schedule-title">
        <h2
          id="schedule-title"
          className="text-xl font-semibold text-club-950 sm:text-2xl"
        >
          This week at the club
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          All sessions are at the Meadows tennis courts. Semester 1 schedule.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {weeklySchedule.map((day) => (
            <li
              key={day.day}
              className="rounded-surface squircle border border-line bg-surface p-4"
            >
              <p className="text-sm font-semibold text-club-900">{day.day}</p>
              <ul className="mt-2 space-y-1 text-sm leading-5 text-muted">
                {day.sessions.map((session) => (
                  <li key={session}>{session}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="run-club-title" className="grid gap-4 sm:grid-cols-2">
        <h2 id="run-club-title" className="sr-only">
          Run club and cardio tennis
        </h2>
        <div className="rounded-surface squircle border border-line bg-surface p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-club-600 uppercase">
            Sundays, alternating
          </p>
          <h3 className="mt-2 text-lg font-semibold text-club-950">Run club</h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Meet at the Meadows courts, coffee afterwards. Time confirmed in the
            club chat.
          </p>
          <p className="mt-3 text-sm font-medium text-club-800">{runClubDates}</p>
        </div>
        <div className="rounded-surface squircle border border-line bg-surface p-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-club-600 uppercase">
            Sundays, alternating
          </p>
          <h3 className="mt-2 text-lg font-semibold text-club-950">
            Cardio tennis
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            16:00–18:00 at the Meadows tennis courts.
          </p>
          <p className="mt-3 text-sm font-medium text-club-800">{cardioDates}</p>
        </div>
      </section>

      <section aria-labelledby="club-links-title" className="scroll-mt-28" id="club-links">
        <h2
          id="club-links-title"
          className="text-xl font-semibold text-club-950 sm:text-2xl"
        >
          Find us and join in
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted">
          Everything in one place: socials, membership and club forms.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clubLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-full flex-col rounded-surface squircle border border-line bg-surface p-4 transition-colors hover:border-club-300 hover:bg-club-50"
              >
                <span className="text-sm font-semibold text-club-800">
                  {link.label}
                </span>
                <span className="mt-1 flex-1 text-sm leading-5 text-muted">
                  {link.description}
                </span>
                <span className="mt-3 text-xs font-semibold tracking-wide text-club-600 uppercase">
                  Open
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4 rounded-float squircle border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-club-950">
            Members: one place for the match week
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Set your availability, see the tentative team sheet as replies come
            in, and check the fixture list.
          </p>
        </div>
        <Link
          href="/sign-in"
          className="glass-primary inline-flex min-h-11 shrink-0 items-center rounded-control squircle bg-club-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-club-800"
        >
          Sign in
        </Link>
      </section>
    </div>
  );
}
