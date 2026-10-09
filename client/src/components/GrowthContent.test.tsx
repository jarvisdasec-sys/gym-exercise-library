// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { GrowthContent } from "./GrowthContent";
import { ClientInquiry } from "./ClientInquiry";
import {
  inquiryDraft,
  applyGrowthMetadata,
  APP_STORE_URL,
  PLANNER_URL,
} from "../lib/growth";

afterEach(() => {
  document.body.innerHTML = "";
  document.head.innerHTML = "";
  vi.unstubAllGlobals();
});
describe("BTB growth release", () => {
  it("offers real product destinations without invented testimonials or active subscriptions", () => {
    const html = renderToStaticMarkup(createElement(GrowthContent));
    expect(html).toContain("Train with confidence.");
    expect(html).toContain(PLANNER_URL.replaceAll("&", "&amp;"));
    expect(html).toContain(APP_STORE_URL);
    expect(html).toContain("/exercises");
    expect(html).toContain("/downloads/btb-weekly-starter.html");
    expect(html).not.toContain("Trusted by thousands");
    const plus = renderToStaticMarkup(
      createElement(GrowthContent, { page: "plus" })
    );
    expect(plus).toContain("Research stage—not a paid offer.");
    expect(plus).toContain("No subscription is available here.");
  });
  it("validates and encodes a draft rather than claiming delivery", () => {
    expect(() =>
      inquiryDraft({ name: "", email: "x", topic: "x", message: "" })
    ).toThrow();
    expect(() =>
      inquiryDraft({ name: "Sam", email: "bad", topic: "x", message: "Hello" })
    ).toThrow("valid email");
    const draft = inquiryDraft({
      name: "Sam",
      email: "sam@example.com",
      topic: "Future BTB Plus membership",
      message: "What is next? & details",
    });
    expect(draft.href).toContain("mailto:btbfitnessandhealth@yahoo.com");
    expect(draft.href).toContain("%26%20details");
    expect(draft.text).toContain("Reply email: sam@example.com");
  });
  it("restores canonical and social metadata on navigation", () => {
    document.head.innerHTML =
      '<link rel="canonical" href="https://example.com/old"><meta name="description" content="old">';
    document.title = "Previous";
    const dispose = applyGrowthMetadata("plus");
    expect(document.title).toContain("BTB Plus");
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href")
    ).toBe("https://www.btbfitnessandhealth.com/plus");
    dispose();
    expect(document.title).toBe("Previous");
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
    ).toBe("old");
    expect(document.querySelector('meta[property="og:url"]')).toBeNull();
  });
  it("shows a prepared draft and invalidates it if the user edits the payload", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(createElement(ClientInquiry)));
    const change = async (selector: string, value: string) => {
      const element = host.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >(selector)!;
      const proto =
        element.tagName === "TEXTAREA"
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(
        element,
        value
      );
      await act(async () =>
        element.dispatchEvent(new Event("input", { bubbles: true }))
      );
    };
    await change("#inquiry-name", "Sam");
    await change("#inquiry-email", "sam@example.com");
    await change("#inquiry-message", "Help with meal prep");
    await act(async () =>
      host
        .querySelector("form")!
        .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
    );
    expect(host.textContent).toContain("Draft ready—not yet sent.");
    expect(host.querySelector('a[href^="mailto:"]')).not.toBeNull();
    await change("#inquiry-message", "Revised request");
    expect(host.querySelector("pre")).toBeNull();
    await act(async () => root.unmount());
  });
});
