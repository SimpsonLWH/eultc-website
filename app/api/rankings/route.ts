import { connection, NextResponse } from "next/server";

import { listRankings } from "@/lib/db/players";
import { serializeRankedPlayer } from "@/lib/db/serialize";

export async function GET() {
  await connection();

  try {
    const players = await listRankings();
    return NextResponse.json({ players: players.map(serializeRankedPlayer) });
  } catch (error) {
    console.error("GET /api/rankings failed", error);
    return NextResponse.json({ error: "database unavailable" }, { status: 503 });
  }
}
