// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import App from "../App";

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});
describe("growth route metadata on real navigation", () => {
  it("moves from direct Start Here to workouts without retaining starter canonical", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    window.history.replaceState({}, "", "/start");
    document.head.innerHTML =
      '<title>Start with BTB — Your Training &amp; Meal-Prep Week</title><link rel="canonical" href="https://www.btbfitnessandhealth.com/start">';
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(createElement(App)));
    await vi.waitFor(
      async () => {
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
        });
        expect(host.querySelector("h1")?.textContent).toContain("Start small.");
      },
      { timeout: 5000 }
    );
    const link = host.querySelector<HTMLAnchorElement>(
      'header a[href="/workouts"]'
    )!;
    await act(async () =>
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }))
    );
    await vi.waitFor(
      async () => {
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
        });
        expect(host.querySelector("h1")?.textContent).toContain("Pick a day.");
      },
      { timeout: 5000 }
    );
    expect(document.title).toBe("Workout Sessions | BTB Fitness & Health");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe("https://www.btbfitnessandhealth.com/workouts");
    await act(async () => root.unmount());
  });
});
