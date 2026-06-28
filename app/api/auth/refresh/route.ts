import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES, setUserAuthCookies } from "@/lib/auth/cookies";
import { performTokenRefresh } from "@/lib/auth/perform-refresh";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const rawRefreshToken = req.cookies.get(COOKIE_NAMES.refresh)?.value;
    if (!rawRefreshToken) {
      return NextResponse.json(apiError("No refresh token"), { status: 401 });
    }

    const result = await performTokenRefresh(rawRefreshToken, req);
    if (!result) {
      return NextResponse.json(apiError("Invalid or expired refresh token"), { status: 401 });
    }

    const res = NextResponse.json(apiSuccess(null, "Session refreshed"));
    setUserAuthCookies(res, result.accessToken, result.refreshToken);
    return res;
  } catch (err) {
    return handleApiError(err);
  }
}
