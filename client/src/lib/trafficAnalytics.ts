import type { PostHog, PostHogConfig } from "posthog-js";

// Public, write-only project ingestion token. This is not a personal API key.
export const TRAFFIC_PROJECT_TOKEN =
  "phc_tgdFd3FiwGr9wCPdgJhUMtHnUbbRnf5RKzjm3r9GXwc2";
export const TRAFFIC_API_HOST = "https://us.i.posthog.com";
export const TRAFFIC_HOSTS = new Set([
  "www.btbfitnessandhealth.com",
  "btbfitnessandhealth.com",
]);
export const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
const CAMPAIGN_LABEL = /^[a-zA-Z0-9_.-]{1,80}$/;
const publicPages = new Set([
  "/",
  "/instagram",
  "/workouts",
  "/wod",
  "/workouts/tools",
  "/cardio",
  "/mobility",
  "/nutrition",
  "/nutrition/builder",
  "/nutrition/meal-prep",
  "/calculators",
  "/learn",
  "/stickers",
]);
let sdkPromise: Promise<PostHog | null> | undefined;
let lastPageUrl: string | null = null;

export function isPublicTrafficPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (
    [
      "/account",
      "/reset-password",
      "/saved",
      "/nutrition/tracker",
      "/workouts/builder",
    ].includes(path)
  )
    return false;
  return (
    publicPages.has(path) ||
    /^\/(e|workouts|cardio|learn)\/[a-z0-9][a-z0-9-]*$/.test(path) ||
    /^\/workouts\/programs\/[a-z0-9-]+\/[1-9][0-9]*\/[1-9][0-9]*$/.test(path)
  );
}

export function campaignProperties(rawUrl: string): Record<string, string> {
  const data: Record<string, string> = {};
  try {
    const url = new URL(rawUrl);
    for (const key of CAMPAIGN_KEYS) {
      const value = url.searchParams.get(key);
      if (value && CAMPAIGN_LABEL.test(value)) data[key] = value;
    }
  } catch {
    /* Invalid inputs never become analytics data. */
  }
  return data;
}

export function sanitizePageUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (
      url.protocol !== "https:" ||
      !TRAFFIC_HOSTS.has(url.hostname) ||
      url.username ||
      url.password ||
      !isPublicTrafficPath(url.pathname)
    )
      return null;
    const clean = new URL(
      url.origin + (url.pathname.replace(/\/+$/, "") || "/")
    );
    for (const [key, value] of Object.entries(campaignProperties(rawUrl)))
      clean.searchParams.set(key, value);
    return clean.href;
  } catch {
    return null;
  }
}

function safeReferrer(value: string): string | null {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.origin
      : null;
  } catch {
    return /^[a-zA-Z0-9.-]+$/.test(value) ? value : null;
  }
}

export function sanitizeTrafficEvent<
  T extends { event: string; properties: Record<string, unknown> },
>(event: T): T | null {
  if (!["$pageview", "$pageleave", "btb_social_click"].includes(event.event))
    return null;
  const rawUrl = event.properties.$current_url;
  const pageUrl = typeof rawUrl === "string" ? sanitizePageUrl(rawUrl) : null;
  if (!pageUrl) return null;
  const properties = { ...event.properties };
  for (const [key, value] of Object.entries(properties)) {
    if (
      [
        "$set",
        "$set_once",
        "$groups",
        "$user_id",
        "user_id",
        "email",
        "name",
        "password",
        "access_token",
        "refresh_token",
      ].includes(key)
    ) {
      delete properties[key];
      continue;
    }
    if (typeof value !== "string") continue;
    const lower = key.toLowerCase();
    if (lower.includes("utm_")) {
      if (!CAMPAIGN_LABEL.test(value)) delete properties[key];
    } else if (
      lower.includes("referrer") ||
      lower.includes("referring_domain")
    ) {
      properties[key] = value ? safeReferrer(value) : "";
    } else if (lower.includes("url")) {
      properties[key] = sanitizePageUrl(value) || safeReferrer(value);
    } else if (lower.includes("pathname")) {
      properties[key] = isPublicTrafficPath(value) ? value : null;
    }
  }
  properties.$current_url = pageUrl;
  properties.$pathname = new URL(pageUrl).pathname;
  properties.btb_analytics_test =
    properties.btb_analytics_test === true ||
    (typeof navigator !== "undefined" && navigator.webdriver === true);
  return { ...event, properties };
}

