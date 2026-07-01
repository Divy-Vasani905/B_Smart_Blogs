import { describe, expect, it } from "vitest";
import {
  classifyRoute,
  requiresAuth,
  isDashboardRoute,
} from "@/lib/middleware/routes";

describe("middleware route classification", () => {
  it("classifies admin panel routes", () => {
    expect(classifyRoute("/backstage-b-smart-studio")).toBe("admin_panel");
    expect(classifyRoute("/backstage-b-smart-studio/blogs")).toBe("admin_panel");
    expect(classifyRoute("/backstage-b-smart-studio/login")).toBe("public");
  });

  it("classifies protected API routes", () => {
    expect(classifyRoute("/api/admin/blogs")).toBe("admin_api");
    expect(classifyRoute("/api/user/blogs")).toBe("user_api");
    expect(classifyRoute("/api/upload/image")).toBe("upload_api");
  });

  it("classifies user dashboard", () => {
    expect(classifyRoute("/dashboard")).toBe("user_dashboard");
    expect(classifyRoute("/dashboard/write")).toBe("user_dashboard");
  });

  it("leaves public routes unprotected", () => {
    expect(classifyRoute("/")).toBe("public");
    expect(classifyRoute("/blogs")).toBe("public");
    expect(classifyRoute("/blog/my-post")).toBe("public");
    expect(classifyRoute("/api/blogs/my-post/view")).toBe("public");
  });

  it("requiresAuth matches protected kinds", () => {
    expect(requiresAuth("/dashboard")).toBe(true);
    expect(requiresAuth("/login")).toBe(false);
  });

  it("detects dashboard routes", () => {
    expect(isDashboardRoute("/dashboard/profile")).toBe(true);
    expect(isDashboardRoute("/api/user/profile")).toBe(false);
  });
});
