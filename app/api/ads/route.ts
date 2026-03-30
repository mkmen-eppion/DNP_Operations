import { NextRequest, NextResponse } from "next/server";
import { getAllAds, getAds, upsertAd, deleteAd, AdSlot } from "@/lib/ads-store";

const VALID_SLOTS: AdSlot[] = ["leaderboard", "medium_rect", "native", "half_page"];

function requireApiKey(req: NextRequest): boolean {
  const apiKey = process.env.NEWSLETTERS_API_KEY;
  return !apiKey || req.headers.get("x-api-key") === apiKey;
}

// GET /api/ads                        — all ads (admin)
// GET /api/ads?slots=leaderboard,...  — active ads for given slots (newsletter page)
export async function GET(req: NextRequest) {
  try {
    const param = req.nextUrl.searchParams.get("slots");

    if (!param) {
      const ads = await getAllAds();
      return NextResponse.json(ads);
    }

    const requested = param
      .split(",")
      .filter((s) => VALID_SLOTS.includes(s as AdSlot)) as AdSlot[];

    const ads = await getAds(requested);
    return NextResponse.json(ads);
  } catch (err) {
    console.error("[ads] GET error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// POST /api/ads — create or update an ad
// Body: { id?: string, slot, label, headline, body, cta_text, cta_url, image_url?, active_until? }
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

  const { id, slot, label, headline, body: adBody, cta_text, cta_url, image_url, active_until } = body;

  if (!slot || !VALID_SLOTS.includes(slot as AdSlot)) {
    return NextResponse.json({ error: "Invalid or missing slot." }, { status: 400 });
  }
  if (!label || !headline || !adBody || !cta_text || !cta_url) {
    return NextResponse.json({ error: "label, headline, body, cta_text, and cta_url are required." }, { status: 400 });
  }

  const ad = await upsertAd(
    typeof id === "string" ? id : null,
    {
      slot: slot as AdSlot,
      label: label as string,
      headline: headline as string,
      body: adBody as string,
      cta_text: cta_text as string,
      cta_url: cta_url as string,
      image_url: typeof image_url === "string" ? image_url : undefined,
      active_until: typeof active_until === "string" ? active_until : undefined,
    }
  );

  return NextResponse.json(ad, { status: id ? 200 : 201 });
}

// DELETE /api/ads?id=xxx
export async function DELETE(req: NextRequest) {
  if (!requireApiKey(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  await deleteAd(id);
  return NextResponse.json({ message: "Deleted." });
}
