import { describe, expect, it } from "vitest";

import { isDevLoginEnabled } from "./dev-login";

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
});
