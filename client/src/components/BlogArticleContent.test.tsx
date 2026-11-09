// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogArticleContent } from "./BlogArticleContent";
import { BLOG_POSTS } from "../lib/blog";
import { getBlogPostMetadata } from "../lib/blogMetadata";
import { applyFallbackRouteMetadata } from "../lib/defaultRouteMetadata";

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});

describe("public authored blog articles", () => {
  for (const post of BLOG_POSTS) {
    it(`renders the complete ${post.slug} article without browser data loading`, () => {
      document.body.innerHTML = renderToStaticMarkup(createElement(BlogArticleContent, { post }));
      expect(document.querySelector("h1")?.textContent).toBe(post.title);
      expect(document.querySelector(".blog-intro")?.textContent).toBe(post.summary);
      for (const section of post.sections) {
        expect(document.body.textContent).toContain(section.heading);
        for (const paragraph of section.paragraphs) expect(document.body.textContent).toContain(paragraph);
        for (const bullet of section.bullets ?? []) expect(document.body.textContent).toContain(bullet);
      }
      expect(document.querySelector(".blog-scope-note")?.textContent).toContain("General education only—not medical advice");
      expect(document.querySelector('a[href="/blog/contribute"]')).not.toBeNull();
      expect(document.querySelector(".blog-next-story")?.getAttribute("href")).toMatch(/^\/blog\//);
      expect(document.querySelector('a[href="/7-day-starter"]') !== null).toBe(post.slug === "a-simple-first-strength-week");
    });

    it(`keeps ${post.slug} client metadata equal to its static metadata`, () => {
      const metadata = getBlogPostMetadata(post);
      applyFallbackRouteMetadata(`/blog/${post.slug}/`);
      expect(document.title).toBe(metadata.title);
      expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(metadata.description);
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(metadata.url);
      for (const [name, value] of [
        ["og:title", metadata.title], ["og:description", metadata.description],
        ["og:url", metadata.url], ["og:image", metadata.image], ["og:type", "article"],
      ]) {
        expect(document.querySelector(`meta[property="${name}"]`)?.getAttribute("content")).toBe(value);
      }
      expect(metadata.image).toBe(`https://www.btbfitnessandhealth.com${post.image}`);
      expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute("content")).toBe(metadata.image);
      applyFallbackRouteMetadata("/workouts");
      expect(document.querySelector('meta[property="og:type"]')?.getAttribute("content")).toBe("website");
      expect(document.querySelector('meta[property="og:url"]')?.getAttribute("content")).not.toContain(post.slug);
    });
  }
});
