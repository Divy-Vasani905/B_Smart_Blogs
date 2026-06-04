import { NextRequest, NextResponse } from "next/server";
import { approveBlog } from "@/services/admin.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    const { id } = await params;
    const blog = await approveBlog(id, user.userId);
    if (!blog) return NextResponse.json(apiError("Blog not found"), { status: 404 });
    return NextResponse.json(apiSuccess(blog, "Blog approved and published"));
  } catch (err) {
    return handleApiError(err);
  }
}
