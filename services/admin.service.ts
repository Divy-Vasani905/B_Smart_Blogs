import Blog, { IBlogDocument } from "@/models/Blog";
import User from "@/models/User";
import { connectDB } from "@/lib/db/mongoose";
import type { BlogFilters, PaginatedBlogs, BlogListItem } from "@/types/blog.types";
import { getPagination } from "@/lib/utils";
import type { AdminUpdateBlogInput } from "@/lib/validations/blog.schema";
import { tiptapJsonToHtml } from "@/lib/tiptap-server";

// ── Admin Dashboard Analytics ─────────────────────────────────────────────────

export interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  pendingBlogs: number;
  draftBlogs: number;
  rejectedBlogs: number;
  changesRequestedBlogs: number;
  totalUsers: number;
  totalViews: number;
  recentBlogs: IBlogDocument[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const [statusCounts, totalUsers, viewsResult, recentBlogs] = await Promise.all([
    Blog.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    User.countDocuments({ role: "user" }),
    Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    Blog.find()
      .populate("author", "name email")
      .select("-content -contentHtml")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const counts = Object.fromEntries(
    statusCounts.map((s: { _id: string; count: number }) => [s._id, s.count])
  ) as Record<string, number>;

  return {
    totalBlogs: Object.values(counts).reduce((a: number, b: number) => a + b, 0),
    publishedBlogs: counts.published ?? 0,
    pendingBlogs: counts.pending ?? 0,
    draftBlogs: counts.draft ?? 0,
    rejectedBlogs: counts.rejected ?? 0,
    changesRequestedBlogs: counts.changes_requested ?? 0,
    totalUsers,
    totalViews: viewsResult[0]?.total ?? 0,
    recentBlogs: recentBlogs as unknown as IBlogDocument[],
  };
}

// ── Admin Blog Management ─────────────────────────────────────────────────────

export async function getAllBlogsAdmin(filters: BlogFilters): Promise<PaginatedBlogs> {
  await connectDB();
  const { page, limit, skip } = getPagination(
    String(filters.page ?? 1),
    String(filters.limit ?? 10)
  );

  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.author) query.author = filters.author;
  if (filters.search) query.$text = { $search: filters.search };

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate("author", "name email avatar")
      .select("-content -contentHtml")
      .sort({ updatedAt: -1 })
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

export async function getPendingBlogs(): Promise<IBlogDocument[]> {
  await connectDB();
  return (Blog.find({ status: "pending" })
    .populate("author", "name email avatar")
    .select("-content")
    .sort({ updatedAt: -1 })
    .lean() as unknown) as Promise<IBlogDocument[]>;
}

export async function approveBlog(
  blogId: string,
  reviewerId: string
): Promise<IBlogDocument | null> {
  await connectDB();
  return Blog.findByIdAndUpdate(
    blogId,
    {
      status: "published",
      publishedAt: new Date(),
      $push: {
        reviewMessages: {
          message: "Your blog has been approved and published.",
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
          type: "approve",
        },
      },
    },
    { new: true }
  ).lean() as unknown as Promise<IBlogDocument | null>;
}

export async function rejectBlog(
  blogId: string,
  reviewerId: string,
  message: string
): Promise<IBlogDocument | null> {
  await connectDB();
  return Blog.findByIdAndUpdate(
    blogId,
    {
      status: "rejected",
      $push: {
        reviewMessages: {
          message,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
          type: "reject",
        },
      },
    },
    { new: true }
  ).lean() as unknown as Promise<IBlogDocument | null>;
}

export async function requestBlogChanges(
  blogId: string,
  reviewerId: string,
  message: string
): Promise<IBlogDocument | null> {
  await connectDB();
  return Blog.findByIdAndUpdate(
    blogId,
    {
      status: "changes_requested",
      $push: {
        reviewMessages: {
          message,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
          type: "changes_requested",
        },
      },
    },
    { new: true }
  ).lean() as unknown as Promise<IBlogDocument | null>;
}



export async function adminUpdateBlog(
  blogId: string,
  data: AdminUpdateBlogInput
): Promise<IBlogDocument | null> {
  await connectDB();

  const { content, ...fields } = data;
  const updateData: Record<string, unknown> = { ...fields };

  if (content) {
    updateData.content = content;
    updateData.contentHtml = tiptapJsonToHtml(content as Record<string, unknown>);
  }

  return Blog.findByIdAndUpdate(blogId, updateData, { new: true }).lean() as unknown as Promise<IBlogDocument | null>;
}

export async function adminDeleteBlog(blogId: string): Promise<boolean> {
  await connectDB();
  const result = await Blog.deleteOne({ _id: blogId });
  return result.deletedCount > 0;
}

export async function getAllUsersAdmin(page = 1, limit = 20) {
  await connectDB();
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find()
      .select("-password -loginAttempts -lockUntil")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);
  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function toggleUserStatus(userId: string): Promise<void> {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new Error("NOT_FOUND");
  user.isActive = !user.isActive;
  await user.save();
}

// Re-export the type so it's available for imports
export type { AdminUpdateBlogInput };
