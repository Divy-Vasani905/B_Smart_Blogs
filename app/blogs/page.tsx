import Link from "next/link";
import Image from "next/image";
import { getPublishedBlogs, getCategories } from "@/services/blog.service";
import { getCloudinaryUrl } from "@/lib/utils";
import { Clock, Eye, Calendar, User, Search, ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 60; // ISR: 1 minute

export const metadata = {
  title: "All Blogs | B Smart Finance",
  description: "Browse all our personal finance and investment articles.",
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" ? parseInt(sp.page) : 1;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;

  const [blogData, categories] = await Promise.all([
    getPublishedBlogs({ page, limit: 12, search, category }),
    getCategories(),
  ]);

  const { blogs, totalPages, total } = blogData;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header Section */}
      <section className="bg-muted/30 border-b border-border py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Our Financial Insights
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explore {total} articles to help you master your money and build wealth.
          </p>

          {/* Search Bar */}
          <form className="relative max-w-xl mx-auto" action="/blogs" method="GET">
            {category && <input type="hidden" name="category" value={category} />}
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-sm font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 order-2 lg:order-1">
            {blogs.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No blogs found matching your criteria.</p>
                {(search || category) && (
                  <Link href="/blogs" className="text-primary hover:underline mt-2 inline-block">
                    Clear filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {blogs.map((blog: any) => {
                  const author = blog.author as Record<string, string>;
                  return (
                    <article
                      key={String(blog._id)}
                      className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                    >
                      {blog.thumbnail && (
                        <Link href={`/blog/${String(blog.slug)}`} className="aspect-video overflow-hidden bg-muted block">
                          <Image
                            src={getCloudinaryUrl(String(blog.thumbnail), 800)}
                            alt={String(blog.title)}
                            width={600}
                            height={338}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                      )}
                      <div className="flex flex-col flex-1 p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Link
                            href={`/blogs?category=${encodeURIComponent(String(blog.category))}`}
                            className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md"
                          >
                            {String(blog.category)}
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {String(blog.readingTime ?? 0)} min
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          <Link href={`/blog/${String(blog.slug)}`}>{String(blog.title)}</Link>
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                          {String(blog.excerpt)}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span className="truncate max-w-[100px]">{author?.name}</span>
                          </div>
                          <time className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(String(blog.publishedAt || blog.createdAt)).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-border">
                {page > 1 ? (
                  <Link
                    href={`/blogs?page=${page - 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 border border-transparent text-muted-foreground opacity-50 cursor-not-allowed text-sm font-medium">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </div>
                )}
                
                <span className="text-sm font-medium text-muted-foreground">
                  Page {page} of {totalPages}
                </span>

                {page < totalPages ? (
                  <Link
                    href={`/blogs?page=${page + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 border border-transparent text-muted-foreground opacity-50 cursor-not-allowed text-sm font-medium">
                    Next <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2 space-y-8">
            <div className="bg-muted/20 border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-lg text-foreground mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blogs"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !category
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    All Categories
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/blogs?category=${encodeURIComponent(c)}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === c
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
