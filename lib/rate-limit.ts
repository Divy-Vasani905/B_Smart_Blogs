import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";

// ── Rate Limiters ─────────────────────────────────────────────────────────────

const isDev = process.env.NODE_ENV !== "production";

/** Login: 5 attempts per 15 minutes per IP (100 in dev) */
const loginLimiter = new RateLimiterMemory({
  keyPrefix: "login",
  points: isDev ? 100 : 5,
  duration: 15 * 60,
  blockDuration: isDev ? 1 : 15 * 60,
});

/** Signup: 3 attempts per hour per IP (100 in dev) */
const signupLimiter = new RateLimiterMemory({
  keyPrefix: "signup",
  points: isDev ? 100 : 3,
  duration: 60 * 60,
  blockDuration: isDev ? 1 : 60 * 60,
});

/** Upload: 20 uploads per hour per user */
const uploadLimiter = new RateLimiterMemory({
  keyPrefix: "upload",
  points: 20,
  duration: 60 * 60,
});

/** General API: 100 requests per minute per IP */
const generalLimiter = new RateLimiterMemory({
  keyPrefix: "general",
  points: 100,
  duration: 60,
});

/** Google OAuth: 10 attempts per 15 minutes per IP (100 in dev) */
const googleLimiter = new RateLimiterMemory({
  keyPrefix: "google_oauth",
  points: isDev ? 100 : 10,
  duration: 15 * 60,
  blockDuration: isDev ? 1 : 15 * 60,
});

// ── Helper Functions ──────────────────────────────────────────────────────────

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function applyLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<NextResponse | null> {
  try {
    await limiter.consume(key);
    return null; // OK
  } catch (err) {
    if (err instanceof RateLimiterRes) {
      const retryAfter = Math.ceil(err.msBeforeNext / 1000);
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Reset": String(Date.now() + err.msBeforeNext),
          },
        }
      );
    }
    throw err;
  }
}

// ── Exported Limiters ─────────────────────────────────────────────────────────

export async function rateLimit(
  req: NextRequest,
  type: "login" | "signup" | "upload" | "general" | "google",
  key?: string
): Promise<NextResponse | null> {
  const ip = getIp(req);
  const limitKey = key ?? ip;

  switch (type) {
    case "login":
      return applyLimit(loginLimiter, limitKey);
    case "signup":
      return applyLimit(signupLimiter, limitKey);
    case "upload":
      return applyLimit(uploadLimiter, limitKey);
    case "google":
      return applyLimit(googleLimiter, limitKey);
    default:
      return applyLimit(generalLimiter, limitKey);
  }
}
