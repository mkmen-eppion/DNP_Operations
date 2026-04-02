"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Plus, Trash2, Pencil, X, Check, AlertCircle, Upload, Link2 } from "lucide-react";
import type { Ad, AdSlot, AdDisplayMode } from "@/lib/ads-store";
import type { AdConfig } from "@/lib/settings-store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const SLOT_LABELS: Record<AdSlot, string> = {
  leaderboard: "Leaderboard (728×90)",
  medium_rect: "Medium Rectangle (300×250)",
  native: "Native / Sponsored (600px wide)",
  half_page: "Half Page (300×600)",
};

const SLOT_ORDER: AdSlot[] = ["leaderboard", "medium_rect", "native", "half_page"];

const DISPLAY_MODE_LABELS: Record<AdDisplayMode, string> = {
  image_only: "Image only",
  text_only:  "Text only",
  text_image: "Text + Image",
};

const EMPTY_AD: Omit<Ad, "id"> = {
  name: "",
  tags: [],
  slot: "native",
  display_mode: "text_only",
  label: "",
  headline: "",
  body: "",
  cta_text: "",
  cta_url: "",
  image_url: "",
  active_until: "",
};

// ---------------------------------------------------------------------------
// Auth gate
// ---------------------------------------------------------------------------

function AuthGate({ onAuth }: { onAuth: (key: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  async function attempt() {
    setError(false);
    const res = await fetch("/api/auth", {
      headers: { "x-api-key": input },
    });
    if (res.ok) {
      sessionStorage.setItem("admin_key", input);
      onAuth(input);
    } else {
      setError(true);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl border p-8 space-y-6 shadow-2xl"
        style={{ backgroundColor: "#0d1b3e", borderColor: "rgba(201,168,76,0.3)" }}
      >
        <div className="flex justify-center">
          <Image src="/logo.png" alt="DPN" width={160} height={0} style={{ height: "auto" }} />
        </div>
        <h1 className="text-center text-lg font-bold" style={{ color: "#c9a84c" }}>
          Admin Access
        </h1>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="API key"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && attempt()}
            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: error ? "#ef4444" : "rgba(201,168,76,0.3)",
              color: "#f5f0e8",
            }}
          />
          {error && (
            <p className="text-xs flex items-center gap-1.5" style={{ color: "#ef4444" }}>
              <AlertCircle className="size-3.5" /> Incorrect key
            </p>
          )}
          <button
            onClick={attempt}
            className="w-full rounded-lg py-2.5 text-sm font-bold transition-colors"
            style={{ background: "#c9a84c", color: "#0d1b3e" }}
          >
            Enter
          </button>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Ad form (create / edit)
// ---------------------------------------------------------------------------

const SLOT_DIMENSIONS: Record<AdSlot, string> = {
  leaderboard: "728 × 90 px",
  medium_rect: "300 × 250 px",
  native: "600 px wide",
  half_page: "300 × 600 px",
};

function AdForm({
  initial,
  apiKey,
  onSave,
  onCancel,
}: {
  initial: Omit<Ad, "id"> & { id?: string };
  apiKey: string;
  onSave: (ad: Ad) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState((initial.tags ?? []).join(", "));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preview = form.image_url ?? "";
  const mode = form.display_mode as AdDisplayMode;
  const needsImage = mode === "image_only" || mode === "text_image";
  const needsText  = mode === "text_only"  || mode === "text_image";

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function switchImageMode(m: "url" | "upload") {
    setImageMode(m);
    set("image_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { "x-api-key": apiKey }, body: fd });
    setUploading(false);
    if (!res.ok) { const d = await res.json(); setErr(d.error ?? "Upload failed."); return; }
    const { url } = await res.json();
    set("image_url", url);
  }

  async function save() {
    setSaving(true);
    setErr("");
    const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ ...form, tags, id: initial.id }),
    });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); setErr(d.error ?? "Save failed."); return; }
    onSave(await res.json());
  }

  const inputStyle = { background: "rgba(255,255,255,0.05)", borderColor: "rgba(201,168,76,0.2)", color: "#f5f0e8" };

  const field = (label: string, key: string, opts?: { placeholder?: string; max?: number; type?: string; required?: boolean }) => (
    <div className="space-y-1">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9aa3b8" }}>
        {label}
        {opts?.required && <span style={{ color: "#c9a84c" }}> *</span>}
        {opts?.max && <span className="ml-1 font-normal">({opts.max} chars)</span>}
      </label>
      <input
        type={opts?.type ?? "text"}
        placeholder={opts?.placeholder}
        maxLength={opts?.max}
        value={(form as unknown as Record<string, string>)[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
        style={inputStyle}
      />
    </div>
  );

  return (
    <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "rgba(201,168,76,0.35)", background: "#0d1b3e" }}>

      {/* ── Identity ── */}
      <div className="grid grid-cols-2 gap-3">
        {field("Ad Name", "name", { placeholder: "Caribbean Realty Q2", required: true })}
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9aa3b8" }}>
            Tags <span className="font-normal normal-case">(comma separated)</span>
          </label>
          <input
            type="text"
            placeholder="real-estate, caribbean"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Slot + Display mode ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9aa3b8" }}>Slot <span style={{ color: "#c9a84c" }}>*</span></label>
          <select
            value={form.slot}
            onChange={(e) => set("slot", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ background: "#0d1b3e", borderColor: "rgba(201,168,76,0.2)", color: "#f5f0e8" }}
          >
            {SLOT_ORDER.map((s) => <option key={s} value={s}>{SLOT_LABELS[s]}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9aa3b8" }}>Display Mode <span style={{ color: "#c9a84c" }}>*</span></label>
          <select
            value={form.display_mode}
            onChange={(e) => set("display_mode", e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ background: "#0d1b3e", borderColor: "rgba(201,168,76,0.2)", color: "#f5f0e8" }}
          >
            {(Object.entries(DISPLAY_MODE_LABELS) as [AdDisplayMode, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Text fields — shown for text_only and text_image ── */}
      {needsText && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {field("Label", "label", { placeholder: "Sponsored", max: 20, required: true })}
            {field("CTA Text", "cta_text", { placeholder: "Learn More", max: 15, required: true })}
          </div>
          {field("Headline", "headline", { placeholder: "Invest in Ghana — From Anywhere", max: 45, required: true })}
          {field("Body", "body", { placeholder: "Short benefit-led description", max: 135, required: true })}
        </>
      )}

      {/* CTA URL always required */}
      {field("CTA URL", "cta_url", { placeholder: "https://", type: "url", required: true })}

      {/* ── Image — shown for image_only and text_image ── */}
      {needsImage && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9aa3b8" }}>
              Image <span style={{ color: "#c9a84c" }}>*</span>
              <span className="ml-1 font-normal normal-case">— {SLOT_DIMENSIONS[form.slot as AdSlot]}, max 300 KB</span>
            </label>
            <div className="flex rounded-lg overflow-hidden border text-xs" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
              {(["url", "upload"] as const).map((m) => (
                <button key={m} type="button" onClick={() => switchImageMode(m)}
                  className="flex items-center gap-1 px-3 py-1.5 transition-colors"
                  style={{ background: imageMode === m ? "rgba(201,168,76,0.15)" : "transparent", color: imageMode === m ? "#c9a84c" : "#9aa3b8" }}
                >
                  {m === "url" ? <Link2 className="size-3" /> : <Upload className="size-3" />}
                  {m === "url" ? "URL" : "Upload"}
                </button>
              ))}
            </div>
          </div>

          {imageMode === "url" && (
            <input type="url" placeholder="https://..." value={form.image_url ?? ""}
              onChange={(e) => set("image_url", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={inputStyle}
            />
          )}

          {imageMode === "upload" && (
            <>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange} className="hidden" id="ad-image-upload" />
              <label htmlFor="ad-image-upload"
                className="flex items-center justify-center gap-2 w-full rounded-lg border px-3 py-3 text-sm cursor-pointer transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(201,168,76,0.2)", borderStyle: "dashed", color: "#9aa3b8" }}
              >
                {uploading ? <><Loader2 className="size-4 animate-spin" /> Uploading…</> : <><Upload className="size-4" /> Click to choose a file</>}
              </label>
            </>
          )}

          {preview && (
            <div className="relative inline-block">
              <img src={preview} alt="Preview" style={{ maxHeight: 80, borderRadius: 6, border: "1px solid rgba(201,168,76,0.2)" }} />
              <button type="button" onClick={() => { set("image_url", ""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute -top-1.5 -right-1.5 rounded-full p-0.5" style={{ background: "#ef4444", color: "#fff" }}>
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Active Until ── */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9aa3b8" }}>Active Until (optional)</label>
        <input type="datetime-local"
          value={form.active_until ? form.active_until.slice(0, 16) : ""}
          onChange={(e) => set("active_until", e.target.value ? new Date(e.target.value).toISOString() : "")}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
          style={{ ...inputStyle, colorScheme: "dark" }}
        />
      </div>

      {err && <p className="text-xs flex items-center gap-1.5" style={{ color: "#ef4444" }}><AlertCircle className="size-3.5" /> {err}</p>}

      <div className="flex gap-2 pt-1">
        <button onClick={save} disabled={saving || uploading}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50"
          style={{ background: "#c9a84c", color: "#0d1b3e" }}>
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Save
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-white/5"
          style={{ borderColor: "rgba(201,168,76,0.2)", color: "#9aa3b8" }}>
          <X className="size-3.5" /> Cancel
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main admin page
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [config, setConfig] = useState<AdConfig | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [editingAd, setEditingAd] = useState<(Omit<Ad, "id"> & { id?: string }) | null>(null);
  const [addingAd, setAddingAd] = useState(false);
  const rotateRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check session storage for saved key
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key");
    if (saved) setApiKey(saved);
    else setLoading(false);
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    loadAll();
  }, [apiKey]);

  async function loadAll() {
    setLoading(true);
    try {
      const [configRes, adsRes] = await Promise.all([
        fetch("/api/settings", { headers: { "x-api-key": apiKey! } }),
        fetch("/api/ads", { headers: { "x-api-key": apiKey! } }),
      ]);
      if (configRes.ok) setConfig(await configRes.json());
      if (adsRes.ok) setAds(await adsRes.json());
    } catch {
      // Firestore not configured yet — proceed with empty state
    }
    setLoading(false);
  }

  async function saveConfig(patch: Partial<AdConfig>) {
    if (!config) return;
    const next = { ...config, ...patch };
    setConfig(next);
    setSavingConfig(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey! },
      body: JSON.stringify(next),
    });
    setSavingConfig(false);
  }

  async function deleteAd(id: string) {
    if (!confirm("Delete this ad?")) return;
    await fetch(`/api/ads?id=${id}`, {
      method: "DELETE",
      headers: { "x-api-key": apiKey! },
    });
    setAds((prev) => prev.filter((a) => a.id !== id));
  }

  function handleAdSaved(ad: Ad) {
    setAds((prev) => {
      const idx = prev.findIndex((a) => a.id === ad.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = ad;
        return next;
      }
      return [...prev, ad];
    });
    setEditingAd(null);
    setAddingAd(false);
  }

  if (!apiKey) return <AuthGate onAuth={setApiKey} />;

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}
      >
        <Loader2 className="size-8 animate-spin" style={{ color: "#c9a84c" }} />
      </main>
    );
  }

  const adsBySlot = SLOT_ORDER.reduce((acc, slot) => {
    acc[slot] = ads.filter((a) => a.slot === slot);
    return acc;
  }, {} as Record<AdSlot, Ad[]>);

  return (
    <main
      className="min-h-screen p-6 py-10"
      style={{ background: "linear-gradient(135deg, #0a1530 0%, #0d1b3e 50%, #112050 100%)" }}
    >
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="DPN" width={160} height={0} style={{ height: "auto" }} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "#9aa3b8" }}>Admin</span>
            <button
              onClick={() => { sessionStorage.removeItem("admin_key"); setApiKey(null); }}
              className="text-xs rounded-lg border px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(201,168,76,0.2)", color: "#9aa3b8" }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* ── Global Ad Config ── */}
        <section
          className="rounded-xl border p-6 space-y-6"
          style={{ borderColor: "rgba(201,168,76,0.3)", background: "rgba(13,27,62,0.7)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: "#c9a84c" }}>
              Global Ad Settings
            </h2>
            {savingConfig && <Loader2 className="size-4 animate-spin" style={{ color: "#c9a84c" }} />}
          </div>

          <p className="text-sm" style={{ color: "#9aa3b8" }}>
            Slot toggles apply to all newsletters. Each slot renders the active ad(s) for that type.
          </p>

          {/* Slot toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SLOT_ORDER.map((slot) => (
              <label
                key={slot}
                className="flex items-center justify-between rounded-lg border px-4 py-3 cursor-pointer transition-colors hover:bg-white/5"
                style={{ borderColor: "rgba(201,168,76,0.2)" }}
              >
                <span className="text-sm" style={{ color: "#f5f0e8" }}>{SLOT_LABELS[slot]}</span>
                <button
                  role="switch"
                  aria-checked={config?.[`ad_${slot}` as keyof AdConfig] as boolean}
                  onClick={() =>
                    saveConfig({ [`ad_${slot}`]: !config?.[`ad_${slot}` as keyof AdConfig] })
                  }
                  className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0"
                  style={{
                    background: config?.[`ad_${slot}` as keyof AdConfig]
                      ? "#c9a84c"
                      : "rgba(255,255,255,0.15)",
                  }}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                    style={{
                      transform: config?.[`ad_${slot}` as keyof AdConfig]
                        ? "translateX(18px)"
                        : "translateX(2px)",
                    }}
                  />
                </button>
              </label>
            ))}
          </div>

          {/* Rotation interval */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold flex-shrink-0" style={{ color: "#f5f0e8" }}>
              Rotate every
            </label>
            <input
              type="number"
              min={5}
              max={3600}
              value={config?.rotate_every_seconds ?? 30}
              onChange={(e) => setConfig((c) => c ? { ...c, rotate_every_seconds: Number(e.target.value) } : c)}
              onBlur={(e) => saveConfig({ rotate_every_seconds: Number(e.target.value) })}
              className="w-24 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(201,168,76,0.2)",
                color: "#f5f0e8",
              }}
            />
            <span className="text-sm" style={{ color: "#9aa3b8" }}>seconds</span>
          </div>
        </section>

        {/* ── Ads Manager ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: "#c9a84c" }}>Ads Manager</h2>
            {!addingAd && !editingAd && (
              <button
                onClick={() => setAddingAd(true)}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-80"
                style={{ background: "#c9a84c", color: "#0d1b3e" }}
              >
                <Plus className="size-3.5" /> New Ad
              </button>
            )}
          </div>

          {addingAd && (
            <AdForm
              initial={{ ...EMPTY_AD }}
              apiKey={apiKey!}
              onSave={handleAdSaved}
              onCancel={() => setAddingAd(false)}
            />
          )}

          {SLOT_ORDER.map((slot) => (
            <div key={slot} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#9aa3b8" }}>
                  {SLOT_LABELS[slot]}
                </h3>
                <div
                  className="h-px flex-1"
                  style={{ background: "rgba(201,168,76,0.15)" }}
                />
                <span className="text-xs" style={{ color: "#9aa3b8" }}>
                  {adsBySlot[slot].length} ad{adsBySlot[slot].length !== 1 ? "s" : ""}
                </span>
              </div>

              {adsBySlot[slot].length === 0 && (
                <p className="text-xs italic" style={{ color: "rgba(154,163,184,0.5)" }}>
                  No ads for this slot yet.
                </p>
              )}

              {adsBySlot[slot].map((ad) =>
                editingAd?.id === ad.id ? (
                  <AdForm
                    key={ad.id}
                    initial={editingAd}
                    apiKey={apiKey!}
                    onSave={handleAdSaved}
                    onCancel={() => setEditingAd(null)}
                  />
                ) : (
                  <AdRow
                    key={ad.id}
                    ad={ad}
                    onEdit={() => setEditingAd({ ...ad })}
                    onDelete={() => deleteAd(ad.id)}
                  />
                )
              )}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Ad row (read-only display)
// ---------------------------------------------------------------------------

function AdRow({ ad, onEdit, onDelete }: { ad: Ad; onEdit: () => void; onDelete: () => void }) {
  const expired = ad.active_until ? new Date(ad.active_until) <= new Date() : false;

  return (
    <div
      className="rounded-xl border p-4 flex items-start justify-between gap-4"
      style={{
        borderColor: expired ? "rgba(239,68,68,0.3)" : "rgba(201,168,76,0.2)",
        background: "rgba(13,27,62,0.5)",
        opacity: expired ? 0.6 : 1,
      }}
    >
      <div className="space-y-1.5 min-w-0">
        {/* Name + badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold truncate" style={{ color: "#f5f0e8" }}>
            {ad.name || <span style={{ color: "#9aa3b8", fontStyle: "italic" }}>Unnamed</span>}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
          >
            {DISPLAY_MODE_LABELS[ad.display_mode]}
          </span>
          {expired && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
              style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}
            >
              Expired
            </span>
          )}
        </div>

        {/* Tags */}
        {ad.tags && ad.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ad.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.06)", color: "#9aa3b8" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content preview */}
        {(ad.display_mode === "text_only" || ad.display_mode === "text_image") && (
          <>
            {ad.headline && (
              <p className="text-xs font-semibold truncate" style={{ color: "#d4c9a8" }}>{ad.headline}</p>
            )}
            {ad.body && (
              <p className="text-xs truncate" style={{ color: "#9aa3b8" }}>{ad.body}</p>
            )}
          </>
        )}
        {(ad.display_mode === "image_only" || ad.display_mode === "text_image") && ad.image_url && (
          <img
            src={ad.image_url}
            alt="Ad preview"
            style={{ maxHeight: 48, borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)" }}
          />
        )}

        {/* CTA + expiry */}
        <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(154,163,184,0.6)" }}>
          {ad.cta_text && <span>{ad.cta_text} →</span>}
          <span className="truncate">{ad.cta_url}</span>
          {ad.active_until && (
            <span className="flex-shrink-0">
              Until {new Date(ad.active_until).toLocaleString("en-US", {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={onEdit}
          className="rounded-lg border p-1.5 transition-colors hover:bg-white/5"
          style={{ borderColor: "rgba(201,168,76,0.2)", color: "#9aa3b8" }}
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border p-1.5 transition-colors hover:bg-red-500/10"
          style={{ borderColor: "rgba(239,68,68,0.2)", color: "#ef4444" }}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
