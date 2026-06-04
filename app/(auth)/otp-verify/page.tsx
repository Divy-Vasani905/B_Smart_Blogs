"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

function OtpVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams ? searchParams.get("email") || "" : "";
  const type = searchParams ? (searchParams.get("type") as "signup" | "login") || "login" : "login";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Cooldown timer for resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [cooldown]);

  // 2. Redirect back if parameters are missing
  useEffect(() => {
    if (!email) {
      router.push(type === "signup" ? "/signup" : "/login");
    }
  }, [email, type, router]);

  // 3. Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle value change for digit inputs
  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return; // Allow only numbers

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto-focus next input if a number is typed
    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    const completeOtp = newOtp.join("");
    if (completeOtp.length === 6) {
      handleSubmit(null, completeOtp);
    }
  };

  // Handle backspaces & arrow keys
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Focus previous input and clear it
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return; // Only allow exactly 6 digits

    const digits = pasteData.split("");
    setOtp(digits);
    handleSubmit(null, pasteData);
  };

  // Submit OTP code
  const handleSubmit = async (e: React.FormEvent | null, directOtp?: string) => {
    if (e) e.preventDefault();
    const code = directOtp || otp.join("");
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, type }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Verification failed");
        setLoading(false);
        return;
      }

      setSuccess(type === "signup" ? "Account created successfully!" : "Verification successful!");
      
      // Redirect based on role
      setTimeout(() => {
        if (data.data.role === "admin") {
          router.push("/backstage-b-smart-studio");
        } else {
          router.push("/");
        }
        router.refresh();
      }, 1000);

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Resend verification code
  const handleResend = async () => {
    if (!canResend) return;

    setError("");
    setSuccess("");
    setCanResend(false);
    setCooldown(60);

    try {
      const res = await fetch("/api/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to resend code");
        setCanResend(true);
        setCooldown(0);
        return;
      }

      setSuccess("A new verification code has been sent to your email.");
      // Reset OTP fields
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setCanResend(true);
      setCooldown(0);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-white">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={type === "signup" ? "/signup" : "/login"}
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {type === "signup" ? "Sign up" : "Sign in"}
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
          <span className="text-white text-2xl font-black">B</span>
        </div>
        <h1 className="text-2xl font-bold">Enter Verification Code</h1>
        <p className="text-gray-400 text-sm mt-2">
          We've sent a 6-digit code to <span className="text-indigo-300 font-medium">{email}</span>
        </p>
      </div>

      {/* Alert states */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 mb-5 text-emerald-400 text-sm animate-pulse">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="flex justify-between gap-2 max-w-xs mx-auto" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length !== 6}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin h-4 w-4" />
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </button>
      </form>

      {/* Resend Cooldown Section */}
      <div className="text-center mt-6">
        {canResend ? (
          <button
            onClick={handleResend}
            className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors cursor-pointer"
          >
            Resend Verification Code
          </button>
        ) : (
          <p className="text-gray-400 text-sm">
            Resend code in <span className="text-white font-medium">{cooldown}s</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-white text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
          <span className="text-white text-2xl font-black">B</span>
        </div>
        <h1 className="text-xl font-bold">Loading Verification...</h1>
      </div>
    }>
      <OtpVerifyContent />
    </Suspense>
  );
}
