import Blog, { IBlogDocument } from "@/models/Blog";
import User from "@/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { slugify, escapeRegex, getPagination } from "@/lib/utils";
import type { BlogFilters, PaginatedBlogs, BlogListItem } from "@/types/blog.types";
import type { CreateBlogInput, UpdateBlogInput } from "@/lib/validations/blog.schema";
import { tiptapJsonToHtml } from "@/lib/tiptap-server";

// Reference User model to prevent tree-shaking and ensure its schema is registered for populate queries
const _preventTreeShaking = User;


// ── Public Blog Service ───────────────────────────────────────────────────────

export async function getPublishedBlogs(filters: BlogFilters): Promise<PaginatedBlogs> {
  await connectDB();
  const { page, limit, skip } = getPagination(
    String(filters.page ?? 1),
    String(filters.limit ?? 10)
  );

  const query: Record<string, unknown> = { status: "published" };

  if (filters.category) query.category = new RegExp(escapeRegex(filters.category), "i");
  if (filters.tag) query.tags = filters.tag.toLowerCase();
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate("author", "name avatar")
      .select("-content -contentHtml -reviewMessages -seo")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs: blogs as unknown as BlogListItem[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBlogBySlug(slug: string): Promise<IBlogDocument | null> {
  await connectDB();
  return Blog.findOne({ slug, status: "published" })
    .populate("author", "name avatar bio")
    .lean() as unknown as Promise<IBlogDocument | null>;
}

export async function getFeaturedBlogs(count = 4): Promise<IBlogDocument[]> {
  await connectDB();
  return Blog.find({ status: "published", isFeature: true })
    .populate("author", "name avatar")
    .select("-content -contentHtml -reviewMessages -seo")
    .sort({ publishedAt: -1 })
    .limit(count)
    .lean() as unknown as Promise<IBlogDocument[]>;
}

export async function getLatestBlogs(count = 6): Promise<IBlogDocument[]> {
  await connectDB();
  return Blog.find({ status: "published" })
    .populate("author", "name avatar")
    .select("-content -contentHtml -reviewMessages -seo")
    .sort({ publishedAt: -1 })
    .limit(count)
    .lean() as unknown as Promise<IBlogDocument[]>;
}

export async function getPopularBlogs(count = 4): Promise<IBlogDocument[]> {
  await connectDB();
  return Blog.find({ status: "published" })
    .populate("author", "name avatar")
    .select("-content -contentHtml -reviewMessages -seo")
    .sort({ views: -1 })
    .limit(count)
    .lean() as unknown as Promise<IBlogDocument[]>;
}

export async function getPublishedBlogsCount(): Promise<number> {
  await connectDB();
  return Blog.countDocuments({ status: "published" });
}


export async function getRelatedBlogs(
  blogId: string,
  category: string,
  count = 3
): Promise<IBlogDocument[]> {
  await connectDB();
  return Blog.find({
    status: "published",
    category,
    _id: { $ne: blogId },
  })
    .populate("author", "name avatar")
    .select("-content -contentHtml -reviewMessages -seo")
    .sort({ publishedAt: -1 })
    .limit(count)
    .lean() as unknown as Promise<IBlogDocument[]>;
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  await connectDB();
  return Blog.find({ status: "published" })
    .select("slug updatedAt")
    .lean() as unknown as Promise<{ slug: string; updatedAt: Date }[]>;
}

export async function incrementViews(blogId: string): Promise<void> {
  await connectDB();
  await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
}

export async function getCategories(): Promise<string[]> {
  await connectDB();
  return Blog.distinct("category", { status: "published" });
}

// ── User Blog Service ─────────────────────────────────────────────────────────

export async function createBlogDraft(
  authorId: string,
  data: CreateBlogInput
): Promise<IBlogDocument> {
  await connectDB();

  const slug = slugify(data.title) + "-" + Date.now();
  const contentHtml = tiptapJsonToHtml(data.content as Record<string, unknown>);

  const blog = await Blog.create({
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    thumbnail: data.thumbnail ?? "",
    category: data.category,
    tags: data.tags ?? [],
    seo: data.seo ?? {},
    slug,
    contentHtml,
    author: authorId,
    status: "draft",
  });

  return blog;
}

export async function getUserBlogs(authorId: string): Promise<IBlogDocument[]> {
  await connectDB();
  return Blog.find({ author: authorId })
    .select("-content -contentHtml")
    .sort({ updatedAt: -1 })
    .lean() as unknown as Promise<IBlogDocument[]>;
}

export async function getUserBlogById(
  blogId: string,
  authorId: string
): Promise<IBlogDocument | null> {
  await connectDB();
  return Blog.findOne({ _id: blogId, author: authorId }).lean() as unknown as Promise<IBlogDocument | null>;
}

export async function updateUserBlog(
  blogId: string,
  authorId: string,
  data: UpdateBlogInput
): Promise<IBlogDocument | null> {
  await connectDB();

  const { content, ...fields } = data;
  const updateData: Record<string, unknown> = { ...fields };

  if (content) {
    updateData.content = content;
    updateData.contentHtml = tiptapJsonToHtml(content as Record<string, unknown>);
  }

  return Blog.findOneAndUpdate(
    { _id: blogId, author: authorId, status: { $in: ["draft", "changes_requested"] } },
    updateData,
    { new: true }
  ).lean() as unknown as Promise<IBlogDocument | null>;
}

export async function submitBlogForReview(
  blogId: string,
  authorId: string
): Promise<IBlogDocument | null> {
  await connectDB();
  return Blog.findOneAndUpdate(
    { _id: blogId, author: authorId, status: { $in: ["draft", "changes_requested"] } },
    { status: "pending" },
    { new: true }
  ).lean() as unknown as Promise<IBlogDocument | null>;
}

export async function deleteUserBlog(
  blogId: string,
  authorId: string
): Promise<boolean> {
  await connectDB();
  const result = await Blog.deleteOne({
    _id: blogId,
    author: authorId,
    status: "draft", // Can only delete drafts
  });
  return result.deletedCount > 0;
}
