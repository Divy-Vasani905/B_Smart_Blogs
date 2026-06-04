import { SignJWT, jwtVerify } from "jose";
import type { AuthUser } from "@/types/user.types";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

// ── Access Token ──────────────────────────────────────────────────────────────

export async function signAccessToken(payload: AuthUser): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("bsmart-finance")
    .setAudience("bsmart-client")
    .setExpirationTime(ACCESS_EXPIRES)
    .sign(ACCESS_SECRET);
}

export async function verifyAccessToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET, {
    issuer: "bsmart-finance",
    audience: "bsmart-client",
  });
  return payload as unknown as AuthUser;
}

// ── Refresh Token ─────────────────────────────────────────────────────────────

export async function signRefreshToken(payload: { userId: string }): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("bsmart-finance")
    .setAudience("bsmart-refresh")
    .setExpirationTime(REFRESH_EXPIRES)
    .sign(REFRESH_SECRET);
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string }> {
  const { payload } = await jwtVerify(token, REFRESH_SECRET, {
    issuer: "bsmart-finance",
    audience: "bsmart-refresh",
  });
  return payload as unknown as { userId: string };
}

// ── Admin Session Token (short-lived, no refresh) ─────────────────────────────

/**
 * Admin gets a dedicated short-lived token stored in a session cookie.
 * No refresh token is issued — admin must re-login on every browser session.
 */
export async function signAdminSessionToken(payload: AuthUser): Promise<string> {
  return new SignJWT({ ...payload, isAdminSession: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("bsmart-finance")
    .setAudience("bsmart-admin")
    .setExpirationTime("8h")
    .sign(ACCESS_SECRET);
}

export async function verifyAdminSessionToken(token: string): Promise<AuthUser & { isAdminSession: boolean }> {
  const { payload } = await jwtVerify(token, ACCESS_SECRET, {
    issuer: "bsmart-finance",
    audience: "bsmart-admin",
  });
  return payload as unknown as AuthUser & { isAdminSession: boolean };
}
