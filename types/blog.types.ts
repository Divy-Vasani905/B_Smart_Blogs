// ─── Blog Types ───────────────────────────────────────────────────────────────

export type BlogStatus =
  | "draft"
  | "pending"
  | "published"
  | "changes_requested"
  | "rejected";

export interface ReviewMessage {
  message: string;
  reviewedBy: string;
  reviewedAt: string;
  type: "approve" | "reject" | "changes_requested";
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>; // Tiptap JSON
  contentHtml: string;             // Sanitized rendered HTML
  thumbnail: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: BlogStatus;
  tags: string[];
  category: string;
  seo: BlogSeo;
  reviewMessages: ReviewMessage[];
  views: number;
  likes: number;
  readingTime: number;
  featuredImage?: string;
  isFeature: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListItem
  extends Omit<IBlog, "content" | "contentHtml" | "reviewMessages" | "seo"> {}

export interface PaginatedBlogs {
  blogs: BlogListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  status?: BlogStatus;
  search?: string;
  page?: number;
  limit?: number;
  author?: string;
}
