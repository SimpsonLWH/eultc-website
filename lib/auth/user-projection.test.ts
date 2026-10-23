import { describe, expect, it } from "vitest";

import {
  evaluateMemberAccess,
  projectCurrentUser,
} from "./user-projection";

describe("Better Auth user projection", () => {
  it("maps an admin session to the application role and player link", () => {
    expect(
      projectCurrentUser(
        {
          id: "user-1",
          email: " Captain@Example.com ",
          name: "Club Captain",
          role: "admin",
        },
        {
          _id: { toString: () => "player-1" },
          name: "Club Captain",
        }
      )
    ).toEqual({
      id: "user-1",
      email: "captain@example.com",
      name: "Club Captain",
      role: "admin",
      playerId: "player-1",
    });
  });

  it("keeps a paid member without a player row outside the BUCS roster", () => {
    expect(
      projectCurrentUser(
        {
          id: "user-2",
          email: "member@example.com",
          name: "Social Member",
          role: "player",
        },
        null
      )
    ).toEqual({
      id: "user-2",
      email: "member@example.com",
      name: "Social Member",
      role: "player",
      playerId: null,
    });
  });

  it("rejects an unpaid player from member access", () => {
    expect(
      evaluateMemberAccess(
        {
          id: "user-2",
          email: "member@example.com",
          name: "Social Member",
          role: "player",
          playerId: null,
        },
        false
      )
    ).toEqual({ allowed: false, reason: "not_paid" });
  });

  it("allows paid players and admin bypasses", () => {
    const player = {
      id: "user-2",
      email: "member@example.com",
      name: "Social Member",
      role: "player" as const,
      playerId: null,
    };
    const admin = { ...player, id: "user-3", role: "admin" as const };

    expect(evaluateMemberAccess(player, true)).toEqual({
      allowed: true,
      access: "paid",
    });
    expect(evaluateMemberAccess(admin, false)).toEqual({
      allowed: true,
      access: "admin-bypass",
    });
  });
});
