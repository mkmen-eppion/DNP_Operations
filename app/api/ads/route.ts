import { NextRequest, NextResponse } from "next/server";
import { getAllAds, getAds, upsertAd, deleteAd, AdSlot, AdDisplayMode } from "@/lib/ads-store";

const VALID_SLOTS: AdSlot[] = ["leaderboard", "medium_rect", "native", "half_page"];
const VALID_MODES: AdDisplayMode[] = ["image_only", "text_only", "text_image"];

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

  const {
    id, slot, display_mode, name, tags,
    label, headline, body: adBody, cta_text, cta_url,
    image_url, active_until,
  } = body;

  // Always required
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }
  if (!slot || !VALID_SLOTS.includes(slot as AdSlot)) {
    return NextResponse.json({ error: "Invalid or missing slot." }, { status: 400 });
  }
  if (!display_mode || !VALID_MODES.includes(display_mode as AdDisplayMode)) {
    return NextResponse.json({ error: "display_mode must be image_only, text_only, or text_image." }, { status: 400 });
  }
  if (!cta_url || typeof cta_url !== "string") {
    return NextResponse.json({ error: "cta_url is required." }, { status: 400 });
  }

  const mode = display_mode as AdDisplayMode;
  const hasImage = typeof image_url === "string" && image_url.trim().length > 0;

  // Mode-specific validation
  if ((mode === "image_only" || mode === "text_image") && !hasImage) {
    return NextResponse.json({ error: `image_url is required for ${mode} mode.` }, { status: 400 });
  }
  if (mode === "text_only" || mode === "text_image") {
    if (!label || !headline || !adBody || !cta_text) {
      return NextResponse.json({ error: "label, headline, body, and cta_text are required for text content." }, { status: 400 });
    }
  }

  // Normalise tags — accept array or comma-separated string
  let normalisedTags: string[] = [];
  if (Array.isArray(tags)) {
    normalisedTags = tags.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof tags === "string") {
    normalisedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  const ad = await upsertAd(
    typeof id === "string" ? id : null,
    {
      name: (name as string).trim(),
      tags: normalisedTags,
      slot: slot as AdSlot,
      display_mode: mode,
      label: typeof label === "string" ? label : "",
      headline: typeof headline === "string" ? headline : "",
      body: typeof adBody === "string" ? adBody : "",
      cta_text: typeof cta_text === "string" ? cta_text : "",
      cta_url: cta_url as string,
      image_url: hasImage ? (image_url as string) : undefined,
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
