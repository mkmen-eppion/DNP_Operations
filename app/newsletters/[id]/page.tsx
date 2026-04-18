"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import type { Ad, AdSlot } from "@/lib/ads-store";
import type { AdConfig } from "@/lib/settings-store";

type Newsletter = {
  id: string;
  wp_title: string;
  wp_body: string;
  received_at: string;
};

// ---------------------------------------------------------------------------
// Rotation hook
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

  useEffect(() => { setIndex(0); }, [ads]);

  if (ads.length === 0) return null;
  return ads[index];
}

// ---------------------------------------------------------------------------
// Ad renderers
// ---------------------------------------------------------------------------

function LeaderboardAd({ ad }: { ad: Ad }) {
  if (!ad.image_url && !ad.headline) return null;
  const mode = ad.display_mode;
  return (
    <div className="newsletter-ad newsletter-ad--leaderboard">
      <a href={ad.cta_url} target="_blank" rel="noopener noreferrer" className="newsletter-ad-leaderboard-inner">
        {mode === "image_only" && ad.image_url && (
          <img src={ad.image_url} alt={ad.headline ?? ""} className="newsletter-ad-leaderboard-img" />
        )}
        {mode === "text_only" && (
          <div className="newsletter-ad-leaderboard-text">
            <span className="newsletter-ad-label">{ad.label}</span>
            <span className="newsletter-ad-headline" style={{ fontSize: 14 }}>{ad.headline}</span>
            <span className="newsletter-ad-cta" style={{ marginLeft: 16 }}>{ad.cta_text}</span>
          </div>
        )}
        {mode === "text_image" && (
          <>
            {ad.image_url && <img src={ad.image_url} alt={ad.headline ?? ""} className="newsletter-ad-leaderboard-img" style={{ maxHeight: "100%", width: "auto", flexShrink: 0 }} />}
            <div className="newsletter-ad-leaderboard-text" style={{ flex: 1 }}>
              <span className="newsletter-ad-label">{ad.label}</span>
              <span className="newsletter-ad-headline" style={{ fontSize: 14 }}>{ad.headline}</span>
              <span className="newsletter-ad-cta" style={{ marginLeft: 16 }}>{ad.cta_text}</span>
            </div>
          </>
        )}
      </a>
    </div>
  );
}

// Medium rect — floated right, text wraps around it. Injected into body HTML.
function MediumRectAd({ ad }: { ad: Ad }) {
  const mode = ad.display_mode;
  if (mode === "image_only") {
    return (
      <div className="newsletter-ad newsletter-ad--medium-rect" style={{ position: "relative", float: "right", marginLeft: 24, marginBottom: 16 }}>
        <a href={ad.cta_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: 0 }}>
          <img src={ad.image_url} alt="" className="newsletter-ad-img" />
        </a>
      </div>
    );
  }
  if (mode === "text_image") {
    return (
      <div className="newsletter-ad newsletter-ad--medium-rect" style={{ position: "relative", float: "right", marginLeft: 24, marginBottom: 16 }}>
        <img src={ad.image_url} alt={ad.headline} className="newsletter-ad-img" />
        <a
          href={ad.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, textDecoration: "none" }}
        >
          <span className="newsletter-ad-headline" style={{ fontSize: 13, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{ad.headline}</span>
          <span className="newsletter-ad-cta" style={{ fontSize: 11, padding: "6px 12px", flexShrink: 0 }}>{ad.cta_text}</span>
        </a>
      </div>
    );
  }
  // text_only
  return (
    <div className="newsletter-ad newsletter-ad--medium-rect" style={{ float: "right", marginLeft: 24, marginBottom: 16 }}>
      <div className="newsletter-ad-inner" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12, height: "100%", boxSizing: "border-box" as const }}>
        <div>
          <span className="newsletter-ad-label">{ad.label}</span>
          <p className="newsletter-ad-headline">{ad.headline}</p>
          <p className="newsletter-ad-sub">{ad.body}</p>
        </div>
        <a className="newsletter-ad-cta" href={ad.cta_url} target="_blank" rel="noopener noreferrer">{ad.cta_text}</a>
      </div>
    </div>
  );
}

