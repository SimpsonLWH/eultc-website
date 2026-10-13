import { existsSync } from "node:fs";

import { connectToDatabase } from "../lib/db/connection";
import type { FixtureInput } from "../lib/db/fixtures";
import { AvailabilityResponseModel } from "../lib/db/models/availability-response";
import { FixtureModel } from "../lib/db/models/fixture";
import type { TeamGender } from "../lib/db/models/fixture";
import { PlayerModel } from "../lib/db/models/player";
import { TeamSelectionModel } from "../lib/db/models/team-selection";
import { UserRoleModel } from "../lib/db/models/user-role";

// Load local environment files when this script runs outside Next.js.
function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (existsSync(file)) {
      process.loadEnvFile(file);
    }
  }
}

// Produce stable sample addresses so reruns update the same player records.
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

// Group legacy sample match details with explicit team identities before flattening them.
type SeedFixtureGroup = Omit<FixtureInput, "gender" | "teamNumber"> & {
  teams: Array<{ gender: TeamGender; teamNumber: number }>;
};

const now = new Date();

// Keep sample fixture dates relative to the time this seed run begins.
function at(daysFromNow: number, hour: number) {
  const date = new Date(now);
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

// Preserve the old sample match counts while expanding each team into its own fixture row.
const FIXTURE_GROUPS = [
  {
    opponent: "University of Stirling",
    date: at(-12, 13),
    venue: "Stirling University Sports Centre",
    homeOrAway: "away",
    availabilityDeadline: at(-13, 20),
    status: "closed",
    teams: [
      { gender: "male", teamNumber: 1 },
      { gender: "female", teamNumber: 1 },
    ],
  },
  {
    opponent: "Heriot-Watt University",
    date: at(5, 14),
    venue: "Edinburgh University Tennis Courts",
    homeOrAway: "home",
    availabilityDeadline: at(4, 20),
    status: "open",
    teams: [
      { gender: "male", teamNumber: 1 },
      { gender: "male", teamNumber: 2 },
      { gender: "female", teamNumber: 1 },
      { gender: "female", teamNumber: 2 },
    ],
  },
  {
    opponent: "University of Glasgow",
    date: at(12, 13),
    venue: "Garscube Sports Complex",
    homeOrAway: "away",
    availabilityDeadline: at(11, 20),
    status: "open",
    teams: [
      { gender: "male", teamNumber: 1 },
      { gender: "female", teamNumber: 1 },
      { gender: "male", teamNumber: 2 },
    ],
  },
] satisfies SeedFixtureGroup[];

// Flatten each opponent's team assignments into independent fixture documents.
const FIXTURES: FixtureInput[] = FIXTURE_GROUPS.flatMap(({ teams, ...fixture }) =>
  teams.map((team) => ({ ...fixture, ...team }))
);

// Expand an aggregate count into a balanced alternating sequence of men's and women's teams.
function legacyTeamAssignments(
  teamCountValue: unknown
): Array<{ gender: TeamGender; teamNumber: number }> {
  const teamCount =
    typeof teamCountValue === "number" &&
    Number.isInteger(teamCountValue) &&
    teamCountValue >= 1 &&
    teamCountValue <= 10
      ? teamCountValue
      : 1;
  const nextTeamNumber: Record<TeamGender, number> = { male: 1, female: 1 };

  return Array.from({ length: teamCount }, (_, index) => {
    const gender: TeamGender = index % 2 === 0 ? "male" : "female";
    const teamNumber = nextTeamNumber[gender];
    nextTeamNumber[gender] += 1;
    return { gender, teamNumber };
  });
}

// Upgrade old fixture records before seeding current examples, preserving response references.
async function migrateLegacyFixtures() {
  const legacyFixtures = await FixtureModel.collection
    .find({
      $or: [{ gender: { $exists: false } }, { teamNumber: { $exists: false } }],
    })
    .toArray();

  for (const legacy of legacyFixtures) {
    const { _id, teamsPlaying, ...fixtureFields } = legacy;
    const assignments = legacyTeamAssignments(teamsPlaying);

    for (const [index, assignment] of assignments.entries()) {
      if (index === 0) {
        // Keep the old document id for the first team so existing answers still reference it.
        await FixtureModel.collection.updateOne(
          { _id },
          { $set: { ...fixtureFields, ...assignment }, $unset: { teamsPlaying: "" } }
        );
      } else {
        // Other teams need independent fixture ids because one answer is stored per fixture.
        await FixtureModel.create({ ...fixtureFields, ...assignment });
      }
    }
  }
}

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

    await migrateLegacyFixtures();

    // Reuse the same ranking data on every run; bulk upserts avoid duplicate sample players.
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

    // Admins also get an inactive players row so they pass the "on the list"
    // gate in T03 while staying out of the ranking list (isActive: false).
    await PlayerModel.collection.bulkWrite([
      ...ADMINS.map((admin, index) => ({
        updateOne: {
          filter: { email: admin.email },
          update: {
            $set: {
              name: admin.name,
              email: admin.email,
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

    for (const fixture of FIXTURES) {
      // Stable sample identity keeps date-relative fixture rows idempotent across days.
      await FixtureModel.updateOne(
        {
          opponent: fixture.opponent,
          venue: fixture.venue,
          homeOrAway: fixture.homeOrAway,
          gender: fixture.gender,
          teamNumber: fixture.teamNumber,
        },
        { $set: fixture },
        { upsert: true, runValidators: true }
      );
    }

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
