"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import type { Ad, AdSlot } from "@/lib/ads-store";
import type { AdConfig } from "@/lib/settings-store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Newsletter = {
  id: string;
  wp_title: string;
  wp_body: string;
  received_at: string;
};

// ---------------------------------------------------------------------------
// Rotation hook — cycles through an array on a given interval (seconds)
// ---------------------------------------------------------------------------

function useRotatingAd(ads: Ad[], intervalSeconds: number): Ad | null {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (ads.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % ads.length);
    }, intervalSeconds * 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [ads, intervalSeconds]);

  // Reset index when ad list changes
  useEffect(() => { setIndex(0); }, [ads]);

  if (ads.length === 0) return null;
  return ads[index];
}

// ---------------------------------------------------------------------------
// Ad slot renderers
// ---------------------------------------------------------------------------

function LeaderboardAd({ ad }: { ad: Ad }) {
  return (
    <div className="newsletter-ad newsletter-ad--leaderboard">
      <a
        href={ad.cta_url}
        target="_blank"
        rel="noopener noreferrer"
        className="newsletter-ad-leaderboard-inner"
      >
        {ad.image_url ? (
          <img src={ad.image_url} alt={ad.headline} className="newsletter-ad-leaderboard-img" />
        ) : (
          <div className="newsletter-ad-leaderboard-text">
            <span className="newsletter-ad-label">{ad.label}</span>
            <span className="newsletter-ad-headline" style={{ fontSize: 14 }}>{ad.headline}</span>
            <span className="newsletter-ad-cta" style={{ marginLeft: 16 }}>{ad.cta_text}</span>
          </div>
        )}
      </a>
    </div>
  );
}

