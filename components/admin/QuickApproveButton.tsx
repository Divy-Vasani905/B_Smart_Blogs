"use client";

export function QuickApproveButton({ blogId }: { blogId: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Approve this blog?")) return;
        const res = await fetch(`/api/admin/blogs/${blogId}/approve`, { method: "POST" });
        if (res.ok) window.location.reload();
        else alert("Failed to approve");
      }}
      className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm font-medium border border-emerald-600/30 transition-colors"
    >
      ✓ Quick Approve
    </button>
  );
}
