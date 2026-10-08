// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { GroupWorkoutSection } from "./GroupWorkoutSection";
import { durationSeconds, sessions } from "../lib/groupWorkouts";

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-08T12:00:00Z"));
  localStorage.clear();
  window.history.replaceState({}, "", "/workouts/groups");
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const query = <T extends Element = HTMLElement>(selector: string) =>
  host.querySelector<T>(selector)!;
async function render() {
  await act(async () => root.render(createElement(GroupWorkoutSection)));
}
async function click(selector: string) {
  await act(async () =>
    query(selector).dispatchEvent(new MouseEvent("click", { bubbles: true }))
  );
}
async function tick(milliseconds: number) {
  await act(async () => vi.advanceTimersByTime(milliseconds));
}

describe("native group-workout section", () => {
  it("organizes all four permitted group sizes with all pairs working", async () => {
    await render();
    for (const size of [4, 6, 8, 10]) {
      await click(`.group-options button[aria-label="${size} people"]`);
      expect(
        query('.group-options button[aria-pressed="true"]').textContent
      ).toBe(String(size));
      expect(host.querySelectorAll(".pairs > .pair")).toHaveLength(size / 2);
      expect(localStorage.getItem("btb-group-v1:size")).toBe(String(size));
    }
    expect(query(".crew-note").textContent).toContain("Pairs 1 and 5");
  });
  it("shows complete numbered standard and easier instructions on every day", async () => {
    await render();
    for (let day = 1; day <= 15; day += 1) {
      await click(`.day-rail button:nth-child(${day})`);
      expect(query("#group-session-title").textContent).toBe(
        sessions[day - 1].name
      );
      for (const easier of [true, false]) {
        await click('input[type="checkbox"]');
        expect(query<HTMLInputElement>('input[type="checkbox"]').checked).toBe(
          easier
        );
        for (const exercise of host.querySelectorAll(".exercise-list > li")) {
          expect(
            exercise.querySelector(".movement-steps")!.children
          ).toHaveLength(3);
          expect(exercise.querySelectorAll(".coaching-note")).toHaveLength(2);
          expect(
            exercise.querySelector(".instruction-label")!.textContent
          ).toContain(easier ? "Easier version" : "How to do it");
          expect(
            exercise.querySelector(".exercise-timing")!.textContent
          ).toContain("seconds rest / rotate");
          expect(
            exercise.querySelector("details .movement-steps")!.children
          ).toHaveLength(3);
        }
      }
    }
  });
  it("starts, pauses, resumes, skips phases and resets without changing group-size timing", async () => {
    await render();
    await click(".timer .primary-button");
    await tick(1000);
    expect(query(".timer-clock").textContent).toBe("00:59");
    await click('.group-options button[aria-label="8 people"]');
    expect(query(".timer-clock").textContent).toBe("00:59");
    await click(".timer .primary-button");
    await tick(2000);
    expect(query(".timer-clock").textContent).toBe("00:59");
    expect(query(".timer .primary-button").textContent).toBe("Resume");
    await click(".timer .primary-button");
    await tick(1000);
    expect(query(".timer-clock").textContent).toBe("00:58");
    await click(".timer-secondary button:nth-child(2)");
    expect(query(".timer-name").textContent).toBe("Shoulder circles");
    expect(query(".timer-clock").textContent).toBe("01:00");
    await click(".timer-secondary button:first-child");
    expect(query(".timer-name").textContent).toBe("Easy march");
    expect(query(".timer .primary-button").textContent).toBe("Start workout");
  });
  it("completes every timer phase and allows restart and completion undo", async () => {
    await render();
    await click(".timer .primary-button");
    await tick(durationSeconds(sessions[0]) * 1000);
    expect(query(".timer-phase").textContent).toBe("Finished");
    expect(query(".timer .primary-button").textContent).toBe("Restart session");
    expect(
      query<HTMLButtonElement>(".timer-secondary button:nth-child(2)").disabled
    ).toBe(true);
    await click(".complete-button");
    expect(query(".complete-button").getAttribute("aria-pressed")).toBe("true");
    expect(query(".progress-note").textContent).toContain("1 of 15");
    await click(".complete-button");
    expect(query(".progress-note").textContent).toContain("0 of 15");
    await click(".timer .primary-button");
    expect(query(".timer-clock").textContent).toBe("01:00");
    expect(query(".timer .primary-button").textContent).toBe("Pause");
  });
  it("preserves the original cycle for a workout that crosses midnight", async () => {
    vi.setSystemTime(new Date("2026-10-22T23:59:59Z"));
    await render();
    expect(query("#group-session-title").textContent).toBe("Crew celebration");
    await click(".timer .primary-button");
    await tick(2000);
    expect(query(".schedule-status").textContent).toContain("Today: Day 1");
    expect(query("#group-session-title").textContent).toBe("Crew celebration");
    expect(query(".session-day").textContent).toContain("CYCLE 2026-10-08");
    await click(".complete-button");
    expect(
      JSON.parse(localStorage.getItem("btb-group-v1:completions")!)[
        "2026-10-08:15"
      ]
    ).toBe(true);
    expect(query(".progress-note").textContent).toContain("0 of 15");
    await click(".schedule-status button");
    expect(query("#group-session-title").textContent).toBe("Build your base");
    expect(query(".timer .primary-button").textContent).toBe("Start workout");
  });
  it("keeps working when storage is unavailable and releases timers on unmount", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    await render();
    await click('.group-options button[aria-label="10 people"]');
    await click('input[type="checkbox"]');
    await click(".complete-button");
    expect(query(".complete-button").getAttribute("aria-pressed")).toBe("true");
    expect(query(".exercise-heading").textContent).toContain("easier option");
    expect(vi.getTimerCount()).toBe(1);
    await act(async () => root.render(createElement("div")));
    expect(vi.getTimerCount()).toBe(0);
  });
});
