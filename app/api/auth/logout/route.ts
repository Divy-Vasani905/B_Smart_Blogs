import { NextResponse } from "next/server";
import { clearUserAuthCookies, clearAdminSessionCookie } from "@/lib/auth/cookies";
import { apiSuccess } from "@/types/api.types";

export async function POST() {
  const res = NextResponse.json(apiSuccess(null, "Logged out successfully"));
  clearUserAuthCookies(res);
  clearAdminSessionCookie(res);
  return res;
}
