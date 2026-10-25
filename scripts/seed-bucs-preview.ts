import { existsSync } from "node:fs";

import { hashPassword } from "better-auth/crypto";
import { ObjectId } from "mongodb";
import { readSheet } from "read-excel-file/node";

import { getDevLoginPassword } from "../lib/auth/dev-login";
import {
  parseFixtureRows,
  parseRankingRows,
  type PreviewFixture,
} from "../lib/bucs-organiser/parse";
import { assertPreviewDatabaseName } from "../lib/bucs-organiser/preview-policy";
import { connectToDatabase } from "../lib/db/connection";
import type { FixtureInput } from "../lib/db/fixtures";
import { londonWallTimeToUtc } from "../lib/fixtures/datetime";
import { AvailabilityResponseModel } from "../lib/db/models/availability-response";
import { FixtureModel } from "../lib/db/models/fixture";
import { MembershipEntryModel } from "../lib/db/models/membership-entry";
import { PlayerModel } from "../lib/db/models/player";
import { RegistrationInviteModel } from "../lib/db/models/registration-invite";
import { TeamSelectionModel } from "../lib/db/models/team-selection";
import { UserRoleModel } from "../lib/db/models/user-role";
import {
  addPaidMembers,
  rotateRegistrationInvite,
} from "../lib/membership/store";

const TARGET_MATCHWEEK = 6;
const PREVIEW_KICKOFF = "13:00";
const PREVIEW_DEADLINE = "20:00";
const PREVIEW_HOME_VENUE = "Preview home venue";
const PREVIEW_AWAY_VENUE = "Preview away venue";
const ADMIN_EMAIL = "preview-captain@preview.invalid";
const ADMIN_NAME = "Preview Captain";

type PreviewSeedFixture = PreviewFixture & {
  kickoff: Date;
  deadline: Date;
  venue: string;
  status: FixtureInput["status"];
};

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (existsSync(file)) {
      process.loadEnvFile(file);
    }
  }
}

function argument(name: string): string | null {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1]?.trim() || null : null;
}

