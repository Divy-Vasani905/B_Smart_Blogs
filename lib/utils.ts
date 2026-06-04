import { NextResponse } from "next/server";
import { apiError } from "@/types/api.types";
import { ZodError } from "zod";

// ── Generic Utilities ─────────────────────────────────────────────────────────

/**
 * Calculate estimated reading time from plain text.
 * @param text - Plain text content
 * @returns Reading time in minutes
 */
export function calcReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Format a Zod error into a user-friendly string.
 */
export function formatZodError(err: ZodError): string {
  return err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
}

/**
 * Handle API errors consistently.
 */
export function handleApiError(err: unknown): NextResponse {
  console.error("[API Error]", err);

  if (err instanceof ZodError) {
    return NextResponse.json(apiError(formatZodError(err)), { status: 400 });
  }

  if (err instanceof Error) {
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json(apiError("Unauthorized"), { status: 401 });
    }
    if (err.message === "FORBIDDEN") {
      return NextResponse.json(apiError("Forbidden"), { status: 403 });
    }
    if (err.message === "NOT_FOUND") {
      return NextResponse.json(apiError("Not found"), { status: 404 });
    }
  }

  return NextResponse.json(
    apiError("Internal server error"),
    { status: 500 }
  );
}

/**
 * Get user info from request headers (set by middleware).
 */
export function getUserFromHeaders(headers: Headers): {
  userId: string;
  role: string;
  email: string;
} | null {
  const userId = headers.get("x-user-id");
  const role = headers.get("x-user-role");
  const email = headers.get("x-user-email");

  if (!userId || !role || !email) return null;
  return { userId, role, email };
}

/**
 * Escape MongoDB regex special characters.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Build a MongoDB-safe pagination object.
 */
export function getPagination(page: string | null, limit: string | null) {
  const p = clamp(parseInt(page ?? "1", 10), 1, 1000);
  const l = clamp(parseInt(limit ?? "10", 10), 1, 50);
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
}

/**
 * Generate a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // replace multiple - with single -
}

/**
 * Transform a Cloudinary image URL to include on-the-fly optimization params.
 * - f_auto: serve WebP/AVIF automatically based on browser support
 * - q_auto:good: balance between quality and file size
 * - w_{width},c_limit: resize width without upscaling
 *
 * This means images arrive pre-sized from Cloudinary's CDN instead of being
 * downloaded at full resolution and re-processed by Next.js.
 */
export function getCloudinaryUrl(url?: string | null, width = 800): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;
  // Inject transformation params after /upload/
  return url.replace(
    /\/upload\/(f_auto,q_auto[^/]*,w_\d+,c_limit\/)?/,
    `/upload/f_auto,q_auto:good,w_${width},c_limit/`
  );
}
