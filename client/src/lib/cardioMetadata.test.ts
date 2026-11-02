// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { CARDIO } from "./cardio";
import {
  BTB_PUBLIC_ORIGIN,
  CARDIO_HUB_METADATA,
  getCardioGuideMetadata,
} from "./cardioMetadata";
import { applyFallbackRouteMetadata } from "./defaultRouteMetadata";

afterEach(() => {
  document.head.innerHTML = "";
});

describe("public cardio SEO metadata", () => {
  it("describes the cardio hub within useful search snippet lengths", () => {
    expect(CARDIO_HUB_METADATA.title.length).toBeGreaterThanOrEqual(30);
    expect(CARDIO_HUB_METADATA.title.length).toBeLessThanOrEqual(60);
    expect(CARDIO_HUB_METADATA.description.length).toBeGreaterThanOrEqual(50);
    expect(CARDIO_HUB_METADATA.description.length).toBeLessThanOrEqual(160);
    expect(CARDIO_HUB_METADATA.url).toBe(`${BTB_PUBLIC_ORIGIN}/cardio`);
  });

  it("gives every cardio method a unique, accurate canonical and search snippet", () => {
    const metadata = CARDIO.map(getCardioGuideMetadata);

    expect(metadata).toHaveLength(18);
    expect(new Set(metadata.map(item => item.url))).toHaveLength(CARDIO.length);
    expect(new Set(metadata.map(item => item.title))).toHaveLength(
      CARDIO.length
    );

    for (const [index, item] of metadata.entries()) {
      expect(item.title.length).toBeLessThanOrEqual(60);
      expect(item.description.length).toBeGreaterThanOrEqual(50);
      expect(item.description.length).toBeLessThanOrEqual(160);
      expect(item.url).toBe(
        `${BTB_PUBLIC_ORIGIN}/cardio/${CARDIO[index].slug}`
      );
      expect(item.title.toLowerCase()).toContain(
        CARDIO[index].name.slice(0, 10).toLowerCase()
      );
    }
  });

  it("keeps client-side route metadata aligned with each static cardio URL", () => {
    document.head.innerHTML = "<title>BTB</title>";
    applyFallbackRouteMetadata("/cardio");
    expect(document.title).toBe(CARDIO_HUB_METADATA.title);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(CARDIO_HUB_METADATA.url);

    const exercise = CARDIO[0];
    const metadata = getCardioGuideMetadata(exercise);
    applyFallbackRouteMetadata(`/cardio/${exercise.slug}`);
    expect(document.title).toBe(metadata.title);
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe(metadata.description);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(metadata.url);
    expect(
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content")
    ).toBe(metadata.image);
    expect(
      document
        .querySelector('meta[property="og:image:alt"]')
        ?.getAttribute("content")
    ).toBe(metadata.imageAlt);
    expect(
      document
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute("content")
    ).toBe(metadata.image);
  });
});
