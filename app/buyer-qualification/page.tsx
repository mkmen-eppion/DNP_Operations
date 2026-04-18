"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

const inputStyle = {
  backgroundColor: "#ffffff",
  borderColor: "rgba(13,27,62,0.2)",
  color: "#0d1b3e",
};

const inputClass =
  "placeholder:text-[#9aa3b8] focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]";

function SectionHeading({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-1">
      <span
        className="flex items-center justify-center size-6 rounded-full text-xs font-bold shrink-0"
        style={{ backgroundColor: "rgba(201,168,76,0.15)", color: "#c9a84c" }}
      >
        {number}
      </span>
      <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#c9a84c" }}>
        {children}
      </h3>
    </div>
  );
}

function Divider() {
  return <hr style={{ borderColor: "rgba(13,27,62,0.1)" }} />;
}

function FieldLabel({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} style={{ color: "#0d1b3e" }}>
      {children}{" "}
      {required && <span className="text-red-500 font-bold">*</span>}
    </Label>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  disabled,
}: {
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            disabled={disabled}
            className="accent-[#c9a84c] size-4"
          />
          <span className="text-sm text-[#0d1b3e]">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({
  name,
  options,
  values,
  onChange,
  disabled,
}: {
  name: string;
  options: { label: string; value: string }[];
  values: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}) {
  function toggle(val: string) {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  }
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            id={`${name}-${opt.value}`}
            checked={values.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            disabled={disabled}
            className="border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
          />
          <span className="text-sm text-[#0d1b3e]">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

type FormData = {
  // Section 1: Project Selection
  projectInterest: string; // free text or "open"
  projectOpen: boolean;
  heardAbout: string[]; // multi-select
  heardRepName: string;
  heardPartnerName: string;
  heardOther: string;

  // Section 2: Purchaser Identity
  fullLegalName: string;
  coPurchaserName: string;
  nationality: string;
  countryOfResidence: string;
  email: string;
  mobile: string;
  preferredContact: string[]; // Email, WhatsApp, Phone
  purchasingAs: string; // individual, jointly, entity

  // Entity sub-fields
  entityName: string;
  entityCountry: string;
  entityRegNumber: string;

  // Section 3: Financial Qualification
  budgetRange: string;
  sourceOfFunds: string[];
  fundingTimeline: string;

  // Section 4: Purchase Intent & Usage
  intendedUsage: string;
  targetTimeline: string;

  // Section 5: Property Preferences
  propertyType: string[];
  preferredLocations: string[];
  dpnRecommendation: string;
  minBedrooms: string;
  amenities: string[];
  amenitiesOther: string;

  // Section 6: Legal & Compliance
  legalAck1: boolean;
  legalAck2: boolean;
  legalAck3: boolean;
  legalAck4: boolean;

  // Section 7: Additional Information
  hasDpnRep: string; // "yes" | "no"
  dpnRepName: string;
  hasAgent: string; // "yes" | "no"
  agentName: string;
  additionalComments: string;
  wantsConsultation: string; // "yes" | "no"

  // Section 8: Data Protection
  dataConsent: boolean;
};

const initial: FormData = {
  projectInterest: "",
  projectOpen: false,
  heardAbout: [],
  heardRepName: "",
  heardPartnerName: "",
  heardOther: "",
  fullLegalName: "",
  coPurchaserName: "",
  nationality: "",
  countryOfResidence: "",
  email: "",
  mobile: "",
  preferredContact: [],
  purchasingAs: "",
  entityName: "",
  entityCountry: "",
  entityRegNumber: "",
  budgetRange: "",
  sourceOfFunds: [],
  fundingTimeline: "",
  intendedUsage: "",
  targetTimeline: "",
  propertyType: [],
  preferredLocations: [],
  dpnRecommendation: "",
  minBedrooms: "",
  amenities: [],
  amenitiesOther: "",
  legalAck1: false,
  legalAck2: false,
  legalAck3: false,
  legalAck4: false,
  hasDpnRep: "",
  dpnRepName: "",
  hasAgent: "",
  agentName: "",
  additionalComments: "",
  wantsConsultation: "",
  dataConsent: false,
};

export default function BuyerQualificationPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const allLegalAcks = form.legalAck1 && form.legalAck2 && form.legalAck3 && form.legalAck4;

  const canSubmit =
    form.fullLegalName.trim() &&
    form.email.trim() &&
    form.nationality.trim() &&
    form.countryOfResidence.trim() &&
    form.dataConsent &&
    allLegalAcks &&
    status !== "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    const res = await fetch("/api/buyer-qualification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("idle");
      alert("Something went wrong. Please try again.");
    }
  }

  const disabled = status === "loading";

  return (
    <main className="min-h-screen flex items-center justify-center p-4 py-10 bg-[#f8f7f4]">
      <div className="w-full max-w-2xl space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Diaspora Property Network"
            width={200}
            height={0}
            style={{ height: "auto" }}
            className="object-contain"
            priority
          />
        </div>

        <Card
          className="shadow-md border bg-white"
          style={{ borderColor: "rgba(13,27,62,0.12)" }}
        >
          <div
            className="h-1 w-full rounded-t-lg"
            style={{ background: "linear-gradient(90deg, #c9a84c, #e6c97a, #c9a84c)" }}
          />

          <CardHeader className="pb-2 text-center pt-6">
            <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-[#c9a84c]">
              DPN Global
            </p>
            <CardTitle className="text-2xl font-bold tracking-tight leading-tight text-[#0d1b3e]">
              DPN Global Buyer & Investor Qualification Form
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed mt-3 text-left text-[#5a6580]">
              This form is designed to qualify serious buyers, ensure compliance with anti-money laundering best
              practices, and accurately match investors with the most appropriate property opportunities within the
              DPN Global portfolio. Completion of this form allows our transaction team to conduct necessary due
              diligence, verify purchaser identity and source of funds in accordance with international regulatory
              standards, and provide tailored guidance on available units that align with your stated preferences
              and financial profile. All information submitted will be treated with the strictest confidentiality
              and used solely for the purpose of facilitating your investment.
            </CardDescription>
            <p className="text-xs mt-3 text-left text-[#5a6580]">
              Fields marked <span className="text-red-500 font-bold">*</span> are required.
            </p>
          </CardHeader>

          <CardContent className="pb-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="size-14 text-[#c9a84c]" />
                <p className="text-lg font-semibold text-[#0d1b3e]">
                  Thank you for submitting your qualification form.
                </p>
                <p className="text-sm text-[#5a6580]">
                  Our team will review your details and be in touch with tailored property opportunities.
                  Welcome to DPN Global.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                {/* ── Section 1: Project Selection ── */}
                <SectionHeading number="1">Project Selection</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="projectInterest">Which DPN Global project(s) are you interested in?</FieldLabel>
                  <Input
                    id="projectInterest"
                    value={form.projectInterest}
                    onChange={(e) => set("projectInterest", e.target.value)}
                    placeholder="Name of Project"
                    disabled={disabled || form.projectOpen}
                    style={inputStyle}
                    className={inputClass}
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      id="projectOpen"
                      checked={form.projectOpen}
                      onCheckedChange={(v) => {
                        set("projectOpen", !!v);
                        if (v) set("projectInterest", "");
                      }}
                      disabled={disabled}
                      className="border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                    />
                    <Label htmlFor="projectOpen" className="text-sm cursor-pointer text-[#5a6580]">
                      Open to projects / not decided yet
                    </Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="heardAbout">How did you hear about DPN Global?</FieldLabel>
                  <CheckboxGroup
                    name="heardAbout"
                    options={[
                      { label: "DPN Global Website", value: "website" },
                      { label: "DPN Representative", value: "representative" },
                      { label: "Referral Partner / Agent", value: "partner" },
                      { label: "Social Media", value: "social-media" },
                      { label: "Event / Webinar", value: "event" },
                      { label: "Other", value: "other" },
                    ]}
                    values={form.heardAbout}
                    onChange={(v) => set("heardAbout", v)}
                    disabled={disabled}
                  />
                  {form.heardAbout.includes("representative") && (
                    <Input
                      value={form.heardRepName}
                      onChange={(e) => set("heardRepName", e.target.value)}
                      placeholder="Representative Name"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                  {form.heardAbout.includes("partner") && (
                    <Input
                      value={form.heardPartnerName}
                      onChange={(e) => set("heardPartnerName", e.target.value)}
                      placeholder="Referral Partner / Agent Name"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                  {form.heardAbout.includes("other") && (
                    <Input
                      value={form.heardOther}
                      onChange={(e) => set("heardOther", e.target.value)}
                      placeholder="Please specify"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                {/* ── Section 2: Purchaser Identity ── */}
                <SectionHeading number="2">Purchaser Identity</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="fullLegalName" required>Full Legal Name</FieldLabel>
                  <Input
                    id="fullLegalName"
                    value={form.fullLegalName}
                    onChange={(e) => set("fullLegalName", e.target.value)}
                    placeholder="As it appears on your passport or government ID"
                    required
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="coPurchaserName">Name of Co-Purchaser (if applicable)</FieldLabel>
                  <Input
                    id="coPurchaserName"
                    value={form.coPurchaserName}
                    onChange={(e) => set("coPurchaserName", e.target.value)}
                    placeholder="Full legal name"
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="nationality" required>Nationality</FieldLabel>
                    <Input
                      id="nationality"
                      value={form.nationality}
                      onChange={(e) => set("nationality", e.target.value)}
                      placeholder="e.g. Ghanaian"
                      required
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="countryOfResidence" required>Country of Current Residence</FieldLabel>
                    <Input
                      id="countryOfResidence"
                      value={form.countryOfResidence}
                      onChange={(e) => set("countryOfResidence", e.target.value)}
                      placeholder="e.g. United Kingdom"
                      required
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="mobile">Mobile Number (incl. WhatsApp)</FieldLabel>
                  <Input
                    id="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => set("mobile", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="preferredContact">Preferred Contact Method</FieldLabel>
                  <CheckboxGroup
                    name="preferredContact"
                    options={[
                      { label: "Email", value: "email" },
                      { label: "WhatsApp", value: "whatsapp" },
                      { label: "Phone", value: "phone" },
                    ]}
                    values={form.preferredContact}
                    onChange={(v) => set("preferredContact", v)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="purchasingAs">Are you purchasing:</FieldLabel>
                  <RadioGroup
                    name="purchasingAs"
                    options={[
                      { label: "As an Individual", value: "individual" },
                      { label: "Jointly (with spouse/partner)", value: "jointly" },
                      { label: "Through a Company / Trust / LLC", value: "entity" },
                    ]}
                    value={form.purchasingAs}
                    onChange={(v) => set("purchasingAs", v)}
                    disabled={disabled}
                  />
                </div>

                {form.purchasingAs === "entity" && (
                  <div
                    className="rounded-lg p-4 space-y-4"
                    style={{ backgroundColor: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    <p className="text-xs font-semibold tracking-wider uppercase text-[#c9a84c]">
                      If purchasing through an entity:
                    </p>
                    <div className="space-y-2">
                      <FieldLabel htmlFor="entityName">Entity Name</FieldLabel>
                      <Input
                        id="entityName"
                        value={form.entityName}
                        onChange={(e) => set("entityName", e.target.value)}
                        placeholder="Company / Trust / LLC name"
                        disabled={disabled}
                        style={inputStyle}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel htmlFor="entityCountry">Country of Registration</FieldLabel>
                      <Input
                        id="entityCountry"
                        value={form.entityCountry}
                        onChange={(e) => set("entityCountry", e.target.value)}
                        placeholder="e.g. United States"
                        disabled={disabled}
                        style={inputStyle}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel htmlFor="entityRegNumber">Registration Number</FieldLabel>
                      <Input
                        id="entityRegNumber"
                        value={form.entityRegNumber}
                        onChange={(e) => set("entityRegNumber", e.target.value)}
                        placeholder="Company registration number"
                        disabled={disabled}
                        style={inputStyle}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {/* ── Section 3: Financial Qualification ── */}
                <SectionHeading number="3">Financial Qualification</SectionHeading>
                <Divider />

                <div className="space-y-3">
                  <FieldLabel htmlFor="budgetRange">What is your approximate budget range?</FieldLabel>
                  <RadioGroup
                    name="budgetRange"
                    options={[
                      { label: "Under $200,000", value: "under-200k" },
                      { label: "$200,000 – $350,000", value: "200k-350k" },
                      { label: "$350,000 – $500,000", value: "350k-500k" },
                      { label: "$500,000 – $750,000", value: "500k-750k" },
                      { label: "$750,000 – $1,000,000", value: "750k-1m" },
                      { label: "Over $1,000,000", value: "over-1m" },
                    ]}
                    value={form.budgetRange}
                    onChange={(v) => set("budgetRange", v)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="sourceOfFunds">Primary source of funds:</FieldLabel>
                  <CheckboxGroup
                    name="sourceOfFunds"
                    options={[
                      { label: "Personal savings / investments", value: "savings" },
                      { label: "Mortgage / bank financing", value: "mortgage" },
                      { label: "Sale of existing property", value: "property-sale" },
                      { label: "Gift / inheritance", value: "gift" },
                      { label: "Business income", value: "business" },
                    ]}
                    values={form.sourceOfFunds}
                    onChange={(v) => set("sourceOfFunds", v)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="fundingTimeline">Funding timeline:</FieldLabel>
                  <RadioGroup
                    name="fundingTimeline"
                    options={[
                      { label: "Funds immediately available", value: "immediate" },
                      { label: "30–60 days notice required", value: "30-60-days" },
                      { label: "60–90 days notice required", value: "60-90-days" },
                      { label: "Seeking financing / Pre-approval in process", value: "seeking-financing" },
                    ]}
                    value={form.fundingTimeline}
                    onChange={(v) => set("fundingTimeline", v)}
                    disabled={disabled}
                  />
                </div>

                {/* ── Section 4: Purchase Intent & Usage ── */}
                <SectionHeading number="4">Purchase Intent & Usage</SectionHeading>
                <Divider />

                <div className="space-y-3">
                  <FieldLabel htmlFor="intendedUsage">Intended usage of the property:</FieldLabel>
                  <RadioGroup
                    name="intendedUsage"
                    options={[
                      { label: "Place in managed rental program (maximise income)", value: "rental-program" },
                      { label: "Primarily personal use (owner-occupied)", value: "personal-use" },
                      { label: "Mix of personal use and rental", value: "mixed" },
                      { label: "Unsure / Seeking guidance", value: "unsure" },
                    ]}
                    value={form.intendedUsage}
                    onChange={(v) => set("intendedUsage", v)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="targetTimeline">Target timeline for investment:</FieldLabel>
                  <RadioGroup
                    name="targetTimeline"
                    options={[
                      { label: "Within 3 months", value: "3-months" },
                      { label: "3–6 months", value: "3-6-months" },
                      { label: "6–12 months", value: "6-12-months" },
                      { label: "Flexible / Researching options", value: "flexible" },
                    ]}
                    value={form.targetTimeline}
                    onChange={(v) => set("targetTimeline", v)}
                    disabled={disabled}
                  />
                </div>

                {/* ── Section 5: Property Preferences ── */}
                <SectionHeading number="5">Property Preferences</SectionHeading>
                <Divider />
                <p className="text-xs text-[#5a6580]">
                  This section helps DPN match you with the most suitable opportunities across all projects.
                </p>

                <div className="space-y-3">
                  <FieldLabel htmlFor="propertyType">Property type of interest:</FieldLabel>
                  <CheckboxGroup
                    name="propertyType"
                    options={[
                      { label: "Chalet / Villa", value: "chalet-villa" },
                      { label: "Hotel Residence / Serviced Apartment", value: "hotel-serviced" },
                      { label: "Standalone Home", value: "standalone-home" },
                      { label: "Land Only", value: "land" },
                      { label: "Commercial / Mixed-Use", value: "commercial" },
                      { label: "Open to options", value: "open" },
                    ]}
                    values={form.propertyType}
                    onChange={(v) => set("propertyType", v)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="preferredLocations">Preferred location(s):</FieldLabel>
                  <CheckboxGroup
                    name="preferredLocations"
                    options={[
                      { label: "Greater Accra", value: "greater-accra" },
                      { label: "Akwapim Hills / Aburi / Eastern Region", value: "akwapim" },
                      { label: "Kumasi / Ashanti Region", value: "kumasi" },
                      { label: "Takoradi / Western Region", value: "takoradi" },
                      { label: "Northern Ghana", value: "northern-ghana" },
                      { label: "DPN Recommendation", value: "dpn-recommendation" },
                    ]}
                    values={form.preferredLocations}
                    onChange={(v) => set("preferredLocations", v)}
                    disabled={disabled}
                  />
                  {form.preferredLocations.includes("dpn-recommendation") && (
                    <Input
                      value={form.dpnRecommendation}
                      onChange={(e) => set("dpnRecommendation", e.target.value)}
                      placeholder="Any area notes or preferences for DPN to consider"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="minBedrooms">Minimum bedrooms required:</FieldLabel>
                  <RadioGroup
                    name="minBedrooms"
                    options={[
                      { label: "Studio", value: "studio" },
                      { label: "1 Bedroom", value: "1" },
                      { label: "2 Bedrooms", value: "2" },
                      { label: "3 Bedrooms", value: "3" },
                      { label: "4+ Bedrooms", value: "4+" },
                    ]}
                    value={form.minBedrooms}
                    onChange={(v) => set("minBedrooms", v)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="amenities">Key amenities of interest (select all that apply):</FieldLabel>
                  <CheckboxGroup
                    name="amenities"
                    options={[
                      { label: "Gated / Secure Community", value: "gated" },
                      { label: "Swimming Pool", value: "pool" },
                      { label: "Spa / Wellness Facilities", value: "spa" },
                      { label: "Gym / Fitness Centre", value: "gym" },
                      { label: "Restaurant / Bar on site", value: "restaurant" },
                      { label: "Event / Conference Facilities", value: "events" },
                      { label: "Garden / Green Space", value: "garden" },
                      { label: "Proximity to Airport", value: "near-airport" },
                      { label: "Proximity to Schools", value: "near-schools" },
                      { label: "Other", value: "other" },
                    ]}
                    values={form.amenities}
                    onChange={(v) => set("amenities", v)}
                    disabled={disabled}
                  />
                  {form.amenities.includes("other") && (
                    <Input
                      value={form.amenitiesOther}
                      onChange={(e) => set("amenitiesOther", e.target.value)}
                      placeholder="Please specify"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                {/* ── Section 6: Legal & Compliance ── */}
                <SectionHeading number="6">Legal & Compliance Acknowledgement</SectionHeading>
                <Divider />

                <div className="space-y-4">
                  {[
                    {
                      id: "legalAck1" as keyof FormData,
                      text: "I understand this form is for qualification purposes only and does not constitute an offer or reservation.",
                    },
                    {
                      id: "legalAck2" as keyof FormData,
                      text: "I understand that DPN Global and its partner developers may request identity verification and source of funds documentation as part of standard due diligence.",
                    },
                    {
                      id: "legalAck3" as keyof FormData,
                      text: "I acknowledge that any deposit made will be held in a designated escrow or client trust account until project milestones are met, subject to the specific terms of the Sale & Purchase Agreement.",
                    },
                    {
                      id: "legalAck4" as keyof FormData,
                      text: "I understand I should obtain independent legal advice before signing any binding contract.",
                    },
                  ].map((ack) => (
                    <div key={ack.id} className="flex items-start gap-3">
                      <Checkbox
                        id={ack.id}
                        checked={!!form[ack.id]}
                        onCheckedChange={(v) => set(ack.id, !!v as FormData[typeof ack.id])}
                        disabled={disabled}
                        className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                      />
                      <Label htmlFor={ack.id} className="text-sm leading-snug cursor-pointer text-[#5a6580]">
                        {ack.text} <span className="text-red-500 font-bold">*</span>
                      </Label>
                    </div>
                  ))}
                </div>

                {/* ── Section 7: Additional Information ── */}
                <SectionHeading number="7">Additional Information</SectionHeading>
                <Divider />

                <div className="space-y-3">
                  <FieldLabel htmlFor="hasDpnRep">Do you have a DPN Global representative assisting you?</FieldLabel>
                  <RadioGroup
                    name="hasDpnRep"
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    value={form.hasDpnRep}
                    onChange={(v) => set("hasDpnRep", v)}
                    disabled={disabled}
                  />
                  {form.hasDpnRep === "yes" && (
                    <Input
                      value={form.dpnRepName}
                      onChange={(e) => set("dpnRepName", e.target.value)}
                      placeholder="Representative name"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="hasAgent">Have you been referred by an agent or third party?</FieldLabel>
                  <RadioGroup
                    name="hasAgent"
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    value={form.hasAgent}
                    onChange={(v) => set("hasAgent", v)}
                    disabled={disabled}
                  />
                  {form.hasAgent === "yes" && (
                    <Input
                      value={form.agentName}
                      onChange={(e) => set("agentName", e.target.value)}
                      placeholder="Agent / third party name"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="additionalComments">Any additional comments or questions?</FieldLabel>
                  <Textarea
                    id="additionalComments"
                    value={form.additionalComments}
                    onChange={(e) => set("additionalComments", e.target.value)}
                    placeholder="Share any additional details, questions, or context that may help our team assist you better."
                    rows={4}
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="wantsConsultation">Would you like to schedule a consultation call?</FieldLabel>
                  <RadioGroup
                    name="wantsConsultation"
                    options={[
                      { label: "Yes, please contact me", value: "yes" },
                      { label: "No, I am just researching for now", value: "no" },
                    ]}
                    value={form.wantsConsultation}
                    onChange={(v) => set("wantsConsultation", v)}
                    disabled={disabled}
                  />
                </div>

                {/* ── Section 8: Data Protection & Privacy ── */}
                <SectionHeading number="8">Data Protection & Privacy</SectionHeading>
                <Divider />

                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    id="dataConsent"
                    checked={form.dataConsent}
                    onCheckedChange={(v) => set("dataConsent", !!v)}
                    disabled={disabled}
                    className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                  />
                  <Label htmlFor="dataConsent" className="text-sm leading-snug cursor-pointer text-[#5a6580]">
                    I consent to DPN Global storing my information and contacting me regarding property opportunities
                    that match my stated preferences. I understand I may withdraw consent at any time.{" "}
                    <span className="text-red-500 font-bold">*</span>
                  </Label>
                </div>

                {/* ── Submit ── */}
                <div className="pt-4 space-y-3">
                  <div
                    className="rounded-lg p-4 text-center space-y-1"
                    style={{ backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    <p className="text-sm font-semibold text-[#c9a84c]">Ready to Submit</p>
                    <p className="text-xs text-[#5a6580]">
                      Our team will review your qualification and be in touch with matched opportunities.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-semibold text-sm tracking-wide transition-all"
                    disabled={!canSubmit}
                    style={{
                      background: canSubmit
                        ? "linear-gradient(135deg, #c9a84c, #e6c97a)"
                        : "rgba(201,168,76,0.3)",
                      color: canSubmit ? "#0d1b3e" : "#9aa3b8",
                      border: "none",
                    }}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Submitting…
                      </>
                    ) : (
                      "Submit Qualification Form"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs pb-6 text-[#5a6580]">
          Your information is kept strictly confidential and never sold.
        </p>
      </div>
    </main>
  );
}
