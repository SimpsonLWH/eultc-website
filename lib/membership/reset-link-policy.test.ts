import { describe, expect, it } from "vitest";

import {
  applyGeneratedResetUrl,
  createPendingResetLink,
} from "./reset-link-policy";

describe("password reset link correlation", () => {
  const now = new Date("2026-10-23T10:00:00.000Z");

  it("creates an unfulfilled one-hour reset request with the captain identity", () => {
    expect(
      createPendingResetLink({
        userId: "user-1",
        email: "Member@Example.com",
        createdBy: "admin-1",
        now,
      })
    ).toEqual({
      userId: "user-1",
      email: "member@example.com",
      url: "",
      createdBy: "admin-1",
      expiresAt: new Date("2026-10-23T11:00:00.000Z"),
      usedAt: null,
    });
  });

  it("adds the generated URL without losing the captain or member identity", () => {
    const pending = createPendingResetLink({
      userId: "user-1",
      email: "member@example.com",
      createdBy: "admin-1",
      now,
    });

    expect(
      applyGeneratedResetUrl(pending, "https://club.example.com/reset?token=abc")
    ).toEqual({
      ...pending,
      url: "https://club.example.com/reset?token=abc",
    });
  });
});
