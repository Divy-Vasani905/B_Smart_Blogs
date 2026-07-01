import { NextResponse } from "next/server";
import { getAdSensePublisherIdForAdsTxt } from "@/lib/adsense/config";

export const dynamic = "force-dynamic";

/**
 * Serves ads.txt from ADSENSE_PUBLISHER_ID / client ID when configured.
 * Required for AdSense approval after deploy.
 */
export async function GET() {
  const pubId = getAdSensePublisherIdForAdsTxt();
  if (!pubId) {
    return new NextResponse("AdSense not configured", { status: 404 });
  }

  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
