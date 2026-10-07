import {
  INSTAGRAM_DESCRIPTION,
  INSTAGRAM_PAGE_URL,
  INSTAGRAM_PREVIEW_IMAGE,
  INSTAGRAM_TITLE,
} from "./social";

const HOME_TITLE = "BTB Gym Exercise Library — 54 Movement Blueprints";
const HOME_DESCRIPTION =
  "BTB delivers premium exercise form guides, structured workouts, cardio protocols and practical nutrition tools. Find the movement. Own the form.";
const HOME_SOCIAL_TITLE = "BTB — Build The Body";
const HOME_SOCIAL_DESCRIPTION =
  "Premium movement guides and training tools for people who want to build the body with intent.";
const HOME_IMAGE = "/images/site/btb-movement-index-hero.jpg";

/** Return a cleanup that also handles arriving directly on prerendered HTML. */
export function applyInstagramMetadata(): () => void {
  const cameFromStaticPage = document.title === INSTAGRAM_TITLE;
  const previousTitle = cameFromStaticPage ? HOME_TITLE : document.title;
  document.title = INSTAGRAM_TITLE;
  const restore: Array<() => void> = [];
  const values: Array<[string, string, string, string | null]> = [
    ["name", "description", INSTAGRAM_DESCRIPTION, HOME_DESCRIPTION],
    ["property", "og:title", INSTAGRAM_TITLE, HOME_SOCIAL_TITLE],
    [
      "property",
      "og:description",
      INSTAGRAM_DESCRIPTION,
      HOME_SOCIAL_DESCRIPTION,
    ],
    ["property", "og:url", INSTAGRAM_PAGE_URL, null],
    ["property", "og:image", INSTAGRAM_PREVIEW_IMAGE, HOME_IMAGE],
    ["name", "twitter:title", INSTAGRAM_TITLE, HOME_SOCIAL_TITLE],
    [
      "name",
      "twitter:description",
      INSTAGRAM_DESCRIPTION,
      HOME_SOCIAL_DESCRIPTION,
    ],
    ["name", "twitter:image", INSTAGRAM_PREVIEW_IMAGE, HOME_IMAGE],
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
  canonical.href = INSTAGRAM_PAGE_URL;
  if (!existingCanonical) document.head.append(canonical);
  return () => {
    document.title = previousTitle;
    restore.forEach(callback => callback());
    if (!existingCanonical || previousHref === null) canonical.remove();
    else canonical.setAttribute("href", previousHref);
  };
}
