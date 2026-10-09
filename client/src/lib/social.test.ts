// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { InstagramLanding } from "@/components/InstagramLanding";
import { EXERCISES } from "@/lib/exercises";
import { WORKOUTS } from "@/lib/workouts";
import { ROUTES } from "@/lib/routes";
import {
  BTB_PUBLIC_ORIGIN,
  FEATURED_INSTAGRAM_EXERCISE,
  INSTAGRAM_BIO_URL,
  INSTAGRAM_DESTINATIONS,
  INSTAGRAM_URL,
  INSTAGRAM_WORKOUTS,
  trackSocialClick,
} from "@/lib/social";

const root = process.cwd();
const analyticsWindow = window as Window & {
  umami?: { track: ReturnType<typeof vi.fn> };
};

afterEach(() => {
  delete analyticsWindow.umami;
  window.history.replaceState({}, "", "/");
  vi.unstubAllGlobals();
});

describe("BTB Instagram destinations", () => {
  it("uses a clean canonical profile and the approved UTM bio link", () => {
    const profile = new URL(INSTAGRAM_URL);
    expect(profile.hostname).toBe("www.instagram.com");
    expect(profile.pathname).toBe("/btbfitnessandhealth/");
    expect(profile.search).toBe("");
    const bio = new URL(INSTAGRAM_BIO_URL);
    expect(bio.origin).toBe(BTB_PUBLIC_ORIGIN);
    expect(bio.pathname).toBe("/instagram");
    expect(Object.fromEntries(bio.searchParams)).toEqual({
      utm_source: "instagram",
      utm_medium: "bio",
      utm_campaign: "btb_profile",
    });
  });

  it("points every tool to a real canonical route", () => {
    const routes = Object.values(ROUTES);
    for (const destination of INSTAGRAM_DESTINATIONS)
      expect(routes).toContain(destination.href);
    expect(INSTAGRAM_DESTINATIONS).toHaveLength(6);
  });

  it("uses real exercise and workout records with a local featured image", () => {
    const exercise = EXERCISES.find(
      item => `/e/${item.slug}` === FEATURED_INSTAGRAM_EXERCISE.href
    );
    expect(exercise?.name).toBe(FEATURED_INSTAGRAM_EXERCISE.title);
    expect(
      existsSync(
        path.join(root, "client/public", FEATURED_INSTAGRAM_EXERCISE.image)
      )
    ).toBe(true);
    for (const session of INSTAGRAM_WORKOUTS) {
      expect(
        WORKOUTS.some(workout => `/workouts/${workout.slug}` === session.href)
      ).toBe(true);
    }
  });

  it("registers the route in the app and static Vercel routing", () => {
    const app = readFileSync(path.join(root, "client/src/App.tsx"), "utf8");
    expect(app).toContain(
      '<Route path="/instagram" component={InstagramPage} />'
    );
    const manifest = JSON.parse(
      readFileSync(path.join(root, "client/public/manus-routes.json"), "utf8")
    );
    expect(
      manifest.routes.some(
        (route: { path: string }) => route.path === "/instagram"
      )
    ).toBe(true);
    const vercel = JSON.parse(
      readFileSync(path.join(root, "vercel.json"), "utf8")
    );
    expect(vercel.rewrites).toEqual(
      expect.arrayContaining([
        { source: "/instagram", destination: "/instagram.html" },
        { source: "/instagram/", destination: "/instagram.html" },
      ])
    );
  });
});

