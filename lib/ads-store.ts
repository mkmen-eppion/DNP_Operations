import { db } from "@/lib/firestore";

export type AdSlot = "leaderboard" | "medium_rect" | "native" | "half_page";

// image_only  — image fills the entire ad block, no text overlay
// text_only   — no image, text + CTA only
// text_image  — image + text/CTA together
export type AdDisplayMode = "image_only" | "text_only" | "text_image";

export type Ad = {
  id: string;
  name: string;           // internal reference name, required
  tags: string[];         // for filtering, e.g. ["real-estate", "caribbean"]
  slot: AdSlot;
  display_mode: AdDisplayMode;
  label: string;          // e.g. "Sponsored" — not required for image_only
  headline: string;       // max 45 chars — not required for image_only
  body: string;           // max 135 chars — not required for image_only
  cta_text: string;       // max 15 chars — not required for image_only
  cta_url: string;        // required always
  image_url?: string;     // required for image_only and text_image
  active_until?: string;  // ISO 8601 — if set and past, ad is suppressed
};

const COL = "ads";

function isActive(ad: Ad): boolean {
  if (!ad.active_until) return true;
  return new Date(ad.active_until) > new Date();
}

export async function getAd(slot: AdSlot): Promise<Ad | null> {
  const snap = await db().collection(COL).where("slot", "==", slot).get();
  if (snap.empty) return null;
  const ads = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Ad))
    .filter(isActive);
  return ads[0] ?? null;
}

export async function getAds(slots: AdSlot[]): Promise<Partial<Record<AdSlot, Ad[]>>> {
  const results: Partial<Record<AdSlot, Ad[]>> = {};
  await Promise.all(
    slots.map(async (slot) => {
      const snap = await db().collection(COL).where("slot", "==", slot).get();
      const ads = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Ad))
        .filter(isActive);
      if (ads.length > 0) results[slot] = ads;
    })
  );
  return results;
}

export async function getAllAds(): Promise<Ad[]> {
  const snap = await db().collection(COL).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Ad));
}

export async function upsertAd(id: string | null, data: Omit<Ad, "id">): Promise<Ad> {
  const col = db().collection(COL);
  // Firestore rejects undefined values — strip them before writing
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Omit<Ad, "id">;
  if (id) {
    await col.doc(id).set(clean, { merge: true });
    return { id, ...clean };
  }
  const ref = await col.add(clean);
  return { id: ref.id, ...clean };
}

export async function deleteAd(id: string): Promise<void> {
  await db().collection(COL).doc(id).delete();
}
