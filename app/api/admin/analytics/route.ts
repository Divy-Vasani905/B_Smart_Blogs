import { NextRequest, NextResponse } from "next/server";
import { getDashboardStats } from "@/services/admin.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    const stats = await getDashboardStats();
    return NextResponse.json(apiSuccess(stats));
  } catch (err) {
    return handleApiError(err);
  }
}
