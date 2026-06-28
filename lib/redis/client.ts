import Redis from "ioredis";

type RedisClient = Redis;

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: RedisClient | undefined;
}

/**
 * Shared Redis client for rate limiting and other server-side caches.
 * Returns null when REDIS_URL is not set (in-memory fallbacks apply).
 */
export function getRedisClient(): RedisClient | null {
  const url =
    process.env.REDIS_URL?.trim() || process.env.UPSTASH_REDIS_URL?.trim();
  if (!url) return null;

  if (globalThis.__redisClient) {
    return globalThis.__redisClient;
  }

  const client = new Redis(url, {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    lazyConnect: true,
    connectTimeout: 5000,
  });

  client.on("error", (err) => {
    console.error("[redis] connection error:", err.message);
  });

  globalThis.__redisClient = client;
  return client;
}

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.REDIS_URL?.trim() || process.env.UPSTASH_REDIS_URL?.trim()
  );
}

/**
 * Call at startup in production to surface missing Redis configuration early.
 */
export function assertRedisConfiguredInProduction(): void {
  if (process.env.NODE_ENV !== "production") return;
  if (isRedisConfigured()) return;

  console.error(
    "[redis] REDIS_URL is not set in production. " +
      "Rate limits will not be shared across server instances. " +
      "See .env.example for setup."
  );
}