export function trafficConfig(): Partial<PostHogConfig> {
  return {
    api_host: TRAFFIC_API_HOST,
    ui_host: "https://us.posthog.com",
    defaults: "2026-05-30",
    cookieless_mode: "always",
    person_profiles: "never",
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: true,
    disable_session_recording: true,
    enable_recording_console_log: false,
    capture_performance: false,
    capture_exceptions: false,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    advanced_disable_feature_flags: true,
    disable_external_dependency_loading: true,
    respect_dnt: true,
    before_send: event =>
      event && shouldTrackTraffic() ? sanitizeTrafficEvent(event) : null,
  };
}

export function hasTrafficPrivacyOptOut(): boolean {
  if (typeof navigator === "undefined") return false;
  const privacyNavigator = navigator as Navigator & {
    globalPrivacyControl?: boolean;
  };
  return (
    privacyNavigator.globalPrivacyControl === true ||
    navigator.doNotTrack === "1"
  );
}

export function sanitizeTrafficDestination(destination: string): string | null {
  if (destination === "https://www.instagram.com/btbfitnessandhealth/")
    return destination;
  if (!destination.startsWith("/") || destination.startsWith("//")) return null;
  const clean = sanitizePageUrl(
    new URL(destination, "https://www.btbfitnessandhealth.com").href
  );
  if (!clean) return null;
  const url = new URL(clean);
  return url.pathname + url.search;
}

export function shouldTrackTraffic(): boolean {
  if (
    typeof window === "undefined" ||
    !import.meta.env.PROD ||
    !TRAFFIC_HOSTS.has(window.location.hostname)
  )
    return false;
  return !hasTrafficPrivacyOptOut();
}

async function trafficSdk(): Promise<PostHog | null> {
  if (!shouldTrackTraffic()) return null;
  if (!sdkPromise)
    sdkPromise = import("posthog-js")
      .then(({ default: sdk }) => {
        if (!shouldTrackTraffic()) return null;
        sdk.init(TRAFFIC_PROJECT_TOKEN, trafficConfig());
        return sdk;
      })
      .catch(() => null);
  return sdkPromise;
}

function testProperties(rawUrl: string): Record<string, boolean> {
  try {
    return {
      btb_analytics_test:
        new URL(rawUrl).searchParams.get("btb_analytics_test") === "1" ||
        navigator.webdriver === true,
    };
  } catch {
    return { btb_analytics_test: false };
  }
}

export async function captureTrafficPage(rawUrl: string): Promise<void> {
  const clean = sanitizePageUrl(rawUrl);
  if (!clean) {
    lastPageUrl = null;
    return;
  }
  try {
    const sdk = await trafficSdk();
    if (!sdk || !shouldTrackTraffic() || lastPageUrl === clean) return;
    lastPageUrl = clean;
    sdk.capture("$pageview", {
      $current_url: clean,
      $pathname: new URL(clean).pathname,
      ...campaignProperties(rawUrl),
      ...testProperties(rawUrl),
    });
  } catch {
    /* Traffic measurement never interrupts the website. */
  }
}

export async function captureTrafficClick(
  destination: string,
  placement: string
): Promise<void> {
  if (typeof window === "undefined") return;
  const clean = sanitizePageUrl(window.location.href);
  if (!clean || !/^[a-zA-Z0-9_.-]{1,80}$/.test(placement)) return;
  const target = sanitizeTrafficDestination(destination);
  if (!target) return;
  const safeDestination = target.startsWith("/")
    ? new URL(target, window.location.origin).href
    : target;
  try {
    const sdk = await trafficSdk();
    if (!sdk || !shouldTrackTraffic()) return;
    sdk.capture("btb_social_click", {
      destination: safeDestination,
      placement,
      $current_url: clean,
      ...campaignProperties(window.location.href),
      ...testProperties(window.location.href),
    });
  } catch {
    /* The existing anchor remains functional. */
  }
}
