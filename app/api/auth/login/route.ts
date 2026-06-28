import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth.schema";
import { getUserByEmail } from "@/services/user.service";
import { comparePassword } from "@/lib/auth/password";
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

    // 1. Verify user exists and credentials are correct first
    const user = await getUserByEmail(email);
    if (!user || !user.isActive) {
      return NextResponse.json(apiError("Invalid email or password"), { status: 401 });
    }

    const isValid = await comparePassword(password, user.password ?? "");
    if (!isValid) {
      return NextResponse.json(apiError("Invalid email or password"), { status: 401 });
    }

    if (parsed.data.intent === "admin" && user.role !== "admin") {
      return NextResponse.json(apiError("Invalid email or password"), { status: 401 });
    }

    // 2. Generate and send login OTP
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
