/**
 * Migration Script: Markdown → MongoDB
 * Run: npx ts-node --project tsconfig.json scripts/migrate-md-to-mongodb.ts
 *
 * Converts all .md blog files in content/blog/ to MongoDB documents.
 * Safe to re-run (upserts by slug).
 */

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

// ── Minimal Schemas for migration ────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String,
  isActive: Boolean, emailVerified: Boolean, loginAttempts: Number,
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: String, slug: String, excerpt: String,
  content: mongoose.Schema.Types.Mixed, contentHtml: String,
  thumbnail: String, author: mongoose.Schema.Types.ObjectId,
  status: String, tags: [String], category: String,
  seo: mongoose.Schema.Types.Mixed, reviewMessages: [],
  views: Number, likes: Number, readingTime: Number,
  featuredImage: String, isFeature: Boolean, publishedAt: Date,
}, { timestamps: true });

function slugToTitle(slug: string): string {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function markdownToTiptapJson(markdown: string): Record<string, unknown> {
  // Split by double newline for paragraphs and headings
  const lines = markdown.split(/\n/);
  const nodes: unknown[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") continue;

    if (trimmed.startsWith("### ")) {
      nodes.push({ type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: trimmed.slice(4) }] });
    } else if (trimmed.startsWith("## ")) {
      nodes.push({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: trimmed.slice(3) }] });
    } else if (trimmed.startsWith("# ")) {
      nodes.push({ type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: trimmed.slice(2) }] });
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      nodes.push({ type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: trimmed.slice(2) }] }] }] });
    } else if (/^\d+\. /.test(trimmed)) {
      nodes.push({ type: "orderedList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: trimmed.replace(/^\d+\. /, "") }] }] }] });
    } else if (trimmed.startsWith("![")) {
      // Skip image markdown tags (they reference local assets)
      continue;
    } else if (trimmed.startsWith("|")) {
      // Skip table rows (preserve as plain text)
      nodes.push({ type: "paragraph", content: [{ type: "text", text: trimmed }] });
    } else {
      // Bold/italic inline parsing
      const text = trimmed
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/__(.+?)__/g, "$1");
      if (text) nodes.push({ type: "paragraph", content: [{ type: "text", text }] });
    }
  }

  return { type: "doc", content: nodes.length > 0 ? nodes : [{ type: "paragraph", content: [{ type: "text", text: "Content migrated from markdown." }] }] };
}

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove image tags
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^(?!<[a-z]).+$/gm, (line) => line.trim() ? `<p>${line.trim()}</p>` : "")
    .replace(/^---$/gm, "<hr>")
    .trim();
}

async function migrate() {
  console.log("🔄 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

  // Ensure a "legacy" system author exists
  let systemUser = await User.findOne({ email: "legacy@bsmartfinance.com" });
  if (!systemUser) {
    systemUser = await User.create({
      name: "B Smart Finance",
      email: "legacy@bsmartfinance.com",
      password: "migrated-no-login",
      role: "user",
      isActive: false,
      emailVerified: false,
      loginAttempts: 0,
    });
    console.log("✅ Created legacy author user");
  }

  const contentDir = path.join(process.cwd(), "content", "blog");
  if (!fs.existsSync(contentDir)) {
    console.log("⚠️  content/blog/ directory not found. Nothing to migrate.");
    process.exit(0);
  }

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
  console.log(`📄 Found ${files.length} markdown files to migrate\n`);

  let success = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");

    try {
      const { data, content } = matter(raw);
      const title = (data.title as string)?.trim() || slugToTitle(slug);
      const tiptapJson = markdownToTiptapJson(content);
      const contentHtml = markdownToHtml(content);

      const words = contentHtml.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(words / 200));

      const blogData = {
        title,
        slug,
        excerpt: data.excerpt || title,
        content: tiptapJson,
        contentHtml,
        thumbnail: data.imageUrl || "",
        author: systemUser._id,
        status: "published",
        tags: [(data.category as string)?.toLowerCase()].filter(Boolean),
        category: (data.category as string) || "Finance",
        seo: {
          metaTitle: title,
          metaDescription: data.excerpt || title,
        },
        reviewMessages: [],
        views: Number(data.views) || 0,
        likes: 0,
        readingTime,
        isFeature: false,
        publishedAt: data.date ? new Date(data.date as string) : new Date(),
      };

      await Blog.findOneAndUpdate(
        { slug },
        { $set: blogData },
        { upsert: true, new: true }
      );

      console.log(`✅ ${slug}`);
      success++;
    } catch (err) {
      console.error(`❌ ${slug}:`, err);
      failed++;
    }
  }

  console.log(`\n📊 Migration complete: ${success} succeeded, ${skipped} skipped, ${failed} failed`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
