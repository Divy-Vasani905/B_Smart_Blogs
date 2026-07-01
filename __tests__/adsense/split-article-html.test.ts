import { describe, expect, it } from "vitest";
import { splitHtmlForMidAd } from "@/lib/adsense/split-article-html";

describe("splitHtmlForMidAd", () => {
  it("splits at the middle paragraph", () => {
    const html = "<p>One</p><p>Two</p><p>Three</p><p>Four</p>";
    const { before, after } = splitHtmlForMidAd(html);
    expect(before).toBe("<p>One</p><p>Two</p>");
    expect(after).toBe("<p>Three</p><p>Four</p>");
  });

  it("returns full html when only one paragraph", () => {
    const html = "<p>Only</p>";
    const { before, after } = splitHtmlForMidAd(html);
    expect(before).toBe(html);
    expect(after).toBe("");
  });
});
