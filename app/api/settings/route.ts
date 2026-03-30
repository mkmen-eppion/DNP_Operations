import { NextRequest, NextResponse } from "next/server";
import { getAdConfig, setAdConfig } from "@/lib/settings-store";

function requireApiKey(req: NextRequest): boolean {
  const apiKey = process.env.NEWSLETTERS_API_KEY;
  return !apiKey || req.headers.get("x-api-key") === apiKey;
}

export async function GET() {
  const config = await getAdConfig();
  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  if (!requireApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const config = await setAdConfig({
    ...(typeof body.ad_leaderboard === "boolean" && { ad_leaderboard: body.ad_leaderboard }),
    ...(typeof body.ad_medium_rect === "boolean" && { ad_medium_rect: body.ad_medium_rect }),
    ...(typeof body.ad_native === "boolean" && { ad_native: body.ad_native }),
    ...(typeof body.ad_half_page === "boolean" && { ad_half_page: body.ad_half_page }),
    ...(typeof body.rotate_every_seconds === "number" && { rotate_every_seconds: body.rotate_every_seconds }),
  });

  return NextResponse.json(config);
}
