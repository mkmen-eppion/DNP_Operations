import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const fields: Record<string, unknown> = {
    // Section 1: Project Selection
    "Project Interest": body.projectOpen ? "Open to projects / not decided yet" : (body.projectInterest || ""),
    "How Heard": Array.isArray(body.heardAbout) ? body.heardAbout.join(", ") : "",
    "Rep Name (Heard From)": body.heardRepName || "",
    "Partner Name (Heard From)": body.heardPartnerName || "",
    "Other Source": body.heardOther || "",

    // Section 2: Purchaser Identity
    "Full Legal Name": body.fullLegalName,
    "Co-Purchaser Name": body.coPurchaserName || "",
    "Nationality": body.nationality,
    "Country of Residence": body.countryOfResidence,
    "Email": body.email,
    "Mobile": body.mobile || "",
    "Preferred Contact": Array.isArray(body.preferredContact) ? body.preferredContact.join(", ") : "",
    "Purchasing As": body.purchasingAs || "",
    "Entity Name": body.entityName || "",
    "Entity Country": body.entityCountry || "",
    "Entity Registration Number": body.entityRegNumber || "",

    // Section 3: Financial Qualification
    "Budget Range": body.budgetRange || "",
    "Source of Funds": Array.isArray(body.sourceOfFunds) ? body.sourceOfFunds.join(", ") : "",
    "Funding Timeline": body.fundingTimeline || "",

    // Section 4: Purchase Intent & Usage
    "Intended Usage": body.intendedUsage || "",
    "Target Investment Timeline": body.targetTimeline || "",

    // Section 5: Property Preferences
    "Property Type": Array.isArray(body.propertyType) ? body.propertyType.join(", ") : "",
    "Preferred Locations": Array.isArray(body.preferredLocations) ? body.preferredLocations.join(", ") : "",
    "DPN Recommendation Notes": body.dpnRecommendation || "",
    "Min Bedrooms": body.minBedrooms || "",
    "Amenities": Array.isArray(body.amenities) ? body.amenities.join(", ") : "",
    "Amenities Other": body.amenitiesOther || "",

    // Section 7: Additional Information
    "Has DPN Rep": body.hasDpnRep || "",
    "DPN Rep Name": body.dpnRepName || "",
    "Has Agent": body.hasAgent || "",
    "Agent Name": body.agentName || "",
    "Additional Comments": body.additionalComments || "",
    "Wants Consultation": body.wantsConsultation || "",

    // Meta
    "Submitted At": new Date().toISOString(),
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_BUYER_QUAL_TABLE_ID}`,
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
    console.error("Airtable buyer-qualification error:", err);
    return NextResponse.json(
      {
        error: "Failed to save submission",
        detail: err,
        baseId: process.env.AIRTABLE_BASE_ID ?? "MISSING",
        tableId: process.env.AIRTABLE_BUYER_QUAL_TABLE_ID ?? "MISSING",
        hasToken: !!process.env.AIRTABLE_TOKEN,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
