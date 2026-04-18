"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <h3
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: "#c9a84c" }}
      >
        {children}
      </h3>
    </div>
  );
}

function Divider() {
  return <hr style={{ borderColor: "rgba(13,27,62,0.1)" }} />;
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
    <Label htmlFor={htmlFor} style={{ color: "#0d1b3e" }}>
      {children}{" "}
      {required && <span className="text-red-500 font-bold">*</span>}
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
        style={{ ...inputStyle, color: value ? "#0d1b3e" : "#9aa3b8" }}
        className="focus:ring-[#c9a84c]"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent style={{ backgroundColor: "#ffffff", borderColor: "rgba(13,27,62,0.12)" }}>
        {children}
      </SelectContent>
    </Select>
  );
}

function SI({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <SelectItem value={value} className="text-[#0d1b3e] focus:bg-[#f0ede6] focus:text-[#0d1b3e]">
      {children}
    </SelectItem>
  );
}

type FormData = {
  // S1
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  citizenship: string;
  // S2
  occupation: string;
  industry: string;
  yearsEmployed: string;
  investorType: string;
  // S3
  annualIncome: string;
  liquidCapital: string;
  firstAllocation: string;
  // S4
  timeline: string;
  readyToMove: string;
  // Communication
  preferredComms: string;
  // Newsletter
  subscribeNewsletter: boolean;
  // Consent
  consent: boolean;
};

const initial: FormData = {
  firstName: "", lastName: "", age: "", email: "", phone: "", city: "", state: "", country: "", citizenship: "",
  occupation: "", industry: "", yearsEmployed: "", investorType: "",
  annualIncome: "", liquidCapital: "", firstAllocation: "",
  timeline: "", readyToMove: "",
  preferredComms: "",
  subscribeNewsletter: false,
  consent: false,
};

