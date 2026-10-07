// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { applyInstagramMetadata } from "./instagramMetadata";
import {
  INSTAGRAM_DESCRIPTION,
  INSTAGRAM_PAGE_URL,
  INSTAGRAM_TITLE,
} from "./social";

afterEach(() => {
  document.head.innerHTML = "";
});

describe("Instagram route metadata", () => {
  it("sets route-specific metadata and restores the prior in-app page", () => {
    document.head.innerHTML =
      '<title>Original page</title><meta name="description" content="Original description"><link rel="canonical" href="https://www.btbfitnessandhealth.com/">';
    const restore = applyInstagramMetadata();
    expect(document.title).toBe(INSTAGRAM_TITLE);
    expect(
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe(INSTAGRAM_DESCRIPTION);
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(INSTAGRAM_PAGE_URL);
    restore();
    expect(document.title).toBe("Original page");
    expect(
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe("Original description");
    expect(
      document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe("https://www.btbfitnessandhealth.com/");
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
  });

  it("does not leave Instagram canonical metadata on other pages after a direct visit", () => {
    document.head.innerHTML = `<title>${INSTAGRAM_TITLE}</title><meta name="description" content="${INSTAGRAM_DESCRIPTION}"><meta property="og:title" content="${INSTAGRAM_TITLE}"><meta property="og:url" content="${INSTAGRAM_PAGE_URL}"><link rel="canonical" href="${INSTAGRAM_PAGE_URL}">`;
    const restore = applyInstagramMetadata();
    restore();
    expect(document.title).toBe(
      "BTB Gym Exercise Library — 54 Movement Blueprints"
    );
    expect(
      document.head
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content")
    ).toBe("BTB — Build The Body");
    expect(
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).not.toBe(INSTAGRAM_DESCRIPTION);
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
  });
});
