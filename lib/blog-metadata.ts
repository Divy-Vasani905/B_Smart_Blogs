import type { Metadata } from "next";
import type { IBlogDocument } from "@/models/Blog";
import { SITE_URL, SITE_KEYWORDS } from "@/lib/site-config";

export function buildBlogPostMetadata(blog: IBlogDocument): Metadata {
  const author = blog.author as unknown as Record<string, string>;
  const seo = blog.seo as Record<string, string> | undefined;
  const url = `${SITE_URL}/blog/${blog.slug}`;

  return {
    title: seo?.metaTitle || blog.title,
    description: seo?.metaDescription || blog.excerpt,
    keywords: [...SITE_KEYWORDS, blog.category, ...(blog.tags ?? [])],
    alternates: { canonical: seo?.canonicalUrl || `/blog/${blog.slug}` },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url,
      type: "article",
      publishedTime: blog.publishedAt ? String(blog.publishedAt) : String(blog.createdAt),
      modifiedTime: String(blog.updatedAt),
      authors: [author?.name ?? "B Smart Finance"],
      section: blog.category,
      tags: [blog.category, ...(blog.tags ?? [])],
      images: [
        {
          url: blog.thumbnail || `${SITE_URL}/og-finance.png`,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.thumbnail || `${SITE_URL}/og-finance.png`],
    },
  };
}
