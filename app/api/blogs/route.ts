import { NextRequest, NextResponse } from "next/server";
import { getPublishedBlogs } from "@/services/blog.service";
import { apiSuccess } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const filters = {
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 10),
      category: searchParams.get("category") ?? undefined,
      tag: searchParams.get("tag") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    };

    const result = await getPublishedBlogs(filters);
    return NextResponse.json(apiSuccess(result), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
