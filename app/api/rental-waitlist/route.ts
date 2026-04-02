import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const fields: Record<string, unknown> = {
    "First Name": body.firstName,
    "Last Name": body.lastName,
    "Age": body.age || "",
    "Email": body.email,
    "Phone": body.phone,
    "City": body.city || "",
    "State": body.state || "",
    "Country": body.country,
    "Citizenship": body.citizenship,
    "Occupation": body.occupation || "",
    "Industry": body.industry || "",
    "Years Employed": body.yearsEmployed || "",
    "Investor Type": body.investorType || "",
    "Annual Income": body.annualIncome || "",
    "Liquid Capital": body.liquidCapital || "",
    "First Allocation": body.firstAllocation || "",
    "Timeline": body.timeline || "",
    "Ready To Move": body.readyToMove || "",
    "Preferred Comms": body.preferredComms || "",
    "Subscribe Newsletter": !!body.subscribeNewsletter,
    "Submitted At": new Date().toISOString(),
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_RENTAL_TABLE_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error("Airtable rental error:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
