"use server";

import { headers } from "next/headers";
import { isAPIError } from "better-auth/api";

import { auth } from "@/lib/auth/config";
import { parseResetPasswordForm } from "@/lib/auth/form-values";
import { getPasswordProblem } from "@/lib/membership/policy";

export type ResetPasswordState = {
  error?: string;
  message?: string;
} | null;

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const values = parseResetPasswordForm(formData);
  if (!values.token) {
    return { error: "This password reset link is invalid or has expired." };
  }

  const passwordProblem = getPasswordProblem(
    values.password,
    values.confirmation
  );
  if (passwordProblem) {
    return { error: passwordProblem };
  }

  try {
    await auth.api.resetPassword({
      body: {
        newPassword: values.password,
        token: values.token,
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      error:
        isAPIError(error) && error.message
          ? error.message
          : "This password reset link is invalid or has expired.",
    };
  }

  return {
    message: "Password updated. You can now sign in with the new password.",
  };
}
