// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { applyGrowthMetadata } from "../lib/growth";
import { applyFallbackRouteMetadata } from "./RouteMetadata";
afterEach(() => {
  document.head.innerHTML = "";
});
describe("route metadata transitions", () => {
  it("does not leave Plus static metadata on an established workout route", () => {
    document.title = "BTB Plus — Help Shape the Next Chapter";
    document.head.insertAdjacentHTML(
      "beforeend",
      '<link rel="canonical" href="https://www.btbfitnessandhealth.com/plus">'
    );
    const cleanup = applyGrowthMetadata("plus");
    cleanup();
    applyFallbackRouteMetadata("/workouts");
    expect(document.title).toBe("Workout Sessions | BTB Fitness & Health");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe("https://www.btbfitnessandhealth.com/workouts");
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute("content")
    ).not.toContain("/plus");
  });
  it("does not overwrite metadata-owned public pages", () => {
    applyGrowthMetadata("start");
    const title = document.title;
    applyFallbackRouteMetadata("/start");
    expect(document.title).toBe(title);
  });
});
