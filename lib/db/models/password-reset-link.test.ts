import { describe, expect, it } from "vitest";

import { PasswordResetLinkModel } from "./password-reset-link";

describe("PasswordResetLink model", () => {
  it("accepts a pending link before Better Auth generates its URL", async () => {
    const pending = new PasswordResetLinkModel({
      userId: "user-1",
      email: "member@example.com",
      url: "",
      createdBy: "admin-1",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await expect(pending.validate()).resolves.toBeUndefined();
  });
});
