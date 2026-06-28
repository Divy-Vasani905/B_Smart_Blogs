import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug, incrementViews } from "@/services/blog.service";
import { rateLimitBlogView } from "@/lib/rate-limit";
import { apiSuccess, apiError } from "@/types/api.types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, { params }: Props) {
  const { slug } = await params;

  const limited = await rateLimitBlogView(req, slug);
  if (limited) return limited;

  const blog = await getBlogBySlug(slug);
  if (!blog) {
    return NextResponse.json(apiError("Blog not found"), { status: 404 });
  }

  // Only the public counter on Blog is persisted — rate-limit state lives in Redis/memory.
  await incrementViews(String(blog._id));

  return NextResponse.json(apiSuccess(null));
}
