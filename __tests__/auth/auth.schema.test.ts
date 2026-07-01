import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema, googleAuthSchema } from "@/lib/validations/auth.schema";

describe("loginSchema", () => {
  it("accepts valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });

  it("accepts admin intent", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "secret",
      intent: "admin",
    });
    expect(result.success).toBe(true);
  });
});

describe("signupSchema", () => {
  it("accepts valid signup", () => {
    const result = signupSchema.safeParse({
      name: "Jane Doe",
      username: "jane_doe",
      email: "jane@example.com",
      password: "SecurePass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects weak password", () => {
    const result = signupSchema.safeParse({
      name: "Jane Doe",
      username: "jane",
      email: "jane@example.com",
      password: "weakpass",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid username characters", () => {
    const result = signupSchema.safeParse({
      name: "Jane Doe",
      username: "jane doe!",
      email: "jane@example.com",
      password: "SecurePass1",
    });
    expect(result.success).toBe(false);
  });
});

describe("googleAuthSchema", () => {
  it("requires credential", () => {
    expect(googleAuthSchema.safeParse({}).success).toBe(false);
    expect(googleAuthSchema.safeParse({ credential: "token" }).success).toBe(true);
  });
});
