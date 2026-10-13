import { existsSync } from "node:fs";

import { connectToDatabase } from "../lib/db/connection";
import type { FixtureInput } from "../lib/db/fixtures";
import { AvailabilityResponseModel } from "../lib/db/models/availability-response";
import { FixtureModel } from "../lib/db/models/fixture";
import { PlayerModel } from "../lib/db/models/player";
import { TeamSelectionModel } from "../lib/db/models/team-selection";
import { UserRoleModel } from "../lib/db/models/user-role";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (existsSync(file)) {
      process.loadEnvFile(file);
    }
  }
}

function emailFor(name: string) {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
}

const PLAYER_NAMES = [
  "Callum Fraser",
  "Angus MacLeod",
  "Jamie Sinclair",
  "Rory Campbell",
  "Euan Douglas",
  "Finn Gallagher",
  "Harry Whitfield",
  "Ollie Bennett",
  "Tom Ainsworth",
  "Max Rennie",
  "Ben Kirkpatrick",
  "Charlie Dunbar",
  "Nathan Boyd",
  "Adam Lennox",
  "Zac Whitaker",
  "Sam Ferguson",
  "Joe Marsden",
  "Leo Hartmann",
  "Aaron Reynolds",
  "Ethan Crosbie",
  "Marcus Lai",
  "Yusuf Ahmed",
  "Noah Pettigrew",
  "Ravi Sharma",
  "Oscar Lindqvist",
  "Hugo Beaumont",
  "Theo Nkemdirim",
  "Isaac Merton",
  "Freddie Haldane",
  "Vikram Nair",
  "Arjun Mehta",
  "Peter Kalinowski",
  "Sebastian Roth",
  "David Okafor",
  "Milan Kovac",
  "Alexei Novak",
];

const ADMINS = [
  { name: "Lewis", email: "lewis@example.com" },
  { name: "Daniel", email: "daniel@example.com" },
];

const now = new Date();

function at(daysFromNow: number, hour: number) {
  const date = new Date(now);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

const FIXTURES = [
  {
    opponent: "University of Stirling",
    date: at(-12, 13),
    venue: "Stirling University Sports Centre",
    homeOrAway: "away",
    teamsPlaying: 2,
    availabilityDeadline: at(-13, 20),
    status: "closed",
  },
  {
    opponent: "Heriot-Watt University",
    date: at(5, 14),
    venue: "Edinburgh University Tennis Courts",
    homeOrAway: "home",
    teamsPlaying: 4,
    availabilityDeadline: at(4, 20),
    status: "open",
  },
  {
    opponent: "University of Glasgow",
    date: at(12, 13),
    venue: "Garscube Sports Complex",
    homeOrAway: "away",
    teamsPlaying: 3,
    availabilityDeadline: at(11, 20),
    status: "open",
  },
] satisfies FixtureInput[];

async function main() {
  loadEnvFiles();
  const connection = await connectToDatabase();

  try {
    await Promise.all([
      PlayerModel.syncIndexes(),
      UserRoleModel.syncIndexes(),
      FixtureModel.syncIndexes(),
      AvailabilityResponseModel.syncIndexes(),
      TeamSelectionModel.syncIndexes(),
    ]);

    const players = PLAYER_NAMES.map((name, index) => ({
      name,
      email: emailFor(name),
      rankingPosition: index + 1,
      isActive: true,
    }));

    await PlayerModel.bulkWrite(
      players.map((player) => ({
        updateOne: {
          filter: { email: player.email },
          update: { $set: player },
          upsert: true,
        },
      }))
    );

    await PlayerModel.collection.bulkWrite([
      ...players.map((player) => ({
        updateOne: {
          filter: { email: player.email },
          update: { $set: { role: "player" } },
          upsert: true,
        },
      })),
      ...ADMINS.map((admin, index) => ({
        updateOne: {
          filter: { email: admin.email },
          update: {
            $set: {
              ...admin,
              email: admin.email,
              role: "admin",
              rankingPosition: players.length + index + 1,
              isActive: false,
            },
          },
          upsert: true,
        },
      })),
    ]);

    await UserRoleModel.bulkWrite([
      ...players.map((player) => ({
        updateOne: {
          filter: { email: player.email },
          update: { $set: { email: player.email, role: "player" as const } },
          upsert: true,
        },
      })),
      ...ADMINS.map((admin) => ({
        updateOne: {
          filter: { email: admin.email },
          update: { $set: { email: admin.email, role: "admin" as const } },
          upsert: true,
        },
      })),
    ]);

    await FixtureModel.bulkWrite(
      FIXTURES.map((fixture) => ({
        updateOne: {
          filter: { opponent: fixture.opponent },
          update: { $set: fixture },
          upsert: true,
        },
      }))
    );

    const [playerCount, roleCount, adminCount, fixtureCount] = await Promise.all([
      PlayerModel.countDocuments(),
      UserRoleModel.countDocuments(),
      UserRoleModel.countDocuments({ role: "admin" }),
      FixtureModel.countDocuments(),
    ]);

    console.log(`Seed complete on "${connection.connection.name}"`);
    console.log(`  players: ${playerCount}`);
    console.log(`  user roles: ${roleCount} (${adminCount} admins)`);
    console.log(`  fixtures: ${fixtureCount}`);
  } finally {
    await connection.disconnect();
  }
}

main().catch((error) => {
  console.error("Seed failed");
  console.error(error);
  process.exitCode = 1;
});
