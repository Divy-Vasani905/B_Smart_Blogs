"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) { setUsers(data.data.users); setTotal(data.data.total); setTotalPages(data.data.totalPages); }
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchUsers(); }, [page]);

  async function toggleStatus(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "PATCH" });
    fetchUsers();
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
            { href: "/backstage-b-smart-studio/blogs", label: "All Blogs", icon: "📝" },
            { href: "/backstage-b-smart-studio/users", label: "Users", icon: "👥", active: true },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.active ? "bg-violet-600/20 text-violet-300 border border-violet-600/30" : "text-gray-300 hover:text-white hover:bg-gray-800"}`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-1">{total} registered users</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" /></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {users.map((user) => (
                  <tr key={String(user._id)} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {String(user.name)[0]?.toUpperCase()}
                        </div>
                        <p className="text-white text-sm font-medium">{String(user.name)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{String(user.email)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${user.role === "admin" ? "bg-violet-500/15 text-violet-400" : "bg-gray-500/15 text-gray-400"}`}>
                        {String(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${user.isActive ? "text-emerald-400" : "text-red-400"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(String(user.createdAt)).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {user.role !== "admin" && (
                        <button onClick={() => toggleStatus(String(user._id))}
                          className={`text-xs transition-colors ${user.isActive ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"}`}>
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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
