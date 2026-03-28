import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "No url provided" }, { status: 400 });
  }

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";

  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
