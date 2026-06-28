import { cookies, headers } from "next/headers";
import { verifyAccessToken, verifyAdminSessionToken } from "./jwt";
import type { AuthUser, UserRole } from "@/types/user.types";

const ACCESS_COOKIE = process.env.COOKIE_ACCESS_NAME || "__bsf_acc";
const ADMIN_COOKIE = process.env.COOKIE_ADMIN_SESSION || "__bsf_adm";

/**
 * Read auth injected by middleware (e.g. after silent token refresh).
 * Only trustworthy on routes protected by middleware.
 */
async function getSessionFromMiddlewareHeaders(): Promise<AuthUser | null> {
  const headerStore = await headers();
  const userId = headerStore.get("x-user-id");
  const role = headerStore.get("x-user-role");
  const email = headerStore.get("x-user-email");
  const name = headerStore.get("x-user-name");

  if (!userId || !role || !email) return null;

  return {
    userId,
    email,
    role: role as UserRole,
    name: name ?? "",
  };
}

/**
 * Get the current authenticated user from the server-side cookie.
 * Returns null if not authenticated or token is invalid/expired.
 */
export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const fromMiddleware = await getSessionFromMiddlewareHeaders();
    if (fromMiddleware) return fromMiddleware;

    const cookieStore = await cookies();
    
    // Admin users only get the ADMIN_COOKIE when logging in
    const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
    if (adminToken) {
      try {
        return await verifyAdminSessionToken(adminToken);
      } catch {}
    }

    const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
    if (!accessToken) return null;
    return await verifyAccessToken(accessToken);
  } catch {
    return null;
  }
}

/**
 * Get current admin session from admin-specific cookie.
 * Returns null if not authenticated or not an admin.
 */
export async function getAdminSession(): Promise<(AuthUser & { isAdminSession: boolean }) | null> {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
    if (!adminToken) return null;
    const payload = await verifyAdminSessionToken(adminToken);
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Require authentication — use in Server Components/Actions.
 * Throws if not authenticated.
 */
export async function requireAuth(): Promise<AuthUser> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Require admin role — use in Server Components/Actions.
 * Throws if not authenticated or not admin.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
