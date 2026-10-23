"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAPIError } from "better-auth/api";

import { auth } from "@/lib/auth/config";
import {
  getDevLoginPassword,
  isDevLoginEnabled,
} from "@/lib/auth/dev-login";
import { parseSignInForm } from "@/lib/auth/form-values";
import { isValidEmail } from "@/lib/membership/policy";

export type SignInState = {
  email?: string;
  error?: string;
} | null;

const GENERIC_SIGN_IN_ERROR = "Unable to sign in with those details.";

export async function signInWithPassword(
  _previousState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const values = parseSignInForm(formData);
  if (!isValidEmail(values.email) || !values.password) {
    return { email: values.email, error: GENERIC_SIGN_IN_ERROR };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: values.email,
        password: values.password,
        rememberMe: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (isAPIError(error)) {
      return {
        email: values.email,
        error:
          error.message === "Unable to sign in with those details."
            ? error.message
            : GENERIC_SIGN_IN_ERROR,
      };
    }
    return { email: values.email, error: GENERIC_SIGN_IN_ERROR };
  }

  redirect("/");
}

export async function quickSignIn(formData: FormData): Promise<void> {
  if (!isDevLoginEnabled()) {
    redirect("/sign-in");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    redirect("/sign-in");
  }

  await auth.api.signInEmail({
    body: {
      email,
      password: getDevLoginPassword(),
      rememberMe: true,
    },
    headers: await headers(),
  });
  redirect("/");
}
