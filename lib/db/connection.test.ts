import { describe, expect, it } from "vitest";

import { resolveDatabaseUri } from "./connection";

describe("resolveDatabaseUri", () => {
  it("uses the explicit preview URI only in preview mode", () => {
    expect(
      resolveDatabaseUri({
        EULTC_DATA_MODE: "preview",
        MONGODB_PREVIEW_URI: "mongodb://preview/example",
        MONGODB_URI: "mongodb://normal/example",
      })
    ).toBe("mongodb://preview/example");
  });

  it("ignores the preview URI outside preview mode", () => {
    expect(
      resolveDatabaseUri({
        MONGODB_PREVIEW_URI: "mongodb://preview/example",
        MONGODB_URI: "mongodb://normal/example",
      })
    ).toBe("mongodb://normal/example");
  });

  it("falls back to MONGODB_URI in preview mode without a preview URI", () => {
    expect(
      resolveDatabaseUri({
        EULTC_DATA_MODE: "preview",
        MONGODB_URI: "mongodb://normal/example",
      })
    ).toBe("mongodb://normal/example");
  });

  it("returns null when no database URI is configured", () => {
    expect(resolveDatabaseUri({})).toBeNull();
  });
});
