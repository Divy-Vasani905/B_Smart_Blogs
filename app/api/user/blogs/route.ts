import { NextRequest, NextResponse } from "next/server";
import { createBlogDraft, getUserBlogs } from "@/services/blog.service";
import { createBlogSchema } from "@/lib/validations/blog.schema";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });

    const blogs = await getUserBlogs(user.userId);
    return NextResponse.json(apiSuccess(blogs));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });

    const body = await req.json();
    const parsed = createBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }

    const blog = await createBlogDraft(user.userId, parsed.data);
    return NextResponse.json(apiSuccess(blog, "Draft saved"), { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
