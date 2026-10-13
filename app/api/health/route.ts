import { connection, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connection";

// Expose a lightweight database connectivity check for local and deployed health probes.
export async function GET() {
  await connection();

  try {
    const mongoose = await connectToDatabase();
    return NextResponse.json({
      ok: true,
      // Mongoose's readyState is more useful than assuming connect() always implies readiness.
      database: mongoose.connection.readyState === 1 ? "connected" : "unknown",
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/health failed", error);
    return NextResponse.json({ ok: false, error: "database unavailable" }, { status: 503 });
  }
}
