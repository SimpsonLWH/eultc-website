import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components enables partial prerendering with streamed request-time content.
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // Compile Tailwind v4 through its Turbopack loader.
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
