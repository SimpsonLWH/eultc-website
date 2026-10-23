import { describe, expect, it } from "vitest";

import {
  getSignUpFormError,
  parseResetPasswordForm,
  parseSignInForm,
  parseSignUpForm,
} from "./form-values";

describe("auth form values", () => {
  it("normalizes registration identity while preserving password whitespace", () => {
    const formData = new FormData();
    formData.set("name", "  Callum Fraser ");
    formData.set("email", " Callum@Example.com ");
    formData.set("password", " spaced password ");
    formData.set("confirmation", " spaced password ");
    formData.set("invite", "invite-code");

    expect(parseSignUpForm(formData)).toEqual({
      name: "Callum Fraser",
      email: "callum@example.com",
      password: " spaced password ",
      confirmation: " spaced password ",
      inviteCode: "invite-code",
    });
  });

  it("requires a name and a valid email", () => {
    expect(
      getSignUpFormError({
        name: "",
        email: "not-an-email",
        password: "long-enough-pass",
        confirmation: "long-enough-pass",
        inviteCode: "invite-code",
      })
    ).toBe("Enter your name.");
  });

  it("parses sign-in without trimming the password", () => {
    const formData = new FormData();
    formData.set("email", " MEMBER@Example.com ");
    formData.set("password", " password with spaces ");

    expect(parseSignInForm(formData)).toEqual({
      email: "member@example.com",
      password: " password with spaces ",
    });
  });

  it("parses reset token and matching password", () => {
    const formData = new FormData();
    formData.set("token", " reset-token ");
    formData.set("password", "long-enough-pass");
    formData.set("confirmation", "long-enough-pass");

    expect(parseResetPasswordForm(formData)).toEqual({
      token: "reset-token",
      password: "long-enough-pass",
      confirmation: "long-enough-pass",
    });
  });
});
