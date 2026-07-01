/**
 * AdSense configuration — enable by setting env vars in Vercel / .env.local.
 * When client ID or a slot ID is missing, that placement renders nothing (no empty boxes).
 */

export type AdSlotKey =
  | "leaderboard"
  | "articleTop"
  | "articleMid"
  | "articleBottom"
  | "sidebar";

const SLOT_ENV: Record<AdSlotKey, string> = {
  leaderboard: "NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD",
  articleTop: "NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_TOP",
  articleMid: "NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MID",
  articleBottom: "NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_BOTTOM",
  sidebar: "NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR",
};

export function getAdSenseClientId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  if (!id || id.includes("xxxx")) return undefined;
  return id;
}

export function isAdSenseEnabled(): boolean {
  return Boolean(getAdSenseClientId());
}

export function getAdSlotId(key: AdSlotKey): string | undefined {
  if (!isAdSenseEnabled()) return undefined;
  const envName = SLOT_ENV[key];
  const slot = process.env[envName]?.trim();
  if (!slot || slot.includes("xxxx")) return undefined;
  return slot;
}

/** Numeric publisher id for ads.txt (strip ca-pub- prefix if present). */
export function getAdSensePublisherIdForAdsTxt(): string | undefined {
  const raw =
    process.env.ADSENSE_PUBLISHER_ID?.trim() ||
    getAdSenseClientId()?.replace(/^ca-pub-/i, "");
  if (!raw || raw.includes("xxxx")) return undefined;
  return raw.startsWith("pub-") ? raw : `pub-${raw}`;
}
