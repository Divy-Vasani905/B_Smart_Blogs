import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
  type IRateLimiterStoreOptions,
} from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis/client";

// ── Configuration ─────────────────────────────────────────────────────────────

const isDev = process.env.NODE_ENV !== "production";

type LimiterKind = "login" | "signup" | "upload" | "general" | "google";

type LimiterConfig = {
  keyPrefix: string;
  points: number;
  duration: number;
  blockDuration?: number;
};

type RateLimiter = {
  consume: (key: string) => Promise<RateLimiterRes>;
};

const LIMITER_CONFIGS: Record<LimiterKind, LimiterConfig> = {
  login: {
    keyPrefix: "login",
    points: isDev ? 100 : 5,
    duration: 15 * 60,
    blockDuration: isDev ? 1 : 15 * 60,
  },
  signup: {
    keyPrefix: "signup",
    points: isDev ? 100 : 3,
    duration: 60 * 60,
    blockDuration: isDev ? 1 : 60 * 60,
  },
  upload: {
    keyPrefix: "upload",
    points: 20,
    duration: 60 * 60,
  },
  general: {
    keyPrefix: "general",
    points: 100,
    duration: 60,
  },
  google: {
    keyPrefix: "google_oauth",
    points: isDev ? 100 : 10,
    duration: 15 * 60,
    blockDuration: isDev ? 1 : 15 * 60,
  },
};

// ── Limiter factory ───────────────────────────────────────────────────────────

const limiterCache = new Map<LimiterKind, RateLimiter>();
let warnedMissingRedis = false;

function createLimiter(config: LimiterConfig): RateLimiter {
  const memoryLimiter = new RateLimiterMemory(config);
  const redis = getRedisClient();

  if (redis) {
    const redisOptions: IRateLimiterStoreOptions = {
      storeClient: redis,
      ...config,
      // If Redis is briefly unavailable, fall back to per-instance memory limits.
      insuranceLimiter: memoryLimiter,
    };
    return new RateLimiterRedis(redisOptions);
  }

  if (process.env.NODE_ENV === "production" && !warnedMissingRedis) {
    warnedMissingRedis = true;
    console.warn(
      "[rate-limit] REDIS_URL is not set — using in-memory limiters. " +
        "Limits will not be shared across server instances."
    );
  }

  return memoryLimiter;
}

function getLimiter(type: LimiterKind): RateLimiter {
  let limiter = limiterCache.get(type);
  if (!limiter) {
    limiter = createLimiter(LIMITER_CONFIGS[type]);
    limiterCache.set(type, limiter);
  }
  return limiter;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function applyLimit(
  limiter: RateLimiter,
  key: string
): Promise<NextResponse | null> {
  try {
    await limiter.consume(key);
    return null;
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

// ── Public API ────────────────────────────────────────────────────────────────

export async function rateLimit(
  req: NextRequest,
  type: LimiterKind,
  key?: string
): Promise<NextResponse | null> {
  const limitKey = key ?? getIp(req);
  return applyLimit(getLimiter(type), limitKey);
}
