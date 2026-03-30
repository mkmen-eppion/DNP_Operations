import { db } from "@/lib/firestore";

export type AdConfig = {
  ad_leaderboard: boolean;
  ad_medium_rect: boolean;
  ad_native: boolean;
  ad_half_page: boolean;
  rotate_every_seconds: number; // client-side rotation interval
};

const DOC = "settings/ad_config";

const DEFAULTS: AdConfig = {
  ad_leaderboard: false,
  ad_medium_rect: false,
  ad_native: false,
  ad_half_page: false,
  rotate_every_seconds: 30,
};

export async function getAdConfig(): Promise<AdConfig> {
  const doc = await db().doc(DOC).get();
  if (!doc.exists) return { ...DEFAULTS };
  return { ...DEFAULTS, ...doc.data() } as AdConfig;
}

export async function setAdConfig(config: Partial<AdConfig>): Promise<AdConfig> {
  await db().doc(DOC).set(config, { merge: true });
  return getAdConfig();
}
