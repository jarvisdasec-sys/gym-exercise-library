import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { EXERCISES } from "@/lib/exercises";
import { LEGACY_ROUTE_REDIRECTS, ROUTES } from "@/lib/routes";

const publicRoot = path.resolve(process.cwd(), "client/public");

describe("canonical navigation", () => {
  it("keeps every primary tab pointed at an implemented route", () => {
    expect(ROUTES.exercises).toBe("/");
    expect(ROUTES.workouts).toBe("/workouts");
    expect(ROUTES.cardio).toBe("/cardio");
    expect(ROUTES.mobility).toBe("/mobility");
    expect(ROUTES.nutrition).toBe("/nutrition");
    expect(ROUTES.calculators).toBe("/calculators");
    expect(ROUTES.education).toBe("/learn");
  });

  it("maps known legacy destinations to truthful working pages", () => {
    expect(LEGACY_ROUTE_REDIRECTS["/exercises"]).toBe("/");
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
