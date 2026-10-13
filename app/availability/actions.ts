"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { eligibleTeams } from "@/lib/availability/eligibility";
import { getFixtureById, getPlayerById, upsertAvailability } from "@/lib/db";
import {
  AVAILABILITY_STATUSES,
  type AvailabilityStatus,
} from "@/lib/db/models/availability-response";

// Return inline feedback so the player sees the result beside their answer controls.
export type AvailabilityActionState = {
  error?: string;
  message?: string;
  status?: AvailabilityStatus;
} | null;

// Recheck identity, roster, ranking, fixture state, and input on every server-action call.
export async function saveAvailabilityAnswer(
  _previousState: AvailabilityActionState,
  formData: FormData
): Promise<AvailabilityActionState> {
  const user = await requireUser();
  const playerId = user.playerId;
  if (!playerId) {
    redirect("/auth/not-listed");
  }

  const fixtureId = String(formData.get("fixtureId") ?? "").trim();
  const rawStatus = formData.get("status");
  const status =
    typeof rawStatus === "string"
      ? AVAILABILITY_STATUSES.find((candidate) => candidate === rawStatus)
      : undefined;
  const noteValue = formData.get("note");
  const note = typeof noteValue === "string" ? noteValue.trim() : "";

  if (!fixtureId) {
    return { error: "Choose a fixture before saving." };
  }
  if (!status) {
    return { error: "Choose available or unavailable." };
  }
  if (note.length > 140) {
    return { error: "Notes must be 140 characters or fewer." };
  }

  const [fixture, player] = await Promise.all([
    getFixtureById(fixtureId),
    getPlayerById(playerId),
  ]);

  if (!fixture || !player) {
    return { error: "This fixture or player could not be found." };
  }

  // The fixture must still accept responses at submission time, even if the page was left open.
  if (fixture.status !== "open" || fixture.availabilityDeadline.getTime() <= Date.now()) {
    return { error: "This signup is closed; your saved answer has not been changed." };
  }

  const allowedTeams = eligibleTeams(player.rankingPosition).filter(
    (teamNumber) => teamNumber <= fixture.teamsPlaying
  );
  if (allowedTeams.length === 0) {
    return { error: "Your ranking is not eligible for a team in this fixture." };
  }

  // T02 stores fixture-level availability, not a team assignment; reject a forged team assertion if supplied.
  const requestedTeamValue = formData.get("teamNumber");
  if (typeof requestedTeamValue === "string" && requestedTeamValue.trim() !== "") {
    const requestedTeam = Number(requestedTeamValue);
    if (!Number.isInteger(requestedTeam) || !allowedTeams.includes(requestedTeam)) {
      return { error: "You can only sign up for one of your eligible teams." };
    }
  }

  // The unique (playerId, fixtureId) index makes each repeat submission an update, not a duplicate.
  await upsertAvailability({
    playerId,
    fixtureId,
    status,
    note: note || null,
  });
  revalidatePath("/availability");

  return { message: "Availability saved.", status };
}