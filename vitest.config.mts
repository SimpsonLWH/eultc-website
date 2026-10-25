import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Run the pure library tests in Node and discover specs alongside their modules.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "components/**/*.test.tsx"],
  },
});
