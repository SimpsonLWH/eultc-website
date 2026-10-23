"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAPIError } from "better-auth/api";

import { auth } from "@/lib/auth/config";
import {
  getSignUpFormError,
  parseSignUpForm,
  type SignUpValues,
} from "@/lib/auth/form-values";

export type SignUpState = {
  error?: string;
  values: SignUpValues;
} | null;

export async function signUpAction(
  _previousState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const values = parseSignUpForm(formData);
  const validationError = getSignUpFormError(values);
  if (validationError) {
    return { error: validationError, values };
  }

  try {
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      inviteCode: values.inviteCode,
      callbackURL: "/",
    };
    await auth.api.signUpEmail({
      body,
      headers: await headers(),
    });
  } catch (error) {
    if (isAPIError(error)) {
      return {
        error:
          error.message ||
          "The account could not be created. Check your details and try again.",
        values,
      };
    }
    return {
      error:
        "The account could not be created. Check your details and try again.",
      values,
    };
  }

  redirect("/");
}
