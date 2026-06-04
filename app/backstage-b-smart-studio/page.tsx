import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import { getDashboardStats } from "@/services/admin.service";
import { AdminLogoutButton } from "@/components/auth/AdminLogoutButton";
import Link from "next/link";

function StatCard({
  label,
  value,
  color,
  href,
}: {
  label: string;
  value: number;
  color: string;
  href?: string;
}) {
  const content = (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors ${href ? "cursor-pointer" : ""}`}
    >
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className={`text-4xl font-bold mt-2 ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/backstage-b-smart-studio/login");

  const stats = await getDashboardStats();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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
            { href: "/backstage-b-smart-studio/pending", label: "Review Queue", icon: "🔍", badge: stats.pendingBlogs },
            { href: "/backstage-b-smart-studio/blogs", label: "All Blogs", icon: "📝" },
            { href: "/backstage-b-smart-studio/users", label: "Users", icon: "👥" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {item.badge ? (
                <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {session.name?.[0]?.toUpperCase() ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session.name}</p>
              <p className="text-gray-500 text-xs truncate">{session.email}</p>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, {session.name}. Here&apos;s an overview.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Blogs" value={stats.totalBlogs} color="text-white" />
            <StatCard
              label="Published"
              value={stats.publishedBlogs}
              color="text-emerald-400"
              href="/backstage-b-smart-studio/blogs?status=published"
            />
            <StatCard
              label="Pending Review"
              value={stats.pendingBlogs}
              color="text-amber-400"
              href="/backstage-b-smart-studio/pending"
            />
            <StatCard
              label="Total Views"
              value={stats.totalViews}
              color="text-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Drafts" value={stats.draftBlogs} color="text-gray-300" />
            <StatCard
              label="Changes Requested"
              value={stats.changesRequestedBlogs}
              color="text-orange-400"
            />
            <StatCard
              label="Rejected"
              value={stats.rejectedBlogs}
              color="text-red-400"
            />
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              color="text-blue-400"
              href="/backstage-b-smart-studio/users"
            />
          </div>

          {/* Recent Blogs */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">Recent Submissions</h2>
              <Link
                href="/backstage-b-smart-studio/blogs"
                className="text-violet-400 hover:text-violet-300 text-sm transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="divide-y divide-gray-800">
              {stats.recentBlogs.length === 0 && (
                <p className="text-gray-500 text-sm px-6 py-8 text-center">
                  No blogs yet.
                </p>
              )}
              {stats.recentBlogs.map((blog: any) => {
                const status = blog.status as string;
                const statusColors: Record<string, string> = {
                  published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
                  draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
                  changes_requested: "bg-orange-500/15 text-orange-400 border-orange-500/30",
                  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
                };
                return (
                  <div key={String(blog._id)} className="flex items-center gap-4 px-6 py-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {String(blog.title)}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        by {(blog.author as Record<string, string>)?.name ?? "Unknown"} ·{" "}
                        {blog.category as string}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        statusColors[status] ?? statusColors.draft
                      }`}
                    >
                      {status.replace("_", " ")}
                    </span>
                    <Link
                      href={`/backstage-b-smart-studio/blogs/${String(blog._id)}`}
                      className="text-gray-400 hover:text-white text-xs transition-colors ml-2"
                    >
                      Review →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
