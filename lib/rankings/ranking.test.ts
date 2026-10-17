import { describe, expect, it } from "vitest";

import {
  buildPositionUpdates,
  insertActivePlayer,
  moveActivePlayer,
  partitionRankingAccounts,
  type RankingAccount,
} from "./ranking";

function account(
  rankingPosition: number,
  overrides: Partial<RankingAccount> = {}
): RankingAccount {
  return {
    id: `player-${rankingPosition}`,
    name: `Player ${rankingPosition}`,
    email: `player-${rankingPosition}@example.com`,
    rankingPosition,
    isActive: true,
    isAdmin: false,
    ...overrides,
  };
}

function accounts(count: number): RankingAccount[] {
  return Array.from({ length: count }, (_, index) => account(index + 1));
}

describe("ranking order", () => {
  it("moves rank 7 to rank 3 with contiguous final positions", () => {
    const active = accounts(8);
    let moved = active;

    for (let step = 0; step < 4; step += 1) {
      moved = moveActivePlayer(moved, "player-7", "up");
    }

    const updates = buildPositionUpdates({
      active: moved,
      inactive: [],
      admins: [],
    });

    expect(moved.map((player) => player.name)).toEqual([
      "Player 1",
      "Player 2",
      "Player 7",
      "Player 3",
      "Player 4",
      "Player 5",
      "Player 6",
      "Player 8",
    ]);
    expect(updates.map((update) => update.rankingPosition)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
    expect(updates[2].id).toBe("player-7");
  });

  it("does not move beyond either end of the list", () => {
    const active = accounts(3);

    expect(moveActivePlayer(active, "player-1", "up")).toEqual(active);
    expect(moveActivePlayer(active, "player-3", "down")).toEqual(active);
  });

  it("inserts at a position and appends when no position is supplied", () => {
    const active = accounts(3);
    const inserted = account(99, {
      id: "new-player",
      name: "New Player",
      email: "new@example.com",
    });

    expect(
      insertActivePlayer(active, inserted, 2).map((player) => player.id)
    ).toEqual(["player-1", "new-player", "player-2", "player-3"]);
    expect(
      insertActivePlayer(active, inserted, null).map((player) => player.id)
    ).toEqual(["player-1", "player-2", "player-3", "new-player"]);
  });

  it("compacts the active list and keeps inactive and admin accounts behind it", () => {
    const staleAccounts = [
      account(1),
      account(2),
      account(4),
      account(5),
      account(8, { id: "inactive", name: "Inactive", isActive: false }),
      account(9, { id: "admin", name: "Admin", isActive: false, isAdmin: true }),
    ];
    const partition = partitionRankingAccounts(staleAccounts);
    const updates = buildPositionUpdates(partition);

    expect(partition.active.map((player) => player.id)).toEqual([
      "player-1",
      "player-2",
      "player-4",
      "player-5",
    ]);
    expect(partition.inactive.map((player) => player.id)).toEqual(["inactive"]);
    expect(partition.admins.map((player) => player.id)).toEqual(["admin"]);
    expect(updates.map((update) => update.rankingPosition)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(updates.find((update) => update.id === "admin")?.rankingPosition).toBe(
      6
    );
  });

  it("appends a reactivated player after the existing active players", () => {
    const active = accounts(2);
    const reactivated = account(10, {
      id: "returning",
      name: "Returning",
      email: "returning@example.com",
      isActive: true,
    });
    const nextActive = [...active, reactivated];
    const updates = buildPositionUpdates({
      active: nextActive,
      inactive: [],
      admins: [],
    });

    expect(updates.map((update) => update.id)).toEqual([
      "player-1",
      "player-2",
      "returning",
    ]);
  });

  it("excludes active admin accounts from both member and inactive lists", () => {
    const partition = partitionRankingAccounts([
      account(1),
      account(2, { id: "captain", isAdmin: true }),
    ]);

    expect(partition.active.map((player) => player.id)).toEqual(["player-1"]);
    expect(partition.inactive).toHaveLength(0);
    expect(partition.admins.map((player) => player.id)).toEqual(["captain"]);
  });
});
