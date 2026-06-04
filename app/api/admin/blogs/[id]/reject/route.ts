import { NextRequest, NextResponse } from "next/server";
import { rejectBlog } from "@/services/admin.service";
import { reviewActionSchema } from "@/lib/validations/blog.schema";
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
    const body = await req.json();
    const parsed = reviewActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }
    const blog = await rejectBlog(id, user.userId, parsed.data.message);
    if (!blog) return NextResponse.json(apiError("Blog not found"), { status: 404 });
    return NextResponse.json(apiSuccess(blog, "Blog rejected"));
  } catch (err) {
    return handleApiError(err);
  }
}
