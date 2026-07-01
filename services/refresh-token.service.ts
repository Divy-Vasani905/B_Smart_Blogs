import bcrypt from "bcryptjs";
import RefreshToken from "@/models/RefreshToken";
import { connectDB } from "@/lib/db/mongoose";
import { verifyRefreshToken } from "@/lib/auth/jwt";
import { REFRESH_MAX_AGE_SECONDS } from "@/lib/auth/jwt";

const SALT_ROUNDS = 12;

function refreshExpiresAt(): Date {
  return new Date(Date.now() + REFRESH_MAX_AGE_SECONDS * 1000);
}

/**
 * Persist a hashed refresh token keyed by JWT jti for O(1) validation.
 */
export async function storeRefreshToken(
  userId: string,
  rawToken: string,
  jti: string,
  meta: { userAgent?: string; ip?: string } = {}
): Promise<void> {
  await connectDB();

  const tokenHash = await bcrypt.hash(rawToken, SALT_ROUNDS);

  await RefreshToken.create({
    jti,
    tokenHash,
    user: userId,
    expiresAt: refreshExpiresAt(),
    userAgent: meta.userAgent ?? "",
    ip: meta.ip ?? "",
  });
}

/**
 * Verify JWT signature and confirm the token exists in DB and is not revoked.
 */
export async function validateStoredRefreshToken(
  rawToken: string
): Promise<{ userId: string; tokenId: string } | null> {
  let payload: { userId: string; jti: string };
  try {
    payload = await verifyRefreshToken(rawToken);
  } catch {
    return null;
  }

  await connectDB();

  const doc = await RefreshToken.findOne({
    jti: payload.jti,
    user: payload.userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).select("_id tokenHash");

  if (!doc) return null;

  const matches = await bcrypt.compare(rawToken, doc.tokenHash);
  if (!matches) return null;

  return { userId: payload.userId, tokenId: String(doc._id) };
}

/**
 * Revoke a single refresh token (rotation / logout).
 */
export async function revokeRefreshToken(rawToken: string): Promise<void> {
  const match = await validateStoredRefreshToken(rawToken);
  if (!match) return;

  await connectDB();
  await RefreshToken.findByIdAndUpdate(match.tokenId, { isRevoked: true });
}

/**
 * Revoke every refresh token for a user (logout all sessions).
 */
export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await connectDB();
  await RefreshToken.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });
}
