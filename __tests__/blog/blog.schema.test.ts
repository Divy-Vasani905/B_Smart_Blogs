import { describe, expect, it } from "vitest";
import {
  createBlogSchema,
  updateBlogSchema,
  reviewActionSchema,
  adminUpdateBlogSchema,
} from "@/lib/validations/blog.schema";

const validTiptap = { type: "doc", content: [] };

const validBlog = {
  title: "How to Build an Emergency Fund",
  excerpt:
    "A practical guide to saving three to six months of expenses for financial security and peace of mind.",
  content: validTiptap,
  category: "Savings",
  tags: ["savings", "budget"],
};

describe("createBlogSchema", () => {
  it("accepts a valid draft payload", () => {
    expect(createBlogSchema.safeParse(validBlog).success).toBe(true);
  });

  it("rejects short title", () => {
    expect(
      createBlogSchema.safeParse({ ...validBlog, title: "Hi" }).success
    ).toBe(false);
  });

  it("rejects short excerpt", () => {
    expect(
      createBlogSchema.safeParse({ ...validBlog, excerpt: "Too short." }).success
    ).toBe(false);
  });

  it("requires Tiptap doc root", () => {
    expect(
      createBlogSchema.safeParse({ ...validBlog, content: { foo: "bar" } }).success
    ).toBe(false);
  });
});

describe("updateBlogSchema", () => {
  it("allows partial updates", () => {
    expect(updateBlogSchema.safeParse({ title: "Updated title here" }).success).toBe(true);
  });
});

describe("reviewActionSchema", () => {
  it("requires meaningful review message", () => {
    expect(reviewActionSchema.safeParse({ message: "Too short" }).success).toBe(false);
    expect(
      reviewActionSchema.safeParse({
        message: "Please expand the section on tax implications.",
      }).success
    ).toBe(true);
  });
});

describe("adminUpdateBlogSchema", () => {
  it("allows status transitions", () => {
    expect(adminUpdateBlogSchema.safeParse({ status: "published" }).success).toBe(true);
    expect(adminUpdateBlogSchema.safeParse({ status: "invalid" }).success).toBe(false);
  });
});
