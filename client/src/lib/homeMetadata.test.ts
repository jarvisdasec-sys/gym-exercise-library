// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  applyHomeMetadata,
  HOME_DESCRIPTION,
  HOME_TITLE,
  HOME_URL,
} from "./homeMetadata";
beforeEach(() => {
  document.head.innerHTML =
    '<title>Previous exercise</title><meta name="description" content="Previous exercise description" />';
});
describe("public homepage metadata lifecycle", () => {
  it("sets public metadata, then restores neutral defaults rather than stale exercise metadata", () => {
    const cleanup = applyHomeMetadata();
    expect(document.title).toBe(HOME_TITLE);
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe(HOME_DESCRIPTION);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(HOME_URL);
    cleanup();
    expect(document.title).toBe(HOME_TITLE);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).not.toContain("Previous exercise");
  });
  it("does not retain the root canonical or og:url when leaving a directly loaded prerendered homepage", () => {
    document.head.innerHTML = `<title>${HOME_TITLE}</title><link rel="canonical" href="${HOME_URL}" /><meta property="og:url" content="${HOME_URL}" />`;
    const cleanup = applyHomeMetadata();
    cleanup();
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
  });
});
