"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

const inputStyle = {
  backgroundColor: "#0d1b3e",
  borderColor: "rgba(201,168,76,0.3)",
  color: "#f5f0e8",
};

const inputClass =
  "placeholder:text-[#9aa3b8] focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-semibold tracking-widest uppercase pt-2 pb-1"
      style={{ color: "#c9a84c" }}
    >
      {children}
    </h3>
  );
}

function Divider() {
  return <hr style={{ borderColor: "rgba(201,168,76,0.15)" }} />;
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor} style={{ color: "#f5f0e8" }}>
      {children}{" "}
      {required && (
        <span className="text-red-400 font-bold" aria-hidden="true">*</span>
      )}
    </Label>
  );
}

function StyledSelect({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  children,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "")} disabled={disabled}>
      <SelectTrigger
        id={id}
        style={{ ...inputStyle, color: value ? "#f5f0e8" : "#9aa3b8" }}
        className="focus:ring-[#c9a84c]"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent style={{ backgroundColor: "#112050", borderColor: "rgba(201,168,76,0.3)" }}>
        {children}
      </SelectContent>
    </Select>
  );
}

function SI({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <SelectItem value={value} className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">
      {children}
    </SelectItem>
  );
}

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  phone2: string;
  email: string;
  age: string;
  country: string;
  citizenshipType: string;
  citizenship1: string;
  citizenship2: string;
  occupation: string;
  yearsEmployed: string;
  annualIncome: string;
  totalAssets: string;
  creditScore: string;
  monthlyDebt: string;
  ownsHome: string;
  homeLocation: string;
  boughtGhana: string;
  buyingStructure: string;
  coApplicantIncome: string;
  purchasePrice: string;
  downPayment: string;
  loanTerm: string;
  propertyType: string;
  ghanaLocation: string;
  timeline: string;
  additionalInfo: string;
  subscribeNewsletter: boolean;
  consentWaitlist: boolean;
  consentContact: boolean;
};

const initial: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  phone2: "",
  email: "",
  age: "",
  country: "",
  citizenshipType: "",
  citizenship1: "",
  citizenship2: "",
  occupation: "",
  yearsEmployed: "",
  annualIncome: "",
  totalAssets: "",
  creditScore: "",
  monthlyDebt: "",
  ownsHome: "",
  homeLocation: "",
  boughtGhana: "",
  buyingStructure: "",
  coApplicantIncome: "",
  purchasePrice: "",
  downPayment: "",
  loanTerm: "",
  propertyType: "",
  ghanaLocation: "",
  timeline: "",
  additionalInfo: "",
  subscribeNewsletter: false,
  consentWaitlist: false,
  consentContact: false,
};

const ghanaLocations = [
  "Accra",
  "Kumasi",
  "East Legon",
  "Cantonments",
  "Airport Residential",
  "Tema",
  "Takoradi",
  "Tamale",
  "Cape Coast",
  "Koforidua",
  "Sunyani",
  "Ho",
  "Other",
];

