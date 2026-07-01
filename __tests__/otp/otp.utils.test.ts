import { describe, expect, it } from "vitest";
import { getOtpCooldownRemaining, isValidOtpCode } from "@/lib/otp/utils";

describe("OTP utilities", () => {
  it("returns remaining cooldown seconds", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const now = createdAt.getTime() + 30_000;
    expect(getOtpCooldownRemaining(createdAt, 60, now)).toBe(30);
  });

  it("returns null when cooldown has passed", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const now = createdAt.getTime() + 120_000;
    expect(getOtpCooldownRemaining(createdAt, 60, now)).toBeNull();
  });

  it("validates 6-digit OTP format", () => {
    expect(isValidOtpCode("123456")).toBe(true);
    expect(isValidOtpCode("12345")).toBe(false);
    expect(isValidOtpCode("abcdef")).toBe(false);
  });
});
