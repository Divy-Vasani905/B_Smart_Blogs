import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog-types";
import { Clock, Eye, User, Calendar } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";

const categoryGradients: Record<string, string> = {
  Investing: "from-emerald-500 to-teal-600",
  Savings: "from-blue-500 to-indigo-500",
  Cryptocurrency: "from-orange-400 to-amber-500",
  Markets: "from-red-500 to-rose-600",
  Retirement: "from-violet-500 to-purple-600",
  "Real Estate": "from-cyan-500 to-blue-500",
  Budgeting: "from-lime-500 to-green-600",
  Banking: "from-sky-500 to-blue-600",
  Credit: "from-slate-600 to-slate-800",
  Education: "from-amber-400 to-orange-500",
  Planning: "from-fuchsia-500 to-pink-600",
};

interface BlogCardProps {
  post: BlogPost;
  /** Pass true for the first 1–2 visible cards to prioritize LCP image loading */
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const gradient =
    categoryGradients[post.category] || "from-violet-500 to-blue-600";

  // Request a 640px-wide optimized image from Cloudinary CDN;
  // Next.js will further scale it per the `sizes` hint.
  const optimizedSrc = getCloudinaryUrl(post.imageUrl, 640);

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted sm:aspect-video">
          <Image
            src={optimizedSrc}
            alt={post.title}
            fill
            priority={priority}
            quality={75}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <span
            className={`absolute left-3 top-3 rounded-md bg-gradient-to-r ${gradient} px-2 py-1 text-xs font-semibold text-white shadow`}
          >
            {post.category}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          <h2 className="line-clamp-2 text-base font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary sm:text-lg">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>

          {/* Author & date */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" aria-hidden />
                {post.author}
              </span>
            )}
            {post.date && (
              <time
                dateTime={post.date}
                className="flex items-center gap-1"
              >
                <Calendar className="h-3 w-3" aria-hidden />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            )}
          </div>

          {/* Read time & views */}
          <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              {post.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

