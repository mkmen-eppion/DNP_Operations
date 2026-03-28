import { NextRequest, NextResponse } from "next/server";
import { addNewsletters, getAll } from "@/lib/newsletters-store";

// POST /api/newsletters
// Body: [{ wp_title: string, wp_body: string }, ...]
// Requires header: x-api-key: <NEWSLETTERS_API_KEY env var>
export async function POST(req: NextRequest) {
  const apiKey = process.env.NEWSLETTERS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server not configured for authenticated posting." }, { status: 500 });
  }
  if (req.headers.get("x-api-key") !== apiKey) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body) || body.length === 0) {
    return NextResponse.json(
      { error: "Body must be a non-empty array of newsletter objects." },
      { status: 400 }
    );
  }

  for (const item of body) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as Record<string, unknown>).wp_title !== "string" ||
      typeof (item as Record<string, unknown>).wp_body !== "string"
    ) {
      return NextResponse.json(
        { error: "Each item must have wp_title (string) and wp_body (string)." },
        { status: 400 }
      );
    }
  }

  const added = addNewsletters(body as { wp_title: string; wp_body: string }[]);
  return NextResponse.json({ message: "Newsletters received.", count: added.length, newsletters: added }, { status: 201 });
}

// GET /api/newsletters
export async function GET() {
  const newsletters = getAll().map(({ id, wp_title, received_at }) => ({
    id,
    wp_title,
    received_at,
  }));
  return NextResponse.json(newsletters);
}
