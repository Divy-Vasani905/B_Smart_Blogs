import { describe, expect, it } from "vitest";
import { hashPassword, comparePassword } from "@/lib/auth/password";

describe("password hashing", () => {
  it("hashes and verifies a password", async () => {
    const plain = "MySecurePass1";
    const hash = await hashPassword(plain);
    expect(hash).not.toBe(plain);
    expect(await comparePassword(plain, hash)).toBe(true);
    expect(await comparePassword("wrong", hash)).toBe(false);
  });
});
