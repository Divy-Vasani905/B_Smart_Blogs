import { getServerSession } from "@/lib/auth/session";
import { getUserBlogs } from "@/services/blog.service";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, { label: string; color: string; desc: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600", desc: "Not submitted yet" },
  pending: { label: "Under Review", color: "bg-amber-100 text-amber-700", desc: "Admin is reviewing" },
  published: { label: "Published", color: "bg-emerald-100 text-emerald-700", desc: "Live on site" },
  changes_requested: { label: "Changes Needed", color: "bg-orange-100 text-orange-700", desc: "See feedback below" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", desc: "See feedback" },
};

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/");

  const blogs = await getUserBlogs(session.userId);
  const counts = {
    total: blogs.length,
    published: blogs.filter((b: any) => b.status === "published").length,
    pending: blogs.filter((b: any) => b.status === "pending").length,
    draft: blogs.filter((b: any) => b.status === "draft").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your blogs and track their review status.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Blogs", value: counts.total, color: "text-gray-900" },
          { label: "Published", value: counts.published, color: "text-emerald-600" },
          { label: "Under Review", value: counts.pending, color: "text-amber-600" },
          { label: "Drafts", value: counts.draft, color: "text-gray-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-gray-400 text-xs font-medium">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/dashboard/write" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
          ✏️ Write New Blog
        </Link>
        <Link href="/dashboard/blogs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-colors">
          📋 My Blogs
        </Link>
      </div>

      {/* Recent Blogs */}
      {blogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Blogs</h2>
            <Link href="/dashboard/blogs" className="text-indigo-600 text-sm hover:text-indigo-500 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(blogs as any[]).slice(0, 5).map((blog) => {
              const s = STATUS_MAP[blog.status as string] ?? STATUS_MAP.draft;
              return (
                <div key={String(blog._id)} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm truncate">{String(blog.title)}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{String(blog.category)} · {String(blog.readingTime ?? 0)} min read</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${s.color}`}>{s.label}</span>
                  {(blog.status === "draft" || blog.status === "changes_requested") && (
                    <Link href={`/dashboard/blogs/${String(blog._id)}/edit`} className="text-indigo-600 hover:text-indigo-500 text-xs transition-colors">Edit</Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {blogs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">✍️</div>
          <h2 className="text-gray-900 font-semibold">No blogs yet</h2>
          <p className="text-gray-400 text-sm mt-2">Start writing your first financial blog!</p>
          <Link href="/dashboard/write" className="inline-flex mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
            Write Now
          </Link>
        </div>
      )}
    </div>
  );
}
