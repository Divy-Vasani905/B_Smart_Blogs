import { unstable_cache, revalidateTag } from "next/cache";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/db/mongoose";

export const BLOG_CATEGORIES_CACHE_TAG = "blog-categories";

/** 24 hours — categories change infrequently */
const CATEGORIES_REVALIDATE_SECONDS = 24 * 60 * 60;

async function loadPublishedCategories(): Promise<string[]> {
  await connectDB();
  const categories = await Blog.distinct("category", { status: "published" });
  return (categories as string[])
    .filter((c) => Boolean(c?.trim()))
    .sort((a, b) => a.localeCompare(b));
}

export const getCachedCategories = unstable_cache(
  loadPublishedCategories,
  ["published-blog-categories"],
  {
    revalidate: CATEGORIES_REVALIDATE_SECONDS,
    tags: [BLOG_CATEGORIES_CACHE_TAG],
  }
);

/** Call when a published blog is created, updated, or removed. */
export function revalidateBlogCategories(): void {
  revalidateTag(BLOG_CATEGORIES_CACHE_TAG);
}
