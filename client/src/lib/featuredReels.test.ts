import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  FEATURED_REELS,
  instagramEmbedUrl,
  instagramReelUrl,
} from "./featuredReels";
import { EXERCISES } from "./exercises";
import { findArticle } from "./eduIndex";
import { sanitizeTrafficDestination } from "./trafficAnalytics";

describe("verified published BTB Reels", () => {
  it("contains exactly the three connector-verified published Reels with durable real covers", () => {
    expect(FEATURED_REELS.map(reel => reel.shortcode)).toEqual([
      "DeKXGoCskEV",
      "DcwOQKdJ9PT",
      "Dco_U3hBoC-",
    ]);
    for (const reel of FEATURED_REELS) {
      expect(
        existsSync(
          path.resolve(import.meta.dirname, "../../public" + reel.poster)
        )
      ).toBe(true);
      expect(instagramEmbedUrl(reel.shortcode)).toBe(
        instagramReelUrl(reel.shortcode) + "embed/"
      );
      expect(sanitizeTrafficDestination(instagramReelUrl(reel.shortcode))).toBe(
        instagramReelUrl(reel.shortcode)
      );
    }
  });
  it("pairs every Reel with a real public guide or tool", () => {
    expect(
      EXERCISES.some(
        exercise => `/e/${exercise.slug}` === FEATURED_REELS[0].guideHref
      )
    ).toBe(true);
    expect(FEATURED_REELS[1].guideHref).toBe("/workouts/tools");
    expect(
      findArticle(FEATURED_REELS[2].guideHref.replace("/learn/", ""))
    ).toBeDefined();
  });
  it("rejects arbitrary, private, or parameter-bearing Instagram links", () => {
    expect(() => instagramReelUrl("../account")).toThrow();
    expect(
      sanitizeTrafficDestination("https://www.instagram.com/reel/unknown/")
    ).toBeNull();
    expect(
      sanitizeTrafficDestination(
        instagramReelUrl(FEATURED_REELS[0].shortcode) + "?email=private"
      )
    ).toBeNull();
    expect(sanitizeTrafficDestination("/account")).toBeNull();
  });
});
