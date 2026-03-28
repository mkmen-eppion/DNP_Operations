import { Redis } from "@upstash/redis";

export type Newsletter = {
  id: string;
  wp_title: string;
  wp_body: string;
  received_at: string;
};

const REDIS_KEY = "newsletters";

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// In-memory fallback for local dev without Redis configured
declare global {
  // eslint-disable-next-line no-var
  var __newsletters: Newsletter[] | undefined;
}
if (!global.__newsletters) global.__newsletters = [];

export async function addNewsletters(
  items: { wp_title: string; wp_body: string }[]
): Promise<Newsletter[]> {
  const added: Newsletter[] = items.map((item) => ({
    id: crypto.randomUUID(),
    wp_title: item.wp_title,
    wp_body: item.wp_body,
    received_at: new Date().toISOString(),
  }));

  const redis = getRedis();
  if (redis) {
    const existing = await redis.get<Newsletter[]>(REDIS_KEY) ?? [];
    await redis.set(REDIS_KEY, [...added, ...existing]);
  } else {
    global.__newsletters!.unshift(...added);
  }

  return added;
}

export async function getAll(): Promise<Newsletter[]> {
  const redis = getRedis();
  if (redis) {
    return (await redis.get<Newsletter[]>(REDIS_KEY)) ?? [];
  }
  return global.__newsletters ?? [];
}

export async function getById(id: string): Promise<Newsletter | undefined> {
  const all = await getAll();
  return all.find((n) => n.id === id);
}
