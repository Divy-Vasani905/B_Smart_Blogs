import { NextRequest, NextResponse } from "next/server";
import { adminUpdateBlog, adminDeleteBlog } from "@/services/admin.service";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db/mongoose";
import { adminUpdateBlogSchema } from "@/lib/validations/blog.schema";
import { apiSuccess, apiError } from "@/types/api.types";
import { getUserFromHeaders, handleApiError } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    const { id } = await params;
    await connectDB();
    const blog = await Blog.findById(id).populate("author", "name email avatar").lean();
    if (!blog) return NextResponse.json(apiError("Blog not found"), { status: 404 });
    return NextResponse.json(apiSuccess(blog));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    const parsed = adminUpdateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        apiError(parsed.error.issues.map((e) => e.message).join("; ")),
        { status: 400 }
      );
    }
    const blog = await adminUpdateBlog(id, parsed.data);
    if (!blog) return NextResponse.json(apiError("Blog not found"), { status: 404 });
    return NextResponse.json(apiSuccess(blog, "Blog updated"));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    const user = getUserFromHeaders(req.headers);
    if (!user || user.role !== "admin") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    const { id } = await params;
    const deleted = await adminDeleteBlog(id);
    if (!deleted) return NextResponse.json(apiError("Blog not found"), { status: 404 });
    return NextResponse.json(apiSuccess(null, "Blog deleted"));
  } catch (err) {
    return handleApiError(err);
  }
}
