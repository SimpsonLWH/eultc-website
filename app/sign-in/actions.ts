"use server";

import { AuthError } from "next-auth";
import { isDevLoginEnabled, signIn } from "@/lib/auth/config";

export type SignInState = {
  error?: string;
} | null;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    await signIn("credentials", { email, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "We couldn’t sign you in. Check the email and try again." };
    }
    throw error;
  }

  return null;
}