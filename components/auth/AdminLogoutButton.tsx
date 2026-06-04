"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async (e) => {
        e.preventDefault();
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/backstage-b-smart-studio/login");
        router.refresh();
      }}
      className="w-full text-left px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors text-sm"
    >
      🚪 Sign out
    </button>
  );
}
