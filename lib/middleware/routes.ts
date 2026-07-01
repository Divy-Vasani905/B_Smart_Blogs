/** Route matchers used by middleware — exported for unit tests. */

export const ADMIN_ROUTES = /^\/backstage-b-smart-studio(?!\/login)(\/.*)?$/;
export const USER_DASHBOARD_ROUTES = /^\/dashboard(\/.*)?$/;
export const ADMIN_API_ROUTES = /^\/api\/admin\//;
export const USER_API_ROUTES = /^\/api\/user\//;
export const UPLOAD_API_ROUTES = /^\/api\/upload\//;

export type ProtectedRouteKind =
  | "admin_panel"
  | "admin_api"
  | "user_dashboard"
  | "user_api"
  | "upload_api"
  | "public";

export function classifyRoute(pathname: string): ProtectedRouteKind {
  if (ADMIN_ROUTES.test(pathname)) return "admin_panel";
  if (ADMIN_API_ROUTES.test(pathname)) return "admin_api";
  if (USER_DASHBOARD_ROUTES.test(pathname)) return "user_dashboard";
  if (USER_API_ROUTES.test(pathname)) return "user_api";
  if (UPLOAD_API_ROUTES.test(pathname)) return "upload_api";
  return "public";
}

export function requiresAuth(pathname: string): boolean {
  return classifyRoute(pathname) !== "public";
}

export function isDashboardRoute(pathname: string): boolean {
  return USER_DASHBOARD_ROUTES.test(pathname);
}
