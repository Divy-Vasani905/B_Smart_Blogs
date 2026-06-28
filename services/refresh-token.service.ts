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
 * Persist a hashed refresh token for later validation and revocation.
 */
export async function storeRefreshToken(
  userId: string,
  rawToken: string,
  meta: { userAgent?: string; ip?: string } = {}
): Promise<void> {
  await connectDB();

  const tokenHash = await bcrypt.hash(rawToken, SALT_ROUNDS);

  await RefreshToken.create({
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
  let payload: { userId: string };
  try {
    payload = await verifyRefreshToken(rawToken);
  } catch {
    return null;
  }

  await connectDB();

  const candidates = await RefreshToken.find({
    user: payload.userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).select("_id tokenHash");

  for (const doc of candidates) {
    if (await bcrypt.compare(rawToken, doc.tokenHash)) {
      return { userId: payload.userId, tokenId: String(doc._id) };
    }
  }

  return null;
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
