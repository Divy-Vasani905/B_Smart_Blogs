import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth.schema";
import {
  getUserByEmail,
  clearExpiredAccountLock,
  isUserAccountLocked,
  recordFailedLoginAttempt,
  resetLoginAttempts,
} from "@/services/user.service";
import { comparePassword } from "@/lib/auth/password";
import { lockRemainingMinutes } from "@/lib/auth/account-lock";
import { generateAndSendLoginOtp } from "@/services/otp.service";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limited = await rateLimit(req, "login", ip);
    if (limited) return limited;

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await getUserByEmail(email);

    if (user) {
      if (isUserAccountLocked(user)) {
        const minutes = lockRemainingMinutes(user.lockUntil!);
        return NextResponse.json(
          apiError(
            `Account temporarily locked due to too many failed attempts. Try again in ${minutes} minute(s).`
          ),
          { status: 423 }
        );
      }
      await clearExpiredAccountLock(String(user._id), user.lockUntil);
    }

    if (!user || !user.isActive) {
      return NextResponse.json(apiError("Invalid email or password"), { status: 401 });
    }

    const isValid = await comparePassword(password, user.password ?? "");
    if (!isValid) {
      await recordFailedLoginAttempt(String(user._id));
      return NextResponse.json(apiError("Invalid email or password"), { status: 401 });
    }

    if (parsed.data.intent === "admin" && user.role !== "admin") {
      await recordFailedLoginAttempt(String(user._id));
      return NextResponse.json(apiError("Invalid email or password"), { status: 401 });
    }

    await resetLoginAttempts(String(user._id));

    const result = await generateAndSendLoginOtp(email);
    if (!result.success) {
      if (result.message === "COOLDOWN_ACTIVE") {
        return NextResponse.json(
          apiError(`Please wait ${result.cooldownRemaining}s before requesting a new OTP`),
          { status: 429 }
        );
      }
      return NextResponse.json(apiError(result.message), { status: 500 });
    }

    return NextResponse.json(
      apiSuccess(null, "OTP sent to email. Please verify to log in."),
      { status: 200 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}
