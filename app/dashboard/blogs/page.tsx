"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Eye, Trash2, AlertCircle } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";
import { api, isOk } from "@/lib/api";

type BlogStatus = "draft" | "pending" | "published" | "changes_requested" | "rejected";

const STATUS_INFO: Record<BlogStatus, { label: string; bg: string; text: string; border: string }> = {
  published: { label: "Published", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  pending: { label: "Under Review", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
  changes_requested: { label: "Changes Needed", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const { data } = await api.get("/api/user/blogs");
      if (data.success) setBlogs(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBlogs(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this draft? This cannot be undone.")) return;
    const { status } = await api.delete(`/api/user/blogs/${id}`);
    if (isOk(status)) fetchBlogs();
    else alert("Failed to delete blog. Ensure it is still a draft.");
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your written content.</p>
        </div>
        <Link href="/dashboard/write" className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
          Write New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-4xl mb-3">📝</div>
          <h2 className="text-gray-900 font-medium">No blogs found</h2>
          <p className="text-gray-500 text-sm mt-1">You haven&apos;t written any blogs yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => {
            const status = blog.status as BlogStatus;
            const info = STATUS_INFO[status] || STATUS_INFO.draft;
            const reviews = (blog.reviewMessages as Record<string, unknown>[]) ?? [];
            const latestReview = reviews[reviews.length - 1];

            return (
              <div key={String(blog._id)} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                    {blog.thumbnail ? (
                      <img src={getCloudinaryUrl(String(blog.thumbnail), 384)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                          {String(blog.category)}
                        </span>
                        <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{String(blog.title)}</h2>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border ${info.bg} ${info.text} ${info.border}`}>
                        {info.label}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{String(blog.excerpt)}</p>

                    <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-2">
                        <span>Updated {new Date(String(blog.updatedAt)).toLocaleDateString()}</span>
                        {status === "published" && <span>{Number(blog.views).toLocaleString()} views</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        {status === "published" ? (
                          <Link href={`/blog/${String(blog.slug)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                            <Eye className="w-4 h-4" /> View Live
                          </Link>
                        ) : (
                          <Link href={`/blog/${String(blog.slug)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                            <Eye className="w-4 h-4" /> Preview
                          </Link>
                        )}
                        
                        {(status === "draft" || status === "changes_requested") && (
                          <>
                            <Link href={`/dashboard/blogs/${String(blog._id)}/edit`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium">
                              <Edit2 className="w-4 h-4" /> Edit
                            </Link>
                            {status === "draft" && (
                              <button onClick={() => handleDelete(String(blog._id))} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Feedback Alert */}
                {(status === "changes_requested" || status === "rejected") && latestReview && (
                  <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 border ${status === "rejected" ? "bg-red-50 border-red-100 text-red-800" : "bg-orange-50 border-orange-100 text-orange-800"}`}>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Admin Feedback</p>
                      <p className="text-sm mt-1">{String(latestReview.message)}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
