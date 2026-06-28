import Link from "next/link";
import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog-types";
import { BlogCard } from "@/components/BlogCard";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_KEYWORDS } from "@/lib/site-config";
import { ArrowRight, TrendingUp } from "lucide-react";
import { getLatestBlogs, getPopularBlogs, getPublishedBlogsCount } from "@/services/blog.service";

export const revalidate = 60; // Revalidate homepage every 60 seconds (ISR)

const HOME_TITLE = "B Smart Finance – Smart Investing & Money Tips";
const HOME_DESCRIPTION =
  "Expert insights on investing, stock markets, crypto, and wealth building. Master your money with clear, practical financial guides.";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
};

function mapMongoToBlogPost(blog: any): BlogPost {
  const author = blog.author as Record<string, any> | undefined;
  const authorName = author?.name || "B Smart Finance";

  return {
    id: String(blog._id),
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.contentHtml || "",
    author: authorName,
    date: String(blog.publishedAt || blog.createdAt),
    category: blog.category,
    imageUrl: blog.thumbnail || "/og-finance.png",
    readTime: `${blog.readingTime || 5} min read`,
    views: Number(blog.views) || 0,
  };
}

async function getData() {
  const [latestBlogs, popularBlogs, count] = await Promise.all([
    getLatestBlogs(4),
    getPopularBlogs(4),
    getPublishedBlogsCount(),
  ]);

  return {
    latest: latestBlogs.map(mapMongoToBlogPost),
    popular: popularBlogs.map(mapMongoToBlogPost),
    totalCount: count,
  };
}

export default async function HomePage() {
  const { latest, popular, totalCount } = await getData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/blogs?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#homepage`,
        url: SITE_URL,
        name: HOME_TITLE,
        description: HOME_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-16 sm:py-20 md:py-28 lg:py-32"
        aria-label="Introduction"
      >
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="animate-blob absolute -left-20 top-0 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl md:h-72 md:w-72" />
          <div className="animation-delay-2000 animate-blob absolute right-0 top-1/4 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl md:h-72 md:w-72" />
          <div className="animation-delay-4000 animate-blob absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl md:h-72 md:w-72" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
              Growing community with  {totalCount} smart blogs
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Master Your Money
              </span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground sm:text-xl md:mt-6">
              Expert insights on investing, stock markets, and wealth building —{" "}
              <span className="font-medium text-foreground">your roadmap to financial freedom.</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/blogs"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Browse all posts <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
              >
                About us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Posts ── */}
      <section
        className="border-b border-border bg-gradient-to-br from-orange-50/60 via-amber-50/60 to-yellow-50/60 py-12 sm:py-16 md:py-20"
        aria-labelledby="latest-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-orange-600">
                Fresh content
              </p>
              <h2
                id="latest-heading"
                className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
              >
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Latest posts
                </span>
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {latest.map((post: BlogPost, index: number) => (
              <div key={post.slug} role="listitem">
                {/* priority on first 2 cards — they are above-the-fold on desktop */}
                <BlogCard post={post} priority={index < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Posts ── */}
      <section
        className="bg-gradient-to-br from-green-50/60 via-teal-50/60 to-cyan-50/60 py-12 sm:py-16 md:py-20"
        aria-labelledby="popular-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-green-600">
                Most read
              </p>
              <h2
                id="popular-heading"
                className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
              >
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Popular posts
                </span>
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            role="list"
          >
            {popular.map((post: BlogPost, index: number) => (
              <div key={post.slug} role="listitem">
                <BlogCard post={post} priority={index < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="border-t border-border bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 py-14 sm:py-16"
        aria-labelledby="cta-heading"
      >
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2
            id="cta-heading"
            className="text-2xl font-bold text-white sm:text-3xl"
          >
            Ready to level up your skills?
          </h2>
          <p className="mt-3 text-white/80">
            Explore all our articles on web development, design, and more.
          </p>
          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow transition-all hover:bg-white/90 hover:shadow-md"
          >
            Start reading <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
