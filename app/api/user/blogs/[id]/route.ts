import { NextRequest, NextResponse } from "next/server";
import {
  getUserBlogById,
  updateUserBlog,
  deleteUserBlog,
} from "@/services/blog.service";
import { updateBlogSchema } from "@/lib/validations/blog.schema";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });
    const { id } = await params;
    const blog = await getUserBlogById(id, user.userId);
    if (!blog) return NextResponse.json(apiError("Blog not found"), { status: 404 });
    return NextResponse.json(apiSuccess(blog));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });
    const { id } = await params;

    const body = await req.json();
    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }

    const blog = await updateUserBlog(id, user.userId, parsed.data);
    if (!blog) return NextResponse.json(apiError("Blog not found or cannot be edited"), { status: 404 });
    return NextResponse.json(apiSuccess(blog, "Blog updated"));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user) return NextResponse.json(apiError("Unauthorized"), { status: 401 });
    const { id } = await params;
    const deleted = await deleteUserBlog(id, user.userId);
    if (!deleted) return NextResponse.json(apiError("Blog not found or cannot be deleted"), { status: 404 });
    return NextResponse.json(apiSuccess(null, "Blog deleted"));
  } catch (err) {
    return handleApiError(err);
  }
}
