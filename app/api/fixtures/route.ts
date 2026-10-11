import { connection, NextResponse } from "next/server";

import { listFixtures, type FixtureScope } from "@/lib/db/fixtures";
import { serializeFixture } from "@/lib/db/serialize";

const SCOPES: FixtureScope[] = ["upcoming", "past", "all"];

export async function GET(request: Request) {
  await connection();

  const requested = new URL(request.url).searchParams.get("scope") ?? "all";
  if (!SCOPES.includes(requested as FixtureScope)) {
    return NextResponse.json(
      { error: "scope must be one of upcoming, past, all" },
      { status: 400 }
    );
  }

  try {
    const fixtures = await listFixtures(requested as FixtureScope);
    return NextResponse.json({ fixtures: fixtures.map(serializeFixture) });
  } catch (error) {
    console.error("GET /api/fixtures failed", error);
    return NextResponse.json({ error: "database unavailable" }, { status: 503 });
  }
}
