// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GrowthContent } from "./GrowthContent";
import { SocialFooter } from "./SocialFooter";
import { APP_STORE_URL } from "../lib/growth";
import { INSTAGRAM_URL } from "../lib/social";

function parseMarkup(html: string) {
  const host = document.createElement("div");
  host.innerHTML = html;
  return host;
}

function expectSafeExternalLink(link: HTMLAnchorElement | null, href: string) {
  expect(link).not.toBeNull();
  expect(link!.getAttribute("href")).toBe(href);
  expect(link!.getAttribute("target")).toBe("_blank");
  expect(link!.relList.contains("noopener")).toBe(true);
  expect(link!.relList.contains("noreferrer")).toBe(true);
}

describe("BTB direct app and Instagram links", () => {
  it("keeps the homepage hero focused and places app/social links in the app section", () => {
    const host = parseMarkup(
      renderToStaticMarkup(createElement(GrowthContent))
    );
    expect(host.querySelector(`.growth-hero a[href="${APP_STORE_URL}"]`)).toBeNull();
    expect(host.querySelector(`.growth-hero a[href="${INSTAGRAM_URL}"]`)).toBeNull();
    const section = host.querySelector("#btb-app");
    expect(section).not.toBeNull();
    const app = section!.querySelector<HTMLAnchorElement>(
      `a[href="${APP_STORE_URL}"]`
    );
    const instagram = section!.querySelector<HTMLAnchorElement>(
      `a[href="${INSTAGRAM_URL}"]`
    );
    expectSafeExternalLink(app, APP_STORE_URL);
    expectSafeExternalLink(instagram, INSTAGRAM_URL);
    expect(app!.textContent).toContain("View BTB on the App Store");
    expect(instagram!.textContent).toContain("Follow BTB on Instagram");
    expect(app!.getAttribute("aria-label")).toContain("opens in a new tab");
    expect(instagram!.getAttribute("aria-label")).toContain(
      "opens in a new tab"
    );
    expect(app!.classList.contains("growth-action")).toBe(true);
    expect(host.querySelector('a[href="/start"]')).not.toBeNull();
  });

  it("keeps the app download and Instagram follow links together in the site-wide footer", () => {
    const host = parseMarkup(renderToStaticMarkup(createElement(SocialFooter)));
    const app = host.querySelector<HTMLAnchorElement>(
      `footer a[href="${APP_STORE_URL}"]`
    );
    const instagram = host.querySelector<HTMLAnchorElement>(
      `footer a[href="${INSTAGRAM_URL}"]`
    );
    expectSafeExternalLink(app, APP_STORE_URL);
    expectSafeExternalLink(instagram, INSTAGRAM_URL);
    expect(app!.textContent).toContain("Download BTB App");
    expect(app!.textContent).toContain("opens in a new tab");
    expect(app!.parentElement).toBe(instagram!.parentElement);
    expect(host.querySelector('a[href="/instagram"]')).not.toBeNull();
  });
});
