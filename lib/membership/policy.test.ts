import { describe, expect, it } from "vitest";

import {
  evaluateRegistrationAccess,
  getPasswordProblem,
  getResetLinkState,
  normalizeEmail,
  parseMembershipEmails,
} from "./policy";

describe("membership policy", () => {
  it("normalizes member email addresses", () => {
    expect(normalizeEmail("  Member@Example.COM ")).toBe("member@example.com");
  });

  it("extracts unique valid emails from a pasted membership list", () => {
    expect(
      parseMembershipEmails(
        "first@example.com\n SECOND@example.com\nfirst@example.com\nnot-an-email"
      )
    ).toEqual({
      emails: ["first@example.com", "second@example.com"],
      invalid: ["not-an-email"],
    });
  });

  it("rejects valid-looking registration without the active invite", () => {
    expect(
      evaluateRegistrationAccess({
        email: "player@example.com",
        inviteCode: "wrong-invite",
        activeInviteCode: "current-invite",
        isPaid: true,
        isAdmin: false,
      })
    ).toEqual({ allowed: false, reason: "invalid_invite" });
  });

  it("allows a paid member with the active invite", () => {
    expect(
      evaluateRegistrationAccess({
        email: " Player@Example.com ",
        inviteCode: "current-invite",
        activeInviteCode: "current-invite",
        isPaid: true,
        isAdmin: false,
      })
    ).toEqual({
      allowed: true,
      email: "player@example.com",
      role: "player",
      access: "paid",
    });
  });

  it("rejects an unpaid player even with the active invite", () => {
    expect(
      evaluateRegistrationAccess({
        email: "player@example.com",
        inviteCode: "current-invite",
        activeInviteCode: "current-invite",
        isPaid: false,
        isAdmin: false,
      })
    ).toEqual({ allowed: false, reason: "not_paid" });
  });

  it("allows an admin to bypass paid membership", () => {
    expect(
      evaluateRegistrationAccess({
        email: "captain@example.com",
        inviteCode: "current-invite",
        activeInviteCode: "current-invite",
        isPaid: false,
        isAdmin: true,
      })
    ).toEqual({
      allowed: true,
      email: "captain@example.com",
      role: "admin",
      access: "admin-bypass",
    });
  });

  it("requires a 12-character confirmed password", () => {
    expect(getPasswordProblem("short-pass", "short-pass")).toBe(
      "Password must be at least 12 characters."
    );
    expect(getPasswordProblem("long-enough-pass", "different-pass")).toBe(
      "Passwords do not match."
    );
    expect(getPasswordProblem("long-enough-pass", "long-enough-pass")).toBeNull();
  });

  it("distinguishes active, expired and redeemed reset links", () => {
    const now = new Date("2026-10-23T10:00:00.000Z");

    expect(
      getResetLinkState(
        { expiresAt: new Date("2026-10-23T10:30:00.000Z") },
        now
      )
    ).toBe("active");
    expect(
      getResetLinkState(
        { expiresAt: new Date("2026-10-23T09:59:59.000Z") },
        now
      )
    ).toBe("expired");
    expect(
      getResetLinkState(
        {
          expiresAt: new Date("2026-10-23T10:30:00.000Z"),
          usedAt: new Date("2026-10-23T09:55:00.000Z"),
        },
        now
      )
    ).toBe("used");
  });
});
