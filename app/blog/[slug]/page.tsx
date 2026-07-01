import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Clock, Eye, ArrowLeft, Calendar, User } from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";
import { getPublishedBlogBySlug, getRelatedBlogs } from "@/services/blog.service";
import { buildBlogPostMetadata } from "@/lib/blog-metadata";
import { getCloudinaryUrl } from "@/lib/utils";
import { BlogViewTracker } from "@/components/BlogViewTracker";
import { AdSenseScript } from "@/components/ads/AdSenseScript";
import { AdSlot } from "@/components/ads/AdSlot";
import { BlogArticleWithAds } from "@/components/ads/BlogArticleWithAds";
import { getAdSlotId } from "@/lib/adsense/config";

/** On-demand ISR — pages are generated on first visit, then revalidated. */
export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) return { title: "Post Not Found" };
  return buildBlogPostMetadata(blog);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getPublishedBlogBySlug(slug);
  if (!blog) notFound();

  const author = blog.author as unknown as Record<string, string>;
  const related = await getRelatedBlogs(String(blog._id), blog.category, 3);
  const leaderboardSlot = getAdSlotId("leaderboard");
  const bottomSlot = getAdSlotId("articleBottom");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.thumbnail || `${SITE_URL}/og-finance.png`,
    url: `${SITE_URL}/blog/${blog.slug}`,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: { "@type": "Person", name: author?.name ?? "B Smart Finance" },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${blog.slug}` },
    articleSection: blog.category,
    keywords: [blog.category, ...(blog.tags ?? [])].join(", "),
    wordCount: blog.contentHtml?.replace(/<[^>]+>/g, "").split(/\s+/).length,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blogs", item: `${SITE_URL}/blogs` },
      { "@type": "ListItem", position: 3, name: blog.title, item: `${SITE_URL}/blog/${blog.slug}` },
    ],
  };

  const titleBlock = !blog.thumbnail ? (
    <div className="mb-8">
      <span className="inline-block rounded-md bg-gradient-to-r from-violet-500 to-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
        {blog.category}
      </span>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{blog.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{author?.name}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{blog.readingTime} min read</span>
        <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{blog.views.toLocaleString()} views</span>
      </div>
    </div>
  ) : null;

  const footerBlock = (
    <>
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {blog.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-10 border-t border-border pt-6">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </div>
    </>
  );

  return (
    <>
      <AdSenseScript />
      <BlogViewTracker slug={blog.slug} />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      <div className="w-full">
        <article>
          <div className="border-b border-border bg-muted/20">
            <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                  <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
                  <li aria-hidden>/</li>
                  <li><Link href="/blogs" className="hover:text-foreground transition-colors">Blogs</Link></li>
                  <li aria-hidden>/</li>
                  <li className="truncate font-medium text-foreground" aria-current="page">{blog.title}</li>
                </ol>
              </nav>
            </div>
          </div>

          {blog.thumbnail && (
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-muted">
              <Image src={getCloudinaryUrl(blog.thumbnail, 1600)} alt={blog.title} fill className="object-cover" sizes="100vw" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
                <div className="container mx-auto">
                  <span className="inline-block rounded-md bg-gradient-to-r from-violet-500 to-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
                    {blog.category}
                  </span>
                  <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white drop-shadow sm:text-3xl md:text-4xl">
                    {blog.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/85">
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" aria-hidden />{author?.name}</span>
                    <time dateTime={String(blog.publishedAt || blog.createdAt)} className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" aria-hidden />
                      {new Date(String(blog.publishedAt || blog.createdAt)).toLocaleDateString("en-US", { dateStyle: "long" })}
                    </time>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden />{blog.readingTime} min read</span>
                    <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" aria-hidden />{blog.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard below hero */}
          <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <AdSlot slotId={leaderboardSlot} format="horizontal" fullWidthResponsive />
          </div>

          <BlogArticleWithAds
            contentHtml={blog.contentHtml ?? ""}
            headerBlock={titleBlock}
            footerBlock={footerBlock}
          />
        </article>

        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AdSlot slotId={bottomSlot} format="horizontal" fullWidthResponsive />
        </div>

        {related.length > 0 && (
          <section className="border-t border-border bg-muted/20 py-12" aria-labelledby="related-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 id="related-heading" className="mb-8 text-xl font-bold tracking-tight sm:text-2xl">You might also like</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(related as unknown as Record<string, unknown>[]).map((p) => (
                  <Link key={String(p._id)} href={`/blog/${String(p.slug)}`}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                    {Boolean(p.thumbnail) && (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <Image src={getCloudinaryUrl(String(p.thumbnail), 640)} alt={String(p.title)} width={400} height={225}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-4">
                      <span className="text-xs font-medium text-primary">{String(p.category)}</span>
                      <h3 className="font-semibold text-card-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {String(p.title)}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
