"use client";

import { useEffect, useRef, useState } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAdSlotId } from "@/lib/adsense/config";
import type { AdFillStatus } from "@/types/adsense";

const LARGE_SCREEN_MQ = "(min-width: 1024px)";

/**
 * Desktop-only (≥1024px) sticky sidebar ad.
 * Shown when the in-article mid ad scrolls out of view.
 * Hidden on tablet/mobile — those only use the centered in-flow mid ad.
 */
export function BlogSidebarAd({
  midAdVisible,
  midAdStatus,
}: {
  midAdVisible: boolean;
  midAdStatus: AdFillStatus;
}) {
  const sidebarSlot = getAdSlotId("sidebar");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(LARGE_SCREEN_MQ);
    const onChange = () => setIsLargeScreen(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isLargeScreen) {
      setShow(false);
      return;
    }
    const midUnavailable = midAdStatus === "unfilled" || midAdStatus === "idle";
    setShow(midUnavailable || !midAdVisible);
  }, [midAdVisible, midAdStatus, isLargeScreen]);

  if (!sidebarSlot || !isLargeScreen || !show) return null;

  return (
    <aside className="hidden lg:block w-[300px] shrink-0" aria-label="Advertisement">
      <div className="sticky top-24">
        <AdSlot
          slotId={sidebarSlot}
          format="rectangle"
          fullWidthResponsive={false}
          fixedSize={{ width: 300, height: 250 }}
          className="!my-0 max-w-[300px]"
        />
      </div>
    </aside>
  );
}

/** Tracks whether the in-article mid ad is visible in the viewport. */
export function useMidAdInView() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, inView };
}
