// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync } from "node:fs";
import path from "node:path";
import { InstagramLanding } from "./InstagramLanding";
import {
  INSTAGRAM_STARTER_PLAN,
  LATEST_INSTAGRAM_POST,
  FEATURED_INSTAGRAM_EXERCISE,
  trackSocialClick,
} from "../lib/social";
import { sanitizeTrafficDestination } from "../lib/trafficAnalytics";

afterEach(() => {
  delete (window as Window & { umami?: unknown }).umami;
  window.history.replaceState({}, "", "/");
  vi.unstubAllGlobals();
});

describe("Instagram growth landing", () => {
  it("renders the free starter plan before the selected post and preserves the form guide", () => {
    const html = renderToStaticMarkup(createElement(InstagramLanding));
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    const starter = doc.querySelector<HTMLAnchorElement>(
      `a[href='${INSTAGRAM_STARTER_PLAN.href}']`
    );
    expect(starter?.textContent).toContain("Open the free 7-day plan");
    expect(html.indexOf('id="instagram-starter-heading"')).toBeLessThan(
      html.indexOf('id="latest-instagram-heading"')
    );
    expect(html).toContain("No account or email signup");
    expect(
      doc.querySelector(`a[href='${FEATURED_INSTAGRAM_EXERCISE.href}']`)
    ).not.toBeNull();
  });

  it("uses the published carousel with a local image and safe accessible external link", () => {
    const doc = new DOMParser().parseFromString(
      renderToStaticMarkup(createElement(InstagramLanding)),
      "text/html"
    );
    const link = doc.querySelector(`a[href='${LATEST_INSTAGRAM_POST.href}']`);
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link?.textContent).toContain("opens in a new tab");
    expect(link?.className).toContain("focus-visible:outline");
    expect(doc.querySelector("time")?.getAttribute("datetime")).toBe(
      "2026-11-17"
    );
    expect(
      existsSync(
        path.join(process.cwd(), "client/public", LATEST_INSTAGRAM_POST.image)
      )
    ).toBe(true);
    expect(
      doc
        .querySelector(`img[src='${LATEST_INSTAGRAM_POST.image}']`)
        ?.getAttribute("alt")
    ).toContain("Nutrition");
  });

  it("allows only the approved new destinations", () => {
    expect(sanitizeTrafficDestination(LATEST_INSTAGRAM_POST.href)).toBe(
      LATEST_INSTAGRAM_POST.href
    );
    expect(sanitizeTrafficDestination(INSTAGRAM_STARTER_PLAN.href)).toBe(
      "/7-day-starter"
    );
    expect(
      sanitizeTrafficDestination("https://www.instagram.com/p/not-approved/")
    ).toBeNull();
    expect(
      sanitizeTrafficDestination(
        `${LATEST_INSTAGRAM_POST.href}?email=private@example.com`
      )
    ).toBeNull();
  });

  it("dispatches optional clicks for both new placements without arbitrary query data", () => {
    const track = vi.fn();
    (window as Window & { umami?: unknown }).umami = { track };
    window.history.replaceState(
      {},
      "",
      "/instagram?utm_source=instagram&email=private@example.com"
    );
    trackSocialClick(INSTAGRAM_STARTER_PLAN.href, "instagram-starter-plan");
    trackSocialClick(LATEST_INSTAGRAM_POST.href, "instagram-latest-nutrition");
    expect(track).toHaveBeenCalledWith("btb_social_click", {
      destination: "/7-day-starter",
      placement: "instagram-starter-plan",
      utm_source: "instagram",
    });
    expect(track).toHaveBeenCalledWith("btb_social_click", {
      destination: LATEST_INSTAGRAM_POST.href,
      placement: "instagram-latest-nutrition",
      utm_source: "instagram",
    });
  });
});
