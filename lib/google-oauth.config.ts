/**
 * Shared Google OAuth client ID helpers.
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID is public and safe to expose in the browser.
 */

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

const PLACEHOLDER_PATTERNS = [
  "YOUR_GOOGLE_CLIENT_ID",
  "123456789-abcxyz",
  "your-client-id",
];

export function isGoogleOAuthConfigured(): boolean {
  if (!GOOGLE_CLIENT_ID) return false;
  if (!GOOGLE_CLIENT_ID.endsWith(".apps.googleusercontent.com")) return false;
  return !PLACEHOLDER_PATTERNS.some((pattern) =>
    GOOGLE_CLIENT_ID.includes(pattern)
  );
}
