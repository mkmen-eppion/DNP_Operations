import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  let body: { email?: string; assetClass?: string; market?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, assetClass, market } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  let webhookRes: Response;
  try {
    webhookRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, assetClass: assetClass || null, market: market || null }),
    });
  } catch (err) {
    console.error("[newsletter] fetch to webhook failed:", err);
    return NextResponse.json(
      { error: `Could not reach webhook: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  if (!webhookRes.ok) {
    const text = await webhookRes.text().catch(() => "");
    console.error("[newsletter] webhook returned", webhookRes.status, text);
    return NextResponse.json(
      { error: `Webhook returned ${webhookRes.status}: ${text}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "Thank you! You've been added to our newsletter." });
}
