import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";

import ClubLandingMotion from "@/components/club-landing-motion";
import {
  CalendarCheckIcon,
  ExternalLinkIcon,
  FacebookIcon,
  InstagramIcon,
  ListOrderedIcon,
  MapPinIcon,
  TennisCourtIcon,
  UserPlusIcon,
  XIcon,
} from "@/components/ui/icons";
import styles from "./club-landing.module.css";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type WeeklySession = {
  name: string;
  time: string;
  detail?: string;
};

type ClubDay = {
  id: "monday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  label: string;
  sessions: readonly WeeklySession[];
};

type ClubLink = {
  label: string;
  href: string;
  description: string;
  icon: IconComponent;
};

const JOIN_URL = "https://www.eusu.ed.ac.uk/organisation/tennis";
const CLUBSPARK_URL = "https://clubspark.lta.org.uk/EdinburghUniversity";

const weeklySchedule = [
  {
    id: "monday",
    label: "Monday",
    sessions: [{ name: "Social tennis", time: "17:30–19:30" }],
  },
  {
    id: "wednesday",
    label: "Wednesday",
    sessions: [
      { name: "Beginners", time: "13:00–14:00" },
      { name: "Intermediate", time: "14:00–15:00" },
      { name: "Advanced", time: "15:00–16:00" },
    ],
  },
  {
    id: "thursday",
    label: "Thursday",
    sessions: [
      { name: "Social tennis", time: "15:30–16:30" },
      { name: "Beginners", time: "16:30–17:30" },
    ],
  },
  {
    id: "friday",
    label: "Friday",
    sessions: [{ name: "Intermediate & advanced", time: "18:00–19:30" }],
  },
  {
    id: "saturday",
    label: "Saturday",
    sessions: [{ name: "Social tennis", time: "16:00–18:00" }],
  },
  {
    id: "sunday",
    label: "Sunday",
    sessions: [
      {
        name: "Run club",
        time: "Alternating Sundays",
        detail:
          "Oct 4, Oct 18, Nov 1, Nov 15, Nov 29. Meet at the courts; time is confirmed in the club chat.",
      },
      {
        name: "Cardio tennis",
        time: "16:00–18:00",
        detail: "Sep 27, Oct 11, Oct 25, Nov 8, Nov 22.",
      },
    ],
  },
] as const satisfies readonly ClubDay[];

const clubLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/eultc",
    description: "Matchdays, socials and club photos.",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/eultc",
    description: "News and event updates.",
    icon: FacebookIcon,
  },
  {
    label: "X",
    href: "https://x.com/UOETennis",
    description: "Live club and matchday updates.",
    icon: XIcon,
  },
  {
    label: "ClubSpark",
    href: CLUBSPARK_URL,
    description: "Court bookings and club membership information.",
    icon: TennisCourtIcon,
  },
  {
    label: "EUSU membership",
    href: JOIN_URL,
    description: "Join through Edinburgh University Sports Union.",
    icon: UserPlusIcon,
  },
  {
    label: "Box leagues",
    href: "https://forms.cloud.microsoft/e/9FDrNpcx2X",
    description: "Sign up for a regular competitive match.",
    icon: ListOrderedIcon,
  },
  {
    label: "Coaching interest",
    href: "https://forms.cloud.microsoft/e/2p0Kn1JaPV",
    description: "Register your interest in club coaching.",
    icon: CalendarCheckIcon,
  },
] as const satisfies readonly ClubLink[];

const appSteps = [
  {
    title: "Set availability",
    body: "Answer each open fixture before the captain’s deadline, from your phone.",
  },
  {
    title: "Select by rank",
    body: "Available players are ordered by the club ranking and placed from the strongest seed.",
  },
  {
    title: "See the live sheet",
    body: "The team sheet updates as replies arrive, with unfilled slots shown clearly.",
  },
  {
    title: "Run the matchweek",
    body: "Captains can track responses, open fixtures and keep the squad working from one view.",
  },
] as const;

