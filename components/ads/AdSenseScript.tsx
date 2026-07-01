"use client";

import Script from "next/script";
import { getAdSenseClientId, isAdSenseEnabled } from "@/lib/adsense/config";

/**
 * Loads the AdSense script once. No-op when NEXT_PUBLIC_ADSENSE_CLIENT_ID is unset.
 */
export function AdSenseScript() {
  const clientId = getAdSenseClientId();
  if (!isAdSenseEnabled() || !clientId) return null;

  return (
    <Script
      id="adsense-script"
      async
      crossOrigin="anonymous"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
    />
  );
}
