import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { BlogStatus } from "@/types/blog.types";

interface ReviewMessageDoc {
  message: string;
  reviewedBy: Types.ObjectId;
  reviewedAt: Date;
  type: "approve" | "reject" | "changes_requested";
}

interface BlogSeoDoc {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
}

export interface IBlogDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: Record<string, unknown>; // Tiptap JSON
  contentHtml: string;              // Sanitized HTML for SSR
  thumbnail: string;
  author: Types.ObjectId;
  status: BlogStatus;
  tags: string[];
  category: string;
  seo: BlogSeoDoc;
  reviewMessages: ReviewMessageDoc[];
  views: number;
  likes: number;
  readingTime: number;
  featuredImage?: string;
  isFeature: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewMessageSchema = new Schema<ReviewMessageDoc>(
  {
    message: { type: String, required: true },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedAt: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ["approve", "reject", "changes_requested"],
      required: true,
    },
  },
  { _id: false }
);

const BlogSeoSchema = new Schema<BlogSeoDoc>(
  {
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
    canonicalUrl: { type: String },
    focusKeyword: { type: String },
  },
  { _id: false }
);

const BlogSchema = new Schema<IBlogDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title must be less than 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [500, "Excerpt must be less than 500 characters"],
    },
    content: {
      type: Schema.Types.Mixed, // Tiptap JSON
      required: [true, "Content is required"],
    },
    contentHtml: {
      type: String,
      default: "",
    },
    thumbnail: { type: String, default: "" },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "changes_requested", "rejected"],
      default: "draft",
      index: true,
    },
    tags: [{ type: String, lowercase: true, trim: true }],
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
      trim: true,
    },
    seo: { type: BlogSeoSchema, default: {} },
    reviewMessages: [ReviewMessageSchema],
    views: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    readingTime: { type: Number, default: 0 }, // in minutes
    featuredImage: { type: String, default: "" },
    isFeature: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Compound indexes for common query patterns
BlogSchema.index({ status: 1, publishedAt: -1 }); // Public blog listing
BlogSchema.index({ author: 1, status: 1 });        // User's own blogs
BlogSchema.index({ category: 1, status: 1 });      // Category filtering
BlogSchema.index({ slug: 1, status: 1 });          // Slug lookup
BlogSchema.index({ isFeature: 1, status: 1 });     // Featured blogs
BlogSchema.index(
  { title: "text", excerpt: "text", tags: "text" },
  { weights: { title: 10, tags: 5, excerpt: 1 } }
); // Full-text search

// Auto-calculate reading time before save
BlogSchema.pre("save", function (next) {
  if (this.isModified("contentHtml")) {
    const words = this.contentHtml.replace(/<[^>]+>/g, "").split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200); // 200 wpm average
  }
  next();
});

const Blog: Model<IBlogDocument> =
  (mongoose.models.Blog as Model<IBlogDocument>) ||
  mongoose.model<IBlogDocument>("Blog", BlogSchema);

export default Blog;
