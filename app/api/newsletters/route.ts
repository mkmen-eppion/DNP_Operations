import { NextRequest, NextResponse } from "next/server";
import { addNewsletters, getAll } from "@/lib/newsletters-store";

// // POST /api/newsletters
// // Body: [{ wp_title: string, wp_body: string }, ...]
// // Requires header: x-api-key: <NEWSLETTERS_API_KEY env var>
// export async function POST(req: NextRequest) {
//   const apiKey = process.env.NEWSLETTERS_API_KEY;
//   if (apiKey && req.headers.get("x-api-key") !== apiKey) {
//     return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
//   }

//   let body: unknown;
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
//   }

//   if (!Array.isArray(body) || body.length === 0) {
//     return NextResponse.json(
//       { error: "Body must be a non-empty array of newsletter objects." },
//       { status: 400 }
//     );
//   }

//   for (const item of body) {
//     if (
//       typeof item !== "object" ||
//       item === null ||
//       typeof (item as Record<string, unknown>).wp_title !== "string" ||
//       typeof (item as Record<string, unknown>).wp_body !== "string"
//     ) {
//       return NextResponse.json(
//         { error: "Each item must have wp_title (string) and wp_body (string)." },
//         { status: 400 }
//       );
//     }
//   }

//   const added = addNewsletters(body as { wp_title: string; wp_body: string }[]);
//   return NextResponse.json({ message: "Newsletters received.", count: added.length, newsletters: added }, { status: 201 });
// }

// // GET /api/newsletters
// export async function GET() {
//   const newsletters = getAll().map(({ id, wp_title, received_at }) => ({
//     id,
//     wp_title,
//     received_at,
//   }));
//   return NextResponse.json(newsletters);
// }

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEWSLETTERS_API_KEY;
  if (apiKey && req.headers.get("x-api-key") !== apiKey) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let wp_title: string;
  let wp_body: string;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    wp_title = formData.get("wp_title") as string;
    wp_body = formData.get("wp_body") as string;
  } else {
    const body = await req.json();
    const item = Array.isArray(body) ? body[0] : body;
    wp_title = item.wp_title;
    wp_body = item.wp_body;
  }

  if (!wp_title || !wp_body) {
    return NextResponse.json(
      { error: "wp_title and wp_body are required." },
      { status: 400 },
    );
  }

  const added = addNewsletters([{ wp_title, wp_body }]);
  return NextResponse.json(
    {
      message: "Newsletters received.",
      count: added.length,
      newsletters: added,
    },
    { status: 201 },
  );
}
