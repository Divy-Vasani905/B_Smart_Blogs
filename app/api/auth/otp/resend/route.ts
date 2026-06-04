import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resendOtpCode } from "@/services/otp.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

const resendSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  type: z.enum(["signup", "login"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }

    const { email, type } = parsed.data;

    const result = await resendOtpCode(email, type);

    if (!result.success) {
      if (result.message === "COOLDOWN_ACTIVE") {
        return NextResponse.json(
          apiError(`Please wait ${result.cooldownRemaining}s before requesting a new OTP`),
          { status: 429 }
        );
      }
      return NextResponse.json(apiError(result.message), { status: 400 });
    }

    return NextResponse.json(
      apiSuccess(null, "Verification code resent successfully"),
      { status: 200 }
    );
  } catch (err: unknown) {
    return handleApiError(err);
  }
}
