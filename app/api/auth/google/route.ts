/**
 * POST /api/auth/google
 *
 * Handles Google Sign-In via ID token (credential JWT):
 * 1. Rate limit by IP
 * 2. Validate { credential }
 * 3. Verify the ID token with google-auth-library
 * 4. Find or create the user in MongoDB
 * 5. Issue JWT tokens and set HttpOnly cookies
 *
 * NOTE: Admin accounts cannot be accessed via Google OAuth.
 */

import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGoogleUser, verifyGoogleToken } from "@/services/google.service";
import { issueUserSession } from "@/lib/auth/issue-session";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";
import { googleAuthSchema } from "@/lib/validations/auth.schema";
import type { UserRole } from "@/types/user.types";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limited = await rateLimit(req, "google", ip);
    if (limited) return limited;

    const body = await req.json();
    const parsed = googleAuthSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }

    const { credential } = parsed.data;

    let googleProfile;
    try {
      googleProfile = await verifyGoogleToken(credential);
    } catch (err) {
      console.error("[API/auth/google] Token verification failed:", err);
      return NextResponse.json(
        apiError("Invalid Google token. Please sign in again."),
        { status: 401 }
      );
    }

    const result = await findOrCreateGoogleUser(googleProfile);

    if (!result.success || !result.user) {
      return NextResponse.json(
        apiError(result.error || "Failed to authenticate with Google"),
        { status: 400 }
      );
    }

    const user = result.user;

    if (user.role === "admin") {
      return NextResponse.json(
        apiError(
          "Admin accounts cannot sign in with Google. Please use your email and password."
        ),
        { status: 403 }
      );
    }

    const tokenPayload = {
      userId: (user._id as object).toString(),
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
    };

    const res = NextResponse.json(
      apiSuccess(
        {
          id: (user._id as object).toString(),
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          provider: user.provider,
        },
        "Signed in with Google successfully"
      ),
      { status: 200 }
    );

    await issueUserSession(res, tokenPayload, req);

    return res;
  } catch (err) {
    return handleApiError(err);
  }
}
