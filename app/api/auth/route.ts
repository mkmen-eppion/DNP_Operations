import { NextRequest, NextResponse } from "next/server";

// Lightweight key-check endpoint — no DB calls, safe to hit before Firestore is configured.
export async function GET(req: NextRequest) {
  const apiKey = process.env.NEWSLETTERS_API_KEY;
  if (!apiKey) {
    // No key configured — allow access (dev mode)
    return NextResponse.json({ ok: true });
  }
  if (req.headers.get("x-api-key") !== apiKey) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