function MediumRectAd({ ad }: { ad: Ad }) {
  // If an image is provided, render it full-bleed at 300×250 with CTA overlay
  if (ad.image_url) {
    return (
      <div className="newsletter-ad newsletter-ad--medium-rect" style={{ position: "relative" }}>
        <img src={ad.image_url} alt={ad.headline} className="newsletter-ad-img" />
        <a
          href={ad.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span className="newsletter-ad-headline" style={{ fontSize: 13, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
            {ad.headline}
          </span>
          <span className="newsletter-ad-cta" style={{ fontSize: 11, padding: "6px 12px", flexShrink: 0 }}>
            {ad.cta_text}
          </span>
        </a>
      </div>
    );
  }

  return (
    <div className="newsletter-ad newsletter-ad--medium-rect">
      <div className="newsletter-ad-inner" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12, height: "100%", boxSizing: "border-box" }}>
        <div>
          <span className="newsletter-ad-label">{ad.label}</span>
          <p className="newsletter-ad-headline">{ad.headline}</p>
          <p className="newsletter-ad-sub">{ad.body}</p>
        </div>
        <a className="newsletter-ad-cta" href={ad.cta_url} target="_blank" rel="noopener noreferrer">
          {ad.cta_text}
        </a>
      </div>
    </div>
  );
}

function NativeAd({ ad }: { ad: Ad }) {
  return (
    <div className="newsletter-ad newsletter-ad--native">
      <div className="newsletter-ad-inner">
        <div>
          <span className="newsletter-ad-label">{ad.label}</span>
          <p className="newsletter-ad-headline">{ad.headline}</p>
          <p className="newsletter-ad-sub">{ad.body}</p>
        </div>
        <a className="newsletter-ad-cta" href={ad.cta_url} target="_blank" rel="noopener noreferrer">
          {ad.cta_text}
        </a>
      </div>
    </div>
  );
}

function HalfPageAd({ ad }: { ad: Ad }) {
  return (
    <div className="newsletter-ad newsletter-ad--half-page">
      <div className="newsletter-ad-half-page-inner">
        {ad.image_url && (
          <img src={ad.image_url} alt={ad.headline} className="newsletter-ad-half-page-img" />
        )}
        <span className="newsletter-ad-label">{ad.label}</span>
        <p className="newsletter-ad-headline" style={{ fontSize: 18, margin: "8px 0 6px" }}>{ad.headline}</p>
        <p className="newsletter-ad-sub" style={{ marginBottom: 16 }}>{ad.body}</p>
        <a className="newsletter-ad-cta" href={ad.cta_url} target="_blank" rel="noopener noreferrer">
          {ad.cta_text}
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slot wrapper — handles rotation internally
// ---------------------------------------------------------------------------

function RotatingSlot({
  slot,
  ads,
  intervalSeconds,
}: {
  slot: AdSlot;
  ads: Ad[];
  intervalSeconds: number;
}) {
  const ad = useRotatingAd(ads, intervalSeconds);
  if (!ad) return null;

  switch (slot) {
    case "leaderboard":  return <LeaderboardAd ad={ad} />;
    case "medium_rect":  return <MediumRectAd ad={ad} />;
    case "native":       return <NativeAd ad={ad} />;
    case "half_page":    return <HalfPageAd ad={ad} />;
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NewsletterArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [config, setConfig] = useState<AdConfig | null>(null);
  const [adsBySlot, setAdsBySlot] = useState<Partial<Record<AdSlot, Ad[]>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      // Fetch newsletter + global config in parallel
      const [nlRes, cfgRes] = await Promise.all([
        fetch(`/api/newsletters/${id}`),
        fetch("/api/settings"),
      ]);

      if (!nlRes.ok) {
        setError("Newsletter not found.");
        setLoading(false);
        return;
      }

      const nl: Newsletter = await nlRes.json();
      const cfg: AdConfig = cfgRes.ok ? await cfgRes.json() : null;

      setNewsletter(nl);
      setConfig(cfg);

      if (cfg) {
        const enabledSlots: AdSlot[] = [];
        if (cfg.ad_leaderboard) enabledSlots.push("leaderboard");
        if (cfg.ad_medium_rect) enabledSlots.push("medium_rect");
        if (cfg.ad_native)      enabledSlots.push("native");
        if (cfg.ad_half_page)   enabledSlots.push("half_page");

        if (enabledSlots.length > 0) {
          const adsRes = await fetch(`/api/ads?slots=${enabledSlots.join(",")}`);
          if (adsRes.ok) setAdsBySlot(await adsRes.json());
        }
      }

      setLoading(false);
    }

    load().catch(() => {
      setError("Failed to load newsletter.");
      setLoading(false);
    });
  }, [id]);

  const interval = config?.rotate_every_seconds ?? 30;

  return (
    <main
      className="min-h-screen p-6 py-10"
      style={{
        background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Diaspora Property Network"
              width={200}
              height={0}
              style={{ height: "auto" }}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Back link */}
        <Link
          href="/newsletters"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[#c9a84c]"
          style={{ color: "#9aa3b8" }}
        >
          <ArrowLeft className="size-4" />
          Back to newsletters
        </Link>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" style={{ color: "#c9a84c" }} />
          </div>
        )}

        {error && (
          <p className="text-center text-sm py-16" style={{ color: "#9aa3b8" }}>
            {error}
          </p>
        )}

        {!loading && newsletter && (
          <>
            {/* Leaderboard — above the article */}
            {config?.ad_leaderboard && adsBySlot.leaderboard && (
              <RotatingSlot slot="leaderboard" ads={adsBySlot.leaderboard} intervalSeconds={interval} />
            )}

            <article
              className="rounded-xl border shadow-2xl overflow-hidden"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "rgba(201,168,76,0.3)",
              }}
            >
              {/* Article header */}
              <div
                className="px-8 py-6 border-b"
                style={{
                  background: "linear-gradient(135deg, #0d1b3e, #112050)",
                  borderColor: "rgba(201,168,76,0.2)",
                }}
              >
                <h1
                  className="text-2xl font-bold tracking-tight leading-snug"
                  style={{ color: "#c9a84c" }}
                >
                  {newsletter.wp_title}
                </h1>
                <p className="text-xs mt-2" style={{ color: "#9aa3b8" }}>
                  {new Date(newsletter.received_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Article body */}
              <div className="px-8 py-8 newsletter-body">
                <div dangerouslySetInnerHTML={{ __html: newsletter.wp_body }} />

                {/* Native ad — after body */}
                {config?.ad_native && adsBySlot.native && (
                  <div className="mt-8">
                    <RotatingSlot slot="native" ads={adsBySlot.native} intervalSeconds={interval} />
                  </div>
                )}

                {/* Medium rect — after native */}
                {config?.ad_medium_rect && adsBySlot.medium_rect && (
                  <div className="mt-6">
                    <RotatingSlot slot="medium_rect" ads={adsBySlot.medium_rect} intervalSeconds={interval} />
                  </div>
                )}
              </div>
            </article>

            {/* Half-page — pre-footer */}
            {config?.ad_half_page && adsBySlot.half_page && (
              <RotatingSlot slot="half_page" ads={adsBySlot.half_page} intervalSeconds={interval} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
