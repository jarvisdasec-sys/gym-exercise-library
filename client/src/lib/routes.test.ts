import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { EXERCISES } from "@/lib/exercises";
import { LEGACY_ROUTE_REDIRECTS, ROUTES } from "@/lib/routes";
import { BLOG_CATEGORIES, BLOG_POSTS, buildBlogSubmissionMailto } from "@/lib/blog";

const publicRoot = path.resolve(process.cwd(), "client/public");

describe("canonical navigation", () => {
  it("keeps every primary tab pointed at an implemented route", () => {
    expect(ROUTES.exercises).toBe("/exercises");
    expect(ROUTES.start).toBe("/start");
    expect(ROUTES.plus).toBe("/plus");
    expect(ROUTES.workouts).toBe("/workouts");
    expect(ROUTES.cardio).toBe("/cardio");
    expect(ROUTES.mobility).toBe("/mobility");
    expect(ROUTES.nutrition).toBe("/nutrition");
    expect(ROUTES.calculators).toBe("/calculators");
    expect(ROUTES.education).toBe("/learn");
    expect(ROUTES.blog).toBe("/blog");
    expect(ROUTES.blogContribute).toBe("/blog/contribute");
    expect(BLOG_POSTS.map(post => post.category)).toEqual(BLOG_CATEGORIES);
    expect(BLOG_POSTS).toHaveLength(4);
    for (const post of BLOG_POSTS) {
      expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      expect(existsSync(path.join(publicRoot, post.image))).toBe(true);
    }
  });

  it("prepares a contribution email without claiming automatic delivery", () => {
    const mailto = buildBlogSubmissionMailto({
      name: "Alex Example",
      email: "alex@example.com",
      type: "Article",
      category: "Health",
      title: "A useful habit",
      message: "A short contribution.",
    });
    expect(mailto).toMatch(/^mailto:btbfitnessandhealth@yahoo\.com\?/);
    expect(decodeURIComponent(mailto)).toContain("A short contribution.");
    expect(decodeURIComponent(mailto)).toContain("attach the image files");
  });

  it("maps known legacy destinations to truthful working pages", () => {
    expect(LEGACY_ROUTE_REDIRECTS["/app"]).toBe("/start#btb-app");
    expect(LEGACY_ROUTE_REDIRECTS["/physical-fitness/running"]).toBe("/cardio");
    expect(LEGACY_ROUTE_REDIRECTS["/fitness/warm-up-and-cooldown"]).toBe("/mobility");
    expect(LEGACY_ROUTE_REDIRECTS["/fitness-calculators"]).toBe("/calculators");
    expect(LEGACY_ROUTE_REDIRECTS["/resources"]).toBe("/learn");
  });
});

describe("exercise media integrity", () => {
  it("has a real public image for every exercise record", () => {
    expect(EXERCISES).toHaveLength(54);
    for (const exercise of EXERCISES) {
      expect(existsSync(path.join(publicRoot, exercise.image))).toBe(true);
    }
  });

  it("includes the requested barbell row record", () => {
    const row = EXERCISES.find((exercise) => exercise.slug === "barbell-bent-over-row");
    expect(row).toMatchObject({
      name: "Barbell Bent-Over Row",
      image: "/images/exercises/barbell_row.png",
    });
  });
});
