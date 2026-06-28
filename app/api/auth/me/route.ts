import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getAdminSession } from "@/lib/auth/session";
import { COOKIE_NAMES, setUserAuthCookies } from "@/lib/auth/cookies";
import { performTokenRefresh } from "@/lib/auth/perform-refresh";
import { getUserById } from "@/services/user.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";
import type { AuthUser } from "@/types/user.types";
import type { TokenRefreshResult } from "@/lib/auth/perform-refresh";

async function resolveSession(req: NextRequest): Promise<{
  session: AuthUser;
  refreshTokens?: TokenRefreshResult;
} | null> {
  const adminSession = await getAdminSession();
  if (adminSession) return { session: adminSession };

  const session = await getServerSession();
  if (session) return { session };

  const rawRefresh = req.cookies.get(COOKIE_NAMES.refresh)?.value;
  if (!rawRefresh) return null;

  const refreshed = await performTokenRefresh(rawRefresh, req);
  if (!refreshed) return null;

  return { session: refreshed.user, refreshTokens: refreshed };
}

export async function GET(req: NextRequest) {
  try {
    const resolved = await resolveSession(req);

    if (!resolved) {
      return NextResponse.json(apiError("Not authenticated"), { status: 401 });
    }

    const user = await getUserById(resolved.session.userId);
    if (!user) {
      return NextResponse.json(apiError("User not found"), { status: 404 });
    }

    const res = NextResponse.json(
      apiSuccess({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      })
    );

    if (resolved.refreshTokens) {
      setUserAuthCookies(
        res,
        resolved.refreshTokens.accessToken,
        resolved.refreshTokens.refreshToken
      );
    }

    return res;
  } catch (err) {
    return handleApiError(err);
  }
}