// The public face of the club: programme and community first, member app second.
export default function ClubLanding() {
  return (
    <div id="club-landing" className={`club-landing ${styles.landing}`}>
      <ClubLandingMotion scopeId="club-landing" />

      <section
        id="top"
        aria-labelledby="club-hero-title"
        className={styles.hero}
      >
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <h1 id="club-hero-title" className={styles.heroTitle}>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>Tennis at</span>
              </span>
              <span className={styles.heroLine}>
                <span className={styles.heroLineInner}>the Meadows</span>
              </span>
            </h1>
            <p className={styles.heroLead}>
              A University of Edinburgh club for every level, with social
              tennis, coaching and BUCS teams.
            </p>
            <div className={styles.heroActions}>
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.primaryAction}
              >
                Join EULTC
                <ExternalLinkIcon className={styles.actionIcon} />
              </a>
              <a href="#weekly-tennis" className={styles.textAction}>
                Find your session
              </a>
            </div>
            <p className={styles.heroMeta}>
              University of Edinburgh · All abilities · The Meadows
            </p>
          </div>

          <div className={styles.heroStage} aria-label="EULTC club photographs">
            <figure className={styles.heroPrimary}>
              <Image
                src="/club/bucs-champions.jpg"
                alt="EULTC players holding a trophy and medals beside a BUCS champions banner"
                width={1599}
                height={1066}
                priority
                sizes="(min-width: 1024px) 47vw, 100vw"
              />
              <figcaption>National Trophy champions, 2026.</figcaption>
            </figure>

            <figure className={styles.heroDetail}>
              <Image
                src="/club/net-post.jpg"
                alt="A tennis ball balanced on a net post at a floodlit court"
                width={1512}
                height={778}
                sizes="(min-width: 1024px) 20vw, 42vw"
              />
            </figure>

            <div className={styles.heroWeek}>
              <p className={styles.heroWeekTitle}>This week</p>
              <ul>
                <li>
                  <span>Monday</span>
                  <span>Social tennis · 17:30</span>
                </li>
                <li>
                  <span>Wednesday</span>
                  <span>Coaching · 13:00</span>
                </li>
                <li>
                  <span>Saturday</span>
                  <span>Social tennis · 16:00</span>
                </li>
              </ul>
              <a href="#weekly-tennis">See the full week</a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="club"
        aria-labelledby="club-intro-title"
        className={styles.clubSection}
      >
        <div className={styles.sectionFrame}>
          <div className={styles.clubEditorial}>
            <figure className={styles.clubPhoto} data-reveal>
              <Image
                src="/club/court-action.jpg"
                alt="Two EULTC players high-five during a tennis session"
                width={799}
                height={533}
                sizes="(min-width: 1024px) 35vw, 100vw"
              />
            </figure>

            <div className={styles.clubCopy}>
              <h2 id="club-intro-title" data-reveal>
                Every level.
                <br />
                One club.
              </h2>
              <div data-reveal>
                <p className={styles.clubStatement}>
                  EULTC brings social tennis, coached sessions and BUCS
                  matchdays together at the Meadows.
                </p>
                <p className={styles.bodyCopy}>
                  From a first beginner session to performance training, the
                  club runs weekly tennis for University of Edinburgh students.
                  There are also box leagues, mixed doubles, Club Championships
                  and socials through the semester.
                </p>
              </div>
            </div>
          </div>

          <dl className={styles.clubFacts}>
            <div data-reveal>
              <dt>Six days</dt>
              <dd>Weekly tennis through the semester</dd>
            </div>
            <div data-reveal>
              <dt>All abilities</dt>
              <dd>Social, coaching and performance tennis</dd>
            </div>
            <div data-reveal>
              <dt>The Meadows</dt>
              <dd>Home of weekly sessions and club matches</dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        id="weekly-tennis"
        aria-labelledby="weekly-tennis-title"
        className={styles.scheduleSection}
      >
        <div className={styles.sectionFrame}>
          <div className={styles.sectionHeading}>
            <h2 id="weekly-tennis-title" data-reveal>
              Find your next session.
            </h2>
            <p data-reveal>
              Semester 1 sessions at the Meadows tennis courts. Choose a day for
              the full timetable.
            </p>
          </div>

          <fieldset
            className={styles.dayPicker}
            data-ui
            data-reveal
          >
            <legend className="sr-only">Choose a day</legend>
            {weeklySchedule.map((day) => (
              <input
                key={day.id}
                className={styles.dayRadio}
                type="radio"
                name="club-day"
                id={`club-day-${day.id}`}
                defaultChecked={day.id === "monday"}
              />
            ))}

            <div className={styles.dayTabs}>
              {weeklySchedule.map((day) => (
                <label key={day.id} htmlFor={`club-day-${day.id}`}>
                  {day.label}
                </label>
              ))}
            </div>

            <div className={styles.dayPanels} aria-live="polite">
              {weeklySchedule.map((day) => (
                <div
                  key={day.id}
                  className={styles.dayPanel}
                  data-panel={day.id}
                >
                  <ul
                    className={styles.sessionList}
                    aria-label={`${day.label} sessions`}
                  >
                    {day.sessions.map((session) => (
                      <li key={session.name}>
                        <span>{session.name}</span>
                        <span>{session.time}</span>
                        {"detail" in session && session.detail ? (
                          <small>{session.detail}</small>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </fieldset>

          <div className={styles.locationBand}>
            <figure data-reveal>
              <Image
                src="/club/meadows-courts.jpg"
                alt="The Meadows tennis courts in Edinburgh at sunset"
                width={1280}
                height={960}
                sizes="(min-width: 768px) 43vw, 100vw"
              />
              <figcaption>Club photograph of the Meadows courts.</figcaption>
            </figure>
            <div data-reveal>
              <MapPinIcon />
              <h3>Meet at the Meadows</h3>
              <p>
                Social, coaching and cardio sessions meet at the Meadows tennis
                courts. Court bookings and membership information live on
                ClubSpark.
              </p>
              <a
                href={CLUBSPARK_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.inlineLink}
              >
                Visit ClubSpark
                <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="links"
        aria-labelledby="club-links-title"
        className={styles.linksSection}
      >
        <div className={styles.sectionFrame}>
          <div className={styles.linksIntro}>
            <h2 id="club-links-title" data-reveal>
              Find your
              <br />
              club links.
            </h2>
            <p data-reveal>
              Follow the club, book a court, find a match or ask about coaching.
              These are the links members actually use.
            </p>
          </div>

          <ul className={styles.linkList}>
            {clubLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href} data-reveal>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    <span className={styles.linkIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <span className={styles.linkCopy}>
                      <strong>{link.label}</strong>
                      <span>{link.description}</span>
                    </span>
                    <ExternalLinkIcon className={styles.linkArrow} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        id="clubhouse"
        aria-labelledby="clubhouse-title"
        className={styles.appSection}
      >
        <div className={styles.sectionFrame}>
          <div className={styles.appIntro}>
            <div>
              <h2 id="clubhouse-title" data-reveal>
                A clearer
                <br />
                matchweek.
              </h2>
              <p data-reveal>
                EULTC Clubhouse is in invite-only beta. It gives members one
                clear view of availability, ranking-based selection, team
                sheets and fixtures.
              </p>
              <Link href="/sign-in" className={styles.secondaryAction}>
                Member sign in
              </Link>
            </div>

            <div className={styles.appStage} data-ui data-reveal>
              <div className={styles.appChrome}>
                <span>EULTC Clubhouse</span>
                <span>Member view · Sample data</span>
              </div>
              <div className={styles.appBody}>
                <div className={styles.appFixture}>
                  <p>Next fixture</p>
                  <h3>BUCS matchweek</h3>
                  <dl>
                    <div>
                      <dt>Teams</dt>
                      <dd>3</dd>
                    </div>
                    <div>
                      <dt>Signup closes</dt>
                      <dd>Tuesday, 20:00</dd>
                    </div>
                  </dl>
                  <div className={styles.availabilityChoice}>
                    <span>Your availability</span>
                    <strong>Available</strong>
                  </div>
                </div>
                <aside className={styles.appResponses}>
                  <p>Captain view</p>
                  <strong>8 of 12 replied</strong>
                  <ul>
                    <li>
                      <span>Available</span>
                      <span>6</span>
                    </li>
                    <li>
                      <span>Unavailable</span>
                      <span>2</span>
                    </li>
                    <li>
                      <span>No response</span>
                      <span>4</span>
                    </li>
                  </ul>
                </aside>
              </div>
              <div className={styles.appTeamSheet}>
                <p>Live team sheet</p>
                <div>
                  <strong>Team 1</strong>
                  <span>Seeds 1–4</span>
                  <span>Ready</span>
                </div>
                <div>
                  <strong>Team 2</strong>
                  <span>Seeds 1–4</span>
                  <span>Ready</span>
                </div>
                <div>
                  <strong>Team 3</strong>
                  <span>3 of 4 filled</span>
                  <span>1 place open</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.appWorkflow}>
            <div>
              <h3 data-reveal>How it works</h3>
              <p data-reveal>
                Built around the weekly BUCS routine, from the first reply to
                the final team sheet.
              </p>
            </div>
            <ol className={styles.steps}>
              {appSteps.map((step) => (
                <li key={step.title} data-reveal>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className={styles.closingField}>
        <section
          aria-labelledby="closing-title"
          className={styles.closing}
        >
          <div className={styles.sectionFrame}>
            <h2 id="closing-title" data-reveal>
              Your game
              <br />
              starts here.
            </h2>
            <div className={styles.closingBottom} data-reveal>
              <p>
                Join the club to play weekly, meet other students and follow the
                BUCS season from the first availability check to matchday.
              </p>
              <div className={styles.closingActions}>
                <a
                  href={JOIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.primaryAction}
                >
                  Join EULTC
                  <ExternalLinkIcon className={styles.actionIcon} />
                </a>
                <Link href="/sign-in" className={styles.textAction}>
                  Member sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.landingFooter}>
          <div className={styles.sectionFrame}>
            <p className={styles.footerName} aria-hidden="true">
              EULTC
            </p>
            <div className={styles.footerGrid}>
              <div>
                <p className={styles.footerLabel}>Edinburgh University Lawn Tennis Club</p>
                <p className={styles.footerNote}>
                  Tennis at the Meadows for students of every level.
                </p>
              </div>
              <nav aria-label="Footer">
                <a href="#club">Club</a>
                <a href="#weekly-tennis">Weekly tennis</a>
                <a href="#clubhouse">Clubhouse</a>
                <a
                  href="https://www.instagram.com/eultc"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/eultc"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
                <a
                  href="https://x.com/UOETennis"
                  target="_blank"
                  rel="noreferrer"
                >
                  X
                </a>
              </nav>
              <div className={styles.footerSocials}>
                <a
                  href="https://www.instagram.com/eultc"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="EULTC on Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.facebook.com/eultc"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="EULTC on Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://x.com/UOETennis"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="EULTC on X"
                >
                  <XIcon />
                </a>
              </div>
            </div>
            <div className={styles.footerLegal}>
              <span>© 2026 Edinburgh University Lawn Tennis Club</span>
              <a href="#top">Back to top</a>
            </div>
            <p className={styles.footerCredit}>
              Club photography from the{" "}
              <a href={CLUBSPARK_URL} target="_blank" rel="noreferrer">
                EULTC ClubSpark page
              </a>
              .
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
