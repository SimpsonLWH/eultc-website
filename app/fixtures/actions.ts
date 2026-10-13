"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createFixture, updateFixture } from "@/lib/db";
import {
  fixtureFormValuesFromFormData,
  validateFixtureForm,
  type FixtureFieldErrors,
  type FixtureFormValues,
} from "@/lib/fixtures/validate";

export type FixtureActionState =
  | { errors: FixtureFieldErrors; values: FixtureFormValues }
  | null;

export async function createFixtureAction(
  _previousState: FixtureActionState,
  formData: FormData
): Promise<FixtureActionState> {
  await requireAdmin();

  const values = fixtureFormValuesFromFormData(formData);
  const result = validateFixtureForm(values);
  if (!result.ok) {
    return { errors: result.errors, values };
  }

  const fixture = await createFixture(result.value);
  const fixtureId = String(fixture._id);

  revalidatePath("/fixtures");
  revalidatePath(`/fixtures/${fixtureId}`);
  redirect(`/fixtures/${fixtureId}`);
}

export async function updateFixtureAction(
  fixtureId: string,
  _previousState: FixtureActionState,
  formData: FormData
): Promise<FixtureActionState> {
  await requireAdmin();

  const values = fixtureFormValuesFromFormData(formData);
  const result = validateFixtureForm(values);
  if (!result.ok) {
    return { errors: result.errors, values };
  }

  const fixture = await updateFixture(fixtureId, result.value);
  if (!fixture) {
    redirect("/fixtures");
  }

  revalidatePath("/fixtures");
  revalidatePath(`/fixtures/${fixtureId}`);
  redirect(`/fixtures/${fixtureId}`);
}
