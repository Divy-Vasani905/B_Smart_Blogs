/** Failed password attempts before the account is temporarily locked. */
export const MAX_LOGIN_ATTEMPTS = 5;

/** How long an account stays locked after too many failed attempts. */
export const ACCOUNT_LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function isLockActive(lockUntil?: Date | null): boolean {
  return Boolean(lockUntil && lockUntil.getTime() > Date.now());
}

export function lockRemainingMinutes(lockUntil: Date): number {
  return Math.max(1, Math.ceil((lockUntil.getTime() - Date.now()) / 60_000));
}
