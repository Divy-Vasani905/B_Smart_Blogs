import { NextRequest, NextResponse } from "next/server";
import { submitBlogForReview } from "@/services/blog.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });
    const { id } = await params;
    const blog = await submitBlogForReview(id, user.userId);
    if (!blog) {
      return NextResponse.json(
        apiError("Blog not found or cannot be submitted"),
        { status: 404 }
      );
    }
    return NextResponse.json(apiSuccess(blog, "Blog submitted for review"));
  } catch (err) {
    return handleApiError(err);
  }
}
