"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

function isInternalLink(href: string | null): boolean {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin;
  } catch {
    return href.startsWith("/");
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const currentPath = pathname ?? "/";
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [barTop, setBarTop] = useState(0);
  const loadingRef = useRef(false);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathRef = useRef(currentPath);

  const updateBarPosition = useCallback(() => {
    const header = document.getElementById("site-header");
    if (!header) {
      setBarTop(0);
      return;
    }
    setBarTop(Math.max(0, header.getBoundingClientRect().bottom));
  }, []);

  const start = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    updateBarPosition();

    if (completeRef.current) clearTimeout(completeRef.current);
    if (trickleRef.current) clearInterval(trickleRef.current);

    setVisible(true);
    setWidth(12);

    trickleRef.current = setInterval(() => {
      setWidth((w) => {
        if (w >= 88) return w;
        return Math.min(w + Math.random() * 6 + 2, 88);
      });
    }, 350);
  }, [updateBarPosition]);

  const complete = useCallback(() => {
    if (!loadingRef.current) return;
    loadingRef.current = false;

    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }

    setWidth(100);
    completeRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 320);
  }, []);

  useEffect(() => {
    updateBarPosition();
    window.addEventListener("scroll", updateBarPosition, { passive: true });
    window.addEventListener("resize", updateBarPosition);

    return () => {
      window.removeEventListener("scroll", updateBarPosition);
      window.removeEventListener("resize", updateBarPosition);
    };
  }, [updateBarPosition]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!isInternalLink(href) || anchor.target === "_blank") return;

      const pathOnly = (href ?? "").split("?")[0].split("#")[0] || "/";
      const current = currentPath.split("?")[0];
      if (pathOnly === current && !(href ?? "").includes("?")) return;

      start();
    };

    const onPopState = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [currentPath, start]);

  useEffect(() => {
    if (prevPathRef.current === currentPath) return;
    prevPathRef.current = currentPath;
    complete();
  }, [currentPath, complete]);

  useEffect(() => {
    return () => {
      if (trickleRef.current) clearInterval(trickleRef.current);
      if (completeRef.current) clearTimeout(completeRef.current);
    };
  }, []);

  if (!visible && width === 0) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[60] h-[2px] overflow-hidden pointer-events-none transition-[top] duration-300 ease-out"
      style={{ top: barTop }}
      role="progressbar"
      aria-hidden={!visible}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <div
        className="h-full bg-sky-500 shadow-[0_0_6px_rgba(56,189,248,0.55)] transition-[width] duration-200 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
