import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const fields: Record<string, unknown> = {
    "First Name": body.firstName,
    "Last Name": body.lastName,
    "Email": body.email,
    "Age": body.age,
    "Primary Phone": body.phone,
    "Secondary Phone": body.phone2 || "",
    "Country": body.country,
    "Citizenship Type": body.citizenshipType,
    "Citizenship 1": body.citizenship1,
    "Citizenship 2": body.citizenship2 || "",
    "Occupation": body.occupation,
    "Years Employed": body.yearsEmployed,
    "Annual Income": body.annualIncome,
    "Total Assets": body.totalAssets,
    "Credit Score": body.creditScore,
    "Monthly Debt": body.monthlyDebt,
    "Owns Home": body.ownsHome,
    "Home Location": body.homeLocation || "",
    "Bought Ghana": body.boughtGhana,
    "Buying Structure": body.buyingStructure,
    "Co-Applicant Income": body.coApplicantIncome || "",
    "Purchase Price": body.purchasePrice,
    "Down Payment": body.downPayment,
    "Loan Term": body.loanTerm,
    "Property Type": body.propertyType,
    "Ghana Location": body.ghanaLocation,
    "Timeline": body.timeline,
    "Additional Info": body.additionalInfo || "",
    "Subscribe Newsletter": !!body.subscribeNewsletter,
    "Submitted At": new Date().toISOString(),
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_MORTGAGE_TABLE_ID}`,
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
    console.error("Airtable mortgage error:", err);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
