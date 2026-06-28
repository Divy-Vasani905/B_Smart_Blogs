import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setUserAuthCookies } from "@/lib/auth/cookies";
import { storeRefreshToken } from "@/services/refresh-token.service";
import type { AuthUser, UserRole } from "@/types/user.types";

function getRequestMeta(req: NextRequest) {
  return {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
    userAgent: req.headers.get("user-agent") ?? "",
  };
}

/**
 * Issue access + refresh JWTs, persist refresh token, and set HttpOnly cookies.
 */
export async function issueUserSession(
  res: NextResponse,
  user: { userId: string; email: string; role: UserRole; name: string },
  req: NextRequest
): Promise<void> {
  const tokenPayload: AuthUser = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const accessToken = await signAccessToken(tokenPayload);
  const refreshToken = await signRefreshToken({ userId: user.userId });

  await storeRefreshToken(user.userId, refreshToken, getRequestMeta(req));
  setUserAuthCookies(res, accessToken, refreshToken);
}
