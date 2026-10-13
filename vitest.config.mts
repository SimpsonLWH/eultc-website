import { defineConfig } from "vitest/config";

// Run the pure library tests in Node and discover specs alongside their modules.
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
