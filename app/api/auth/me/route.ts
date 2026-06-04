import { NextRequest, NextResponse } from "next/server";
import { getServerSession, getAdminSession } from "@/lib/auth/session";
import { getUserById } from "@/services/user.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // Check admin session first
    const adminSession = await getAdminSession();
    if (adminSession) {
      const user = await getUserById(adminSession.userId);
      if (!user) {
        return NextResponse.json(apiError("User not found"), { status: 404 });
      }
      return NextResponse.json(
        apiSuccess({
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        })
      );
    }

    // Check user session
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(apiError("Not authenticated"), { status: 401 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json(apiError("User not found"), { status: 404 });
    }

    return NextResponse.json(
      apiSuccess({
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      })
    );
  } catch (err) {
    return handleApiError(err);
  }
}
