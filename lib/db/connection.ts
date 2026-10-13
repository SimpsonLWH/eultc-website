import mongoose from "mongoose";

// Reuse one in-flight connection across requests and Next.js development reloads.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

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
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and add your MongoDB connection string."
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
