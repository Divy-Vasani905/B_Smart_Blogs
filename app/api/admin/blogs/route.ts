import { NextRequest, NextResponse } from "next/server";
import { getAllBlogsAdmin } from "@/services/admin.service";
import { apiSuccess } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const filters = {
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 10),
      status: (searchParams.get("status") as never) ?? undefined,
      category: searchParams.get("category") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    };

    const result = await getAllBlogsAdmin(filters);
    return NextResponse.json(apiSuccess(result));
  } catch (err) {
    return handleApiError(err);
  }
}
