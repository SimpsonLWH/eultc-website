import { describe, expect, it } from "vitest";

import { assertPreviewDatabaseName } from "./preview-policy";

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