describe("public landing markup", () => {
  it("renders useful content and destinations without auth or browser APIs", () => {
    const html = renderToStaticMarkup(createElement(InstagramLanding));
    const document = new DOMParser().parseFromString(html, "text/html");
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector("h1")?.textContent).toContain(
      "Beyond the Reel."
    );
    expect(document.querySelectorAll("h2").length).toBeGreaterThanOrEqual(4);
    const links = [...document.querySelectorAll<HTMLAnchorElement>("a")];
    for (const destination of INSTAGRAM_DESTINATIONS)
      expect(
        links.some(link => link.getAttribute("href") === destination.href)
      ).toBe(true);
    expect(links.some(link => link.getAttribute("href") === "/account")).toBe(
      true
    );
    const external = links.find(
      link => link.getAttribute("href") === INSTAGRAM_URL
    );
    expect(external?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(external?.getAttribute("target")).toBe("_blank");
    expect(external?.textContent).toContain("opens in a new tab");
    expect(
      links.every(link =>
        Boolean(link.textContent?.trim() || link.getAttribute("aria-label"))
      )
    ).toBe(true);
  });

  it("uses the canonical follow URL in the homepage CTA and shared footer", () => {
    for (const component of ["InstagramFollow.tsx", "SocialFooter.tsx"]) {
      const source = readFileSync(
        path.join(root, "client/src/components", component),
        "utf8"
      );
      expect(source).toContain("href={INSTAGRAM_URL}");
      expect(source.replace(/\s+/g, " ")).toContain("Follow BTB on Instagram");
      expect(source).toContain("focus-visible:outline");
    }
    expect(
      readFileSync(path.join(root, "client/src/pages/Home.tsx"), "utf8")
    ).toContain("<InstagramFollow />");
  });
});

describe("optional existing analytics", () => {
  it("remains harmless with no analytics configuration", () => {
    expect(() =>
      trackSocialClick("/wod", "instagram-workout-of-day")
    ).not.toThrow();
  });

  it("tracks controlled destinations and allowed campaign labels only", () => {
    const track = vi.fn();
    analyticsWindow.umami = { track };
    window.history.replaceState(
      {},
      "",
      "/instagram?utm_source=instagram&utm_medium=bio&utm_campaign=btb_profile&email=private@example.com"
    );
    trackSocialClick("/wod", "instagram-workout-of-day");
    expect(track).toHaveBeenCalledWith("btb_social_click", {
      destination: "/wod",
      placement: "instagram-workout-of-day",
      utm_source: "instagram",
      utm_medium: "bio",
      utm_campaign: "btb_profile",
    });
  });

  it("does not pass arbitrary campaign text or allow exceptions to block clicks", () => {
    const track = vi.fn(() => {
      throw new Error("Tracker unavailable");
    });
    analyticsWindow.umami = { track };
    window.history.replaceState(
      {},
      "",
      "/instagram?utm_campaign=private%40example.com"
    );
    expect(() =>
      trackSocialClick(INSTAGRAM_URL, "footer-follow")
    ).not.toThrow();
    expect(track).toHaveBeenCalledWith("btb_social_click", {
      destination: INSTAGRAM_URL,
      placement: "footer-follow",
    });
  });

  it("handles rejected tracker promises", async () => {
    analyticsWindow.umami = {
      track: vi.fn(() => Promise.reject(new Error("Offline"))),
    };
    expect(() =>
      trackSocialClick("/wod", "instagram-workout-session")
    ).not.toThrow();
    await Promise.resolve();
  });
});

describe("shared analytics privacy", () => {
  it.each([{ doNotTrack: "1" }, { globalPrivacyControl: true }])(
    "does not dispatch any social measurement when privacy preferences opt out: %o",
    signal => {
      const track = vi.fn();
      analyticsWindow.umami = { track };
      vi.stubGlobal("navigator", signal);
      trackSocialClick("/wod", "instagram-workout-session");
      expect(track).not.toHaveBeenCalled();
    }
  );
  it("does not measure an account/private destination", () => {
    const track = vi.fn();
    analyticsWindow.umami = { track };
    trackSocialClick("/account", "instagram-account");
    expect(track).not.toHaveBeenCalled();
  });
  it("does not measure a social action from a private page", () => {
    const track = vi.fn();
    analyticsWindow.umami = { track };
    window.history.replaceState({}, "", "/account");
    trackSocialClick(INSTAGRAM_URL, "footer-follow");
    expect(track).not.toHaveBeenCalled();
  });
  it("sanitizes destination query strings on both analytics paths", () => {
    const track = vi.fn();
    analyticsWindow.umami = { track };
    trackSocialClick(
      "/wod?email=private%40example.com#access_token=secret",
      "instagram-workout-session"
    );
    expect(track).toHaveBeenCalledWith("btb_social_click", {
      destination: "/wod",
      placement: "instagram-workout-session",
    });
  });
});