function previousDate(date: string): string {
  const value = new Date(`${date}T12:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() - 1);
  return value.toISOString().slice(0, 10);
}

function buildFixtures(fixtures: PreviewFixture[]): PreviewSeedFixture[] {
  return fixtures.map((fixture) => {
    const kickoff = londonWallTimeToUtc(fixture.date, PREVIEW_KICKOFF);
    const deadline = londonWallTimeToUtc(
      previousDate(fixture.date),
      PREVIEW_DEADLINE
    );
    if (!kickoff || !deadline) {
      throw new Error(
        `Could not build preview dates for Matchweek ${fixture.matchWeek} M${fixture.teamNumber}.`
      );
    }

    const status: FixtureInput["status"] =
      fixture.matchWeek < TARGET_MATCHWEEK
        ? "closed"
        : fixture.matchWeek === TARGET_MATCHWEEK
          ? "open"
          : "draft";

    return {
      ...fixture,
      kickoff,
      deadline,
      venue:
        fixture.homeOrAway === "home"
          ? PREVIEW_HOME_VENUE
          : PREVIEW_AWAY_VENUE,
      status,
    };
  });
}

async function readPreviewWorkbook(path: string) {
  const [rankingRows, fixtureRows] = await Promise.all([
    readSheet(path, "Ranking List"),
    readSheet(path, "Fixture List"),
  ]);

  const players = parseRankingRows(rankingRows);
  const fixtureResult = parseFixtureRows(fixtureRows);
  if (players.length !== 39) {
    throw new Error(`Expected 39 ranked players; found ${players.length}.`);
  }
  if (fixtureResult.fixtures.length !== 33) {
    throw new Error(
      `Expected 33 complete fixtures; found ${fixtureResult.fixtures.length}.`
    );
  }
  if (fixtureResult.skippedCupTies.length !== 2) {
    throw new Error("Expected two unresolved cup ties.");
  }

  return { players, ...fixtureResult };
}

function printDryRun(input: {
  players: number;
  fixtures: number;
  cupTies: number;
  targetFixtures: number;
}) {
  console.log("BUCS organiser preview seed — DRY RUN");
  console.log(`  players: ${input.players}`);
  console.log(`  fixtures: ${input.fixtures}`);
  console.log(`  skipped cup ties: ${input.cupTies}`);
  console.log(
    `  target Matchweek ${TARGET_MATCHWEEK}: ${input.targetFixtures} open fixtures`
  );
  console.log("No database writes were made. Re-run with --apply.");
}

async function resetPreviewDatabase() {
  const connection = await connectToDatabase();
  try {
    assertPreviewDatabaseName(connection.connection.name);
    await connection.connection.dropDatabase();
    await Promise.all([
      PlayerModel.syncIndexes(),
      UserRoleModel.syncIndexes(),
      FixtureModel.syncIndexes(),
      AvailabilityResponseModel.syncIndexes(),
      TeamSelectionModel.syncIndexes(),
      MembershipEntryModel.syncIndexes(),
      RegistrationInviteModel.syncIndexes(),
    ]);
    return connection;
  } catch (error) {
    await connection.disconnect();
    throw error;
  }
}

async function seedPreviewData(
  input: Awaited<ReturnType<typeof readPreviewWorkbook>>
) {
  const fixtures = buildFixtures(input.fixtures);
  const targetFixtures = fixtures.filter(
    (fixture) => fixture.matchWeek === TARGET_MATCHWEEK
  );
  const targetTeamNumbers = new Set(
    targetFixtures.map((fixture) => fixture.teamNumber)
  );
  for (const teamNumber of [1, 2, 3, 4, 5]) {
    if (!targetTeamNumbers.has(teamNumber)) {
      throw new Error(`Target matchweek is missing M${teamNumber}.`);
    }
  }

  const connection = await resetPreviewDatabase();
  const authDatabase = connection.connection.db;
  if (!authDatabase) {
    throw new Error("MongoDB did not expose a database connection.");
  }

  try {
    const insertedPlayers = await PlayerModel.insertMany(
      input.players.map((player) => ({
        name: player.name,
        email: player.previewEmail,
        rankingPosition: player.rank,
        isActive: true,
      }))
    );
    const playersByRank = new Map(
      insertedPlayers.map((player) => [player.rankingPosition, player])
    );

    await PlayerModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      rankingPosition: input.players.length + 1,
      isActive: false,
    });
    await UserRoleModel.insertMany([
      ...input.players.map((player) => ({
        email: player.previewEmail,
        role: "player" as const,
      })),
      { email: ADMIN_EMAIL, role: "admin" as const },
    ]);
    await addPaidMembers(
      input.players.map((player) => player.previewEmail),
      "seed-bucs-preview"
    );
    await rotateRegistrationInvite("seed-bucs-preview");

    const insertedFixtures = await FixtureModel.insertMany(
      fixtures.map((fixture) => ({
        opponent: fixture.opponent,
        date: fixture.kickoff,
        venue: fixture.venue,
        homeOrAway: fixture.homeOrAway,
        gender: "male" as const,
        teamNumber: fixture.teamNumber,
        availabilityDeadline: fixture.deadline,
        status: fixture.status,
      }))
    );
    const targetByTeam = new Map(
      insertedFixtures
        .filter((fixture) => fixture.status === "open")
        .map((fixture) => [fixture.teamNumber, fixture])
    );

    const responseRows: Array<{
      playerId: unknown;
      fixtureId: unknown;
      status: "available" | "unavailable";
      note: string;
    }> = [];
    for (const player of input.players) {
      const playerDocument = playersByRank.get(player.rank);
      if (!playerDocument) {
        throw new Error(`Preview player rank ${player.rank} was not inserted.`);
      }

      let teamNumber: number | null = null;
      let status: "available" | "unavailable" | null = null;
      if (player.rank <= 20) {
        teamNumber = Math.ceil(player.rank / 4);
        status = "available";
      } else if (player.rank <= 24) {
        teamNumber = 5;
        status = "available";
      } else if (player.rank <= 27) {
        teamNumber = 5;
        status = "unavailable";
      }

      if (teamNumber === null || status === null) {
        continue;
      }
      const fixture = targetByTeam.get(teamNumber);
      if (!fixture) {
        throw new Error(`Preview fixture M${teamNumber} was not inserted.`);
      }
      responseRows.push({
        playerId: playerDocument._id,
        fixtureId: fixture._id,
        status,
        note: "Synthetic preview response",
      });
    }
    await AvailabilityResponseModel.insertMany(responseRows);

    const firstPlayer = playersByRank.get(1);
    if (!firstPlayer) {
      throw new Error("Preview rank 1 was not inserted.");
    }
    const now = new Date();
    const accounts = [
      {
        name: firstPlayer.name,
        email: firstPlayer.email,
        role: "player",
      },
      { name: ADMIN_NAME, email: ADMIN_EMAIL, role: "admin" },
    ];
    for (const account of accounts) {
      const userId = new ObjectId();
      await authDatabase.collection("user").insertOne({
        _id: userId,
        name: account.name,
        email: account.email,
        emailVerified: false,
        image: null,
        role: account.role,
        createdAt: now,
        updatedAt: now,
      });
      await authDatabase.collection("account").insertOne({
        accountId: userId.toString(),
        providerId: "credential",
        userId,
        password: await hashPassword(getDevLoginPassword()),
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log(`Preview seed complete on "${connection.connection.name}"`);
    console.log(`  players: ${input.players.length}`);
    console.log(`  fixtures: ${fixtures.length}`);
    console.log(`  skipped cup ties: ${input.skippedCupTies.length}`);
    console.log(`  responses: ${responseRows.length}`);
    console.log(
      `  sign in: ${firstPlayer.name} or ${ADMIN_NAME} (development password)`
    );
  } finally {
    await connection.disconnect();
  }
}

async function main() {
  const file = argument("file");
  if (!file) {
    throw new Error(
      'Usage: npm run db:seed:bucs-preview -- --file "/path/to/BUCS Team Organiser.xlsx" [--apply]'
    );
  }

  const input = await readPreviewWorkbook(file);
  const targetFixtures = input.fixtures.filter(
    (fixture) => fixture.matchWeek === TARGET_MATCHWEEK
  );
  if (!process.argv.includes("--apply")) {
    printDryRun({
      players: input.players.length,
      fixtures: input.fixtures.length,
      cupTies: input.skippedCupTies.length,
      targetFixtures: targetFixtures.length,
    });
    return;
  }

  loadEnvFiles();
  await seedPreviewData(input);
}

main().catch((error) => {
  console.error("BUCS preview seed failed");
  console.error(error);
  process.exitCode = 1;
});
