"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blog-data";
import { BlogCard } from "@/components/BlogCard";
import { Search, SlidersHorizontal } from "lucide-react";

type Tab = "all" | "latest" | "popular";

interface BlogsClientProps {
  initialSearch: string;
  posts: BlogPost[];
  categories: string[];
}

export function BlogsClient({ initialSearch, posts, categories }: BlogsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [tab, setTab] = useState<Tab>("all");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    let list = posts;

    // Category filter
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
    }

    // Sort
    if (tab === "latest")
      return [...list].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    if (tab === "popular") return [...list].sort((a, b) => b.views - a.views);
    return list;
  }, [search, tab, activeCategory, posts]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = search.trim();
      if (q) router.push(`/blogs?search=${encodeURIComponent(q)}`);
      else router.push("/blogs");
    },
    [search, router]
  );

  const allCategories = ["All", ...categories];

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="border-b border-border bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wider text-violet-600">
            Explore
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              All Posts
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse and search our collection of articles.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

        {/* Controls row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="flex rounded-lg border border-border bg-muted/30 p-1">
            {(["all", "latest", "popular"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors sm:px-5 ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full sm:max-w-[280px]"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Search blog posts"
            />
          </form>
        </div>

        {/* Category Pills */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="mb-6 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"} found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
            No posts found. Try a different search or category.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {filtered.map((post) => (
              <article key={post.slug} role="listitem">
                <BlogCard post={post} />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
