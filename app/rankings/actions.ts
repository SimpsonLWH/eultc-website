"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import {
  createRankingPlayer,
  ensurePlayerRole,
  listRankingAccounts,
  saveRankingPositions,
} from "@/lib/db";
import {
  buildPositionUpdates,
  insertActivePlayer,
  moveActivePlayer,
  partitionRankingAccounts,
  type RankingAccount,
} from "@/lib/rankings/ranking";
import {
  addPlayerValuesFromFormData,
  emptyAddPlayerValues,
  validateAddPlayer,
  type AddPlayerErrors,
  type AddPlayerValues,
} from "@/lib/rankings/validate";

export type RankingActionResult = {
  error?: string;
  message?: string;
} | null;

export type AddPlayerState = {
  error?: string;
  errors?: AddPlayerErrors;
  message?: string;
  values: AddPlayerValues;
} | null;

const RANKING_VIEWS = [
  "/rankings",
  "/availability",
  "/team-sheet",
  "/selection",
  "/",
  "/api/rankings",
];

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateRankingViews() {
  for (const path of RANKING_VIEWS) {
    revalidatePath(path);
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

// Move one active player and persist the complete resulting order.
export async function movePlayerAction(
  _previousState: RankingActionResult,
  formData: FormData
): Promise<RankingActionResult> {
  await requireAdmin();

  const playerId = readText(formData, "playerId");
  const direction = readText(formData, "direction");
  if (!playerId || (direction !== "up" && direction !== "down")) {
    return { error: "Choose a player and a direction." };
  }

  try {
    const accounts = await listRankingAccounts();
    const partition = partitionRankingAccounts(accounts);
    if (!partition.active.some((account) => account.id === playerId)) {
      return { error: "That player is no longer in the active rankings." };
    }

    const nextActive = moveActivePlayer(
      partition.active,
      playerId,
      direction
    );
    const unchanged = nextActive.every(
      (account, index) => account.id === partition.active[index]?.id
    );
    if (unchanged) {
      return null;
    }

    await saveRankingPositions(
      buildPositionUpdates({
        active: nextActive,
        inactive: partition.inactive,
        admins: partition.admins,
      })
    );
  } catch (error) {
    console.error("Ranking move failed", error);
    return { error: "The ranking could not be saved. Please try again." };
  }

  revalidateRankingViews();
  return { message: "Ranking saved." };
}

// Add a roster player at a chosen active position, or append them.
export async function addPlayerAction(
  _previousState: AddPlayerState,
  formData: FormData
): Promise<AddPlayerState> {
  await requireAdmin();

  const values = addPlayerValuesFromFormData(formData);

  try {
    const accounts = await listRankingAccounts();
    const partition = partitionRankingAccounts(accounts);
    const validation = validateAddPlayer(values, partition.active.length + 1);
    if (!validation.ok) {
      return { errors: validation.errors, values };
    }

    const { name, email, position } = validation.value;
    if (accounts.some((account) => account.email === email)) {
      return {
        errors: { email: "A player with that email already exists." },
        values,
      };
    }

    const highestPosition = accounts.reduce(
      (highest, account) => Math.max(highest, account.rankingPosition),
      0
    );
    const created = await createRankingPlayer({
      name,
      email,
      rankingPosition: highestPosition + 1,
      isActive: true,
    });
    await ensurePlayerRole(email);

    const newAccount: RankingAccount = {
      id: String(created._id),
      name: created.name,
      email: created.email,
      rankingPosition: created.rankingPosition,
      isActive: true,
      isAdmin: false,
    };
    const nextActive = insertActivePlayer(partition.active, newAccount, position);

    await saveRankingPositions(
      buildPositionUpdates({
        active: nextActive,
        inactive: partition.inactive,
        admins: partition.admins,
      })
    );
  } catch (error) {
    console.error("Ranking player creation failed", error);
    if (isDuplicateKeyError(error)) {
      return {
        errors: { email: "A player with that email already exists." },
        values,
      };
    }
    return {
      error: "The player could not be added. Please try again.",
      values,
    };
  }

  revalidateRankingViews();
  return {
    message: "Player added.",
    values: emptyAddPlayerValues,
  };
}

// Deactivate or reactivate one roster player; admin accounts cannot be edited.
export async function setPlayerActiveAction(
  _previousState: RankingActionResult,
  formData: FormData
): Promise<RankingActionResult> {
  await requireAdmin();

  const playerId = readText(formData, "playerId");
  const activeValue = readText(formData, "isActive");
  if (!playerId || (activeValue !== "true" && activeValue !== "false")) {
    return { error: "Choose a valid player status." };
  }
  const shouldActivate = activeValue === "true";

  try {
    const accounts = await listRankingAccounts();
    const target = accounts.find((account) => account.id === playerId);
    if (!target || target.isAdmin) {
      return { error: "That player cannot be changed from this page." };
    }
    if (target.isActive === shouldActivate) {
      return null;
    }

    const partition = partitionRankingAccounts(accounts);
    const changedTarget: RankingAccount = {
      ...target,
      isActive: shouldActivate,
    };
    const nextActive = shouldActivate
      ? [...partition.active, changedTarget]
      : partition.active.filter((account) => account.id !== playerId);
    const nextInactive = shouldActivate
      ? partition.inactive.filter((account) => account.id !== playerId)
      : [...partition.inactive, changedTarget];

    await saveRankingPositions(
      buildPositionUpdates({
        active: nextActive,
        inactive: nextInactive,
        admins: partition.admins,
      })
    );
  } catch (error) {
    console.error("Ranking status change failed", error);
    return { error: "The player status could not be saved. Please try again." };
  }

  revalidateRankingViews();
  return {
    message: shouldActivate ? "Player reactivated." : "Player deactivated.",
  };
}
