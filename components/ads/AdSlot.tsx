"use client";

import { useEffect, useRef, useState } from "react";
import { getAdSenseClientId } from "@/lib/adsense/config";
import type { AdFillStatus } from "@/types/adsense";

const FILL_TIMEOUT_MS = 4000;

type AdSlotProps = {
  slotId: string | undefined;
  /** AdSense ad format hint */
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  /** Responsive full-width on mobile */
  fullWidthResponsive?: boolean;
  /** Fixed dimensions — use for compact in-article video/display units */
  fixedSize?: { width: number; height: number };
  className?: string;
  /** Called when Google reports filled / unfilled */
  onFillStatus?: (status: AdFillStatus) => void;
};

/**
 * Renders a single AdSense unit. The wrapper stays hidden until an ad fills;
 * unfilled or missing config → no DOM footprint (no empty grey boxes).
 */
export function AdSlot({
  slotId,
  format = "auto",
  fullWidthResponsive = true,
  fixedSize,
  className = "",
  onFillStatus,
}: AdSlotProps) {
  const clientId = getAdSenseClientId();
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [show, setShow] = useState(false);

  const enabled = Boolean(clientId && slotId);

  useEffect(() => {
    if (!enabled || !insRef.current || pushed.current) return;

    pushed.current = true;
    onFillStatus?.("loading");

    const ins = insRef.current;
    let settled = false;

    const settle = (status: "filled" | "unfilled") => {
      if (settled) return;
      settled = true;
      if (status === "filled") {
        setShow(true);
        onFillStatus?.("filled");
      } else {
        setShow(false);
        onFillStatus?.("unfilled");
      }
    };

    const observer = new MutationObserver(() => {
      const adStatus = ins.getAttribute("data-ad-status");
      if (adStatus === "filled") settle("filled");
      if (adStatus === "unfilled") settle("unfilled");
    });
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });

    const timeout = window.setTimeout(() => {
      if (ins.getAttribute("data-ad-status") !== "filled") {
        settle("unfilled");
      }
    }, FILL_TIMEOUT_MS);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      settle("unfilled");
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [enabled, onFillStatus]);

  if (!enabled) return null;

  const isCompact = Boolean(fixedSize);
  const expandedMaxH = fixedSize ? fixedSize.height + 48 : 800;

  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
        show
          ? `opacity-100 my-6${isCompact ? " mx-auto flex justify-center" : ""}`
          : "opacity-0 max-h-0 my-0 pointer-events-none"
      } ${className}`}
      style={show ? { maxHeight: expandedMaxH } : { maxHeight: 0 }}
      aria-hidden={!show}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{
          display: "block",
          ...(fixedSize
            ? { width: fixedSize.width, height: fixedSize.height, maxWidth: "100%" }
            : {}),
        }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={
          fixedSize ? "false" : fullWidthResponsive ? "true" : "false"
        }
      />
    </div>
  );
}
