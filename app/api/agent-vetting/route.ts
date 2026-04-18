import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const fields: Record<string, unknown> = {
    // Section 1: Agent / Representative Identity
    "Full Legal Name": body.fullLegalName,
    "Trading Name": body.tradingName || "",
    "Entity Type": Array.isArray(body.entityType) ? body.entityType.join(", ") : "",
    "Entity Type Other": body.entityTypeOther || "",
    "Country of Registration": body.countryOfRegistration || "",
    "Company Registration Number": body.companyRegNumber || "",
    "Years in Operation": body.yearsInOperation || "",

    // Section 2: Key Point of Contact
    "Primary Contact Name": body.primaryContactName,
    "Primary Contact Title": body.primaryContactTitle || "",
    "Primary Contact Email": body.primaryContactEmail,
    "Primary Contact Mobile": body.primaryContactMobile || "",
    "Secondary Contact Name": body.secondaryContactName || "",
    "Secondary Contact Email": body.secondaryContactEmail || "",
    "Secondary Contact Mobile": body.secondaryContactMobile || "",

    // Section 3: Business Address & Contact Information
    "Business Address": body.businessAddress || "",
    "City": body.city || "",
    "State / Province": body.stateProvince || "",
    "Postal Code": body.postalCode || "",
    "Country": body.country || "",
    "Main Telephone": body.mainTelephone || "",
    "Alternative Telephone": body.alternativeTelephone || "",
    "General Business Email": body.generalBusinessEmail || "",

    // Section 4: Online Presence
    "Website URL": body.websiteUrl || "",
    "LinkedIn Company Page": body.linkedinCompany || "",
    "LinkedIn Profile": body.linkedinProfile || "",
    "Instagram": body.instagram || "",
    "Facebook": body.facebook || "",
    "X (Twitter)": body.twitter || "",
    "YouTube": body.youtube || "",
    "TikTok": body.tiktok || "",
    "Other Platform": body.otherPlatform || "",

    // Section 5: Professional Credentials & Licensing
    "Has Real Estate License": body.hasLicense || "",
    "License Issuing Body & Number": body.licenseIssuingBody || "",
    "License Country / State": body.licenseCountryState || "",
    "Member of Professional Association": body.isMemberAssociation || "",
    "Association Names": body.associationNames || "",
    "Has Indemnity Insurance": body.hasIndemnityInsurance || "",

    // Section 6: Network & Client Reach
    "Client Demographic": Array.isArray(body.clientDemographic) ? body.clientDemographic.join(", ") : "",
    "Client Demographic Other": body.clientDemographicOther || "",
    "Estimated Client Count": body.estimatedClientCount || "",
    "Engagement Channels": Array.isArray(body.engagementChannels) ? body.engagementChannels.join(", ") : "",
    "Engagement Channels Other": body.engagementChannelsOther || "",
    "Previous Ghana Transaction": body.previousGhanaTransaction || "",
    "Ghana Transaction Details": body.ghanaTransactionDetails || "",

    // Section 7: DPN Global Project Interest
    "Projects Interested": Array.isArray(body.projectsInterested) ? body.projectsInterested.join(", ") : "",
    "How Heard About Opportunity": Array.isArray(body.heardAboutOpportunity) ? body.heardAboutOpportunity.join(", ") : "",
    "Heard Rep Name": body.heardRepName || "",
    "Heard Partner Name": body.heardPartnerName || "",
    "Heard Other": body.heardOther || "",

    // Meta
    "Submitted At": new Date().toISOString(),
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_AGENT_VETTING_TABLE_ID}`,
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
    console.error("Airtable agent-vetting error:", err);
    return NextResponse.json(
      {
        error: "Failed to save submission",
        detail: err,
        baseId: process.env.AIRTABLE_BASE_ID ?? "MISSING",
        tableId: process.env.AIRTABLE_AGENT_VETTING_TABLE_ID ?? "MISSING",
        hasToken: !!process.env.AIRTABLE_TOKEN,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
