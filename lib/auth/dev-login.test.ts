import { describe, expect, it } from "vitest";

import { getDevLoginPassword, isDevLoginEnabled } from "./dev-login";

describe("isDevLoginEnabled", () => {
  it("allows credentials during local development", () => {
    expect(isDevLoginEnabled({ NODE_ENV: "development" })).toBe(true);
  });

  it("allows opted-in preview deployments", () => {
    expect(
      isDevLoginEnabled({
        NODE_ENV: "production",
        VERCEL_ENV: "preview",
        AUTH_DEV_LOGIN: "true",
      })
    ).toBe(true);
  });

  it("never allows credentials in production", () => {
    expect(
      isDevLoginEnabled({
        NODE_ENV: "production",
        VERCEL_ENV: "production",
        AUTH_DEV_LOGIN: "true",
      })
    ).toBe(false);
    expect(
      isDevLoginEnabled({
        NODE_ENV: "production",
        AUTH_DEV_LOGIN: "true",
      })
    ).toBe(false);
  });

  it("uses a server-only development password", () => {
    expect(getDevLoginPassword({ AUTH_DEV_PASSWORD: " dev-password " })).toBe(
      "dev-password"
    );
    expect(getDevLoginPassword({})).toBe("eultc-dev-password");
  });
});
