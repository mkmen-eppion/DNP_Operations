"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [assetClass, setAssetClass] = useState("");
  const [market, setMarket] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, assetClass, market }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You've been subscribed!");
        setEmail("");
        setAssetClass("");
        setMarket("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}>
      <div className="w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "#c9a84c" }}>
              Diaspora Property
            </p>
            <p className="text-xs tracking-[0.4em] uppercase mt-0.5" style={{ color: "#9aa3b8" }}>
              Network
            </p>
          </div>
        </div>

        <Card className="shadow-2xl border" style={{ backgroundColor: "#112050", borderColor: "rgba(201,168,76,0.3)" }}>
          {/* Gold top accent bar */}
          <div className="h-1 w-full rounded-t-lg" style={{ background: "linear-gradient(90deg, #c9a84c, #e6c97a, #c9a84c)" }} />

          <CardHeader className="pb-4 text-center pt-6">
            <CardTitle className="text-2xl font-bold tracking-tight" style={{ color: "#c9a84c" }}>
              Real Estate Newsletter
            </CardTitle>
            <CardDescription className="text-sm" style={{ color: "#9aa3b8" }}>
              Get curated insights on property markets
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 className="size-12" style={{ color: "#c9a84c" }} />
                <p className="text-sm font-medium" style={{ color: "#f5f0e8" }}>
                  {message}
                </p>
                <p className="text-xs" style={{ color: "#9aa3b8" }}>
                  Welcome to the Diaspora Property Network community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "#f5f0e8" }}>
                    Email{" "}
                    <span className="text-xs font-normal" style={{ color: "#9aa3b8" }}>required</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === "loading"}
                    style={{
                      backgroundColor: "#0d1b3e",
                      borderColor: "rgba(201,168,76,0.3)",
                      color: "#f5f0e8",
                    }}
                    className="placeholder:text-[#9aa3b8] focus-visible:ring-[#c9a84c] focus-visible:border-[#c9a84c]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetClass" style={{ color: "#f5f0e8" }}>
                    Asset class{" "}
                    <span className="text-xs font-normal" style={{ color: "#9aa3b8" }}>optional</span>
                  </Label>
                  <Select value={assetClass} onValueChange={(v) => setAssetClass(v ?? "")} disabled={status === "loading"}>
                    <SelectTrigger
                      id="assetClass"
                      style={{
                        backgroundColor: "#0d1b3e",
                        borderColor: "rgba(201,168,76,0.3)",
                        color: assetClass ? "#f5f0e8" : "#9aa3b8",
                      }}
                      className="focus:ring-[#c9a84c]"
                    >
                      <SelectValue placeholder="Select an asset class" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#112050", borderColor: "rgba(201,168,76,0.3)" }}>
                      <SelectItem value="residential" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">Residential</SelectItem>
                      <SelectItem value="commercial" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">Commercial</SelectItem>
                      <SelectItem value="mixed-use" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">Mixed Use</SelectItem>
                      <SelectItem value="land" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market" style={{ color: "#f5f0e8" }}>
                    Market{" "}
                    <span className="text-xs font-normal" style={{ color: "#9aa3b8" }}>optional</span>
                  </Label>
                  <Select value={market} onValueChange={(v) => setMarket(v ?? "")} disabled={status === "loading"}>
                    <SelectTrigger
                      id="market"
                      style={{
                        backgroundColor: "#0d1b3e",
                        borderColor: "rgba(201,168,76,0.3)",
                        color: market ? "#f5f0e8" : "#9aa3b8",
                      }}
                      className="focus:ring-[#c9a84c]"
                    >
                      <SelectValue placeholder="Select a market" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "#112050", borderColor: "rgba(201,168,76,0.3)" }}>
                      <SelectItem value="africa" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">Africa</SelectItem>
                      <SelectItem value="united-states" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">United States</SelectItem>
                      <SelectItem value="caribbean" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">Caribbean</SelectItem>
                      <SelectItem value="south-america" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">South America</SelectItem>
                      <SelectItem value="middle-east" className="text-[#f5f0e8] focus:bg-[#1a2d5a] focus:text-[#c9a84c]">Middle East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full font-semibold text-sm tracking-wide transition-all"
                  disabled={status === "loading" || !email.trim()}
                  style={{
                    background: "linear-gradient(135deg, #c9a84c, #e6c97a)",
                    color: "#0d1b3e",
                    border: "none",
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      Subscribing…
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>

                {status === "error" && message && (
                  <div className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "rgba(239,68,68,0.4)", backgroundColor: "rgba(239,68,68,0.1)", color: "#fca5a5" }}>
                    <XCircle className="size-4 mt-0.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs" style={{ color: "#9aa3b8" }}>
          You can unsubscribe at any time.
        </p>
      </div>
    </main>
  );
}
