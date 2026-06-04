import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { getPendingBlogs } from "@/services/admin.service";
import { QuickApproveButton } from "@/components/admin/QuickApproveButton";
import Link from "next/link";
import { getCloudinaryUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PendingReviewPage() {
  const session = await getAdminSession();
  if (!session) redirect("/backstage-b-smart-studio/login");

  const blogs = await getPendingBlogs();

  return (
    <div className="flex h-screen">
      {/* Sidebar — reuse same sidebar structure */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
              <span className="text-white text-sm font-black">B</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">B Smart Studio</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { href: "/backstage-b-smart-studio", label: "Dashboard", icon: "📊" },
            { href: "/backstage-b-smart-studio/pending", label: "Review Queue", icon: "🔍", active: true },
            { href: "/backstage-b-smart-studio/blogs", label: "All Blogs", icon: "📝" },
            { href: "/backstage-b-smart-studio/users", label: "Users", icon: "👥" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-600/30"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Review Queue</h1>
          <p className="text-gray-400 text-sm mt-1">
            {blogs.length} blog{blogs.length !== 1 ? "s" : ""} pending review
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-white text-xl font-semibold">All caught up!</h2>
            <p className="text-gray-400 text-sm mt-2">No blogs pending review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog: any) => {
              const author = blog.author as Record<string, string>;
              return (
                <div
                  key={String(blog._id)}
                  className="bg-gray-900 border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-lg font-medium">
                          Pending Review
                        </span>
                        <span className="text-gray-600 text-xs">{blog.category as string}</span>
                      </div>
                      <h2 className="text-white font-semibold text-lg">{String(blog.title)}</h2>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{String(blog.excerpt)}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>By <span className="text-gray-300">{author?.name}</span></span>
                        <span>{String(blog.readingTime ?? 0)} min read</span>
                        <span>
                          {new Date(String(blog.updatedAt)).toLocaleDateString("en-US", { dateStyle: "medium" })}
                        </span>
                      </div>
                      {/* Tags */}
                      {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {(blog.tags as string[]).slice(0, 5).map((tag) => (
                            <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-lg">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {blog.thumbnail && (
                      <img
                        src={getCloudinaryUrl(String(blog.thumbnail), 192)}
                        alt=""
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-800">
                    <Link
                      href={`/backstage-b-smart-studio/blogs/${String(blog._id)}`}
                      className="flex-1 text-center py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
                    >
                      Full Review
                    </Link>
                    <QuickApproveButton blogId={String(blog._id)} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

