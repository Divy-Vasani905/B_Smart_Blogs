import { NextRequest, NextResponse } from "next/server";
import { toggleUserStatus } from "@/services/admin.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    const { id } = await params;
    await toggleUserStatus(id);
    return NextResponse.json(apiSuccess(null, "User status updated"));
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json(apiError("User not found"), { status: 404 });
    }
    return handleApiError(err);
  }
}
