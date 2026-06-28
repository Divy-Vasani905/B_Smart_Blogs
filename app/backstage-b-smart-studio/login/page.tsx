"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showOtp && cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    } else if (showOtp && cooldown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [showOtp, cooldown]);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { ...form, intent: "admin" });

      if (!data.success) {
        setError(data.error || "Authentication failed");
        return;
      }

      setPendingEmail(form.email);
      setShowOtp(true);
      setOtpCode("");
      setCooldown(60);
      setCanResend(false);
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/otp/verify", {
        email: pendingEmail,
        code: otpCode,
        type: "login",
      });

      if (!data.success) {
        setError(data.error || "Verification failed");
        return;
      }

      if (data.data?.role !== "admin") {
        await api.post("/api/auth/logout");
        setError("Access denied. Admin credentials required.");
        setShowOtp(false);
        setOtpCode("");
        return;
      }

      router.push("/backstage-b-smart-studio");
      router.refresh();
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!canResend) return;

    setError("");
    setCanResend(false);
    setCooldown(60);
    try {
      const { data } = await api.post("/api/auth/otp/resend", {
        email: pendingEmail,
        type: "login",
      });

      if (!data.success) {
        setError(data.error || "Failed to resend code");
        setCanResend(true);
        setCooldown(0);
      }
    } catch {
      setError("Connection failed. Please try again.");
      setCanResend(true);
      setCooldown(0);
    }
  }

  function handleBackToCredentials() {
    setShowOtp(false);
    setOtpCode("");
    setError("");
    setCooldown(60);
    setCanResend(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-2xl shadow-violet-500/30 mb-5">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Studio</h1>
          <p className="text-gray-500 text-sm mt-1">Restricted access — authorized personnel only</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {!showOtp ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              {error && <ErrorBanner message={error} />}

              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                  placeholder="admin@bsmartfinance.com"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 text-sm mt-2"
              >
                {loading ? <LoadingLabel text="Verifying..." /> : "Continue"}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-center text-sm text-gray-400">
                Verification code sent to{" "}
                <span className="font-semibold text-violet-400">{pendingEmail}</span>
              </p>

              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="admin-otp" className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    6-Digit Code
                  </label>
                  <input
                    id="admin-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-center tracking-[0.5em] text-lg font-bold placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    placeholder="000000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25 text-sm"
                >
                  {loading ? <LoadingLabel text="Verifying..." /> : "Verify & Sign In"}
                </button>
              </form>

              <div className="text-center space-y-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm font-semibold text-violet-400 hover:text-violet-300 hover:underline"
                  >
                    Resend code
                  </button>
                ) : (
                  <p className="text-xs text-gray-500">
                    Resend code in <span className="font-medium text-gray-300">{cooldown}s</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="block w-full text-xs text-gray-500 hover:text-gray-400"
                >
                  ← Back to login
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Session expires when browser closes
        </p>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 bg-red-950/50 border border-red-800/50 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  );
}

function LoadingLabel({ text }: { text: string }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      {text}
    </span>
  );
}
