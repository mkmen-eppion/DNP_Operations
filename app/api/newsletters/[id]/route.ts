import { NextRequest, NextResponse } from "next/server";
import { getById } from "@/lib/newsletters-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const newsletter = await getById(id);
  if (!newsletter) {
    return NextResponse.json({ error: "Newsletter not found." }, { status: 404 });
  }
  return NextResponse.json(newsletter);
}
