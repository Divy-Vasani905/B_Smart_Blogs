"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const GoogleAuthProvider = dynamic(
  () =>
    import("@/components/auth/GoogleAuthProvider").then((m) => ({
      default: m.GoogleAuthProvider,
    })),
  { ssr: false }
);

const GoogleLoginButton = dynamic(
  () =>
    import("@/components/auth/GoogleLoginButton").then((m) => ({
      default: m.GoogleLoginButton,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-10 sm:h-11 rounded-lg bg-gray-100 animate-pulse" aria-hidden />
    ),
  }
);

type GoogleLoginButtonProps = ComponentProps<typeof GoogleLoginButton>;

/** Loads Google OAuth SDK only when this component is mounted (e.g. auth modal open). */
export function LazyGoogleSignIn(props: GoogleLoginButtonProps) {
  return (
    <GoogleAuthProvider>
      <GoogleLoginButton {...props} />
    </GoogleAuthProvider>
  );
}