export default function MortgagePage() {
  const [form, setForm] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const set = (field: keyof FormData) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.age.trim() &&
    form.phone.trim() &&
    form.country.trim() &&
    form.citizenshipType.trim() &&
    form.citizenship1.trim() &&
    form.occupation.trim() &&
    form.yearsEmployed.trim() &&
    form.annualIncome.trim() &&
    form.totalAssets.trim() &&
    form.creditScore.trim() &&
    form.monthlyDebt.trim() &&
    form.ownsHome.trim() &&
    form.boughtGhana.trim() &&
    form.buyingStructure.trim() &&
    form.purchasePrice.trim() &&
    form.downPayment.trim() &&
    form.loanTerm.trim() &&
    form.propertyType.trim() &&
    form.ghanaLocation.trim() &&
    form.timeline.trim() &&
    form.consentWaitlist &&
    form.consentContact &&
    status !== "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    // Simulate submission — replace with real API call when ready
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 py-10"
      style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}
    >
      <div className="w-full max-w-xl space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Diaspora Property Network"
            width={160}
            height={60}
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
            <CardTitle className="text-2xl font-bold tracking-tight" style={{ color: "#c9a84c" }}>
              DPN-Global Mortgage Program
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed" style={{ color: "#9aa3b8" }}>
              Be among the first to access a new international mortgage solution designed to help
              the African Diaspora finance property in Ghana.
            </CardDescription>
            <p className="text-xs mt-2" style={{ color: "#9aa3b8" }}>
              Fields marked <span className="text-red-400 font-bold">*</span> are required.
            </p>
          </CardHeader>

          <CardContent className="pb-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="size-14" style={{ color: "#c9a84c" }} />
                <p className="text-lg font-semibold" style={{ color: "#f5f0e8" }}>
                  You&apos;re on the list!
                </p>
                <p className="text-sm" style={{ color: "#9aa3b8" }}>
                  We&apos;ll reach out as soon as early access opens. Welcome to DPN-Global.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                {/* ── Personal Information ── */}
                <SectionHeading>Personal Information</SectionHeading>
                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => set("firstName")(e.target.value)}
                      placeholder="Jane"
                      required
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => set("lastName")(e.target.value)}
                      placeholder="Mensah"
                      required
                      disabled={status === "loading"}
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
                    onChange={(e) => set("email")(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === "loading"}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="age" required>Age</FieldLabel>
                  <Input
                    id="age"
                    type="number"
                    min={18}
                    max={100}
                    value={form.age}
                    onChange={(e) => set("age")(e.target.value)}
                    placeholder="35"
                    disabled={status === "loading"}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="phone" required>Primary Phone</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone")(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="phone2">Secondary Phone</FieldLabel>
                    <Input
                      id="phone2"
                      type="tel"
                      value={form.phone2}
                      onChange={(e) => set("phone2")(e.target.value)}
                      placeholder="+44 7700 000000"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="country" required>Country of Residence</FieldLabel>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => set("country")(e.target.value)}
                    placeholder="United States"
                    disabled={status === "loading"}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                {/* Citizenship */}
                <div className="space-y-2">
                  <FieldLabel htmlFor="citizenshipType" required>Citizenship</FieldLabel>
                  <StyledSelect
                    id="citizenshipType"
                    value={form.citizenshipType}
                    onChange={set("citizenshipType") as (v: string) => void}
                    placeholder="Single or dual citizenship?"
                    disabled={status === "loading"}
                  >
                    <SI value="single">Single Citizenship</SI>
                    <SI value="dual">Dual Citizenship</SI>
                  </StyledSelect>
                </div>

                {form.citizenshipType === "single" && (
                  <div className="space-y-2">
                    <FieldLabel htmlFor="citizenship1" required>Country of Citizenship</FieldLabel>
                    <Input
                      id="citizenship1"
                      value={form.citizenship1}
                      onChange={(e) => set("citizenship1")(e.target.value)}
                      placeholder="e.g. Ghana"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                )}

                {form.citizenshipType === "dual" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FieldLabel htmlFor="citizenship1" required>First Citizenship</FieldLabel>
                      <Input
                        id="citizenship1"
                        value={form.citizenship1}
                        onChange={(e) => set("citizenship1")(e.target.value)}
                        placeholder="e.g. Ghana"
                        disabled={status === "loading"}
                        style={inputStyle}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-2">
                      <FieldLabel htmlFor="citizenship2" required>Second Citizenship</FieldLabel>
                      <Input
                        id="citizenship2"
                        value={form.citizenship2}
                        onChange={(e) => set("citizenship2")(e.target.value)}
                        placeholder="e.g. United States"
                        disabled={status === "loading"}
                        style={inputStyle}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {/* ── Employment & Income ── */}
                <SectionHeading>Employment &amp; Income</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="occupation" required>Occupation</FieldLabel>
                  <Input
                    id="occupation"
                    value={form.occupation}
                    onChange={(e) => set("occupation")(e.target.value)}
                    placeholder="Engineer"
                    disabled={status === "loading"}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="yearsEmployed" required>Years Employed</FieldLabel>
                    <Input
                      id="yearsEmployed"
                      type="number"
                      min={0}
                      value={form.yearsEmployed}
                      onChange={(e) => set("yearsEmployed")(e.target.value)}
                      placeholder="5"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="annualIncome" required>Annual Income (USD)</FieldLabel>
                    <Input
                      id="annualIncome"
                      type="number"
                      min={0}
                      value={form.annualIncome}
                      onChange={(e) => set("annualIncome")(e.target.value)}
                      placeholder="80,000"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* ── Financial Profile ── */}
                <SectionHeading>Financial Profile</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="totalAssets" required>Total Assets Available (USD)</FieldLabel>
                  <Input
                    id="totalAssets"
                    type="number"
                    min={0}
                    value={form.totalAssets}
                    onChange={(e) => set("totalAssets")(e.target.value)}
                    placeholder="Cash, savings, investments, equity…"
                    disabled={status === "loading"}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="creditScore" required>Estimated Credit Score Range</FieldLabel>
                  <StyledSelect
                    id="creditScore"
                    value={form.creditScore}
                    onChange={set("creditScore") as (v: string) => void}
                    placeholder="Select range"
                    disabled={status === "loading"}
                  >
                    <SI value="720+">720+</SI>
                    <SI value="680-719">680–719</SI>
                    <SI value="620-679">620–679</SI>
                    <SI value="below-620">Below 620</SI>
                  </StyledSelect>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="monthlyDebt" required>Estimated Monthly Debt Obligations (USD)</FieldLabel>
                  <Input
                    id="monthlyDebt"
                    type="number"
                    min={0}
                    value={form.monthlyDebt}
                    onChange={(e) => set("monthlyDebt")(e.target.value)}
                    placeholder="1,500"
                    disabled={status === "loading"}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>

                {/* ── Property Ownership Background ── */}
                <SectionHeading>Property Ownership Background</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="ownsHome" required>Do you currently own a home in the U.S. or abroad?</FieldLabel>
                  <StyledSelect
                    id="ownsHome"
                    value={form.ownsHome}
                    onChange={set("ownsHome") as (v: string) => void}
                    placeholder="Select"
                    disabled={status === "loading"}
                  >
                    <SI value="yes">Yes</SI>
                    <SI value="no">No</SI>
                  </StyledSelect>
                </div>

                {form.ownsHome === "yes" && (
                  <div className="space-y-2">
                    <FieldLabel htmlFor="homeLocation">If yes, where is the property located?</FieldLabel>
                    <Input
                      id="homeLocation"
                      value={form.homeLocation}
                      onChange={(e) => set("homeLocation")(e.target.value)}
                      placeholder="City, Country"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <FieldLabel htmlFor="boughtGhana" required>Have you purchased property in Ghana before?</FieldLabel>
                  <StyledSelect
                    id="boughtGhana"
                    value={form.boughtGhana}
                    onChange={set("boughtGhana") as (v: string) => void}
                    placeholder="Select"
                    disabled={status === "loading"}
                  >
                    <SI value="yes">Yes</SI>
                    <SI value="no">No</SI>
                  </StyledSelect>
                </div>

                {/* ── Purchase Structure ── */}
                <SectionHeading>Purchase Structure</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="buyingStructure" required>Are you buying alone or with a co-applicant?</FieldLabel>
                  <StyledSelect
                    id="buyingStructure"
                    value={form.buyingStructure}
                    onChange={set("buyingStructure") as (v: string) => void}
                    placeholder="Select"
                    disabled={status === "loading"}
                  >
                    <SI value="alone">Alone</SI>
                    <SI value="co-applicant">With Co-Applicant</SI>
                  </StyledSelect>
                </div>

                {form.buyingStructure === "co-applicant" && (
                  <div className="space-y-2">
                    <FieldLabel htmlFor="coApplicantIncome">Co-Applicant Annual Income (USD)</FieldLabel>
                    <Input
                      id="coApplicantIncome"
                      type="number"
                      min={0}
                      value={form.coApplicantIncome}
                      onChange={(e) => set("coApplicantIncome")(e.target.value)}
                      placeholder="60,000"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                )}

                {/* ── Property & Loan Details ── */}
                <SectionHeading>Property &amp; Loan Details</SectionHeading>
                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="purchasePrice" required>Estimated Purchase Price (USD)</FieldLabel>
                    <Input
                      id="purchasePrice"
                      type="number"
                      min={0}
                      value={form.purchasePrice}
                      onChange={(e) => set("purchasePrice")(e.target.value)}
                      placeholder="250,000"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="downPayment" required>Down Payment Amount (USD)</FieldLabel>
                    <Input
                      id="downPayment"
                      type="number"
                      min={0}
                      value={form.downPayment}
                      onChange={(e) => set("downPayment")(e.target.value)}
                      placeholder="50,000"
                      disabled={status === "loading"}
                      style={inputStyle}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="loanTerm" required>Preferred Loan Term</FieldLabel>
                  <StyledSelect
                    id="loanTerm"
                    value={form.loanTerm}
                    onChange={set("loanTerm") as (v: string) => void}
                    placeholder="Select term"
                    disabled={status === "loading"}
                  >
                    <SI value="under-15">Under 15 Years</SI>
                    <SI value="15">15 Years</SI>
                    <SI value="30">30 Years</SI>
                  </StyledSelect>
                </div>

                {/* ── Purchase Intent ── */}
                <SectionHeading>Purchase Intent</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="propertyType" required>What type of property are you looking to finance?</FieldLabel>
                  <StyledSelect
                    id="propertyType"
                    value={form.propertyType}
                    onChange={set("propertyType") as (v: string) => void}
                    placeholder="Select type"
                    disabled={status === "loading"}
                  >
                    <SI value="primary-residence">Primary Residence</SI>
                    <SI value="investment">Investment Property</SI>
                    <SI value="short-term-rental">Short-Term Rental</SI>
                    <SI value="land">Land Purchase</SI>
                    <SI value="other">Other</SI>
                  </StyledSelect>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="ghanaLocation" required>Preferred Location in Ghana</FieldLabel>
                  <StyledSelect
                    id="ghanaLocation"
                    value={form.ghanaLocation}
                    onChange={set("ghanaLocation") as (v: string) => void}
                    placeholder="Select area"
                    disabled={status === "loading"}
                  >
                    {ghanaLocations.map((loc) => (
                      <SI key={loc} value={loc.toLowerCase().replace(/\s+/g, "-")}>{loc}</SI>
                    ))}
                  </StyledSelect>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="timeline" required>Estimated Purchase Timeline</FieldLabel>
                  <StyledSelect
                    id="timeline"
                    value={form.timeline}
                    onChange={set("timeline") as (v: string) => void}
                    placeholder="Select timeline"
                    disabled={status === "loading"}
                  >
                    <SI value="immediately">Immediately</SI>
                    <SI value="3-months">Within 3 Months</SI>
                    <SI value="6-months">Within 6 Months</SI>
                    <SI value="12-months">Within 12 Months</SI>
                    <SI value="exploring">Just Exploring</SI>
                  </StyledSelect>
                </div>

                {/* ── Additional Information ── */}
                <SectionHeading>Additional Information</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="additionalInfo">Tell us more about your goals or financing needs</FieldLabel>
                  <Textarea
                    id="additionalInfo"
                    value={form.additionalInfo}
                    onChange={(e) => set("additionalInfo")(e.target.value)}
                    placeholder="Share any context that would help us understand your situation…"
                    rows={4}
                    disabled={status === "loading"}
                    style={inputStyle}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* ── Consent & Preferences ── */}
                <SectionHeading>Consent &amp; Preferences</SectionHeading>
                <Divider />

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consentWaitlist"
                      checked={form.consentWaitlist}
                      onCheckedChange={(v) => set("consentWaitlist")(v)}
                      disabled={status === "loading"}
                      className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                    />
                    <Label
                      htmlFor="consentWaitlist"
                      className="text-sm leading-snug cursor-pointer"
                      style={{ color: "#9aa3b8" }}
                    >
                      I understand this is a waiting list for a mortgage product currently in
                      development. <span className="text-red-400 font-bold">*</span>
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consentContact"
                      checked={form.consentContact}
                      onCheckedChange={(v) => set("consentContact")(v)}
                      disabled={status === "loading"}
                      className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                    />
                    <Label
                      htmlFor="consentContact"
                      className="text-sm leading-snug cursor-pointer"
                      style={{ color: "#9aa3b8" }}
                    >
                      I agree to be contacted by DPN-Global regarding updates and opportunities
                      related to the mortgage program. <span className="text-red-400 font-bold">*</span>
                    </Label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="subscribeNewsletter"
                      checked={form.subscribeNewsletter}
                      onCheckedChange={(v) => set("subscribeNewsletter")(v)}
                      disabled={status === "loading"}
                      className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                    />
                    <Label
                      htmlFor="subscribeNewsletter"
                      className="text-sm leading-snug cursor-pointer"
                      style={{ color: "#9aa3b8" }}
                    >
                      Subscribe me to the DPN-Global mailing list for property news, market updates,
                      and exclusive opportunities.
                    </Label>
                  </div>
                </div>

                {/* ── Submit ── */}
                <div className="pt-2 space-y-3">
                  <p className="text-center text-xs" style={{ color: "#9aa3b8" }}>
                    No commitment. No credit check. Early access only.
                  </p>
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
                      "Secure My Spot"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs pb-6" style={{ color: "#9aa3b8" }}>
          Your information is kept private and never sold.
        </p>
      </div>
    </main>
  );
}
