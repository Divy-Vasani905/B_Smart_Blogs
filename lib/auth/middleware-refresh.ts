import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { isOk } from "@/lib/api";
import type { AuthUser } from "@/types/user.types";

/**
 * When the access JWT is expired, call /api/auth/refresh and forward new cookies.
 * Used by middleware on protected routes.
 */
export async function tryRefreshAccessToken(
  req: NextRequest
): Promise<NextResponse | null> {
  const refreshToken = req.cookies.get(COOKIE_NAMES.refresh)?.value;
  if (!refreshToken) return null;

  const refreshUrl = new URL("/api/auth/refresh", req.url);
  const refreshRes = await axios.post(refreshUrl.toString(), null, {
    headers: { Cookie: req.headers.get("cookie") ?? "" },
    validateStatus: () => true,
  });

  if (!isOk(refreshRes.status)) return null;

  const setCookies = refreshRes.headers["set-cookie"] ?? [];

  let newAccessToken: string | undefined;
  for (const cookie of setCookies) {
    const prefix = `${COOKIE_NAMES.access}=`;
    if (cookie.startsWith(prefix)) {
      newAccessToken = decodeURIComponent(cookie.slice(prefix.length).split(";")[0] ?? "");
      break;
    }
  }

  if (!newAccessToken) return null;

  let payload: AuthUser;
  try {
    payload = await verifyAccessToken(newAccessToken);
  } catch {
    return null;
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-name", payload.name);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  for (const cookie of setCookies) {
    response.headers.append("Set-Cookie", cookie);
  }

  return response;
}
