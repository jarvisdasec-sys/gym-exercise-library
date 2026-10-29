// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "../App";

let root: Root;
let host: HTMLDivElement;

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.localStorage.clear();
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
        await new Promise((resolve) => setTimeout(resolve, 10));
      });
      expect(host.querySelector("h1")?.textContent).toContain(text);
    },
    { timeout: 5000 },
  );
}

describe("exercise library browsing", () => {
  it("opens directly to the requested muscle group results", async () => {
    window.history.replaceState({}, "", "/exercises?group=chest#exercise-results");
    await act(async () => root.render(createElement(App)));
    await waitForHeading("Find the movement.");

    const results = host.querySelector<HTMLElement>("#exercise-results");
    expect(results).not.toBeNull();
    expect(results?.querySelector("h2")?.textContent).toBe("Chest");
    expect(results?.textContent).toContain("Barbell Bench Press");
    expect(results?.textContent).not.toContain("Deadlift");
    const suggestionBox = host.querySelector("#suggestion-box");
    expect(suggestionBox).not.toBeNull();
    expect(
      Boolean(results && suggestionBox &&
        (results.compareDocumentPosition(suggestionBox) & Node.DOCUMENT_POSITION_FOLLOWING)),
    ).toBe(true);
  });

  it("provides working muscle-group links outside the static exercise image", async () => {
    window.history.replaceState({}, "", "/e/barbell-bench-press");
    await act(async () => root.render(createElement(App)));
    await waitForHeading("Barbell Bench Press");

    expect(host.textContent).toContain("not a clickable menu");
    const backLink = host.querySelector<HTMLAnchorElement>(
      'nav[aria-label="Browse exercise library by muscle group"] a[href="/exercises?group=back#exercise-results"]',
    );
    expect(backLink).not.toBeNull();

    await act(async () =>
      backLink!.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 })),
    );
    await waitForHeading("Find the movement.");
    expect(host.querySelector("#exercise-results h2")?.textContent).toBe("Back");
  });
});
