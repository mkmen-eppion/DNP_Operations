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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Building2, Loader2 } from "lucide-react";

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
    <main className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">

        <div className="flex justify-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
            <Building2 className="size-3" />
            DNP Real Estate
          </Badge>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Real Estate Newsletter
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Get curated insights on property markets
            </CardDescription>
          </CardHeader>

          <CardContent>
            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="size-10 text-green-600" />
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  {message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-xs text-muted-foreground font-normal">required</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === "loading"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetClass">
                    Asset class <span className="text-xs text-muted-foreground font-normal">optional</span>
                  </Label>
                  <Select value={assetClass} onValueChange={setAssetClass} disabled={status === "loading"}>
                    <SelectTrigger id="assetClass">
                      <SelectValue placeholder="Select an asset class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="market">
                    Market <span className="text-xs text-muted-foreground font-normal">optional</span>
                  </Label>
                  <Select value={market} onValueChange={setMarket} disabled={status === "loading"}>
                    <SelectTrigger id="market">
                      <SelectValue placeholder="Select a market" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="united-states">United States</SelectItem>
                      <SelectItem value="caribbean">Caribbean</SelectItem>
                      <SelectItem value="south-america">South America</SelectItem>
                      <SelectItem value="middle-east">Middle East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading" || !email.trim()}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Subscribing…
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>

                {status === "error" && message && (
                  <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <XCircle className="size-4 mt-0.5 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          You can unsubscribe at any time.
        </p>
      </div>
    </main>
  );
}
