"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth/config";
import { isDevLoginEnabled } from "@/lib/auth/dev-login";

export type SignInState = {
  error?: string;
} | null;

// Keep server-side validation aligned with the browser's email input constraints.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate the submitted address before calling Auth.js's development provider.
export async function signInWithEmail(
  _previousState: SignInState,
  formData: FormData
): Promise<SignInState> {
  if (!isDevLoginEnabled()) {
    return { error: "Development email sign-in is disabled in this environment." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    // Auth.js throws redirect signals as well as authentication errors; only map its errors to UI.
    await signIn("credentials", { email, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "We couldn’t sign you in. Check the email and try again." };
    }
    throw error;
  }

  return null;
}

// One-click development sign-in used by the quick buttons on the sign-in page.
export async function quickSignIn(formData: FormData): Promise<void> {
  if (!isDevLoginEnabled()) {
    return;
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!emailPattern.test(email)) {
    return;
  }

  await signIn("credentials", { email, redirectTo: "/" });
}
