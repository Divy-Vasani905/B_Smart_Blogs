"use client";

/**
 * Custom-styled "Continue with Google" button.
 *
 * Uses Google's Sign In With Google (ID token / credential flow) via
 * @react-oauth/google. A transparent Google button sits on top of our
 * styled label so clicks always reach Google's SDK.
 *
 * Flow:
 * 1. User clicks → Google account picker opens
 * 2. Google returns a signed ID token (credential JWT)
 * 3. POST /api/auth/google with { credential }
 * 4. Backend verifies the token and issues JWT cookies
 */

import { GoogleLogin, CredentialResponse, useGoogleOAuth } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth.config";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
}

function GoogleG() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-gray-500 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

const buttonClassName = `
  w-full flex items-center justify-center gap-3
  h-10 sm:h-11 px-4 rounded-lg
  bg-white border border-gray-300
  text-gray-700 text-xs sm:text-sm font-semibold
  shadow-sm
  pointer-events-none
`;

function GoogleLoginButtonInner({ onSuccess }: GoogleLoginButtonProps) {
  const router = useRouter();
  const { login } = useAuth();
  const { scriptLoadedSuccessfully } = useGoogleOAuth();
  const [loading, setLoading] = useState(false);

  const handleCredentialSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Google sign-in failed. No credential received.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/google", {
        credential: response.credential,
      });

      if (!data.success) {
        toast.error(data.error || "Google sign-in failed. Please try again.");
        setLoading(false);
        return;
      }

      login(data.data);
      toast.success("Signed in with Google successfully!");

      onSuccess?.();
      setTimeout(() => {
        router.refresh();
        router.push("/");
      }, 100);
    } catch (err) {
      console.error("Google authentication error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!scriptLoadedSuccessfully) {
    return (
      <div className={`${buttonClassName} opacity-70`} aria-live="polite">
        <Spinner />
        <span>Loading Google sign-in...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-10 sm:h-11">
      {/* Transparent Google button captures clicks */}
      <div
        className="absolute inset-0 z-20 overflow-hidden opacity-[0.011] cursor-pointer"
        aria-hidden="true"
      >
        <GoogleLogin
          onSuccess={handleCredentialSuccess}
          onError={() => {
            setLoading(false);
            toast.error("Google sign-in was cancelled or failed.");
          }}
          text="continue_with"
          theme="outline"
          size="large"
          width={400}
          containerProps={{
            style: { width: "100%", height: "100%" },
          }}
        />
      </div>

      {/* Visible custom styling */}
      <div
        className={`${buttonClassName}${loading ? " opacity-60" : ""}`}
        aria-label="Continue with Google"
      >
        {loading ? (
          <>
            <Spinner />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleG />
            <span>Continue with Google</span>
          </>
        )}
      </div>
    </div>
  );
}

export function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  if (!isGoogleOAuthConfigured()) {
    return (
      <button
        type="button"
        onClick={() => {
          toast.error(
            "Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local and restart the dev server."
          );
        }}
        className={buttonClassName.replace("pointer-events-none", "")}
        aria-label="Continue with Google"
      >
        <GoogleG />
        <span>Continue with Google</span>
      </button>
    );
  }

  return <GoogleLoginButtonInner onSuccess={onSuccess} />;
}
