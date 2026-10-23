import { describe, expect, it } from "vitest";

import {
  buildRegistrationUrl,
  evaluateMembershipRemoval,
} from "./admin-policy";

describe("membership admin policy", () => {
  it("builds a copyable invite URL", () => {
    expect(
      buildRegistrationUrl("https://club.example.com/", "invite-token")
    ).toBe("https://club.example.com/sign-up?invite=invite-token");
  });

  it("rejects removing an admin-paid entry", () => {
    expect(
      evaluateMembershipRemoval({
        targetRole: "admin",
        targetUserId: "admin-user",
      })
    ).toEqual({ allowed: false, reason: "admin_account" });
  });

  it("revokes the target's sessions when removing a member", () => {
    expect(
      evaluateMembershipRemoval({
        targetRole: "player",
        targetUserId: "player-user",
      })
    ).toEqual({ allowed: true, revokeUserId: "player-user" });
  });

  it("removes a paid email that has no auth account", () => {
    expect(
      evaluateMembershipRemoval({
        targetRole: null,
        targetUserId: null,
      })
    ).toEqual({ allowed: true, revokeUserId: null });
  });
});
