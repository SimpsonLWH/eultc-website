import { describe, expect, it } from "vitest";

import {
  assertPreviewDatabaseName,
  previewFixtureStatus,
  resolveTargetMatchweekStatus,
} from "./preview-policy";

describe("assertPreviewDatabaseName", () => {
  it.each(["eultc_preview", "eultc-preview-2026", "PREVIEW"])(
    "accepts a preview database name: %s",
    (name) => {
      expect(() => assertPreviewDatabaseName(name)).not.toThrow();
    }
  );

  it.each(["dev", "eultc_prod", "production", "eultc"])(
    "rejects a non-preview database name: %s",
    (name) => {
      expect(() => assertPreviewDatabaseName(name)).toThrow(
        /database name must contain "preview"/i
      );
    }
  );

  it.each(["preview-prod", "prod-preview", "eultc-preview-production"])(
    "rejects preview-looking names that include production: %s",
    (name) => {
      expect(() => assertPreviewDatabaseName(name)).toThrow(/production/i);
    }
  );
});

describe("previewFixtureStatus", () => {
  it("closes historical preview weeks", () => {
    expect(previewFixtureStatus(1)).toBe("closed");
    expect(previewFixtureStatus(4)).toBe("closed");
  });

  it("opens only the target matchweek", () => {
    expect(resolveTargetMatchweekStatus(5)).toBe("draft");
    expect(resolveTargetMatchweekStatus(6)).toBe("open");
    expect(resolveTargetMatchweekStatus(7)).toBe("draft");
  });
});
