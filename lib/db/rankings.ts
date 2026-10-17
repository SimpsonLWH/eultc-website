import { connectToDatabase } from "./connection";
import { PlayerModel } from "./models/player";
import { UserRoleModel } from "./models/user-role";
import type {
  RankingAccount,
  RankingPositionUpdate,
} from "@/lib/rankings/ranking";

// Resolve every roster row with its captain-account status in one consistent read.
export async function listRankingAccounts(): Promise<RankingAccount[]> {
  await connectToDatabase();

  const [players, adminRoles] = await Promise.all([
    PlayerModel.find().sort({ rankingPosition: 1 }).lean(),
    UserRoleModel.find({ role: "admin" }).select({ email: 1 }).lean(),
  ]);
  const adminEmails = new Set(
    adminRoles.map((role) => role.email.trim().toLowerCase())
  );

  return players.map((player) => ({
    id: String(player._id),
    name: player.name,
    email: player.email,
    rankingPosition: player.rankingPosition,
    isActive: player.isActive,
    isAdmin: adminEmails.has(player.email.trim().toLowerCase()),
  }));
}

// Create the roster row before assigning it a final contiguous rank.
export async function createRankingPlayer(input: {
  name: string;
  email: string;
  rankingPosition: number;
  isActive: boolean;
}) {
  await connectToDatabase();
  const player = await PlayerModel.create(input);
  return player.toObject();
}

// New roster members can sign in as players; existing admin roles are preserved.
export async function ensurePlayerRole(email: string) {
  await connectToDatabase();
  return UserRoleModel.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    {
      $setOnInsert: {
        email: email.toLowerCase().trim(),
        role: "player",
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).lean();
}

/**
 * Rewrite all player positions in two phases so the unique index is safe.
 *
 * Concurrent captain saves are last-write-wins: each action reads the current
 * roster, applies one change, and writes the complete resulting order.
 */
export async function saveRankingPositions(
  updates: RankingPositionUpdate[]
): Promise<void> {
  await connectToDatabase();

  const existingPlayers = await PlayerModel.find(
    {},
    { _id: 1, rankingPosition: 1 }
  ).lean();

  if (existingPlayers.length !== updates.length) {
    throw new Error("Ranking save must include every player account.");
  }

  const existingIds = new Set(existingPlayers.map((player) => String(player._id)));
  if (updates.some((update) => !existingIds.has(update.id))) {
    throw new Error("Ranking save contains an unknown player.");
  }

  if (updates.length === 0) {
    return;
  }

  // Shift everyone beyond the current maximum, then assign final unique ranks.
  const maxPosition = existingPlayers.reduce(
    (highest, player) => Math.max(highest, player.rankingPosition),
    0
  );
  const offset = maxPosition + updates.length + 1;
  await PlayerModel.updateMany({}, { $inc: { rankingPosition: offset } });

  try {
    await PlayerModel.bulkWrite(
      updates.map((update) => ({
        updateOne: {
          filter: { _id: update.id },
          update: {
            $set: {
              rankingPosition: update.rankingPosition,
              isActive: update.isActive,
            },
          },
        },
      })),
      { ordered: true }
    );
  } catch (error) {
    // A single retry repairs a transient write failure after the temporary shift.
    try {
      await PlayerModel.bulkWrite(
        updates.map((update) => ({
          updateOne: {
            filter: { _id: update.id },
            update: {
              $set: {
                rankingPosition: update.rankingPosition,
                isActive: update.isActive,
              },
            },
          },
        })),
        { ordered: true }
      );
    } catch {
      throw error;
    }
  }
}
