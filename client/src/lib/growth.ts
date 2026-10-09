import { applyFallbackRouteMetadata } from "./defaultRouteMetadata";

export const APP_STORE_URL =
  "https://apps.apple.com/us/app/btb-fitness-health/id6782528786";
export const PLANNER_URL =
  "https://auto-meal-planner-pi.vercel.app/?view=recipeWeek";
export const BTB_CONTACT = "btbfitnessandhealth@yahoo.com";
export const GROWTH_META = {
  home: {
    path: "/",
    title: "BTB Fitness & Health — Train, Plan & Prep",
    description:
      "Build a repeatable training and meal-prep routine with BTB. Explore exercise guides, complete recipe planning and practical education from Jarvis Dixon.",
  },
  start: {
    path: "/start",
    title: "Start with BTB — Your Training & Meal-Prep Week",
    description:
      "Choose your next step with BTB: explore exercise guides, build a recipe week, download a free planning worksheet or ask a question.",
  },
  plus: {
    path: "/plus",
    title: "BTB Plus — Help Shape the Next Chapter",
    description:
      "Explore the proposed BTB Plus membership and share your interest. Current tools remain free; no subscription, payment or cloud sync is offered here.",
  },
} as const;
export function applyGrowthMetadata(
  page: keyof typeof GROWTH_META
): () => void {
  const meta = GROWTH_META[page];
  const priorTitle = document.title;
  document.title = meta.title;
  const restore: (() => void)[] = [];
  for (const [attribute, name, value] of [
    ["name", "description", meta.description],
    ["property", "og:title", meta.title],
    ["property", "og:description", meta.description],
    ["property", "og:url", `https://www.btbfitnessandhealth.com${meta.path}`],
    [
      "property",
      "og:image",
      "https://www.btbfitnessandhealth.com/images/site/btb-movement-index-hero.jpg",
    ],
    ["name", "twitter:title", meta.title],
    ["name", "twitter:description", meta.description],
    [
      "name",
      "twitter:image",
      "https://www.btbfitnessandhealth.com/images/site/btb-movement-index-hero.jpg",
    ],
  ]) {
    const existing = document.head.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${name}"]`
    );
    const element = existing ?? document.createElement("meta");
    const previous = element.getAttribute("content");
    element.setAttribute(attribute, name);
    element.content = value;
    if (!existing) document.head.append(element);
    restore.push(() => {
      if (!existing) element.remove();
      else if (previous !== null) element.content = previous;
    });
  }
  const existing = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  const canonical = existing ?? document.createElement("link");
  const oldHref = canonical.getAttribute("href");
  canonical.rel = "canonical";
  canonical.href = `https://www.btbfitnessandhealth.com${meta.path}`;
  if (!existing) document.head.append(canonical);
  return () => {
    document.title = priorTitle;
    restore.forEach(fn => fn());
    if (!existing) canonical.remove();
    else if (oldHref) canonical.href = oldHref;
    if (window.location.pathname !== meta.path)
      applyFallbackRouteMetadata(window.location.pathname);
  };
}
export interface InquiryInput {
  name: string;
  email: string;
  topic: string;
  message: string;
}
export function inquiryDraft(input: InquiryInput) {
  if (!input.name.trim() || input.name.trim().length > 100)
    throw new Error("Please enter your name (up to 100 characters).");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ||
    input.email.length > 254
  )
    throw new Error("Please enter a valid email address.");
  if (!input.message.trim() || input.message.length > 2000)
    throw new Error("Please add a message (up to 2,000 characters).");
  const subject = `BTB inquiry: ${input.topic}`;
  const text = [
    `To: ${BTB_CONTACT}`,
    `Subject: ${subject}`,
    "",
    `Name: ${input.name.trim()}`,
    `Reply email: ${input.email.trim()}`,
    `Interested in: ${input.topic}`,
    "",
    input.message.trim(),
  ].join("\n");
  const body = text.split("\n").slice(3).join("\n");
  return {
    text,
    href: `mailto:${BTB_CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
