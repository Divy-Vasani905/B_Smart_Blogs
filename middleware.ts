import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyAdminSessionToken } from "@/lib/auth/jwt";
import { tryRefreshAccessToken } from "@/lib/auth/middleware-refresh";

const ACCESS_COOKIE = process.env.COOKIE_ACCESS_NAME || "__bsf_acc";
const ADMIN_COOKIE = process.env.COOKIE_ADMIN_SESSION || "__bsf_adm";

// ── Route Matchers ─────────────────────────────────────────────────
const ADMIN_ROUTES = /^\/backstage-b-smart-studio(?!\/login)(\/.*)?$/;
const USER_DASHBOARD_ROUTES = /^\/dashboard(\/.*)?$/;
const ADMIN_API_ROUTES = /^\/api\/admin\//;
const USER_API_ROUTES = /^\/api\/user\//;
const UPLOAD_API_ROUTES = /^\/api\/upload\//;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ── Admin panel protection ───────────────────────────────────────
  if (ADMIN_ROUTES.test(pathname)) {
    const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;

    if (!adminToken) {
      return NextResponse.redirect(
        new URL("/backstage-b-smart-studio/login", req.url)
      );
    }

    try {
      const payload = await verifyAdminSessionToken(adminToken);
      if (payload.role !== "admin") {
        return NextResponse.redirect(
          new URL("/backstage-b-smart-studio/login", req.url)
        );
      }
      // Inject user info into request headers for Server Components
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-role", payload.role);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-name", payload.name);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      // Token invalid/expired — redirect to admin login
      const loginUrl = new URL("/backstage-b-smart-studio/login", req.url);
      const redirectRes = NextResponse.redirect(loginUrl);
      // Clear stale admin cookie
      redirectRes.cookies.set(ADMIN_COOKIE, "", { maxAge: 0, path: "/" });
      return redirectRes;
    }
  }

  // ── Admin API protection ────────────────────────────────────────────────────
  if (ADMIN_API_ROUTES.test(pathname)) {
    const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;

    if (!adminToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const payload = await verifyAdminSessionToken(adminToken);
      if (payload.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        );
      }
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-role", payload.role);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-name", payload.name);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  // ── User dashboard & user API protection ───────────────────────────────────
  if (USER_DASHBOARD_ROUTES.test(pathname) || USER_API_ROUTES.test(pathname) || UPLOAD_API_ROUTES.test(pathname)) {
    const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
    const adminToken = req.cookies.get(ADMIN_COOKIE)?.value;

    if (!accessToken && !adminToken) {
      if (USER_DASHBOARD_ROUTES.test(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      let payload;
      if (adminToken) {
        try {
          payload = await verifyAdminSessionToken(adminToken);
        } catch {
          if (accessToken) payload = await verifyAccessToken(accessToken);
          else throw new Error("Invalid tokens");
        }
      } else {
        payload = await verifyAccessToken(accessToken as string);
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-role", payload.role);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-name", payload.name);
      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      const refreshed = await tryRefreshAccessToken(req);
      if (refreshed) return refreshed;

      if (USER_DASHBOARD_ROUTES.test(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/backstage-b-smart-studio/:path*",
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/api/user/:path*",
    "/api/upload/:path*",
  ],
};
