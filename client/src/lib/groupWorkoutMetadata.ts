import { HOME_TITLE, HOME_DESCRIPTION, HOME_IMAGE } from "./homeMetadata";

export const GROUP_TITLE = "BTB Group Workouts — 15-Day Bodyweight Program";
export const GROUP_DESCRIPTION =
  "Train anywhere with 4, 6, 8 or 10 people. Follow a repeating 15-day bodyweight, cardio, dance and recovery plan with complete exercise instructions.";
export const GROUP_URL = "https://www.btbfitnessandhealth.com/workouts/groups";
export const GROUP_IMAGE =
  "https://www.btbfitnessandhealth.com/images/site/btb-workouts-hero.jpg";

/** Return a cleanup that also handles arriving directly on prerendered HTML. */
export function applyGroupWorkoutMetadata(): () => void {
  const cameFromStaticPage = document.title === GROUP_TITLE;
  const previousTitle = cameFromStaticPage ? HOME_TITLE : document.title;
  document.title = GROUP_TITLE;
  const restore: Array<() => void> = [];
  const values: Array<[string, string, string, string | null]> = [
    ["name", "description", GROUP_DESCRIPTION, HOME_DESCRIPTION],
    ["property", "og:title", GROUP_TITLE, HOME_TITLE],
    ["property", "og:description", GROUP_DESCRIPTION, HOME_DESCRIPTION],
    ["property", "og:url", GROUP_URL, null],
    ["property", "og:image", GROUP_IMAGE, HOME_IMAGE],
    ["name", "twitter:title", GROUP_TITLE, HOME_TITLE],
    ["name", "twitter:description", GROUP_DESCRIPTION, HOME_DESCRIPTION],
    ["name", "twitter:image", GROUP_IMAGE, HOME_IMAGE],
  ];
  for (const [attribute, name, content, fallback] of values) {
    const existing = document.head.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${name}"]`
    );
    const element = existing ?? document.createElement("meta");
    const previousContent = cameFromStaticPage
      ? fallback
      : element.getAttribute("content");
    element.setAttribute(attribute, name);
    element.setAttribute("content", content);
    if (!existing) document.head.append(element);
    restore.push(() => {
      if (!existing || previousContent === null) element.remove();
      else element.setAttribute("content", previousContent);
    });
  }
  const existingCanonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  const canonical = existingCanonical ?? document.createElement("link");
  const previousHref = cameFromStaticPage
    ? null
    : canonical.getAttribute("href");
  canonical.rel = "canonical";
  canonical.href = GROUP_URL;
  if (!existingCanonical) document.head.append(canonical);
  return () => {
    document.title = previousTitle;
    restore.forEach(callback => callback());
    if (!existingCanonical || previousHref === null) canonical.remove();
    else canonical.setAttribute("href", previousHref);
  };
}
