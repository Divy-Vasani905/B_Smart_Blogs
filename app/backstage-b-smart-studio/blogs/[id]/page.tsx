"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { getCloudinaryUrl } from "@/lib/utils";
import { api, isOk } from "@/lib/api";
import { SafeHtml } from "@/components/SafeHtml";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-96 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" /> }
);

export default function AdminBlogReviewPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const id = params?.id;
  // Guard against missing id
  if (!id) {
    // Redirect to blogs list if id is unavailable
    router.push('/backstage-b-smart-studio/blogs');
    return null;
  }
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState<"reject" | "changes" | null>(null);

  // Edit Mode States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>({
    title: "",
    excerpt: "",
    category: "",
    content: null,
    status: "",
  });

  const fetchBlog = useCallback(() => {
    setLoading(true);
    api.get(`/api/admin/blogs/${id}`)
      .then(({ data: d }) => {
        if (d.success) {
          setBlog(d.data);
          setEditForm({
            title: d.data.title,
            excerpt: d.data.excerpt,
            category: d.data.category,
            content: d.data.content,
            status: d.data.status,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  async function doAction(action: "approve" | "reject" | "request-changes") {
    if (action !== "approve" && !message.trim()) { toast.error("Please provide a message."); return; }
    setActionLoading(action);
    try {
      const url = `/api/admin/blogs/${id}/${action}`;
      const body = action === "approve" ? undefined : { message };
      const { status } = await api.post(url, body);
      if (isOk(status)) {
        toast.success(`Blog ${action.replace("-", " ")}d successfully`);
        router.push("/backstage-b-smart-studio/pending");
      } else { toast.error("Action failed."); }
    } finally { setActionLoading(""); }
  }

  async function handleAdminUpdate() {
    setActionLoading("updating");
    try {
      const { data } = await api.put(`/api/admin/blogs/${id}`, editForm);
      if (data.success) {
        toast.success("Blog updated by admin");
        setIsEditMode(false);
        fetchBlog();
      } else {
        toast.error(data.error || "Update failed");
      }
    } finally { setActionLoading(""); }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center"><p className="text-white text-lg">Blog not found</p>
        <Link href="/backstage-b-smart-studio" className="text-violet-400 text-sm mt-2 inline-block">← Back</Link>
      </div>
    </div>
  );

  const author = blog.author as any;
  const seo = blog.seo as any;
  const reviewMessages = (blog.reviewMessages as any[]) ?? [];
  const status = blog.status as string;

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/backstage-b-smart-studio/blogs" className="text-gray-400 hover:text-white transition-colors text-sm">← All Blogs</Link>
          <div className="w-px h-4 bg-gray-700" />
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
            status === "published" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
            status === "pending" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
            status === "changes_requested" ? "bg-orange-500/15 text-orange-400 border-orange-500/30" :
            status === "rejected" ? "bg-red-500/15 text-red-400 border-red-500/30" :
            "bg-gray-500/15 text-gray-400 border-gray-500/30"
          }`}>{status?.replace("_", " ")}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <>
              <button onClick={() => setIsEditMode(true)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 hover:text-white hover:border-gray-600 text-sm font-medium transition-colors">
                Edit Content
              </button>
              {status === "pending" && (
                <>
                  <button onClick={() => setShowMessageBox("changes")}
                    className="px-4 py-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600/30 text-sm font-medium transition-colors">
                    Request Changes
                  </button>
                  <button onClick={() => setShowMessageBox("reject")}
                    className="px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 text-sm font-medium transition-colors">
                    Reject
                  </button>
                  <button onClick={() => doAction("approve")} disabled={!!actionLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                    {actionLoading === "approve" ? "Approving..." : "✓ Approve & Publish"}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button onClick={() => setIsEditMode(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleAdminUpdate} disabled={!!actionLoading}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {actionLoading === "updating" ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Message box for reject/changes */}
        {showMessageBox && (
          <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-gray-900">
            <h3 className="text-white font-semibold mb-3">
              {showMessageBox === "reject" ? "Rejection Reason" : "Changes Required"}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={showMessageBox === "reject" ? "Explain why this blog is rejected..." : "Describe the changes needed..."}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
            />
            <div className="flex gap-3 mt-3">
              <button onClick={() => doAction(showMessageBox === "reject" ? "reject" : "request-changes")}
                disabled={!!actionLoading}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {actionLoading ? "Sending..." : "Send Feedback"}
              </button>
              <button onClick={() => { setShowMessageBox(null); setMessage(""); }}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Blog Content */}
        {isEditMode ? (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Excerpt</label>
                <textarea
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                    <option value="changes_requested">Changes Requested</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden">
              <TiptapEditor
                content={editForm.content}
                onChange={(json) => setEditForm({ ...editForm, content: json })}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Boolean(blog.thumbnail) && (
              <img src={getCloudinaryUrl(String(blog.thumbnail), 1200)} alt="" className="w-full aspect-video object-cover rounded-2xl shadow-2xl shadow-black/50" />
            )}

            <div>
              <p className="text-violet-400 text-sm font-bold tracking-widest uppercase mb-2">{String(blog.category)}</p>
              <h1 className="text-4xl font-extrabold text-white leading-tight">{String(blog.title)}</h1>
              <p className="text-gray-400 mt-4 text-lg leading-relaxed">{String(blog.excerpt)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 py-6 border-y border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden border border-gray-700">
                  {author?.avatar && <img src={getCloudinaryUrl(author.avatar, 64)} className="w-full h-full object-cover" />}
                </div>
                <span>By <span className="text-white font-medium">{author?.name}</span></span>
              </div>
              <span>{author?.email}</span>
              <span>{String(blog.readingTime ?? 0)} min read</span>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-2xl">
              <SafeHtml
                html={String(blog.contentHtml ?? "")}
                className="prose prose-indigo prose-lg max-w-none prose-img:rounded-2xl"
              />
            </div>

            {reviewMessages.length > 0 && (
              <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800">
                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                  <span>📜</span> Review History
                </h2>
                <div className="space-y-4">
                  {reviewMessages.slice().reverse().map((r, i) => (
                    <div key={i} className={`p-5 rounded-2xl border text-sm ${
                      r.type === "approve" ? "border-emerald-800/50 bg-emerald-950/20 text-emerald-300" :
                      r.type === "reject" ? "border-red-800/50 bg-red-950/20 text-red-300" :
                      "border-orange-800/50 bg-orange-950/20 text-orange-300"
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold uppercase tracking-wider text-[10px] opacity-80">{r.type.replace("_", " ")}</span>
                        <span className="text-[10px] opacity-50">{new Date(String(r.reviewedAt)).toLocaleString()}</span>
                      </div>
                      <p className="leading-relaxed">{String(r.message)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
