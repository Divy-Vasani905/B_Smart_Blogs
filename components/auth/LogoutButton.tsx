"use client";

import { useAuth } from "@/context/AuthContext";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="text-sm text-gray-500 hover:text-red-500 transition-colors ml-2"
    >
      Sign out
    </button>
  );
}
