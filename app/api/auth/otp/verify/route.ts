import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserRole } from "@/types/user.types";
import { verifySignupOtp, verifyLoginOtp } from "@/services/otp.service";
import { signAccessToken, signRefreshToken, signAdminSessionToken } from "@/lib/auth/jwt";
import { setUserAuthCookies, setAdminSessionCookie } from "@/lib/auth/cookies";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

const verifySchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  code: z.string().length(6, "Code must be exactly 6 digits"),
  type: z.enum(["signup", "login"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }

    const { email, code, type } = parsed.data;

    let result;
    if (type === "signup") {
      result = await verifySignupOtp(email, code);
    } else {
      result = await verifyLoginOtp(email, code);
    }

    if (!result.success || !result.userData) {
      return NextResponse.json(apiError(result.message), { status: 400 });
    }

    const user = result.userData;

    // Issue session tokens based on user role
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
    };

    const res = NextResponse.json(
      apiSuccess(
        {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        type === "signup" ? "Account verified and created successfully" : "Logged in successfully"
      ),
      { status: 200 }
    );

    if (user.role === "admin") {
      const adminToken = await signAdminSessionToken(tokenPayload);
      setAdminSessionCookie(res, adminToken);
    } else {
      const accessToken = await signAccessToken(tokenPayload);
      const refreshToken = await signRefreshToken({ userId: user._id });
      setUserAuthCookies(res, accessToken, refreshToken);
    }

    return res;
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