// Native — full-width inline, gold left border, mid-content
function NativeAd({ ad }: { ad: Ad }) {
  const mode = ad.display_mode;
  if (mode === "image_only") {
    return (
      <div className="newsletter-ad--native-inline" style={{ padding: 0, border: "none" }}>
        <a href={ad.cta_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: 0 }}>
          <img src={ad.image_url} alt="" style={{ width: "100%", display: "block", borderRadius: 4 }} />
        </a>
      </div>
    );
  }
  if (mode === "text_image") {
    return (
      <div className="newsletter-ad--native-inline">
        <div className="newsletter-ad--native-tag">{ad.label}</div>
        <div className="newsletter-ad--native-body" style={{ alignItems: "center", gap: 16 }}>
          {ad.image_url && (
            <img src={ad.image_url} alt={ad.headline} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
          )}
          <div className="newsletter-ad--native-text" style={{ flex: 1 }}>
            <p className="newsletter-ad--native-headline">{ad.headline}</p>
            <p className="newsletter-ad--native-sub">{ad.body}</p>
          </div>
          <a className="newsletter-ad-cta newsletter-ad--native-cta" href={ad.cta_url} target="_blank" rel="noopener noreferrer">
            {ad.cta_text}
          </a>
        </div>
      </div>
    );
  }
  // text_only
  return (
    <div className="newsletter-ad--native-inline">
      <div className="newsletter-ad--native-tag">{ad.label}</div>
      <div className="newsletter-ad--native-body">
        <div className="newsletter-ad--native-text">
          <p className="newsletter-ad--native-headline">{ad.headline}</p>
          <p className="newsletter-ad--native-sub">{ad.body}</p>
        </div>
        <a className="newsletter-ad-cta newsletter-ad--native-cta" href={ad.cta_url} target="_blank" rel="noopener noreferrer">
          {ad.cta_text}
        </a>
      </div>
    </div>
  );
}

