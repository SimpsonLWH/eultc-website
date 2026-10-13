import { connection, NextResponse } from "next/server";

import { listRankings } from "@/lib/db/players";
import { serializeRankedPlayer } from "@/lib/db/serialize";

// Return active players in ranking order using the public API shape.
export async function GET() {
  await connection();

  try {
    const players = await listRankings();
    // Keep Mongoose documents and internal fields out of the JSON response.
    return NextResponse.json({ players: players.map(serializeRankedPlayer) });
  } catch (error) {
    console.error("GET /api/rankings failed", error);
    return NextResponse.json({ error: "database unavailable" }, { status: 503 });
  }
}
