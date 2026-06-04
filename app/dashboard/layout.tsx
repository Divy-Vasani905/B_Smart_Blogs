import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard top nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-black">B</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">B Smart Finance</span>
          </a>
          <div className="hidden sm:flex items-center gap-1">
            {[
              { href: "/dashboard", label: "Overview" },
              { href: "/dashboard/write", label: "Write" },
              { href: "/dashboard/blogs", label: "My Blogs" },
              { href: "/dashboard/profile", label: "Profile" },
            ].map((item) => (
              <a key={item.href} href={item.href}
                className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors font-medium">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {session.name?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">{session.name}</span>
          <LogoutButton />
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
