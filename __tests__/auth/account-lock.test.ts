import { describe, expect, it } from "vitest";
import {
  isLockActive,
  lockRemainingMinutes,
  MAX_LOGIN_ATTEMPTS,
  ACCOUNT_LOCK_DURATION_MS,
} from "@/lib/auth/account-lock";

describe("account lock", () => {
  it("detects active lock", () => {
    const future = new Date(Date.now() + 60_000);
    expect(isLockActive(future)).toBe(true);
  });

  it("treats expired lock as inactive", () => {
    const past = new Date(Date.now() - 1_000);
    expect(isLockActive(past)).toBe(false);
  });

  it("returns at least 1 minute remaining", () => {
    const lockUntil = new Date(Date.now() + 30_000);
    expect(lockRemainingMinutes(lockUntil)).toBe(1);
  });

  it("exports sensible defaults", () => {
    expect(MAX_LOGIN_ATTEMPTS).toBeGreaterThan(0);
    expect(ACCOUNT_LOCK_DURATION_MS).toBeGreaterThan(0);
  });
});
