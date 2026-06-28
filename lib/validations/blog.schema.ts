import { z } from "zod";

// ── Blog Schemas ──────────────────────────────────────────────────────────────

const seoSchema = z.object({
  metaTitle: z.string().max(70, "Meta title too long").optional(),
  metaDescription: z.string().max(160, "Meta description too long").optional(),
  canonicalUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  focusKeyword: z.string().max(100).optional(),
});

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title too long")
    .trim(),
  excerpt: z
    .string()
    .min(50, "Excerpt must be at least 50 characters")
    .max(500, "Excerpt too long")
    .trim(),
  content: z.record(z.string(), z.unknown()).refine(
    (val) => val && typeof val === "object" && "type" in val,
    "Content must be valid Tiptap JSON"
  ),
  thumbnail: z.string().url("Invalid thumbnail URL").optional().or(z.literal("")),
  category: z.string().min(1, "Category is required").trim(),
  tags: z.array(z.string().trim().toLowerCase()).max(10, "Maximum 10 tags").default([]),
  seo: seoSchema.optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const reviewActionSchema = z.object({
  message: z
    .string()
    .min(10, "Review message must be at least 10 characters")
    .max(1000, "Review message too long"),
});

export const adminUpdateBlogSchema = updateBlogSchema.extend({
  status: z
    .enum(["draft", "pending", "published", "changes_requested", "rejected"])
    .optional(),
  isFeature: z.boolean().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ReviewActionInput = z.infer<typeof reviewActionSchema>;
export type AdminUpdateBlogInput = z.infer<typeof adminUpdateBlogSchema>;
