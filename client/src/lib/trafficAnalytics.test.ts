// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  campaignProperties,
  isPublicTrafficPath,
  sanitizePageUrl,
  sanitizeTrafficEvent,
  trafficConfig,
} from "./trafficAnalytics";

const sdk = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn() }));
vi.mock("posthog-js", () => ({ default: sdk }));
const origin = "https://www.btbfitnessandhealth.com";
const browser = window as Window & {
  happyDOM: { setURL: (url: string) => void };
};

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("PROD", false);
  browser.happyDOM.setURL(
    origin +
      "/instagram?utm_source=instagram&utm_medium=bio&utm_campaign=btb_profile"
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  browser.happyDOM.setURL("http://localhost:3000/");
});

describe("public analytics scope", () => {
  it.each([
    "/",
    "/start",
    "/plus",
    "/exercises",
    "/instagram",
    "/instagram/",
    "/e/barbell-bent-over-row",
    "/wod",
    "/nutrition/builder",
    "/workouts/pull-day",
    "/workouts/programs/strength/1/2",
  ])("allows the real public page %s", path => {
    expect(isPublicTrafficPath(path)).toBe(true);
  });
  it.each([
    "/account",
    "/reset-password",
    "/saved",
    "/nutrition/tracker",
    "/workouts/builder",
    "/unknown",
    "/e/private%40example.com",
  ])("excludes private or invalid page %s", path => {
    expect(isPublicTrafficPath(path)).toBe(false);
  });
  it("drops credentials, unrelated query strings, and fragments", () => {
    expect(
      sanitizePageUrl(
        origin +
          "/instagram?utm_source=instagram&utm_medium=bio&email=private%40example.com&access_token=secret#refresh_token=private"
      )
    ).toBe(origin + "/instagram?utm_source=instagram&utm_medium=bio");
    expect(
      sanitizePageUrl(
        "https://user:password@www.btbfitnessandhealth.com/instagram"
      )
    ).toBeNull();
    expect(sanitizePageUrl("https://other.example/instagram")).toBeNull();
    expect(
      sanitizePageUrl("http://www.btbfitnessandhealth.com/instagram")
    ).toBeNull();
  });
  it("keeps only controlled campaign labels", () => {
    expect(
      campaignProperties(
        origin +
          "/?utm_source=instagram&utm_campaign=private%40example.com&utm_content=row_2026-10-07&email=private"
      )
    ).toEqual({ utm_source: "instagram", utm_content: "row_2026-10-07" });
    expect(campaignProperties("not a URL")).toEqual({});
  });
});

describe("privacy controls", () => {
  it("requires cookieless, unprofiled measurement and disables unwanted capture", () => {
    expect(trafficConfig()).toMatchObject({
      cookieless_mode: "always",
      person_profiles: "never",
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      capture_exceptions: false,
      capture_performance: false,
      respect_dnt: true,
    });
  });
  it("sanitizes all URL and initial-attribution properties, not just the current URL", () => {
    const event = sanitizeTrafficEvent({
      event: "$pageview",
      uuid: "retained",
      properties: {
        $current_url: origin + "/instagram?utm_source=instagram&email=private",
        $initial_current_url:
          origin + "/e/barbell-bent-over-row?token=secret#access_token=secret",
        $referrer: "https://l.instagram.com/?u=private&secret=hidden",
        $session_entry_url: origin + "/instagram?password=secret",
        $initial_utm_campaign: "private@example.com",
        $set: { email: "private@example.com" },
        email: "private@example.com",
      },
    });
    expect(event?.uuid).toBe("retained");
    expect(event?.properties).toMatchObject({
      $current_url: origin + "/instagram?utm_source=instagram",
      $initial_current_url: origin + "/e/barbell-bent-over-row",
      $referrer: "https://l.instagram.com",
      $session_entry_url: origin + "/instagram",
    });
    expect(event?.properties).not.toHaveProperty("$set");
    expect(event?.properties).not.toHaveProperty("email");
    expect(event?.properties).not.toHaveProperty("$initial_utm_campaign");
    expect(JSON.stringify(event)).not.toContain("secret");
    expect(JSON.stringify(event)).not.toContain("private@");
  });
  it("drops private page events and all unrequested event categories", () => {
    expect(
      sanitizeTrafficEvent({
        event: "$pageview",
        properties: { $current_url: origin + "/account?email=private" },
      })
    ).toBeNull();
    expect(
      sanitizeTrafficEvent({
        event: "$autocapture",
        properties: { $current_url: origin },
      })
    ).toBeNull();
    expect(
      sanitizeTrafficEvent({
        event: "$identify",
        properties: { $current_url: origin },
      })
    ).toBeNull();
  });
});

