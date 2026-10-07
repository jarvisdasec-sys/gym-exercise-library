// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BtbMotion } from "./BtbMotion";
import {
  FEATURED_REELS,
  instagramEmbedUrl,
  instagramReelUrl,
} from "@/lib/featuredReels";
vi.mock("@/lib/social", () => ({ trackSocialClick: vi.fn() }));
let root: Root, host: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  (
    window as unknown as {
      happyDOM: { settings: { disableIframePageLoading: boolean } };
    }
  ).happyDOM.settings.disableIframePageLoading = true;
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

describe("BTB in Motion", () => {
  it("has real published links and local covers but no player in public/default HTML", async () => {
    const markup = renderToStaticMarkup(<BtbMotion />);
    expect(markup).toContain("BTB");
    expect(markup).not.toContain("<iframe");
    await act(async () => root.render(<BtbMotion />));
    expect(host.querySelectorAll("article")).toHaveLength(3);
    expect(document.querySelector("iframe")).toBeNull();
    for (const reel of FEATURED_REELS) {
      expect(host.querySelector(`img[src="${reel.poster}"]`)).not.toBeNull();
      expect(
        host.querySelector(`a[href="${instagramReelUrl(reel.shortcode)}"]`)
      ).not.toBeNull();
      expect(host.querySelector(`a[href="${reel.guideHref}"]`)).not.toBeNull();
    }
  });
  it("mounts exactly the chosen real player after consent and retains an accessible external fallback", async () => {
    await act(async () => root.render(<BtbMotion />));
    const button = host.querySelector<HTMLButtonElement>("article button")!;
    await act(async () => button.click());
    const frame = document.querySelector<HTMLIFrameElement>("iframe")!;
    expect(frame.src).toBe(instagramEmbedUrl(FEATURED_REELS[0].shortcode));
    expect(frame.title).toContain("Published BTB Reel");
    expect(frame.referrerPolicy).toBe("no-referrer");
    expect(frame.allow).not.toContain("autoplay");
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain(
      "Player blocked or unavailable?"
    );
    const close = document.querySelector<HTMLButtonElement>(
      '[role="dialog"] button'
    )!;
    await act(async () => close.click());
    expect(document.querySelector("iframe")).toBeNull();
    await vi.waitFor(() => expect(document.activeElement).toBe(button));
  });
});
