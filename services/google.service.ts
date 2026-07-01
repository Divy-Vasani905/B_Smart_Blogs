/**
 * services/google.service.ts
 *
 * Handles all Google OAuth logic:
 * 1. Verifies the Google ID token using google-auth-library
 * 2. Extracts profile data (email, name, picture, googleId)
 * 3. Finds existing user or creates a new one (find-or-create pattern)
 * 4. Links googleId to existing accounts that signed up with email/password
 */

import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db/mongoose";
import User, { IUserDocument } from "@/models/User";
import { logger } from "@/lib/logger";

// Initialize the Google OAuth client with our server-side Client ID
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Types ──────────────────────────────────────────────────────────────────────

export interface GoogleProfile {
  googleId: string;  // Google's unique user identifier ("sub" claim)
  email: string;
  name: string;
  picture?: string;  // Profile picture URL from Google
  emailVerified: boolean;
}

export interface GoogleAuthResult {
  success: boolean;
  user?: IUserDocument;
  error?: string;
}

// ── Token Verification ─────────────────────────────────────────────────────────

/**
 * Verifies the Google ID token (credential) received from the frontend.
 * Returns the decoded profile information if valid.
 * Throws an error if the token is invalid, expired, or tampered with.
 */
export async function verifyGoogleToken(credential: string): Promise<GoogleProfile> {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID, // Ensures token was issued for OUR app
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Failed to decode Google token payload");
  }

  // Google's "sub" claim is their unique, stable user identifier
  const googleId = payload.sub;
  const email = payload.email;

  if (!email) {
    throw new Error("Google account does not have an associated email address");
  }

  if (!payload.email_verified) {
    throw new Error("Google account email is not verified");
  }

  return {
    googleId,
    email: email.toLowerCase().trim(),
    name: payload.name || email.split("@")[0], // Fallback to email prefix if no name
    picture: payload.picture,
    emailVerified: payload.email_verified ?? false,
  };
}

// ── Username Generation ────────────────────────────────────────────────────────

/**
 * Generates a unique username from a Google profile.
 * Strategy: sanitize the name, then append a random suffix if taken.
 */
async function generateUniqueUsername(name: string, email: string): Promise<string> {
  // Start with the name: lowercase, only alphanumeric + underscores, max 20 chars
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")   // Replace non-alphanumeric with underscore
    .replace(/_+/g, "_")           // Collapse consecutive underscores
    .replace(/^_|_$/g, "")         // Trim leading/trailing underscores
    .substring(0, 20)              // Max 20 chars to leave room for suffix
    || email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_").substring(0, 20);

  // Ensure minimum 3 chars
  const safeBase = base.length >= 3 ? base : `user_${base}`.substring(0, 20);

  // Try the base username first
  const existingBase = await User.findOne({ username: safeBase }).lean();
  if (!existingBase) return safeBase;

  // If taken, append a random 4-digit number and retry up to 10 times
  for (let i = 0; i < 10; i++) {
    const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    const candidate = `${safeBase.substring(0, 25)}_${suffix}`; // max 30 chars
    const taken = await User.findOne({ username: candidate }).lean();
    if (!taken) return candidate;
  }

  // Last resort: use timestamp-based username
  return `user_${Date.now().toString().slice(-8)}`;
}

// ── Find or Create User ────────────────────────────────────────────────────────

/**
 * Core business logic:
 * - If user exists with this email → link googleId if missing, return user
 * - If user doesn't exist → create new Google-provider user
 *
 * This function ensures idempotency: calling it multiple times with the same
 * Google account will always return the same user document.
 */
export async function findOrCreateGoogleUser(profile: GoogleProfile): Promise<GoogleAuthResult> {
  try {
    await connectDB();

    // ── Case 1: User already exists with this email ──────────────────────────
    const existingUser = await User.findOne({ email: profile.email });

    if (existingUser) {
      // Block inactive accounts from logging in via Google too
      if (!existingUser.isActive) {
        return {
          success: false,
          error: "This account has been deactivated. Please contact support.",
        };
      }

      // Link the googleId if this user originally signed up with email/password
      if (!existingUser.googleId) {
        existingUser.googleId = profile.googleId;
        // Optionally update avatar if user hasn't set one yet
        if (!existingUser.avatar && profile.picture) {
          existingUser.avatar = profile.picture;
        }
        // Mark email as verified since Google confirmed it
        existingUser.emailVerified = true;
        await existingUser.save();
      }

      return { success: true, user: existingUser };
    }

    // ── Case 2: New user — create their account ──────────────────────────────
    const username = await generateUniqueUsername(profile.name, profile.email);

    const newUser = await User.create({
      name: profile.name,
      username,
      email: profile.email,
      // No password field — Google users authenticate via Google
      provider: "google",
      googleId: profile.googleId,
      avatar: profile.picture || "",
      role: "user",           // Google users are always regular users
      isActive: true,
      emailVerified: true,    // Google already verified the email
    });

    return { success: true, user: newUser };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error during Google auth";
    logger.error("google.find_or_create_failed", { err: message });
    return { success: false, error: message };
  }
}
