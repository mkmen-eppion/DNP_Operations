import { db } from "@/lib/firestore";
import { FieldValue } from "firebase-admin/firestore";

export type AdSlot = "leaderboard" | "medium_rect" | "native" | "half_page";

export type Newsletter = {
  id: string;
  wp_title: string;
  wp_body: string;
  received_at: string;
  ad_leaderboard: boolean;
  ad_medium_rect: boolean;
  ad_native: boolean;
  ad_half_page: boolean;
};

const COL = "newsletters";

export async function addNewsletters(
  items: {
    wp_title: string;
    wp_body: string;
    ad_leaderboard?: boolean;
    ad_medium_rect?: boolean;
    ad_native?: boolean;
    ad_half_page?: boolean;
  }[]
): Promise<Newsletter[]> {
  const firestore = db();
  const added: Newsletter[] = [];

  for (const item of items) {
    const ref = firestore.collection(COL).doc();
    const newsletter: Newsletter = {
      id: ref.id,
      wp_title: item.wp_title,
      wp_body: item.wp_body,
      received_at: new Date().toISOString(),
      ad_leaderboard: item.ad_leaderboard ?? false,
      ad_medium_rect: item.ad_medium_rect ?? false,
      ad_native: item.ad_native ?? false,
      ad_half_page: item.ad_half_page ?? false,
    };
    await ref.set({ ...newsletter, _ts: FieldValue.serverTimestamp() });
    added.push(newsletter);
  }

  return added;
}

export async function getAll(): Promise<Newsletter[]> {
  const snap = await db()
    .collection(COL)
    .orderBy("_ts", "desc")
    .get();

  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      wp_title: d.wp_title,
      wp_body: d.wp_body,
      received_at: d.received_at,
      ad_leaderboard: d.ad_leaderboard ?? false,
      ad_medium_rect: d.ad_medium_rect ?? false,
      ad_native: d.ad_native ?? false,
      ad_half_page: d.ad_half_page ?? false,
    };
  });
}

export async function getById(id: string): Promise<Newsletter | undefined> {
  const doc = await db().collection(COL).doc(id).get();
  if (!doc.exists) return undefined;
  const d = doc.data()!;
  return {
    id: doc.id,
    wp_title: d.wp_title,
    wp_body: d.wp_body,
    received_at: d.received_at,
    ad_leaderboard: d.ad_leaderboard ?? false,
    ad_medium_rect: d.ad_medium_rect ?? false,
    ad_native: d.ad_native ?? false,
    ad_half_page: d.ad_half_page ?? false,
  };
}
