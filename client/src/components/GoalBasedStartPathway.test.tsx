// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { GoalBasedStartPathway } from "./GoalBasedStartPathway";

afterEach(() => {
  document.body.innerHTML = "";
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("goal-based Start Here pathway", () => {
  it("offers education, fitness, and nutrition goals with an immediately usable first-week plan", () => {
    const html = renderToStaticMarkup(
      createElement(GoalBasedStartPathway, {
        recipePlannerUrl: "https://planner.example.test/recipe-week",
      })
    );
    expect(html).toContain("Understand the basics");
    expect(html).toContain("Build a fitness routine");
    expect(html).toContain("Eat with more intention");
    expect(html).toContain("Choose one goal.");
    expect(html).toContain("DAY 01");
    expect(html).toContain("/workouts/full-body-starter");
    expect(html).toContain("saved only in this browser on this device");
    expect(html).toContain("not individual medical, nutrition, or training advice");
  });

  it("switches pathways and saves checked steps only in local browser storage", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);

    await act(async () => {
      root.render(
        createElement(GoalBasedStartPathway, {
          recipePlannerUrl: "https://planner.example.test/recipe-week",
        })
      );
    });
    const nutritionGoal = host.querySelector<HTMLButtonElement>(
      'button[data-goal="nutrition"]'
    )!;
    await act(async () => nutritionGoal.click());

    expect(host.textContent).toContain("Plan one recipe week");
    expect(host.querySelector('a[href="https://planner.example.test/recipe-week"]')).not.toBeNull();

    const dayThree = host.querySelector<HTMLInputElement>(
      'input[aria-label="Mark day 3 complete: Plan one recipe week"]'
    )!;
    await act(async () => dayThree.click());

    const saved = JSON.parse(window.localStorage.getItem("btb:start-goal-progress:v1")!);
    expect(saved.nutrition).toContain("day-3");
    expect(host.textContent).toContain("1 of 7 steps checked");
    await act(async () => root.unmount());
  });
});
