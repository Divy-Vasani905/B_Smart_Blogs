import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearUserAuthCookies, clearAdminSessionCookie, COOKIE_NAMES } from "@/lib/auth/cookies";
import { revokeRefreshToken } from "@/services/refresh-token.service";
import { apiSuccess } from "@/types/api.types";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(COOKIE_NAMES.refresh)?.value;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  const res = NextResponse.json(apiSuccess(null, "Logged out successfully"));
  clearUserAuthCookies(res);
  clearAdminSessionCookie(res);
  return res;
}
