import { NextRequest } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import {
  validateStoredRefreshToken,
  revokeRefreshToken,
  storeRefreshToken,
} from "@/services/refresh-token.service";
import { getUserById } from "@/services/user.service";
import type { AuthUser, UserRole } from "@/types/user.types";

function getRequestMeta(req: NextRequest) {
  return {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
    userAgent: req.headers.get("user-agent") ?? "",
  };
}

export interface TokenRefreshResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/**
 * Validate refresh cookie, rotate tokens, and return new JWT pair.
 */
export async function performTokenRefresh(
  rawRefreshToken: string,
  req: NextRequest
): Promise<TokenRefreshResult | null> {
  const match = await validateStoredRefreshToken(rawRefreshToken);
  if (!match) return null;

  const userDoc = await getUserById(match.userId);
  if (!userDoc || !userDoc.isActive) return null;

  await revokeRefreshToken(rawRefreshToken);

  const user: AuthUser = {
    userId: String(userDoc._id),
    email: userDoc.email,
    role: userDoc.role as UserRole,
    name: userDoc.name,
  };

  const accessToken = await signAccessToken(user);
  const { token: refreshToken, jti } = await signRefreshToken({ userId: user.userId });
  await storeRefreshToken(user.userId, refreshToken, jti, getRequestMeta(req));

  return { accessToken, refreshToken, user };
}
