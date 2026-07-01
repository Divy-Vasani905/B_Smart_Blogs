export type AdFillStatus = "idle" | "loading" | "filled" | "unfilled";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export {};
