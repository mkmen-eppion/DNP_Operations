import { db } from "@/lib/firestore";

export type AdSlot = "leaderboard" | "medium_rect" | "native" | "half_page";

export type Ad = {
  id: string;           // Firestore document ID
  slot: AdSlot;
  label: string;        // e.g. "Sponsored" | "Partner Offer"
  headline: string;     // max 45 chars per spec
  body: string;         // max 135 chars per spec
  cta_text: string;     // max 15 chars per spec
  cta_url: string;      // must be HTTPS
  image_url?: string;   // optional — used by leaderboard / half-page image units
  active_until?: string; // ISO 8601 — if set and in the past, ad is suppressed
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
  if (id) {
    await col.doc(id).set(data, { merge: true });
    return { id, ...data };
  }
  const ref = await col.add(data);
  return { id: ref.id, ...data };
}

export async function deleteAd(id: string): Promise<void> {
  await db().collection(COL).doc(id).delete();
}
