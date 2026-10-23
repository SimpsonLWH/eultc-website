import {
  getPasswordProblem,
  isValidEmail,
  normalizeEmail,
} from "../membership/policy";

export type SignUpValues = {
  name: string;
  email: string;
  password: string;
  confirmation: string;
  inviteCode: string;
};

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function parseSignUpForm(formData: FormData): SignUpValues {
  return {
    name: text(formData, "name").trim(),
    email: normalizeEmail(text(formData, "email")),
    password: text(formData, "password"),
    confirmation: text(formData, "confirmation"),
    inviteCode: text(formData, "invite").trim(),
  };
}

export function getSignUpFormError(values: SignUpValues): string | null {
  if (!values.name) {
    return "Enter your name.";
  }
  if (!isValidEmail(values.email)) {
    return "Enter a valid email address.";
  }
  if (!values.inviteCode) {
    return "This registration link is no longer valid.";
  }
  return getPasswordProblem(values.password, values.confirmation);
}

export function parseSignInForm(formData: FormData) {
  return {
    email: normalizeEmail(text(formData, "email")),
    password: text(formData, "password"),
  };
}

export function parseResetPasswordForm(formData: FormData) {
  return {
    token: text(formData, "token").trim(),
    password: text(formData, "password"),
    confirmation: text(formData, "confirmation"),
  };
}
