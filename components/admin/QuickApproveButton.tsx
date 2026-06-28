"use client";

import { api, isOk } from "@/lib/api";

export function QuickApproveButton({ blogId }: { blogId: string }) {
  return (
    <button
      onClick={async () => {
        if (!confirm("Approve this blog?")) return;
        const { status } = await api.post(`/api/admin/blogs/${blogId}/approve`);
        if (isOk(status)) window.location.reload();
        else alert("Failed to approve");
      }}
      className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm font-medium border border-emerald-600/30 transition-colors"
    >
      ✓ Quick Approve
    </button>
  );
}
