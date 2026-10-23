import Link from "next/link";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import ImageFrame from "@/components/ui/image-frame";
import type { CurrentUser } from "@/lib/auth";
import {
  listFixtures,
  listPlayerResponses,
  listRankings,
} from "@/lib/db";
import {
  isSignupOpen,
  selectNextEligibleFixture,
} from "@/lib/dashboard/next-fixture";
import {
  formatLondonDate,
  formatLondonDateTime,
  formatLondonTime,
} from "@/lib/fixtures/datetime";
import { formatTeamLabel } from "@/lib/fixtures/team-label";
import DeadlineCountdown from "./deadline-countdown";

type DashboardProps = {
  user: CurrentUser;
};

// The signed-in home: what is next, have I answered, and where am I ranked.
// Everything is read in this server component; no client-side fetch waterfall.
export default async function Dashboard({ user }: DashboardProps) {
  const isAdmin = user.role === "admin";
  const [fixtures, rankings] = await Promise.all([
    listFixtures("upcoming"),
    listRankings(),
  ]);

  const rank =
    rankings.find((player) => player.id === user.playerId)?.rankingPosition ??
    null;
  const nextFixture = rank
    ? selectNextEligibleFixture(fixtures, rank)
    : null;
  const responses = user.playerId
    ? await listPlayerResponses(user.playerId)
    : [];
  const myAnswer =
    nextFixture !== null
      ? (responses.find(
          (response) => String(response.fixtureId) === String(nextFixture._id)
        ) ?? null)
      : null;
  const topFive = rankings.slice(0, 5);

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase text-club-700">
          Matchweek
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
          Your week
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Next fixture, your availability and your ranking at a glance.
        </p>
      </header>

      <section aria-label="Next fixture">
        <Card>
          {nextFixture ? (
            <div className="space-y-5">
              <ImageFrame ratio="3/1" />
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-muted">
                    Next fixture ·{" "}
                    {formatTeamLabel(nextFixture.gender, nextFixture.teamNumber)}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-club-950 sm:text-2xl">
                    {nextFixture.opponent}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {formatLondonDate(nextFixture.date)} · Kick-off{" "}
                    {formatLondonTime(nextFixture.date)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{nextFixture.venue}</p>
                  <p className="mt-3 text-sm text-muted">
                    Signup closes{" "}
                    {formatLondonDateTime(nextFixture.availabilityDeadline)}
                  </p>
                  <p className="mt-2">
                    <DeadlineCountdown
                      deadline={nextFixture.availabilityDeadline.toISOString()}
                      open={isSignupOpen(nextFixture)}
                    />
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge
                    variant={
                      nextFixture.homeOrAway === "home" ? "club" : "neutral"
                    }
                  >
                    {nextFixture.homeOrAway === "home" ? "Home" : "Away"}
                  </Badge>
                  <Badge variant={isSignupOpen(nextFixture) ? "club" : "neutral"}>
                    {isSignupOpen(nextFixture)
                      ? "Signup open"
                      : "Signup closed"}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <EmptyBlock
              title="No upcoming fixtures"
              description={
                rank
                  ? "Your next fixture appears here once the captains publish the schedule."
                  : isAdmin
                    ? "Captains manage fixtures from the Fixtures tab."
                    : "Fixtures appear here once a captain adds this account to the active player rankings."
              }
            />
          )}
          {nextFixture ? (
            <div className="mt-5">
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-surface squircle bg-club-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-club-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
                href="/availability"
              >
                {isSignupOpen(nextFixture)
                  ? "Set availability"
                  : "View availability"}
              </Link>
            </div>
          ) : null}
        </Card>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section aria-label="My availability">
          <Card>
            <h2 className="text-lg font-semibold text-club-950">
              My availability
            </h2>
            {nextFixture ? (
              myAnswer ? (
                <p className="mt-2 text-sm leading-6 text-ink">
                  You&rsquo;re <strong>{myAnswer.status}</strong> for{" "}
                  {nextFixture.opponent}.
                </p>
              ) : (
                <p className="mt-2 text-sm leading-6 text-muted">
                  You haven&rsquo;t answered for {nextFixture.opponent} yet.
                </p>
              )
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted">
                {rank
                  ? "Answer when a fixture is announced."
                  : isAdmin
                    ? "Captain accounts are outside the player availability list."
                    : "Availability opens once a captain adds this account to the active player rankings."}
              </p>
            )}
            {rank ? (
              <Link
                className="mt-4 inline-block text-sm font-semibold text-club-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
                href="/availability"
              >
                {myAnswer ? "Change your answer" : "Answer availability"}
              </Link>
            ) : null}
          </Card>
        </section>

        <section aria-label="My rank">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-club-950">My rank</h2>
              {rank ? (
                <Badge variant="club">
                  #{rank} of {rankings.length}
                </Badge>
              ) : (
                <Badge>Not ranked</Badge>
              )}
            </div>
            {rank ? (
              <p className="mt-2 text-sm leading-6 text-ink">
                Top of the list:
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted">
                {isAdmin
                  ? "Captain accounts are kept outside the player rankings."
                  : "Your ranking appears here once a captain adds you to the list."}
              </p>
            )}
            {topFive.length > 0 ? (
              <ol className="mt-3 space-y-1.5">
                {topFive.map((account) => (
                  <li
                    key={account.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-ink">
                      {account.name}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-muted">
                      #{account.rankingPosition}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted">
                No players are ranked yet.
              </p>
            )}
            <Link
              className="mt-4 inline-block text-sm font-semibold text-club-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
              href="/rankings"
            >
              View rankings
            </Link>
          </Card>
        </section>
      </div>

      {isAdmin ? (
        <section aria-label="Captain tools">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-club-950">
                  Captain tools
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Manage paid members, registration, accounts and selection.
                </p>
              </div>
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-control squircle bg-club-700 px-4 text-sm font-semibold text-white hover:bg-club-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
                href="/members"
              >
                Manage members
              </Link>
            </div>
          </Card>
        </section>
      ) : null}
    </div>
  );
}

function EmptyBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-control squircle bg-surface-muted p-5 text-center">
      <h2 className="font-semibold text-club-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
