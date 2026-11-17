// @vitest-environment happy-dom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { SiteNav } from "./SiteNav";
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: null }) }));
vi.mock("@/components/AuthControl", () => ({ AuthControl: () => null }));

it("offers the starter on mobile and restores focus when Escape dismisses navigation", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  try {
    await act(async () => root.render(createElement(SiteNav, { active: "home" })));
    const button = host.querySelector<HTMLButtonElement>('button[aria-controls="btb-mobile-sections"]')!;
    expect(button.getAttribute("aria-expanded")).toBe("false");
    await act(async () => button.click());
    expect(host.querySelector('#btb-mobile-sections a[href="/7-day-starter"]')?.textContent).toContain("Free 7-day");
    await act(async () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    expect(host.querySelector("#btb-mobile-sections")).toBeNull();
    expect(document.activeElement).toBe(button);
  } finally {
    await act(async () => root.unmount());
    host.remove();
    vi.unstubAllGlobals();
  }
});