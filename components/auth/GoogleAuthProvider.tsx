"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  GOOGLE_CLIENT_ID,
  isGoogleOAuthConfigured,
} from "@/lib/google-oauth.config";

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  if (!isGoogleOAuthConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[GoogleAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing or still a placeholder. Google sign-in is disabled."
      );
    }
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => {
        console.error("[GoogleAuth] Failed to load Google Identity Services script.");
      }}
    >
      {children}
    </GoogleOAuthProvider>
  );
}