export default function RentalPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const set = (field: keyof FormData) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.country.trim() &&
    form.citizenship.trim() &&
    form.consent &&
    status !== "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    const res = await fetch("/api/rental-waitlist", {
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
      <div className="w-full max-w-xl space-y-6">
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
              DPN-Global Presents
            </p>
            <CardTitle className="text-2xl font-bold tracking-tight leading-tight text-[#0d1b3e]">
              The Passive Rental Investment Program™
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed mt-2 text-[#5a6580]">
              Earn from Short-Term Rentals — Without Owning the Property
            </CardDescription>
            <p className="text-xs mt-3 leading-relaxed text-[#5a6580]">
              This program allows you to partner with DPN-Global to operate a short-term rental unit
              in Ghana 🇬🇭 for a 12 month period — earning income while gaining real market
              experience. Complete this form to receive early access to upcoming opportunities.
            </p>
            <p className="text-xs mt-3 text-[#5a6580]">
              Fields marked <span className="text-red-500 font-bold">*</span> are required.
            </p>
          </CardHeader>

          <CardContent className="pb-8">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle2 className="size-14 text-[#c9a84c]" />
                <p className="text-lg font-semibold text-[#0d1b3e]">
                  You&apos;re on the waitlist!
                </p>
                <p className="text-sm text-[#5a6580]">
                  Opportunities will be offered to qualified waitlist members first. Welcome to DPN-Global.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 mt-2">

                {/* ── Section 1 ── */}
                <SectionHeading number="1">Personal Information</SectionHeading>
                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
                    <Input id="firstName" value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} placeholder="Jane" required disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
                    <Input id="lastName" value={form.lastName} onChange={(e) => set("lastName")(e.target.value)} placeholder="Mensah" required disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="age">Age</FieldLabel>
                  <Input id="age" type="number" min={18} max={100} value={form.age} onChange={(e) => set("age")(e.target.value)} placeholder="35" disabled={disabled} style={inputStyle} className={inputClass} />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                  <Input id="email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder="you@example.com" required disabled={disabled} style={inputStyle} className={inputClass} />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="phone" required>Phone Number <span className="text-xs font-normal" style={{ color: "#9aa3b8" }}>(WhatsApp preferred)</span></FieldLabel>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="+1 (555) 000-0000" required disabled={disabled} style={inputStyle} className={inputClass} />
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="country" required>Country of Residence</FieldLabel>
                  <Input id="country" value={form.country} onChange={(e) => set("country")(e.target.value)} placeholder="United States" required disabled={disabled} style={inputStyle} className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="city">City</FieldLabel>
                    <Input id="city" value={form.city} onChange={(e) => set("city")(e.target.value)} placeholder="New York" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="state">State / Province</FieldLabel>
                    <Input id="state" value={form.state} onChange={(e) => set("state")(e.target.value)} placeholder="NY" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="citizenship" required>Citizenship</FieldLabel>
                  <Input id="citizenship" value={form.citizenship} onChange={(e) => set("citizenship")(e.target.value)} placeholder="Ghanaian" required disabled={disabled} style={inputStyle} className={inputClass} />
                </div>

                {/* ── Section 2 ── */}
                <SectionHeading number="2">Professional Profile</SectionHeading>
                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="occupation">Occupation</FieldLabel>
                    <Input id="occupation" value={form.occupation} onChange={(e) => set("occupation")(e.target.value)} placeholder="Engineer" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel htmlFor="industry">Industry</FieldLabel>
                    <Input id="industry" value={form.industry} onChange={(e) => set("industry")(e.target.value)} placeholder="Technology" disabled={disabled} style={inputStyle} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="yearsEmployed">Years Employed</FieldLabel>
                  <StyledSelect id="yearsEmployed" value={form.yearsEmployed} onChange={set("yearsEmployed") as (v: string) => void} placeholder="Select range" disabled={disabled}>
                    <SI value="less-than-1">Less than 1 year</SI>
                    <SI value="1-3">1–3 years</SI>
                    <SI value="3-5">3–5 years</SI>
                    <SI value="5+">5+ years</SI>
                  </StyledSelect>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="investorType">Which best describes you?</FieldLabel>
                  <StyledSelect id="investorType" value={form.investorType} onChange={set("investorType") as (v: string) => void} placeholder="Select" disabled={disabled}>
                    <SI value="first-time">First Time Investor</SI>
                    <SI value="seasoned">Seasoned Investor</SI>
                  </StyledSelect>
                </div>

                {/* ── Section 3 ── */}
                <SectionHeading number="3">Financial Snapshot <span className="normal-case font-normal text-xs tracking-normal" style={{ color: "#9aa3b8" }}>(Confidential)</span></SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="annualIncome">Annual Income</FieldLabel>
                  <StyledSelect id="annualIncome" value={form.annualIncome} onChange={set("annualIncome") as (v: string) => void} placeholder="Select range" disabled={disabled}>
                    <SI value="under-50k">Under $50,000</SI>
                    <SI value="50k-100k">$50,000 – $100,000</SI>
                    <SI value="100k-250k">$100,000 – $250,000</SI>
                    <SI value="250k+">$250,000+</SI>
                  </StyledSelect>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="liquidCapital">Total Liquid Capital Available</FieldLabel>
                  <StyledSelect id="liquidCapital" value={form.liquidCapital} onChange={set("liquidCapital") as (v: string) => void} placeholder="Select range" disabled={disabled}>
                    <SI value="under-5k">Under $5,000</SI>
                    <SI value="5k-15k">$5,000 – $15,000</SI>
                    <SI value="15k-50k">$15,000 – $50,000</SI>
                    <SI value="50k+">$50,000+</SI>
                  </StyledSelect>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="firstAllocation">Comfortable Allocating to First Investment</FieldLabel>
                  <StyledSelect id="firstAllocation" value={form.firstAllocation} onChange={set("firstAllocation") as (v: string) => void} placeholder="Select range" disabled={disabled}>
                    <SI value="2500-5000">$2,500 – $5,000</SI>
                    <SI value="5000-10000">$5,000 – $10,000</SI>
                    <SI value="10000-25000">$10,000 – $25,000</SI>
                    <SI value="25000+">$25,000+</SI>
                  </StyledSelect>
                </div>

                {/* ── Section 4 ── */}
                <SectionHeading number="4">Investment Readiness</SectionHeading>
                <Divider />

                <div className="space-y-2">
                  <FieldLabel htmlFor="timeline">How soon are you looking to participate?</FieldLabel>
                  <StyledSelect id="timeline" value={form.timeline} onChange={set("timeline") as (v: string) => void} placeholder="Select timeline" disabled={disabled}>
                    <SI value="immediately">Immediately</SI>
                    <SI value="30-60-days">Within 30–60 days</SI>
                    <SI value="3-6-months">Within 3–6 months</SI>
                    <SI value="exploring">Just exploring</SI>
                  </StyledSelect>
                </div>

                <div className="space-y-2">
                  <FieldLabel htmlFor="readyToMove">If an opportunity matched your criteria, would you be ready to move forward?</FieldLabel>
                  <StyledSelect id="readyToMove" value={form.readyToMove} onChange={set("readyToMove") as (v: string) => void} placeholder="Select" disabled={disabled}>
                    <SI value="yes">Yes</SI>
                    <SI value="maybe">Maybe</SI>
                    <SI value="no">No</SI>
                  </StyledSelect>
                </div>

                {/* ── Preferred Communication ── */}
                <div className="space-y-2">
                  <FieldLabel htmlFor="preferredComms">Preferred Mode of Communication</FieldLabel>
                  <StyledSelect id="preferredComms" value={form.preferredComms} onChange={set("preferredComms") as (v: string) => void} placeholder="Select" disabled={disabled}>
                    <SI value="whatsapp">WhatsApp</SI>
                    <SI value="email">Email</SI>
                    <SI value="phone-call">Phone Call</SI>
                  </StyledSelect>
                </div>

                {/* ── Consent ── */}
                <SectionHeading number="✓">Consent</SectionHeading>
                <Divider />

                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    id="consent"
                    checked={form.consent}
                    onCheckedChange={(v) => set("consent")(v)}
                    disabled={disabled}
                    className="mt-0.5 border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                  />
                  <Label htmlFor="consent" className="text-sm leading-snug cursor-pointer text-[#5a6580]">
                    I understand this form is for interest and pre-qualification purposes only. Submission does not guarantee participation. Investment opportunities are subject to availability, eligibility, and final program structure. <span className="text-red-500 font-bold">*</span>
                  </Label>
                </div>

                {/* ── Join The Newsletter ── */}
                <div
                  className="rounded-lg p-4 space-y-2"
                  style={{ backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)" }}
                >
                  <p className="text-sm font-semibold text-[#c9a84c]">Join The Newsletter</p>
                  <p className="text-xs text-[#5a6580]">
                    Stay up to date with DPN-Global property news, market insights, and exclusive opportunities.
                  </p>
                  <div className="flex items-center gap-2.5 pt-1">
                    <Checkbox
                      id="subscribeNewsletter"
                      checked={form.subscribeNewsletter}
                      onCheckedChange={(v) => set("subscribeNewsletter")(!!v)}
                      disabled={disabled}
                      className="border-[#c9a84c] data-[state=checked]:bg-[#c9a84c] data-[state=checked]:border-[#c9a84c]"
                    />
                    <Label htmlFor="subscribeNewsletter" className="text-sm cursor-pointer text-[#5a6580]">
                      Yes, subscribe me to the DPN-Global newsletter
                    </Label>
                  </div>
                </div>

                {/* ── Submit ── */}
                <div className="pt-4 space-y-3">
                  <div
                    className="rounded-lg p-4 text-center space-y-1"
                    style={{ backgroundColor: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    <p className="text-sm font-semibold text-[#c9a84c]">Secure Your Position</p>
                    <p className="text-xs text-[#5a6580]">
                      Opportunities will be offered to qualified waitlist members first.
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
                      "Join the Investor Waitlist"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs pb-6 text-[#5a6580]">
          Your information is kept private and never sold.
        </p>
      </div>
    </main>
  );
}
