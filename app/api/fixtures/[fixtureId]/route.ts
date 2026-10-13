import { connection, NextResponse } from "next/server";

import { getFixtureById } from "@/lib/db/fixtures";
import { serializeFixture } from "@/lib/db/serialize";

// Return one fixture by URL id, translating database failures into an API response.
export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/fixtures/[fixtureId]">
) {
  // Route handlers need request-time access when Cache Components are enabled.
  await connection();

  const { fixtureId } = await ctx.params;

  try {
    const fixture = await getFixtureById(fixtureId);
    if (!fixture) {
      // A valid request for a missing fixture is distinct from a database failure.
      return NextResponse.json({ error: "fixture not found" }, { status: 404 });
    }
    return NextResponse.json({ fixture: serializeFixture(fixture) });
  } catch (error) {
    console.error("GET /api/fixtures/[fixtureId] failed", error);
    return NextResponse.json({ error: "database unavailable" }, { status: 503 });
  }
}
