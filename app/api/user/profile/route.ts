import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { updateUserProfile } from "@/services/user.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(apiError("Not authenticated"), { status: 401 });
    }

    const body = await req.json();
    const validatedData = profileSchema.parse(body);

    const updatedUser = await updateUserProfile(session.userId, validatedData);
    if (!updatedUser) {
      return NextResponse.json(apiError("User not found"), { status: 404 });
    }

    return NextResponse.json(apiSuccess(updatedUser));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(apiError(err.issues[0].message), { status: 400 });
    }
    return handleApiError(err);
  }
}
