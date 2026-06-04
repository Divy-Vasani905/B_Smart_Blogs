import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug, incrementViews } from "@/services/blog.service";
import { apiSuccess, apiError } from "@/types/api.types";

type Props = { params: Promise<{ slug: string }> };

export async function POST(_req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return NextResponse.json(apiError("Blog not found"), { status: 404 });
  }
  await incrementViews(String(blog._id));
  return NextResponse.json(apiSuccess(null));
}
