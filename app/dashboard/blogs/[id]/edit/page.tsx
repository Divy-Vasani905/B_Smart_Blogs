"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" /> }
);

const CATEGORIES = [
  "Savings", "Investing", "Budgeting", "Stocks", "Mutual Funds",
  "Cryptocurrency", "Real Estate", "Retirement", "Tax Planning",
  "Personal Finance", "Insurance", "Loans & Credit",
];

export default function EditBlogPage() {
const params = useParams<{ id?: string }>();
  const id = params?.id;
  const router = useRouter();

  const [initialLoading, setInitialLoading] = useState(true);
  const [blog, setBlog] = useState<Record<string, unknown> | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [focusKw, setFocusKw] = useState("");
  const [content, setContent] = useState<Record<string, unknown> | null>(null);

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/user/blogs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const b = data.data;
          setBlog(b);
          setTitle(b.title);
          setExcerpt(b.excerpt);
          setCategory(b.category);
          setTags((b.tags || []).join(", "));
          setThumbnail(b.thumbnail || "");
          setContent(b.content);
          if (b.seo) {
            setSeoTitle(b.seo.metaTitle || "");
            setSeoDesc(b.seo.metaDescription || "");
            setFocusKw(b.seo.focusKeyword || "");
          }
        }
      })
      .finally(() => setInitialLoading(false));
  }, [id]);

  const handleEditorChange = useCallback((json: Record<string, unknown>, _html: string) => {
    setContent(json);
  }, []);

  async function uploadThumbnail(file: File) {
    setThumbnailUploading(true);
    try {
      const fd = new FormData();
      fd.append("thumbnail", file);
      const res = await fetch("/api/upload/thumbnail", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setThumbnail(data.data.url);
      else setError(data.error || "Thumbnail upload failed");
    } finally { setThumbnailUploading(false); }
  }

  async function saveDraft() {
    if (!title || !excerpt || !category || !content) {
      setError("Title, excerpt, category, and content are required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const body = {
        title, excerpt, category, content,
        thumbnail,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        seo: { metaTitle: seoTitle, metaDescription: seoDesc, focusKeyword: focusKw },
      };
      const res = await fetch(`/api/user/blogs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!data.success) setError(data.error || "Save failed");
      else alert("Draft saved successfully!");
    } finally { setSaving(false); }
  }

  async function submitForReview() {
    await saveDraft();
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`/api/user/blogs/${id}/submit`, { method: "POST" });
      const data = await res.json();
      if (data.success) router.push("/dashboard/blogs");
      else setError(data.error || "Submit failed");
    } finally { setSubmitting(false); }
  }

  if (initialLoading) return <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />;
  if (!blog) return <div className="text-center py-20">Blog not found or you don&apos;t have permission to edit it.</div>;

  const reviews = (blog.reviewMessages as Record<string, unknown>[]) ?? [];
  const latestReview = reviews[reviews.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blogs" className="text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
            <p className="text-gray-500 text-sm mt-1">Make changes before resubmitting.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={saveDraft} disabled={saving}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-gray-300 text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "💾 Save"}
          </button>
          <button onClick={submitForReview} disabled={submitting || saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            {submitting ? "Submitting..." : "🚀 Submit for Review"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {blog.status === "changes_requested" && latestReview && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-3 text-orange-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Admin Feedback</h3>
            <p className="text-sm mt-1">{String(latestReview.message)}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Blog Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-base font-medium" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Excerpt / Summary *</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 text-sm resize-none" />
            </div>
          </div>
          {content && <TiptapEditor content={content} onChange={handleEditorChange} />}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm">Blog Details</h3>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm">
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Tags</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Thumbnail</h3>
            {thumbnail ? (
              <div className="relative">
                <img src={getCloudinaryUrl(thumbnail, 640)} alt="Thumbnail" className="w-full aspect-video object-cover rounded-xl" />
                <button onClick={() => setThumbnail("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400">
                <span className="text-2xl mb-1">🖼</span>
                <span className="text-xs text-gray-400">{thumbnailUploading ? "Uploading..." : "Click to upload"}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadThumbnail(f); }} />
              </label>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">SEO Settings</h3>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meta Title</label>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-xs" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meta Description</label>
              <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} maxLength={160} rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-xs resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Focus Keyword</label>
              <input value={focusKw} onChange={(e) => setFocusKw(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
