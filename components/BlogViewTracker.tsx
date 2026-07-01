"use client";

import { useEffect, useRef } from "react";

/** Must match server blog_view rate-limit window (24 hours). */
const VIEW_COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface BlogViewTrackerProps {
  slug: string;
}

function storageKey(slug: string): string {
  return `bsf_blog_view_${slug.toLowerCase().trim()}`;
}

function wasCountedRecently(slug: string): boolean {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return false;
    const viewedAt = Number.parseInt(raw, 10);
    if (Number.isNaN(viewedAt)) return false;
    return Date.now() - viewedAt < VIEW_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markCounted(slug: string): void {
  try {
    localStorage.setItem(storageKey(slug), String(Date.now()));
  } catch {
    // Private browsing / storage disabled — server rate limit still applies
  }
}

/**
 * Records one view per browser per slug every 24 hours.
 * Reloads within the window do not call the API or bump MongoDB views.
 */
export function BlogViewTracker({ slug }: BlogViewTrackerProps) {
  const started = useRef(false);

  useEffect(() => {
    if (!slug || started.current) return;
    started.current = true;

    if (wasCountedRecently(slug)) return;

    fetch(`/api/blogs/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      credentials: "same-origin",
    })
      .then((res) => {
        if (res.ok) markCounted(slug);
      })
      .catch(() => {
        // Non-blocking — reading experience must not break if tracking fails
      });
  }, [slug]);

  return null;
}
