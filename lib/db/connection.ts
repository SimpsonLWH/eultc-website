import mongoose from "mongoose";

// Reuse one in-flight connection across requests and Next.js development reloads.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

type DatabaseEnvironment = {
  [key: string]: string | undefined;
  EULTC_DATA_MODE?: string;
  MONGODB_PREVIEW_URI?: string;
  MONGODB_URI?: string;
};

export function resolveDatabaseUri(
  environment: DatabaseEnvironment = process.env
): string | null {
  const previewUri = environment.MONGODB_PREVIEW_URI?.trim();
  if (environment.EULTC_DATA_MODE === "preview") {
    // Preview mode must never fall through to the normal database URI.
    return previewUri || null;
  }
  return environment.MONGODB_URI?.trim() || null;
}

const globalForMongoose = globalThis as typeof globalThis & {
  __eultcMongoose?: MongooseCache;
};

// Store the cache on globalThis so module re-evaluation does not open extra sockets.
const cache: MongooseCache =
  globalForMongoose.__eultcMongoose ?? { conn: null, promise: null };

globalForMongoose.__eultcMongoose = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) {
    return cache.conn;
  }

  // Connect once using the configured URI and clear a failed promise so later calls can retry.
  const uri = resolveDatabaseUri();
  if (!uri) {
    throw new Error(
      "No MongoDB URI is set. Add MONGODB_URI, or set EULTC_DATA_MODE=preview and MONGODB_PREVIEW_URI."
    );
  }

  cache.promise ??= mongoose.connect(uri, {
    // Indexes are synced explicitly by `npm run db:seed`. Keeping autoIndex on
    // locally means a fresh database gets its unique indexes on first use.
    autoIndex: process.env.NODE_ENV !== "production",
  });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
