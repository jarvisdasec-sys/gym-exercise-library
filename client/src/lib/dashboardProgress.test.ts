// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { loadDashboardProgress } from "./dashboardProgress";
import { EDU_ARTICLES } from "./eduIndex";

beforeEach(() => window.localStorage.clear());
describe("device-local dashboard progress", () => {
  it("starts empty and never invents member progress", () => {
    expect(loadDashboardProgress()).toEqual({
      educationCompleted: [],
      educationBookmarks: [],
      mobilityCompleted: [],
      cardioMinutes: 0,
      cardioKcal: 0,
      cardioUnknown: 0,
    });
  });
  it("validates and deduplicates real article slugs and mobility arrays", () => {
    const slug = EDU_ARTICLES[0].slug;
    window.localStorage.setItem(
      "btb.education.completed.v1",
      JSON.stringify([slug, slug, "unknown", null])
    );
    window.localStorage.setItem(
      "btb.education.bookmarks.v1",
      JSON.stringify([slug])
    );
    window.localStorage.setItem(
      "btb.mobility.completed.v1",
      JSON.stringify(["flow-a", "flow-a", null, ""])
    );
    expect(loadDashboardProgress()).toMatchObject({
      educationCompleted: [slug],
      educationBookmarks: [slug],
      mobilityCompleted: ["flow-a"],
    });
  });
  it("handles damaged storage and invalid cardio entries without NaN or crashes", () => {
    window.localStorage.setItem("btb.mobility.completed.v1", "broken json");
    window.localStorage.setItem(
      "btb.cardio.log.v1",
      JSON.stringify({
        bad: "not an array",
        day: [
          null,
          {},
          { minutes: "20", kcal: 20 },
          { minutes: -4, kcal: 0 },
          { minutes: 20, kcal: 100 },
          { minutes: 5, kcal: null },
        ],
      })
    );
    expect(loadDashboardProgress()).toMatchObject({
      mobilityCompleted: [],
      cardioMinutes: 25,
      cardioKcal: 100,
      cardioUnknown: 1,
    });
  });
});
