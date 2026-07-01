/** Seconds remaining before another OTP can be sent, or null if cooldown has passed. */
export function getOtpCooldownRemaining(
  createdAt: Date,
  cooldownSeconds: number,
  now = Date.now()
): number | null {
  const elapsedSeconds = Math.floor((now - createdAt.getTime()) / 1000);
  if (elapsedSeconds < cooldownSeconds) {
    return cooldownSeconds - elapsedSeconds;
  }
  return null;
}

export function isValidOtpCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}
