import { NextRequest, NextResponse } from "next/server";
import { addNewsletters, getAll } from "@/lib/newsletters-store";

function parseBool(val: unknown): boolean {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "true" || val === "1";
  return false;
}

export async function GET() {
  const newsletters = (await getAll()).map(({ id, wp_title, received_at }) => ({
    id,
    wp_title,
    received_at,
  }));
  return NextResponse.json(newsletters);
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEWSLETTERS_API_KEY;
  if (apiKey && req.headers.get("x-api-key") !== apiKey) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let wp_title: string;
  let wp_body: string;
  let ad_leaderboard = false;
  let ad_medium_rect = false;
  let ad_native = false;
  let ad_half_page = false;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    wp_title = formData.get("wp_title") as string;
    wp_body = formData.get("wp_body") as string;
    ad_leaderboard = parseBool(formData.get("ad_leaderboard"));
    ad_medium_rect = parseBool(formData.get("ad_medium_rect"));
    ad_native = parseBool(formData.get("ad_native"));
    ad_half_page = parseBool(formData.get("ad_half_page"));
  } else {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const item = Array.isArray(body) ? body[0] : (body as Record<string, unknown>);
    wp_title = item.wp_title as string;
    wp_body = item.wp_body as string;
    ad_leaderboard = parseBool(item.ad_leaderboard);
    ad_medium_rect = parseBool(item.ad_medium_rect);
    ad_native = parseBool(item.ad_native);
    ad_half_page = parseBool(item.ad_half_page);
  }

  if (!wp_title || !wp_body) {
    return NextResponse.json(
      { error: "wp_title and wp_body are required." },
      { status: 400 }
    );
  }

  const added = await addNewsletters([
    { wp_title, wp_body, ad_leaderboard, ad_medium_rect, ad_native, ad_half_page },
  ]);
  return NextResponse.json(
    { message: "Newsletters received.", count: added.length, newsletters: added },
    { status: 201 }
  );
}
