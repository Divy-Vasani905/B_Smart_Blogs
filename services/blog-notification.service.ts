import { sendEmail, getBlogReviewEmailTemplate } from "@/lib/email";
import { SITE_URL } from "@/lib/site-config";
import User from "@/models/User";
import { connectDB } from "@/lib/db/mongoose";
import type { IBlogDocument } from "@/models/Blog";

type PopulatedAuthor = {
  _id: string;
  name?: string;
  email?: string;
};

function getAuthor(blog: IBlogDocument): PopulatedAuthor | null {
  const author = blog.author as unknown;
  if (!author || typeof author !== "object") return null;
  const doc = author as PopulatedAuthor;
  if (!doc.email) return null;
  return doc;
}

async function resolveAuthor(
  blog: IBlogDocument
): Promise<{ name: string; email: string } | null> {
  const populated = getAuthor(blog);
  if (populated?.email) {
    return { name: populated.name || "Writer", email: populated.email };
  }

  const authorId =
    typeof blog.author === "object" && blog.author !== null
      ? String((blog.author as { _id?: unknown })._id ?? blog.author)
      : String(blog.author);

  await connectDB();
  const user = await User.findById(authorId).select("name email").lean();
  if (!user?.email) return null;
  return { name: user.name || "Writer", email: user.email };
}

export async function notifyAuthorBlogApproved(blog: IBlogDocument): Promise<void> {
  const author = await resolveAuthor(blog);
  if (!author) return;

  const blogUrl = `${SITE_URL}/blog/${blog.slug}`;
  const html = getBlogReviewEmailTemplate({
    authorName: author.name,
    blogTitle: blog.title,
    type: "approve",
    dashboardUrl: `${SITE_URL}/dashboard/blogs`,
    blogUrl,
  });

  await sendEmail({
    to: author.email,
    subject: `Published: "${blog.title}" is live on B Smart Finance`,
    html,
  });
}

export async function notifyAuthorBlogRejected(
  blog: IBlogDocument,
  message: string
): Promise<void> {
  const author = await resolveAuthor(blog);
  if (!author) return;

  const html = getBlogReviewEmailTemplate({
    authorName: author.name,
    blogTitle: blog.title,
    type: "reject",
    message,
    dashboardUrl: `${SITE_URL}/dashboard/blogs`,
  });

  await sendEmail({
    to: author.email,
    subject: `Review update: "${blog.title}" was not approved`,
    html,
  });
}
