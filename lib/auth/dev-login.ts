type AuthEnvironment = {
  NODE_ENV?: string;
  VERCEL_ENV?: string;
  AUTH_DEV_LOGIN?: string;
  AUTH_DEV_PASSWORD?: string;
};

// Credential sign-in proves no email ownership, so production must never opt in.
export function isDevLoginEnabled(environment: AuthEnvironment = process.env) {
  if (environment.NODE_ENV === "development") {
    return true;
  }

  return (
    environment.VERCEL_ENV === "preview" &&
    environment.AUTH_DEV_LOGIN === "true"
  );
}

export function getDevLoginPassword(environment: AuthEnvironment = process.env) {
  return environment.AUTH_DEV_PASSWORD?.trim() || "eultc-dev-password";
}
