import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth.schema";
import { hashPassword } from "@/lib/auth/password";
import { generateAndSendSignupOtp } from "@/services/otp.service";
import { rateLimit } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const limited = await rateLimit(req, "signup");
    if (limited) return limited;

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }

    const { name, username, email, password } = parsed.data;

    // Hash the password on the backend
    const passwordHash = await hashPassword(password);

    // Generate and send OTP
    const result = await generateAndSendSignupOtp({
      email,
      name,
      username,
      passwordHash,
    });

    if (!result.success) {
      if (result.message === "EMAIL_EXISTS") {
        return NextResponse.json(
          apiError("An account with this email already exists"),
          { status: 409 }
        );
      }
      if (result.message === "USERNAME_EXISTS") {
        return NextResponse.json(
          apiError("This username is already taken"),
          { status: 409 }
        );
      }
      if (result.message === "COOLDOWN_ACTIVE") {
        return NextResponse.json(
          apiError(`Please wait ${result.cooldownRemaining}s before requesting a new OTP`),
          { status: 429 }
        );
      }
      return NextResponse.json(apiError(result.message), { status: 500 });
    }

    return NextResponse.json(
      apiSuccess(null, "OTP sent to email. Please verify your account."),
      { status: 200 }
    );
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
