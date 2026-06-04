import { NextRequest, NextResponse } from "next/server";
import { getAllUsersAdmin, toggleUserStatus } from "@/services/admin.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const result = await getAllUsersAdmin(page, limit);
    return NextResponse.json(apiSuccess(result));
  } catch (err) {
    return handleApiError(err);
  }
}
