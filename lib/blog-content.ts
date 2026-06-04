import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "./blog-types";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

interface BlogPostFrontmatter {
  title?: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTime: string;
  views: number;
}

/** Derive a display title from slug e.g. "my-first-post" → "My First Post" */
function slugToTitle(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const frontmatter = data as Partial<BlogPostFrontmatter>;
  const title =
    frontmatter.title && String(frontmatter.title).trim()
      ? String(frontmatter.title).trim()
      : slugToTitle(slug);
  return {
    slug,
    id: slug,
    title,
    excerpt: frontmatter.excerpt ?? "",
    content: content.trim(),
    author: frontmatter.author ?? "",
    date: frontmatter.date ?? "",
    category: frontmatter.category ?? "",
    imageUrl: frontmatter.imageUrl ?? "",
    readTime: frontmatter.readTime ?? "",
    views: Number(frontmatter.views) || 0,
  };
}

// ── In-memory cache (populated once per server process) ──────────────────────
let _cache: BlogPost[] | null = null;

/** Read all blog posts from content/blog/*.md — cached after first load */
export function getAllPosts(): BlogPost[] {
  if (_cache) return _cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR);
  const posts: BlogPost[] = [];
  for (const file of files) {
    if (!file.endsWith(".md") || file === "README.md") continue;
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    posts.push(parsePost(slug, raw));
  }
  _cache = posts;
  return _cache;
}

export function getPostBySlug(slug: string): BlogPost | null {
  // Use cache first — avoids a separate fs.readFileSync per slug page
  const fromCache = getAllPosts().find((p) => p.slug === slug);
  if (fromCache) return fromCache;
  // Fallback: direct read (e.g. during generateStaticParams before cache warms)
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(mdPath)) return null;
  const raw = fs.readFileSync(mdPath, "utf-8");
  return parsePost(slug, raw);
}

export function getLatestPosts(count = 4): BlogPost[] {
  return [...getAllPosts()]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function getPopularPosts(count = 4): BlogPost[] {
  return [...getAllPosts()].sort((a, b) => b.views - a.views).slice(0, count);
}

export function getCategories(): string[] {
  const set = new Set<string>();
  for (const post of getAllPosts()) {
    if (post.category) set.add(post.category);
  }
  return Array.from(set).sort();
}

export function searchPosts(query: string): BlogPost[] {
  const lower = query.toLowerCase();
  return getAllPosts().filter(
    (post) =>
      post.title.toLowerCase().includes(lower) ||
      post.excerpt.toLowerCase().includes(lower) ||
      post.category.toLowerCase().includes(lower) ||
      post.author.toLowerCase().includes(lower)
  );
}
