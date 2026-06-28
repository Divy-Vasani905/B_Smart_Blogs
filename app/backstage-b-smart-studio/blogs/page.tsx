"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, isOk } from "@/lib/api";

type BlogStatus = "draft" | "pending" | "published" | "changes_requested" | "rejected";
const STATUS_COLORS: Record<BlogStatus, string> = {
  published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  changes_requested: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  rejected: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12", ...(status ? { status } : {}), ...(search ? { search } : {}) });
      const { data } = await api.get(`/api/admin/blogs?${params}`);
      if (data.success) { setBlogs(data.data.blogs); setTotal(data.data.total); setTotalPages(data.data.totalPages); }
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchBlogs(); }, [page, status]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog permanently?")) return;
    const { status } = await api.delete(`/api/admin/blogs/${id}`);
    if (isOk(status)) fetchBlogs();
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center"><span className="text-white text-sm font-black">B</span></div>
            <div><p className="text-white font-semibold text-sm">B Smart Studio</p><p className="text-gray-500 text-xs">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { href: "/backstage-b-smart-studio", label: "Dashboard", icon: "📊" },
            { href: "/backstage-b-smart-studio/pending", label: "Review Queue", icon: "🔍" },
            { href: "/backstage-b-smart-studio/blogs", label: "All Blogs", icon: "📝", active: true },
            { href: "/backstage-b-smart-studio/users", label: "Users", icon: "👥" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? "bg-violet-600/20 text-violet-300 border border-violet-600/30" : "text-gray-300 hover:text-white hover:bg-gray-800"}`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">All Blogs</h1>
            <p className="text-gray-400 text-sm mt-1">{total} total blogs</p>
          </div>
        </div>
        <div className="flex gap-3 mb-6">
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setPage(1); fetchBlogs(); } }} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
            <option value="">All Statuses</option>
            {["published", "pending", "draft", "changes_requested", "rejected"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" /></div>
          ) : blogs.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-16">No blogs found.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Title", "Author", "Category", "Status", "Views", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {blogs.map((blog) => {
                  const st = blog.status as BlogStatus;
                  const author = blog.author as Record<string, string>;
                  return (
                    <tr key={String(blog._id)} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3"><p className="text-white text-sm font-medium truncate max-w-[200px]">{String(blog.title)}</p></td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{author?.name}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{String(blog.category)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_COLORS[st] ?? STATUS_COLORS.draft}`}>
                          {st?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{Number(blog.views).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/backstage-b-smart-studio/blogs/${String(blog._id)}`} className="text-violet-400 hover:text-violet-300 text-xs transition-colors">Review</Link>
                          <button onClick={() => handleDelete(String(blog._id))} className="text-red-400 hover:text-red-300 text-xs transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white disabled:opacity-40 text-sm">← Prev</button>
            <span className="text-gray-400 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white disabled:opacity-40 text-sm">Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}
