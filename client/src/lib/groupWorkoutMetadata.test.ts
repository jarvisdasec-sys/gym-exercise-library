// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import {
  applyGroupWorkoutMetadata,
  GROUP_DESCRIPTION,
  GROUP_IMAGE,
  GROUP_TITLE,
  GROUP_URL,
} from "./groupWorkoutMetadata";
import { HOME_TITLE, HOME_DESCRIPTION, HOME_IMAGE } from "./homeMetadata";

beforeEach(() => {
  document.head.innerHTML = "";
});
describe("group-workout route metadata", () => {
  it("uses canonical homepage defaults when leaving a direct static group visit", () => {
    document.head.innerHTML = `<title>${GROUP_TITLE}</title><meta name="description" content="${GROUP_DESCRIPTION}"><meta property="og:title" content="${GROUP_TITLE}"><meta property="og:description" content="${GROUP_DESCRIPTION}"><meta property="og:image" content="${GROUP_IMAGE}"><meta name="twitter:description" content="${GROUP_DESCRIPTION}"><link rel="canonical" href="${GROUP_URL}">`;
    const cleanup = applyGroupWorkoutMetadata();
    expect(document.title).toBe(GROUP_TITLE);
    cleanup();
    expect(document.title).toBe(HOME_TITLE);
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe(HOME_DESCRIPTION);
    expect(
      document
        .querySelector('meta[property="og:title"]')
        ?.getAttribute("content")
    ).toBe(HOME_TITLE);
    expect(
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content")
    ).toBe(HOME_DESCRIPTION);
    expect(
      document
        .querySelector('meta[name="twitter:description"]')
        ?.getAttribute("content")
    ).toBe(HOME_DESCRIPTION);
    expect(
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content")
    ).toBe(HOME_IMAGE);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
  it("restores the prior page's actual metadata after a client-side group visit", () => {
    document.head.innerHTML =
      '<title>Prior page</title><meta name="description" content="Previous description"><link rel="canonical" href="https://www.btbfitnessandhealth.com/prior">';
    const cleanup = applyGroupWorkoutMetadata();
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(GROUP_URL);
    cleanup();
    expect(document.title).toBe("Prior page");
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe("Previous description");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe("https://www.btbfitnessandhealth.com/prior");
  });
});