describe("non-blocking runtime tracking", () => {
  it("tracks controlled tool-interest labels without personal form fields", async () => {
    vi.stubEnv("PROD", true);
    browser.happyDOM.setURL(
      origin + "/start?utm_source=instagram&email=private"
    );
    const analytics = await import("./trafficAnalytics");
    await analytics.captureGrowthClick("recipe_planner");
    expect(sdk.capture).toHaveBeenCalledWith(
      "btb_tool_click",
      expect.objectContaining({
        target: "recipe_planner",
        $current_url: origin + "/start?utm_source=instagram",
      }),
      { transport: "sendBeacon", send_instantly: true }
    );
    expect(JSON.stringify(sdk.capture.mock.calls)).not.toContain("private");
  });
  it("does not initialize on development or preview domains", async () => {
    const analytics = await import("./trafficAnalytics");
    await analytics.captureTrafficPage(window.location.href);
    expect(sdk.init).not.toHaveBeenCalled();
    vi.stubEnv("PROD", true);
    browser.happyDOM.setURL("https://preview.example/instagram");
    await analytics.captureTrafficPage(window.location.href);
    expect(sdk.init).not.toHaveBeenCalled();
  });
  it("honors Do Not Track and Global Privacy Control", async () => {
    vi.stubEnv("PROD", true);
    vi.stubGlobal("navigator", { doNotTrack: "1", webdriver: false });
    const analytics = await import("./trafficAnalytics");
    await analytics.captureTrafficPage(window.location.href);
    expect(sdk.init).not.toHaveBeenCalled();
    vi.stubGlobal("navigator", {
      globalPrivacyControl: true,
      webdriver: false,
    });
    await analytics.captureTrafficPage(window.location.href);
    expect(sdk.init).not.toHaveBeenCalled();
  });
  it("initializes once, deduplicates rerenders, and measures real route changes", async () => {
    vi.stubEnv("PROD", true);
    const analytics = await import("./trafficAnalytics");
    await analytics.captureTrafficPage(window.location.href);
    await analytics.captureTrafficPage(window.location.href);
    await analytics.captureTrafficPage(origin + "/wod");
    expect(sdk.init).toHaveBeenCalledTimes(1);
    expect(sdk.capture).toHaveBeenCalledTimes(2);
    expect(sdk.capture).toHaveBeenLastCalledWith(
      "$pageview",
      expect.objectContaining({
        $current_url: origin + "/wod",
        $pathname: "/wod",
      })
    );
  });
  it("resets deduplication across an excluded page", async () => {
    vi.stubEnv("PROD", true);
    const analytics = await import("./trafficAnalytics");
    await analytics.captureTrafficPage(origin + "/instagram");
    await analytics.captureTrafficPage(origin + "/account");
    await analytics.captureTrafficPage(origin + "/instagram");
    expect(sdk.capture).toHaveBeenCalledTimes(2);
  });
  it("marks verification traffic and strips the verification flag from the URL", async () => {
    vi.stubEnv("PROD", true);
    const analytics = await import("./trafficAnalytics");
    await analytics.captureTrafficPage(
      origin + "/instagram?utm_source=instagram&btb_analytics_test=1"
    );
    expect(sdk.capture).toHaveBeenCalledWith(
      "$pageview",
      expect.objectContaining({
        btb_analytics_test: true,
        $current_url: origin + "/instagram?utm_source=instagram",
      })
    );
  });
  it("tracks safe controlled clicks and rejects arbitrary destinations", async () => {
    vi.stubEnv("PROD", true);
    const analytics = await import("./trafficAnalytics");
    await analytics.captureTrafficClick(
      "/wod?email=private",
      "instagram-workout-session"
    );
    expect(sdk.capture).toHaveBeenCalledWith(
      "btb_social_click",
      expect.objectContaining({
        destination: origin + "/wod",
        utm_source: "instagram",
        utm_medium: "bio",
      }),
      { transport: "sendBeacon", send_instantly: true }
    );
    await analytics.captureTrafficClick(
      "https://other.example/private",
      "footer-follow"
    );
    expect(sdk.capture).toHaveBeenCalledTimes(1);
  });
  it("never rejects navigation if the analytics SDK fails", async () => {
    vi.stubEnv("PROD", true);
    sdk.capture.mockImplementationOnce(() => {
      throw new Error("Offline");
    });
    const analytics = await import("./trafficAnalytics");
    await expect(
      analytics.captureTrafficPage(window.location.href)
    ).resolves.toBeUndefined();
    sdk.capture.mockImplementationOnce(() => {
      throw new Error("Offline");
    });
    await expect(
      analytics.captureTrafficClick("/wod", "instagram-featured-guide")
    ).resolves.toBeUndefined();
  });
});

describe("navigation-delivery regressions", () => {
  it("retains explicit test markers on SDK-generated pageleave events", () => {
    const event = sanitizeTrafficEvent({
      event: "$pageleave",
      properties: {
        $current_url: origin + "/instagram?btb_analytics_test=1",
        btb_analytics_test: false,
      },
    });
    expect(event?.properties).toMatchObject({
      $current_url: origin + "/instagram",
      btb_analytics_test: true,
    });
  });
  it("dispatches an already initialized SDK click synchronously before navigation", async () => {
    vi.stubEnv("PROD", true);
    browser.happyDOM.setURL(
      origin + "/instagram?utm_source=instagram&btb_analytics_test=1"
    );
    const analytics = await import("./trafficAnalytics");
    await analytics.captureTrafficPage(window.location.href);
    sdk.capture.mockClear();
    const pending = analytics.captureTrafficClick(
      "/wod",
      "instagram-workout-of-day"
    );
    expect(sdk.capture).toHaveBeenCalledWith(
      "btb_social_click",
      expect.objectContaining({
        $current_url: origin + "/instagram?utm_source=instagram",
        btb_analytics_test: true,
      }),
      { transport: "sendBeacon", send_instantly: true }
    );
    browser.happyDOM.setURL(origin + "/wod");
    await pending;
  });
  it("snapshots attribution and test flags before a pending SDK import", async () => {
    vi.stubEnv("PROD", true);
    browser.happyDOM.setURL(
      origin + "/instagram?utm_source=instagram&btb_analytics_test=1"
    );
    const analytics = await import("./trafficAnalytics");
    const pending = analytics.captureTrafficClick(
      "/wod",
      "instagram-workout-of-day"
    );
    browser.happyDOM.setURL(origin + "/wod");
    await pending;
    expect(sdk.capture).toHaveBeenCalledWith(
      "btb_social_click",
      expect.objectContaining({
        utm_source: "instagram",
        btb_analytics_test: true,
      }),
      { transport: "sendBeacon", send_instantly: true }
    );
  });
});
