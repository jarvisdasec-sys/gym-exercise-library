// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "../App";
import { GROUP_TITLE, GROUP_URL } from "../lib/groupWorkoutMetadata";

let host: HTMLDivElement;
let root: Root;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  localStorage.clear();
  window.history.replaceState({}, "", "/workouts/groups");
  document.title = "BTB Gym Exercise Library — 54 Movement Blueprints";
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});
async function waitForHeading(text: string) {
  await vi.waitFor(
    async () => {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      expect(host.querySelector("h1")?.textContent).toContain(text);
    },
    { timeout: 5000 }
  );
}
async function clickLink(selector: string) {
  const link = host.querySelector<HTMLAnchorElement>(selector);
  expect(link).not.toBeNull();
  await act(async () =>
    link!.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }))
  );
}

describe("live BTB app group-workout integration", () => {
  it("loads the specific group route rather than treating groups as a workout slug", async () => {
    await act(async () => root.render(createElement(App)));
    await waitForHeading("Group Workouts");
    expect(host.querySelector("#group-workouts")).not.toBeNull();
    expect(host.querySelectorAll(".day-rail button")).toHaveLength(15);
    expect(document.title).toBe(GROUP_TITLE);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(GROUP_URL);
    expect(host.querySelector('header a[href="/workouts"]')).not.toBeNull();
    expect(host.querySelector('footer a[href="/instagram"]')).not.toBeNull();
  });
  it("keeps the existing workout board and homepage with a visible group entry", async () => {
    await act(async () => root.render(createElement(App)));
    await waitForHeading("Group Workouts");
    await clickLink('header a[href="/workouts"]');
    await waitForHeading("Pick a day.");
    expect(host.querySelector("#group-workouts")).not.toBeNull();
    expect(host.querySelector('a[href="/workouts/push-day"]')).not.toBeNull();
    expect(document.title).not.toBe(GROUP_TITLE);
    await clickLink('header a[href="/"]');
    await waitForHeading("Train with confidence.");
    expect(
      host.querySelector('a[href="/workouts/groups"]')?.textContent
    ).toContain("Open Group Workouts");
    expect(host.querySelector("#instagram-follow-heading")).not.toBeNull();
  });
});
