import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s | B Smart Studio" },
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {children}
    </div>
  );
}
