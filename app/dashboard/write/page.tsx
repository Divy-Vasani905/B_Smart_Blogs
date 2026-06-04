"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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

export default function WriteBlogPage() {
  const router = useRouter();
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
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleEditorChange = useCallback((json: Record<string, unknown>, _html: string) => {
    setContent(json);
  }, []);

  async function uploadThumbnail(file: File) {
    setThumbnailUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("thumbnail", file);
      const res = await fetch("/api/upload/thumbnail", { method: "POST", body: fd });
      
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        throw new Error(`Server returned an invalid response (${res.status}).`);
      }

      if (data.success) {
        setThumbnail(data.data.url);
      } else {
        setError(data.error || "Thumbnail upload failed");
      }
    } catch (err: any) {
      console.error("[Upload Error]", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally { 
      setThumbnailUploading(false); 
    }
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
      const url = savedId ? `/api/user/blogs/${savedId}` : "/api/user/blogs";
      const method = savedId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) { setSavedId(data.data._id); }
      else setError(data.error || "Save failed");
    } finally { setSaving(false); }
  }

  async function submitForReview() {
    if (!savedId) { await saveDraft(); }
    if (!savedId) return;
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`/api/user/blogs/${savedId}/submit`, { method: "POST" });
      const data = await res.json();
      if (data.success) router.push("/dashboard/blogs");
      else setError(data.error || "Submit failed");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Write a Blog</h1>
          <p className="text-gray-500 text-sm mt-1">Your blog will be reviewed before publishing.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={saveDraft} disabled={saving}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-gray-300 text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "💾 Save Draft"}
          </button>
          <button onClick={submitForReview} disabled={submitting || saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            {submitting ? "Submitting..." : "🚀 Submit for Review"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}
      {savedId && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
          ✓ Draft saved automatically
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Blog Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Write a compelling title..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 text-base font-medium"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Excerpt / Summary *</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Brief summary (50–500 chars)..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 text-sm resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{excerpt.length}/500</p>
            </div>
          </div>

          {/* Tiptap Editor */}
          <TiptapEditor onChange={handleEditorChange} placeholder="Start writing your blog content..." />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category & Tags */}
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
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="savings, investing, sip (comma-separated)"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-sm"
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Thumbnail</h3>
            {thumbnail ? (
              <div className="relative">
                <img src={getCloudinaryUrl(thumbnail, 640)} alt="Thumbnail" className="w-full aspect-video object-cover rounded-xl" />
                <button onClick={() => setThumbnail("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors">
                <span className="text-2xl mb-1">🖼</span>
                <span className="text-xs text-gray-400">{thumbnailUploading ? "Uploading..." : "Click to upload (max 5MB)"}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={(e) => { 
                    const f = e.target.files?.[0]; 
                    if (f) uploadThumbnail(f); 
                    e.target.value = ""; // Reset input so same file can be selected again
                  }}
                />
              </label>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">SEO Settings</h3>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meta Title <span className="text-gray-300">(max 70)</span></label>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} placeholder="Leave blank to use blog title"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Meta Description <span className="text-gray-300">(max 160)</span></label>
              <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} maxLength={160} rows={2} placeholder="Leave blank to use excerpt"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-xs resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Focus Keyword</label>
              <input value={focusKw} onChange={(e) => setFocusKw(e.target.value)} placeholder="e.g. mutual funds India"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
