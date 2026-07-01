import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { slugify, escapeRegex, getPagination, getUserFromHeaders } from "@/lib/utils";
import { getClientIp } from "@/lib/request-ip";

describe("slugify", () => {
  it("creates URL-safe slugs", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  Multiple   Spaces ")).toBe("multiple-spaces");
  });
});

describe("escapeRegex", () => {
  it("escapes special characters", () => {
    expect(escapeRegex("a+b(c)")).toBe("a\\+b\\(c\\)");
  });
});

describe("getPagination", () => {
  it("clamps page and limit", () => {
    expect(getPagination("0", "100")).toEqual({ page: 1, limit: 50, skip: 0 });
    expect(getPagination("2", "10")).toEqual({ page: 2, limit: 10, skip: 10 });
  });
});

describe("getUserFromHeaders", () => {
  it("parses middleware-injected headers", () => {
    const headers = new Headers({
      "x-user-id": "abc",
      "x-user-role": "user",
      "x-user-email": "u@example.com",
    });
    expect(getUserFromHeaders(headers)).toEqual({
      userId: "abc",
      role: "user",
      email: "u@example.com",
    });
  });

  it("returns null when headers are missing", () => {
    expect(getUserFromHeaders(new Headers())).toBeNull();
  });
});

describe("getClientIp", () => {
  it("uses first x-forwarded-for hop", () => {
    const req = new NextRequest("http://localhost/api", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("203.0.113.1");
  });
});
