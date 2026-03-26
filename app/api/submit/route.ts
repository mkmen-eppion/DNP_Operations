import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_URL) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
  }

  let webhookRes: Response;
  try {
    webhookRes = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch (err) {
    console.error("[submit] fetch to webhook failed:", err);
    return NextResponse.json(
      { error: `Could not reach webhook: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  if (!webhookRes.ok) {
    const text = await webhookRes.text().catch(() => "");
    console.error("[submit] webhook returned", webhookRes.status, text);
    return NextResponse.json(
      { error: `Webhook returned ${webhookRes.status}: ${text}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "URL submitted successfully!" });
}
