// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "../App";
import {
  INSTAGRAM_PAGE_URL,
  INSTAGRAM_TITLE,
  INSTAGRAM_URL,
} from "../lib/social";

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.localStorage.clear();
  window.history.replaceState(
    {},
    "",
    "/instagram?utm_source=instagram&utm_medium=bio&utm_campaign=btb_profile"
  );
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

describe("Instagram hub application integration", () => {
  it("loads the public route, featured guide, shared footer and canonical metadata", async () => {
    await act(async () => root.render(createElement(App)));
    await waitForHeading("Beyond the Reel.");
    expect(
      host.querySelector('a[href="/e/barbell-bent-over-row"]')
    ).not.toBeNull();
    expect(host.querySelector('a[href="/nutrition/builder"]')).not.toBeNull();
    expect(host.querySelector('footer a[href="/instagram"]')).not.toBeNull();
    expect(
      host.querySelector(`footer a[href="${INSTAGRAM_URL}"]`)
    ).not.toBeNull();
    expect(document.title).toBe(INSTAGRAM_TITLE);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe(INSTAGRAM_PAGE_URL);
  });

  it("returns to the existing movement library and keeps the homepage follow CTA", async () => {
    await act(async () => root.render(createElement(App)));
    await waitForHeading("Beyond the Reel.");
    const library = host.querySelector<HTMLAnchorElement>(
      'header nav a[href="/"]'
    );
    expect(library).not.toBeNull();
    await act(async () =>
      library!.dispatchEvent(
        new MouseEvent("click", { bubbles: true, button: 0 })
      )
    );
    await waitForHeading("Find the movement.");
    expect(host.querySelector("#instagram-follow-heading")?.textContent).toBe(
      "Train with BTB."
    );
    expect(host.querySelector("h1")?.textContent).not.toContain("Not found");
    expect(document.title).not.toBe(INSTAGRAM_TITLE);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).not.toBe(INSTAGRAM_PAGE_URL);
  });
});
