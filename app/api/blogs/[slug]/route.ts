import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug } from "@/services/blog.service";
import { apiSuccess, apiError } from "@/types/api.types";
import { handleApiError } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json(apiError("Blog not found"), { status: 404 });
    }
    return NextResponse.json(apiSuccess(blog), {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
