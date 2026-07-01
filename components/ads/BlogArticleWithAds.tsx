"use client";

import { useMemo, useState } from "react";
import { SafeHtml } from "@/components/SafeHtml";
import { AdSlot } from "@/components/ads/AdSlot";
import { BlogSidebarAd, useMidAdInView } from "@/components/ads/BlogSidebarAd";
import { splitHtmlForMidAd } from "@/lib/adsense/split-article-html";
import { getAdSlotId } from "@/lib/adsense/config";
import type { AdFillStatus } from "@/types/adsense";

const proseClassName =
  "prose prose-neutral prose-slate dark:prose-invert max-w-none text-black prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black prose-p:text-black prose-strong:text-black prose-a:text-primary prose-img:rounded-xl prose-pre:bg-muted prose-code:text-primary prose-code:before:content-none prose-code:after:content-none";

type BlogArticleWithAdsProps = {
  contentHtml: string;
  headerBlock?: React.ReactNode;
  footerBlock?: React.ReactNode;
};

export function BlogArticleWithAds({
  contentHtml,
  headerBlock,
  footerBlock,
}: BlogArticleWithAdsProps) {
  const topSlot = getAdSlotId("articleTop");
  const midSlot = getAdSlotId("articleMid");
  const { before, after } = useMemo(() => splitHtmlForMidAd(contentHtml), [contentHtml]);
  const { sentinelRef, inView: midAdInView } = useMidAdInView();
  const [midAdStatus, setMidAdStatus] = useState<AdFillStatus>("idle");

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      {/*
        Mobile/tablet (<1024px): single centered column.
        Desktop (≥1024px): 3-column grid keeps article centered; sidebar sits in right gutter.
      */}
      <div className="lg:grid lg:grid-cols-[1fr_min(48rem,100%)_1fr] lg:items-start lg:gap-x-0">
        <div className="hidden lg:block" aria-hidden />

        <div className="min-w-0 w-full max-w-3xl mx-auto lg:max-w-none lg:mx-0 lg:col-start-2">
          {headerBlock}

          <AdSlot slotId={topSlot} format="horizontal" fullWidthResponsive />

          {before ? <SafeHtml html={before} className={proseClassName} /> : null}

          <div ref={sentinelRef}>
            <AdSlot
              slotId={midSlot}
              format="rectangle"
              fullWidthResponsive={false}
              fixedSize={{ width: 300, height: 250 }}
              className="max-w-[300px]"
              onFillStatus={setMidAdStatus}
            />
          </div>

          {after ? <SafeHtml html={after} className={proseClassName} /> : null}

          {!before && !after && contentHtml ? (
            <SafeHtml html={contentHtml} className={proseClassName} />
          ) : null}

          {footerBlock}
        </div>

        <div className="hidden lg:flex lg:justify-start lg:pl-6">
          <BlogSidebarAd midAdVisible={midAdInView} midAdStatus={midAdStatus} />
        </div>
      </div>
    </div>
  );
}