// Half page — centered between content and footer
function HalfPageAd({ ad }: { ad: Ad }) {
  const mode = ad.display_mode;
  if (mode === "image_only") {
    return (
      <div className="newsletter-ad--half-page-wrap">
        <div className="newsletter-ad--half-page-label">Advertisement</div>
        <a href={ad.cta_url} target="_blank" rel="noopener noreferrer" className="newsletter-ad--half-page-link" style={{ display: "block", lineHeight: 0 }}>
          <div className="newsletter-ad newsletter-ad--half-page" style={{ padding: 0, overflow: "hidden" }}>
            <img src={ad.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </a>
      </div>
    );
  }
  return (
    <div className="newsletter-ad--half-page-wrap">
      <div className="newsletter-ad--half-page-label">Advertisement</div>
      <a href={ad.cta_url} target="_blank" rel="noopener noreferrer" className="newsletter-ad--half-page-link">
        <div className="newsletter-ad newsletter-ad--half-page">
          <div className="newsletter-ad-half-page-inner">
            {mode === "text_image" && ad.image_url && (
              <img src={ad.image_url} alt={ad.headline} className="newsletter-ad-half-page-img" />
            )}
            <span className="newsletter-ad-label">{ad.label}</span>
            <p className="newsletter-ad-headline" style={{ fontSize: 18, margin: "8px 0 6px" }}>{ad.headline}</p>
            <p className="newsletter-ad-sub" style={{ marginBottom: 16 }}>{ad.body}</p>
            <span className="newsletter-ad-cta">{ad.cta_text}</span>
          </div>
        </div>
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slot wrapper with rotation
// ---------------------------------------------------------------------------

function RotatingSlot({ slot, ads, intervalSeconds }: { slot: AdSlot; ads: Ad[]; intervalSeconds: number }) {
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
// Body injector — injects medium rect + native into the HTML at anchor points
// ---------------------------------------------------------------------------

// Finds the Nth <hr> in the HTML and inserts content after it.
// medium_rect goes after 1st <hr> (top of body, so it floats right alongside early content)
// native goes after 3rd <hr> (mid-content break)
function injectAdsIntoBody(
  html: string,
  mediumRectHtml: string | null,
  nativeHtml: string | null,
): string {
  let result = html;
  const hrTag = '<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"/>';

  if (mediumRectHtml) {
    // Inject before the first <p> after the first <hr> so the ad floats
    // right inside the text block rather than above it
    const hrIdx = result.indexOf(hrTag);
    if (hrIdx !== -1) {
      const afterHr = hrIdx + hrTag.length;
      const pIdx = result.indexOf("<p", afterHr);
      const insertAt = pIdx !== -1 ? pIdx : afterHr;
      result = result.slice(0, insertAt) + mediumRectHtml + result.slice(insertAt);
    }
  }

  if (nativeHtml) {
    // Find 3rd <hr> (offset past the one we may have just used)
    let count = 0;
    let searchFrom = 0;
    while (count < 3) {
      const idx = result.indexOf(hrTag, searchFrom);
      if (idx === -1) break;
      count++;
      if (count === 3) {
        const insertAt = idx + hrTag.length;
        result = result.slice(0, insertAt) + nativeHtml + result.slice(insertAt);
        break;
      }
      searchFrom = idx + hrTag.length;
    }
  }

  return result;
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

  // Rotating ad state for inline slots (medium_rect, native)
  const [mrIndex, setMrIndex] = useState(0);
  const [nativeIndex, setNativeIndex] = useState(0);
  const mrTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const nativeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      const nlRes = await fetch(`/api/newsletters/${id}`);
      if (!nlRes.ok) { setError("Newsletter not found."); setLoading(false); return; }

      const nl: Newsletter = await nlRes.json();
      setNewsletter(nl);

      try {
        const cfgRes = await fetch("/api/settings");
        const cfg: AdConfig = cfgRes.ok ? await cfgRes.json() : null;
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
      } catch { /* ads/settings unavailable — article still renders */ }

      setLoading(false);
    }
    load().catch(() => { setError("Failed to load newsletter."); setLoading(false); });
  }, [id]);

  // Set up rotation timers for inline slots
  const interval = config?.rotate_every_seconds ?? 30;
  useEffect(() => {
    const mrAds = adsBySlot.medium_rect ?? [];
    if (mrAds.length > 1) {
      mrTimer.current = setInterval(() => setMrIndex((i) => (i + 1) % mrAds.length), interval * 1000);
    }
    return () => { if (mrTimer.current) clearInterval(mrTimer.current); };
  }, [adsBySlot.medium_rect, interval]);

  useEffect(() => {
    const nativeAds = adsBySlot.native ?? [];
    if (nativeAds.length > 1) {
      nativeTimer.current = setInterval(() => setNativeIndex((i) => (i + 1) % nativeAds.length), interval * 1000);
    }
    return () => { if (nativeTimer.current) clearInterval(nativeTimer.current); };
  }, [adsBySlot.native, interval]);

  const mrAd = (adsBySlot.medium_rect ?? [])[mrIndex] ?? null;
  const nativeAd = (adsBySlot.native ?? [])[nativeIndex] ?? null;

  // Build injected HTML for inline slots
  const bodyHtml = (() => {
    if (!newsletter) return "";
    const mrHtml = config?.ad_medium_rect && mrAd
      ? `<div class="newsletter-ad-mr-float">${buildMediumRectHtml(mrAd)}</div>`
      : null;
    const nativeHtml = config?.ad_native && nativeAd
      ? buildNativeHtml(nativeAd)
      : null;
    return injectAdsIntoBody(newsletter.wp_body, mrHtml, nativeHtml);
  })();

  return (
    <main className="min-h-screen p-6 py-10 bg-[#f8f7f4]">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-center">
          <Link href="/">
            <Image src="/logo.png" alt="Diaspora Property Network" width={200} height={0} style={{ height: "auto" }} className="object-contain" priority />
          </Link>
        </div>

        <Link href="/newsletters" className="inline-flex items-center gap-1.5 text-sm text-[#5a6580] transition-colors hover:text-[#c9a84c]">
          <ArrowLeft className="size-4" />
          Back to newsletters
        </Link>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-[#c9a84c]" />
          </div>
        )}
        {error && <p className="text-center text-sm py-16 text-[#5a6580]">{error}</p>}

        {!loading && newsletter && (
          <>
            {/* Leaderboard — above article */}
            {config?.ad_leaderboard && adsBySlot.leaderboard && (
              <RotatingSlot slot="leaderboard" ads={adsBySlot.leaderboard} intervalSeconds={interval} />
            )}

            <article
              className="rounded-xl border shadow-md overflow-hidden bg-white"
              style={{ borderColor: "rgba(13,27,62,0.12)" }}
            >
              <div
                className="px-8 py-6 border-b"
                style={{ background: "linear-gradient(135deg, #0d1b3e, #112050)", borderColor: "rgba(201,168,76,0.2)" }}
              >
                <h1 className="text-2xl font-bold tracking-tight leading-snug text-[#c9a84c]">
                  {newsletter.wp_title}
                </h1>
                <p className="text-xs mt-2 text-[#9aa3b8]">
                  {new Date(newsletter.received_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              {/* Body with medium rect + native injected inline */}
              <div
                className="px-8 py-8 newsletter-body"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {/* Half page — inside article card, pre-footer */}
              {config?.ad_half_page && adsBySlot.half_page && (
                <div className="px-8 pb-8">
                  <RotatingSlot slot="half_page" ads={adsBySlot.half_page} intervalSeconds={interval} />
                </div>
              )}
            </article>
          </>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// HTML string builders for dangerouslySetInnerHTML injection
// These mirror the React renderers above but as plain HTML strings
// ---------------------------------------------------------------------------

function buildMediumRectHtml(ad: Ad): string {
  const mode = ad.display_mode;
  if (mode === "image_only") {
    return `
      <div class="newsletter-ad newsletter-ad--medium-rect" style="position:relative;">
        <a href="${esc(ad.cta_url)}" target="_blank" rel="noopener noreferrer" style="display:block;line-height:0;">
          <img src="${esc(ad.image_url ?? "")}" alt="" class="newsletter-ad-img" />
        </a>
      </div>`;
  }
  if (mode === "text_image") {
    return `
      <div class="newsletter-ad newsletter-ad--medium-rect" style="position:relative;">
        <img src="${esc(ad.image_url ?? "")}" alt="${esc(ad.headline)}" class="newsletter-ad-img" />
        <a href="${esc(ad.cta_url)}" target="_blank" rel="noopener noreferrer"
           style="position:absolute;bottom:12px;left:12px;right:12px;display:flex;align-items:flex-end;justify-content:space-between;gap:8px;text-decoration:none;">
          <span class="newsletter-ad-headline" style="font-size:13px;text-shadow:0 1px 3px rgba(0,0,0,0.6);">${esc(ad.headline)}</span>
          <span class="newsletter-ad-cta" style="font-size:11px;padding:6px 12px;flex-shrink:0;">${esc(ad.cta_text)}</span>
        </a>
      </div>`;
  }
  // text_only
  return `
    <div class="newsletter-ad newsletter-ad--medium-rect">
      <div class="newsletter-ad-inner" style="flex-direction:column;align-items:flex-start;gap:12px;height:100%;box-sizing:border-box;">
        <div>
          <span class="newsletter-ad-label">${esc(ad.label)}</span>
          <p class="newsletter-ad-headline">${esc(ad.headline)}</p>
          <p class="newsletter-ad-sub">${esc(ad.body)}</p>
        </div>
        <a class="newsletter-ad-cta" href="${esc(ad.cta_url)}" target="_blank" rel="noopener noreferrer">${esc(ad.cta_text)}</a>
      </div>
    </div>`;
}

function buildNativeHtml(ad: Ad): string {
  const mode = ad.display_mode;
  if (mode === "image_only") {
    return `
      <div class="newsletter-ad--native-inline" style="padding:0;border:none;">
        <a href="${esc(ad.cta_url)}" target="_blank" rel="noopener noreferrer" style="display:block;line-height:0;">
          <img src="${esc(ad.image_url ?? "")}" alt="" style="width:100%;display:block;border-radius:4px;" />
        </a>
      </div>`;
  }
  if (mode === "text_image") {
    return `
      <div class="newsletter-ad--native-inline">
        <div class="newsletter-ad--native-tag">${esc(ad.label)}</div>
        <div class="newsletter-ad--native-body" style="align-items:center;gap:16px;">
          ${ad.image_url ? `<img src="${esc(ad.image_url)}" alt="${esc(ad.headline)}" style="width:120px;height:80px;object-fit:cover;border-radius:4px;flex-shrink:0;" />` : ""}
          <div class="newsletter-ad--native-text" style="flex:1;">
            <p class="newsletter-ad--native-headline">${esc(ad.headline)}</p>
            <p class="newsletter-ad--native-sub">${esc(ad.body)}</p>
          </div>
          <a class="newsletter-ad-cta newsletter-ad--native-cta" href="${esc(ad.cta_url)}" target="_blank" rel="noopener noreferrer">${esc(ad.cta_text)}</a>
        </div>
      </div>`;
  }
  // text_only
  return `
    <div class="newsletter-ad--native-inline">
      <div class="newsletter-ad--native-tag">${esc(ad.label)}</div>
      <div class="newsletter-ad--native-body">
        <div class="newsletter-ad--native-text">
          <p class="newsletter-ad--native-headline">${esc(ad.headline)}</p>
          <p class="newsletter-ad--native-sub">${esc(ad.body)}</p>
        </div>
        <a class="newsletter-ad-cta newsletter-ad--native-cta" href="${esc(ad.cta_url)}" target="_blank" rel="noopener noreferrer">${esc(ad.cta_text)}</a>
      </div>
    </div>`;
}

function esc(str: string = ""): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
