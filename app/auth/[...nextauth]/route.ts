import { handlers } from "@/lib/auth/config";

// Expose Auth.js's standard GET and POST endpoints under the configured /auth base path.
export const { GET, POST } = handlers;