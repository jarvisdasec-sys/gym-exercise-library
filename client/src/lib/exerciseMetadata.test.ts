// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { INDEXED_EXERCISES } from "./exercises";
import { getExerciseGuide } from "./exerciseGuides";
import {
  applyExerciseGuideMetadata,
  BTB_SITE_ORIGIN,
  getExerciseGuideMetadata,
} from "./exerciseMetadata";

afterEach(() => {
  document.head.innerHTML = "";
});

describe("public exercise-guide discovery metadata", () => {
  it("makes a distinct absolute canonical and social preview for every real guide", () => {
    const metadata = INDEXED_EXERCISES.map(getExerciseGuideMetadata);
    expect(metadata).toHaveLength(54);
    expect(new Set(metadata.map(item => item.url))).toHaveLength(54);
    expect(new Set(metadata.map(item => item.title))).toHaveLength(54);

    for (const item of metadata) {
      expect(item.url.startsWith(`${BTB_SITE_ORIGIN}/e/`)).toBe(true);
      expect(item.image.startsWith(BTB_SITE_ORIGIN)).toBe(true);
      expect(item.description).toContain("setup, execution");
    }
  });

  it("keeps every crawler guide tied to the actual source coaching data", () => {
    for (const exercise of INDEXED_EXERCISES) {
      const guide = getExerciseGuide(exercise);
      expect(guide.setup.length).toBeGreaterThan(0);
      expect(guide.execution.length).toBeGreaterThan(0);
      expect(guide.cues.length).toBeGreaterThan(0);
      expect(guide.mistakes.length).toBeGreaterThan(0);
      expect(guide.safety.length).toBeGreaterThan(0);
      expect(guide.easier.length).toBeGreaterThan(0);
      expect(guide.harder.length).toBeGreaterThan(0);
    }
  });

  it("sets complete guide metadata and does not leave it indexable on an unknown plate", () => {
    document.head.innerHTML =
      '<title>BTB</title><meta name="description" content="Neutral"><link rel="canonical" href="https://www.btbfitnessandhealth.com/">';
    const knownCleanup = applyExerciseGuideMetadata(INDEXED_EXERCISES[0]);
    const known = getExerciseGuideMetadata(INDEXED_EXERCISES[0]);

    expect(document.title).toBe(known.title);
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute("content")
    ).toBe(known.url);
    expect(
      document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content")
    ).toBe(known.image);
    expect(
      document
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute("content")
    ).toBe(known.image);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(known.url);
    knownCleanup();

    const unknownCleanup = applyExerciseGuideMetadata(null);
    expect(document.title).toBe(
      "Exercise Guide Not Found | BTB Fitness & Health"
    );
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute("content")
    ).toBe("noindex,nofollow");
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    unknownCleanup();
  });
});
