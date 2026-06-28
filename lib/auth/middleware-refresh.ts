import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { COOKIE_NAMES } from "@/lib/auth/cookies";
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
  const refreshRes = await fetch(refreshUrl.toString(), {
    method: "POST",
    headers: { Cookie: req.headers.get("cookie") ?? "" },
  });

  if (refreshRes.status < 200 || refreshRes.status >= 300) return null;

  const setCookies = refreshRes.headers.getSetCookie();

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
