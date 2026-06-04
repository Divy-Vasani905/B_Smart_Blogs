import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";

const ACCESS_COOKIE = process.env.COOKIE_ACCESS_NAME || "__bsf_acc";
const REFRESH_COOKIE = process.env.COOKIE_REFRESH_NAME || "__bsf_ref";
const ADMIN_COOKIE = process.env.COOKIE_ADMIN_SESSION || "__bsf_adm";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  path: "/",
};

// ── User Cookies ──────────────────────────────────────────────────────────────

export function setUserAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  // Access token: 30 days
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    ...baseCookieOptions,
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  });

  // Refresh token: 30 days
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    ...baseCookieOptions,
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  });
}

export function clearUserAuthCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
}

// ── Admin Cookies (SESSION ONLY — no maxAge = expires on browser close) ──────

/**
 * Admin uses a session cookie: closing the browser = logged out.
 * No maxAge is set intentionally to force re-login each browser session.
 */
export function setAdminSessionCookie(res: NextResponse, adminToken: string): void {
  res.cookies.set(ADMIN_COOKIE, adminToken, {
    ...baseCookieOptions,
    // NO maxAge here — this is a session cookie, expires when browser closes
  });
}

export function clearAdminSessionCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, "", { ...baseCookieOptions, maxAge: 0 });
}

// ── Cookie Name Exports (for middleware reads) ────────────────────────────────

export const COOKIE_NAMES = {
  access: ACCESS_COOKIE,
  refresh: REFRESH_COOKIE,
  admin: ADMIN_COOKIE,
} as const;
