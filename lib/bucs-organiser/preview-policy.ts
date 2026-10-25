/**
 * Organiser data uses real names and synthetic identities, so it may only be
 * written to a clearly disposable preview database.
 */
export function assertPreviewDatabaseName(name: string): void {
  const normalized = name.toLowerCase();
  if (!normalized.includes("preview")) {
    throw new Error(
      `Preview database name must contain "preview"; received "${name}".`
    );
  }
  if (normalized.includes("prod")) {
    throw new Error(
      `Refusing to seed a production database from preview data: "${name}".`
    );
  }
}
