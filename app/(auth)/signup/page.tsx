'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", { ...form });
      if (!data.success) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push(`/otp-verify?email=${encodeURIComponent(form.email)}&type=signup`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg mb-4">
          <span className="text-white text-2xl font-black">B</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-gray-400 text-sm mt-1">Join B Smart Finance</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-0.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">Full Name</label>
          <input
            id="name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="space-y-0.5">
          <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
          <input
            id="username"
            placeholder="johndoe"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="space-y-0.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="space-y-0.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
