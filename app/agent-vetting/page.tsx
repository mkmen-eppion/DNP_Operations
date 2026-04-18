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
  backgroundColor: "#0d1b3e",
  borderColor: "rgba(201,168,76,0.3)",
  color: "#f5f0e8",
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
  return <hr style={{ borderColor: "rgba(201,168,76,0.15)" }} />;
}

function FieldLabel({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} style={{ color: "#f5f0e8" }}>
      {children}{" "}
      {required && <span className="text-red-400 font-bold">*</span>}
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
          <span className="text-sm" style={{ color: "#f5f0e8" }}>{opt.label}</span>
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
          <span className="text-sm" style={{ color: "#f5f0e8" }}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

type FormData = {
  // Section 1: Agent / Representative Identity
  fullLegalName: string;
  tradingName: string;
  entityType: string; // single choice
  entityTypeOther: string;
  countryOfRegistration: string;
  companyRegNumber: string;
  yearsInOperation: string;

  // Section 2: Key Point of Contact
  primaryContactName: string;
  primaryContactTitle: string;
  primaryContactEmail: string;
  primaryContactMobile: string;
  secondaryContactName: string;
  secondaryContactEmail: string;
  secondaryContactMobile: string;

  // Section 3: Business Address & Contact Information
  businessAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  mainTelephone: string;
  alternativeTelephone: string;
  generalBusinessEmail: string;

  // Section 4: Online Presence
  websiteUrl: string;
  linkedinCompany: string;
  linkedinProfile: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  otherPlatform: string;

  // Section 5: Professional Credentials & Licensing
  hasLicense: string;
  licenseIssuingBody: string;
  licenseCountryState: string;
  isMemberAssociation: string;
  associationNames: string;
  hasIndemnityInsurance: string;

  // Section 6: Network & Client Reach
  clientDemographic: string[];
  clientDemographicOther: string;
  estimatedClientCount: string;
  engagementChannels: string[];
  engagementChannelsOther: string;
  previousGhanaTransaction: string;
  ghanaTransactionDetails: string;

  // Section 7: DPN Global Project Interest
  projectsInterested: string[];
  heardAboutOpportunity: string[];
  heardRepName: string;
  heardPartnerName: string;
  heardOther: string;

  // Section 8: Engagement Terms & Commission Acknowledgement
  ackCommission1: boolean;
  ackCommission2: boolean;
  ackCommission3: boolean;
  ackRole1: boolean;
  ackRole2: boolean;
  ackRole3: boolean;
  ackCompliance1: boolean;
  ackCompliance2: boolean;
  ackCompliance3: boolean;

  // Section 9: Declaration
  declareAccuracy: boolean;
  declareNoGuarantee: boolean;
  declareVerification: boolean;
  declareNotify: boolean;
};

const initial: FormData = {
  fullLegalName: "",
  tradingName: "",
  entityType: "",
  entityTypeOther: "",
  countryOfRegistration: "",
  companyRegNumber: "",
  yearsInOperation: "",
  primaryContactName: "",
  primaryContactTitle: "",
  primaryContactEmail: "",
  primaryContactMobile: "",
  secondaryContactName: "",
  secondaryContactEmail: "",
  secondaryContactMobile: "",
  businessAddress: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "",
  mainTelephone: "",
  alternativeTelephone: "",
  generalBusinessEmail: "",
  websiteUrl: "",
  linkedinCompany: "",
  linkedinProfile: "",
  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
  tiktok: "",
  otherPlatform: "",
  hasLicense: "",
  licenseIssuingBody: "",
  licenseCountryState: "",
  isMemberAssociation: "",
  associationNames: "",
  hasIndemnityInsurance: "",
  clientDemographic: [],
  clientDemographicOther: "",
  estimatedClientCount: "",
  engagementChannels: [],
  engagementChannelsOther: "",
  previousGhanaTransaction: "",
  ghanaTransactionDetails: "",
  projectsInterested: [],
  heardAboutOpportunity: [],
  heardRepName: "",
  heardPartnerName: "",
  heardOther: "",
  ackCommission1: false,
  ackCommission2: false,
  ackCommission3: false,
  ackRole1: false,
  ackRole2: false,
  ackRole3: false,
  ackCompliance1: false,
  ackCompliance2: false,
  ackCompliance3: false,
  declareAccuracy: false,
  declareNoGuarantee: false,
  declareVerification: false,
  declareNotify: false,
};

export default function AgentVettingPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const allDeclarations =
    form.declareAccuracy &&
    form.declareNoGuarantee &&
    form.declareVerification &&
    form.declareNotify;

  const allAcks =
    form.ackCommission1 &&
    form.ackCommission2 &&
    form.ackCommission3 &&
    form.ackRole1 &&
    form.ackRole2 &&
    form.ackRole3 &&
    form.ackCompliance1 &&
    form.ackCompliance2 &&
    form.ackCompliance3;

  // Section 3 required when entity is a formal business (not sole-proprietor or influencer)
  const requiresBusinessAddress = form.entityType !== "" &&
    form.entityType !== "sole-proprietor" &&
    form.entityType !== "influencer";

  const section3Valid = !requiresBusinessAddress || (
    form.businessAddress.trim() &&
    form.city.trim() &&
    form.stateProvince.trim() &&
    form.postalCode.trim() &&
    form.country.trim() &&
    form.mainTelephone.trim() &&
    form.generalBusinessEmail.trim()
  );

  const canSubmit =
    form.fullLegalName.trim() &&
    form.entityType !== "" &&
    form.yearsInOperation !== "" &&
    form.primaryContactEmail.trim() &&
    form.primaryContactName.trim() &&
    section3Valid &&
    // Section 5 all required
    form.hasLicense !== "" &&
    form.isMemberAssociation !== "" &&
    form.hasIndemnityInsurance !== "" &&
    // Section 6
    form.clientDemographic.length > 0 &&
    form.previousGhanaTransaction !== "" &&
    // Section 7
    form.projectsInterested.length > 0 &&
    form.heardAboutOpportunity.length > 0 &&
    allAcks &&
    allDeclarations &&
    status !== "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    const res = await fetch("/api/agent-vetting", {
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
    <main
      className="min-h-screen flex items-center justify-center p-4 py-10"
      style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}
    >
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
          className="shadow-2xl border"
          style={{ backgroundColor: "#112050", borderColor: "rgba(201,168,76,0.3)" }}
        >
          <div
            className="h-1 w-full rounded-t-lg"
            style={{ background: "linear-gradient(90deg, #c9a84c, #e6c97a, #c9a84c)" }}
          />

          <CardHeader className="pb-2 text-center pt-6">
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#c9a84c" }}>
              DPN Global
            </p>
            <CardTitle className="text-2xl font-bold tracking-tight leading-tight" style={{ color: "#c9a84c" }}>
              Third-Party Agent / Representative Vetting Form
            </CardTitle>
            <p className="text-xs font-semibold mt-2" style={{ color: "#c9a84c" }}>
              Sub-Agent / Referral Partner Application
            </p>
            <CardDescription className="text-sm leading-relaxed mt-3 text-left" style={{ color: "#9aa3b8" }}>
              This form is used to onboard and vet third-party individuals or entities who wish to introduce
              qualified purchasers to DPN Global projects, including The Courtyard by Sai Wine. Approval is
              required prior to any commission-eligible activity.
            </CardDescription>
            <p className="text-xs mt-3 text-left" style={{ color: "#9aa3b8" }}>
              Fields marked <span className="text-red-400 font-bold">*</span> are required.
            </p>
          </CardHeader>

          <CardContent className="pb-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="size-14" style={{ color: "#c9a84c" }} />
                <p className="text-lg font-semibold" style={{ color: "#f5f0e8" }}>
                  Application submitted successfully.
                </p>
                <p className="text-sm" style={{ color: "#9aa3b8" }}>
                  Our team will review your application and be in touch. Thank you for your interest in
                  partnering with DPN Global.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">

                {/* ── Section 1: Agent / Representative Identity ── */}
                <SectionHeading number="1">Agent / Representative Identity</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="fullLegalName" required>Full Legal Name of Applicant</FieldLabel>
                  <Input
                    id="fullLegalName"
                    value={form.fullLegalName}
                    onChange={(e) => set("fullLegalName", e.target.value)}
                    placeholder="As it appears on government-issued ID"
                    required
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="tradingName">Trading Name / Company Name (if applicable)</FieldLabel>
                  <Input
                    id="tradingName"
                    value={form.tradingName}
                    onChange={(e) => set("tradingName", e.target.value)}
                    placeholder="Trading or company name"
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="entityType" required>Type of Entity:</FieldLabel>
                  <RadioGroup
                    name="entityType"
                    options={[
                      { label: "Sole Proprietor / Individual", value: "sole-proprietor" },
                      { label: "Limited Liability Company (LLC)", value: "llc" },
                      { label: "Partnership", value: "partnership" },
                      { label: "Registered Real Estate Agency", value: "real-estate-agency" },
                      { label: "Law Firm / Legal Practice", value: "law-firm" },
                      { label: "Influencer / Content Creator", value: "influencer" },
                      { label: "Other", value: "other" },
                    ]}
                    value={form.entityType}
                    onChange={(v) => set("entityType", v)}
                    disabled={disabled}
                  />
                  {form.entityType === "other" && (
                    <Input
                      value={form.entityTypeOther}
                      onChange={(e) => set("entityTypeOther", e.target.value)}
                      placeholder="Please specify entity type"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="countryOfRegistration">Country of Registration (if applicable)</FieldLabel>
                    <Input
                      id="countryOfRegistration"
                      value={form.countryOfRegistration}
                      onChange={(e) => set("countryOfRegistration", e.target.value)}
                      placeholder="e.g. United Kingdom"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="companyRegNumber">Company Registration Number (if applicable)</FieldLabel>
                    <Input
                      id="companyRegNumber"
                      value={form.companyRegNumber}
                      onChange={(e) => set("companyRegNumber", e.target.value)}
                      placeholder="Registration number"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="yearsInOperation" required>Years in Operation:</FieldLabel>
                  <RadioGroup
                    name="yearsInOperation"
                    options={[
                      { label: "Less than 1 year", value: "less-than-1" },
                      { label: "1–3 years", value: "1-3" },
                      { label: "3–5 years", value: "3-5" },
                      { label: "5–10 years", value: "5-10" },
                      { label: "10+ years", value: "10+" },
                    ]}
                    value={form.yearsInOperation}
                    onChange={(v) => set("yearsInOperation", v)}
                    disabled={disabled}
                  />
                </div>

                {/* ── Section 2: Key Point of Contact ── */}
                <SectionHeading number="2">Key Point of Contact</SectionHeading>
                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="primaryContactName" required>Primary Contact Full Name</FieldLabel>
                    <Input
                      id="primaryContactName"
                      value={form.primaryContactName}
                      onChange={(e) => set("primaryContactName", e.target.value)}
                      placeholder="Full name"
                      required
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="primaryContactTitle">Title / Role</FieldLabel>
                    <Input
                      id="primaryContactTitle"
                      value={form.primaryContactTitle}
                      onChange={(e) => set("primaryContactTitle", e.target.value)}
                      placeholder="e.g. Director, Agent"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="primaryContactEmail" required>Direct Email Address</FieldLabel>
                    <Input
                      id="primaryContactEmail"
                      type="email"
                      value={form.primaryContactEmail}
                      onChange={(e) => set("primaryContactEmail", e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="primaryContactMobile">Direct Mobile Number (incl. WhatsApp)</FieldLabel>
                    <Input
                      id="primaryContactMobile"
                      type="tel"
                      value={form.primaryContactMobile}
                      onChange={(e) => set("primaryContactMobile", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div
                  className="rounded-lg p-4 space-y-4"
                  style={{ backgroundColor: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}
                >
                  <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#c9a84c" }}>
                    Secondary Contact (if applicable)
                  </p>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="secondaryContactName">Secondary Contact Name</FieldLabel>
                    <Input
                      id="secondaryContactName"
                      value={form.secondaryContactName}
                      onChange={(e) => set("secondaryContactName", e.target.value)}
                      placeholder="Full name"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel htmlFor="secondaryContactEmail">Secondary Contact Email</FieldLabel>
                      <Input
                        id="secondaryContactEmail"
                        type="email"
                        value={form.secondaryContactEmail}
                        onChange={(e) => set("secondaryContactEmail", e.target.value)}
                        placeholder="secondary@example.com"
                        disabled={disabled}
                        style={inputStyle}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel htmlFor="secondaryContactMobile">Secondary Contact Mobile</FieldLabel>
                      <Input
                        id="secondaryContactMobile"
                        type="tel"
                        value={form.secondaryContactMobile}
                        onChange={(e) => set("secondaryContactMobile", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        disabled={disabled}
                        style={inputStyle}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section 3: Business Address & Contact Information ── */}
                <SectionHeading number="3">Business Address & Contact Information</SectionHeading>
                <Divider />

                {requiresBusinessAddress && (
                  <p className="text-xs" style={{ color: "#9aa3b8" }}>
                    Required for your selected entity type (except Alternative Telephone).
                  </p>
                )}

                <div className="space-y-2">
                  <FieldLabel htmlFor="businessAddress" required={requiresBusinessAddress}>Primary Business Address</FieldLabel>
                  <Input
                    id="businessAddress"
                    value={form.businessAddress}
                    onChange={(e) => set("businessAddress", e.target.value)}
                    placeholder="Street address"
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="city" required={requiresBusinessAddress}>City</FieldLabel>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="City"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="stateProvince" required={requiresBusinessAddress}>State / Province</FieldLabel>
                    <Input
                      id="stateProvince"
                      value={form.stateProvince}
                      onChange={(e) => set("stateProvince", e.target.value)}
                      placeholder="State or province"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="postalCode" required={requiresBusinessAddress}>Postal / Zip Code</FieldLabel>
                    <Input
                      id="postalCode"
                      value={form.postalCode}
                      onChange={(e) => set("postalCode", e.target.value)}
                      placeholder="Postal code"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="country" required={requiresBusinessAddress}>Country</FieldLabel>
                    <Input
                      id="country"
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      placeholder="Country"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="mainTelephone" required={requiresBusinessAddress}>Main Office Telephone</FieldLabel>
                    <Input
                      id="mainTelephone"
                      type="tel"
                      value={form.mainTelephone}
                      onChange={(e) => set("mainTelephone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="alternativeTelephone">Alternative Telephone</FieldLabel>
                    <Input
                      id="alternativeTelephone"
                      type="tel"
                      value={form.alternativeTelephone}
                      onChange={(e) => set("alternativeTelephone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="generalBusinessEmail" required={requiresBusinessAddress}>General Business Email</FieldLabel>
                  <Input
                    id="generalBusinessEmail"
                    type="email"
                    value={form.generalBusinessEmail}
                    onChange={(e) => set("generalBusinessEmail", e.target.value)}
                    placeholder="info@yourcompany.com"
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                {/* ── Section 4: Online Presence ── */}
                <SectionHeading number="4">Online Presence</SectionHeading>
                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="websiteUrl">Company Website URL</FieldLabel>
                    <Input id="websiteUrl" value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://yourwebsite.com" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="linkedinCompany">LinkedIn Company Page</FieldLabel>
                    <Input id="linkedinCompany" value={form.linkedinCompany} onChange={(e) => set("linkedinCompany", e.target.value)} placeholder="linkedin.com/company/..." disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="linkedinProfile">LinkedIn Profile (Primary Contact)</FieldLabel>
                    <Input id="linkedinProfile" value={form.linkedinProfile} onChange={(e) => set("linkedinProfile", e.target.value)} placeholder="linkedin.com/in/..." disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="instagram">Instagram Handle</FieldLabel>
                    <Input id="instagram" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@handle" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="facebook">Facebook Page</FieldLabel>
                    <Input id="facebook" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="facebook.com/..." disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="twitter">X (Twitter) Handle</FieldLabel>
                    <Input id="twitter" value={form.twitter} onChange={(e) => set("twitter", e.target.value)} placeholder="@handle" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="youtube">YouTube Channel</FieldLabel>
                    <Input id="youtube" value={form.youtube} onChange={(e) => set("youtube", e.target.value)} placeholder="youtube.com/@channel" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="tiktok">TikTok Handle</FieldLabel>
                    <Input id="tiktok" value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="@handle" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="otherPlatform">Other Relevant Platform</FieldLabel>
                  <Input id="otherPlatform" value={form.otherPlatform} onChange={(e) => set("otherPlatform", e.target.value)} placeholder="Platform name and handle/URL" disabled={disabled} style={inputStyle} className={inputClass} />
                </div>

                {/* ── Section 5: Professional Credentials & Licensing ── */}
                <SectionHeading number="5">Professional Credentials & Licensing</SectionHeading>
                <Divider />

                <div className="space-y-3">
                  <FieldLabel htmlFor="hasLicense" required>Do you hold a professional real estate license?</FieldLabel>
                  <RadioGroup
                    name="hasLicense"
                    options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                    value={form.hasLicense}
                    onChange={(v) => set("hasLicense", v)}
                    disabled={disabled}
                  />
                  {form.hasLicense === "yes" && (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-2">
                        <FieldLabel htmlFor="licenseIssuingBody">If yes, issuing body and license number</FieldLabel>
                        <Input
                          id="licenseIssuingBody"
                          value={form.licenseIssuingBody}
                          onChange={(e) => set("licenseIssuingBody", e.target.value)}
                          placeholder="e.g. Ghana Real Estate Agency Board — GH-12345"
                          disabled={disabled}
                          style={inputStyle}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-2">
                        <FieldLabel htmlFor="licenseCountryState">Country / State of licensure</FieldLabel>
                        <Input
                          id="licenseCountryState"
                          value={form.licenseCountryState}
                          onChange={(e) => set("licenseCountryState", e.target.value)}
                          placeholder="e.g. Ghana"
                          disabled={disabled}
                          style={inputStyle}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="isMemberAssociation" required>Are you a member of any professional association?</FieldLabel>
                  <RadioGroup
                    name="isMemberAssociation"
                    options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                    value={form.isMemberAssociation}
                    onChange={(v) => set("isMemberAssociation", v)}
                    disabled={disabled}
                  />
                  {form.isMemberAssociation === "yes" && (
                    <Input
                      value={form.associationNames}
                      onChange={(e) => set("associationNames", e.target.value)}
                      placeholder="Please specify which association(s)"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="hasIndemnityInsurance" required>Do you hold professional indemnity insurance?</FieldLabel>
                  <RadioGroup
                    name="hasIndemnityInsurance"
                    options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                    value={form.hasIndemnityInsurance}
                    onChange={(v) => set("hasIndemnityInsurance", v)}
                    disabled={disabled}
                  />
                  {form.hasIndemnityInsurance === "yes" && (
                    <p className="text-xs italic" style={{ color: "#9aa3b8" }}>
                      If yes, please provide certificate upon request.
                    </p>
                  )}
                </div>

                {/* ── Section 6: Network & Client Reach ── */}
                <SectionHeading number="6">Network & Client Reach</SectionHeading>
                <Divider />

                <div className="space-y-3">
                  <FieldLabel htmlFor="clientDemographic" required>Primary client demographic (select at least one):</FieldLabel>
                  <CheckboxGroup
                    name="clientDemographic"
                    options={[
                      { label: "Ghanaian Diaspora (UK)", value: "diaspora-uk" },
                      { label: "Ghanaian Diaspora (USA)", value: "diaspora-usa" },
                      { label: "Ghanaian Diaspora (Europe)", value: "diaspora-europe" },
                      { label: "Ghanaian Diaspora (Canada)", value: "diaspora-canada" },
                      { label: "African-American / Caribbean Diaspora", value: "african-american-caribbean" },
                      { label: "Non-African International Investors", value: "international-investors" },
                      { label: "Domestic Ghanaian Buyers", value: "domestic-ghana" },
                      { label: "Corporate / Institutional Clients", value: "corporate" },
                      { label: "High-Net-Worth Individuals (HNWIs)", value: "hnwi" },
                      { label: "Other", value: "other" },
                    ]}
                    values={form.clientDemographic}
                    onChange={(v) => set("clientDemographic", v)}
                    disabled={disabled}
                  />
                  {form.clientDemographic.includes("other") && (
                    <Input
                      value={form.clientDemographicOther}
                      onChange={(e) => set("clientDemographicOther", e.target.value)}
                      placeholder="Please specify"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="estimatedClientCount">
                    Estimated number of active clients / followers seeking Ghana property opportunities
                  </FieldLabel>
                  <Input
                    id="estimatedClientCount"
                    value={form.estimatedClientCount}
                    onChange={(e) => set("estimatedClientCount", e.target.value)}
                    placeholder="e.g. 500, 1,000–5,000"
                    disabled={disabled}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="engagementChannels">Primary channels for client engagement (select all that apply):</FieldLabel>
                  <CheckboxGroup
                    name="engagementChannels"
                    options={[
                      { label: "In-person consultations", value: "in-person" },
                      { label: "WhatsApp groups", value: "whatsapp" },
                      { label: "Email newsletters", value: "email-newsletter" },
                      { label: "Social media platforms", value: "social-media" },
                      { label: "Events / Seminars / Webinars", value: "events" },
                      { label: "Community / Church networks", value: "community-church" },
                      { label: "Professional association networks", value: "professional-networks" },
                      { label: "Legal advisory services", value: "legal-advisory" },
                      { label: "Influencer content / Sponsorships", value: "influencer" },
                      { label: "Other", value: "other" },
                    ]}
                    values={form.engagementChannels}
                    onChange={(v) => set("engagementChannels", v)}
                    disabled={disabled}
                  />
                  {form.engagementChannels.includes("other") && (
                    <Input
                      value={form.engagementChannelsOther}
                      onChange={(e) => set("engagementChannelsOther", e.target.value)}
                      placeholder="Please specify"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="previousGhanaTransaction" required>Have you previously facilitated a real estate transaction in Ghana?</FieldLabel>
                  <RadioGroup
                    name="previousGhanaTransaction"
                    options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }]}
                    value={form.previousGhanaTransaction}
                    onChange={(v) => set("previousGhanaTransaction", v)}
                    disabled={disabled}
                  />
                  {form.previousGhanaTransaction === "yes" && (
                    <Textarea
                      value={form.ghanaTransactionDetails}
                      onChange={(e) => set("ghanaTransactionDetails", e.target.value)}
                      placeholder="Please provide brief details (project name, year, property type)"
                      rows={3}
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                </div>

                {/* ── Section 7: DPN Global Project Interest ── */}
                <SectionHeading number="7">DPN Global Project Interest</SectionHeading>
                <Divider />

                <div className="space-y-3">
                  <FieldLabel htmlFor="projectsInterested" required>Which DPN Global project(s) are you interested in representing?</FieldLabel>
                  <CheckboxGroup
                    name="projectsInterested"
                    options={[
                      { label: "The Courtyard by Sai Wine (Akwapim Hills, Ghana)", value: "courtyard-sai-wine" },
                      { label: "All DPN Global projects", value: "all-projects" },
                    ]}
                    values={form.projectsInterested}
                    onChange={(v) => set("projectsInterested", v)}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-3">
                  <FieldLabel htmlFor="heardAboutOpportunity" required>How did you hear about this opportunity?</FieldLabel>
                  <CheckboxGroup
                    name="heardAboutOpportunity"
                    options={[
                      { label: "DPN Global Website", value: "website" },
                      { label: "DPN Representative", value: "representative" },
                      { label: "Existing DPN Partner", value: "existing-partner" },
                      { label: "Social Media", value: "social-media" },
                      { label: "Industry Event", value: "industry-event" },
                      { label: "Other", value: "other" },
                    ]}
                    values={form.heardAboutOpportunity}
                    onChange={(v) => set("heardAboutOpportunity", v)}
                    disabled={disabled}
                  />
                  {form.heardAboutOpportunity.includes("representative") && (
                    <Input
                      value={form.heardRepName}
                      onChange={(e) => set("heardRepName", e.target.value)}
                      placeholder="DPN Representative Name"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                  {form.heardAboutOpportunity.includes("existing-partner") && (
                    <Input
                      value={form.heardPartnerName}
                      onChange={(e) => set("heardPartnerName", e.target.value)}
                      placeholder="Existing DPN Partner Name"
                      disabled={disabled}
                      style={inputStyle}
                      className={inputClass}
                    />
                  )}
                  {form.heardAboutOpportunity.includes("other") && (
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

                {/* ── Section 8: Engagement Terms & Commission Acknowledgement ── */}
                <SectionHeading number="8">Engagement Terms & Commission Acknowledgement</SectionHeading>
                <Divider />

                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#c9a84c" }}>Commission Structure</p>
                <div className="space-y-4">
                  {[
                    { id: "ackCommission1" as keyof FormData, text: "I understand that commission is payable only upon successful receipt of the required deposit from the buyer and clearance of funds." },
                    { id: "ackCommission2" as keyof FormData, text: "I understand that commission is calculated on the net purchase price exclusive of closing costs, furnishing packages, or other ancillary fees." },
                    { id: "ackCommission3" as keyof FormData, text: "I understand that the specific commission percentage will be outlined in a separate Referral Agreement and is subject to the project and unit type sold." },
                  ].map((ack) => (
                    <div key={ack.id} className="flex items-start gap-3">
                      <Checkbox
                        id={ack.id}
                        checked={!!form[ack.id]}
                        onCheckedChange={(v) => set(ack.id, !!v as FormData[typeof ack.id])}
                        disabled={disabled}
                        className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                      />
                      <Label htmlFor={ack.id} className="text-sm leading-snug cursor-pointer" style={{ color: "#9aa3b8" }}>
                        {ack.text} <span className="text-red-400 font-bold">*</span>
                      </Label>
                    </div>
                  ))}
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider pt-2" style={{ color: "#c9a84c" }}>Role Definition</p>
                <div className="space-y-4">
                  {[
                    { id: "ackRole1" as keyof FormData, text: "I agree that my role is strictly Introduction and Facilitation. I will not negotiate terms, execute contracts, or handle client funds on behalf of DPN Global or the Developer." },
                    { id: "ackRole2" as keyof FormData, text: "I agree to represent The Courtyard and DPN Global projects accurately and only using approved marketing materials provided in the official Agent Toolkit." },
                    { id: "ackRole3" as keyof FormData, text: "I understand that all formal offers, legal documentation, and transaction management will be handled directly by DPN Global's licensed transaction team." },
                  ].map((ack) => (
                    <div key={ack.id} className="flex items-start gap-3">
                      <Checkbox
                        id={ack.id}
                        checked={!!form[ack.id]}
                        onCheckedChange={(v) => set(ack.id, !!v as FormData[typeof ack.id])}
                        disabled={disabled}
                        className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                      />
                      <Label htmlFor={ack.id} className="text-sm leading-snug cursor-pointer" style={{ color: "#9aa3b8" }}>
                        {ack.text} <span className="text-red-400 font-bold">*</span>
                      </Label>
                    </div>
                  ))}
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider pt-2" style={{ color: "#c9a84c" }}>Compliance with Law</p>
                <div className="space-y-4">
                  {[
                    { id: "ackCompliance1" as keyof FormData, text: "I acknowledge that this engagement is subject to the Real Estate Agency Act, 2020 (Act 1047) of Ghana where applicable." },
                    { id: "ackCompliance2" as keyof FormData, text: "I understand that any dual commission or referral arrangement must be disclosed in writing to the purchaser as per regulatory best practice." },
                    { id: "ackCompliance3" as keyof FormData, text: "I confirm that I am not subject to any sanctions, restrictions, or disqualifications that would prevent me from acting as a property referral partner." },
                  ].map((ack) => (
                    <div key={ack.id} className="flex items-start gap-3">
                      <Checkbox
                        id={ack.id}
                        checked={!!form[ack.id]}
                        onCheckedChange={(v) => set(ack.id, !!v as FormData[typeof ack.id])}
                        disabled={disabled}
                        className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                      />
                      <Label htmlFor={ack.id} className="text-sm leading-snug cursor-pointer" style={{ color: "#9aa3b8" }}>
                        {ack.text} <span className="text-red-400 font-bold">*</span>
                      </Label>
                    </div>
                  ))}
                </div>

                {/* ── Section 9: Declaration ── */}
                <SectionHeading number="9">Declaration</SectionHeading>
                <Divider />

                <div className="space-y-4">
                  {[
                    { id: "declareAccuracy" as keyof FormData, text: "The information provided in this form is true, accurate, and complete to the best of my knowledge." },
                    { id: "declareNoGuarantee" as keyof FormData, text: "I understand that submission of this form does not guarantee approval as a DPN Global Referral Partner." },
                    { id: "declareVerification" as keyof FormData, text: "I understand that DPN Global reserves the right to verify any information provided and to decline any application at its sole discretion." },
                    { id: "declareNotify" as keyof FormData, text: "I agree to notify DPN Global promptly of any material changes to the information provided herein." },
                  ].map((decl) => (
                    <div key={decl.id} className="flex items-start gap-3">
                      <Checkbox
                        id={decl.id}
                        checked={!!form[decl.id]}
                        onCheckedChange={(v) => set(decl.id, !!v as FormData[typeof decl.id])}
                        disabled={disabled}
                        className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                      />
                      <Label htmlFor={decl.id} className="text-sm leading-snug cursor-pointer" style={{ color: "#9aa3b8" }}>
                        {decl.text} <span className="text-red-400 font-bold">*</span>
                      </Label>
                    </div>
                  ))}
                </div>

                {/* ── Submit ── */}
                <div className="pt-4 space-y-3">
                  <div
                    className="rounded-lg p-4 text-center space-y-1"
                    style={{ backgroundColor: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <p className="text-sm font-semibold" style={{ color: "#c9a84c" }}>Submit Your Application</p>
                    <p className="text-xs" style={{ color: "#9aa3b8" }}>
                      Our team will review your application and contact you regarding next steps.
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
                      "Submit Agent Application"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs pb-6" style={{ color: "#9aa3b8" }}>
          Your information is kept strictly confidential and used solely for vetting purposes.
        </p>
      </div>
    </main>
  );
}
