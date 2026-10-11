import { connection, NextResponse } from "next/server";

import { getFixtureById } from "@/lib/db/fixtures";
import { serializeFixture } from "@/lib/db/serialize";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/fixtures/[fixtureId]">
) {
  await connection();

  const { fixtureId } = await ctx.params;

  try {
    const fixture = await getFixtureById(fixtureId);
    if (!fixture) {
      return NextResponse.json({ error: "fixture not found" }, { status: 404 });
    }
    return NextResponse.json({ fixture: serializeFixture(fixture) });
  } catch (error) {
    console.error("GET /api/fixtures/[fixtureId] failed", error);
    return NextResponse.json({ error: "database unavailable" }, { status: 503 });
  }
}
