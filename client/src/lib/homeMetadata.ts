export const HOME_TITLE = "BTB Gym Exercise Library — 54 Movement Blueprints";
export const HOME_DESCRIPTION =
  "Explore BTB exercise guides, workouts, nutrition tools and published Reels. Sign in to see your saved movements and member dashboard.";
export const HOME_URL = "https://www.btbfitnessandhealth.com/exercises";
export const HOME_IMAGE =
  "https://www.btbfitnessandhealth.com/images/site/btb-movement-index-hero.jpg";

/** Routes that do not own metadata should receive the neutral app defaults, not the page visited before Home. */
export function applyHomeMetadata(): () => void {
  document.title = HOME_TITLE;
  const restore: Array<() => void> = [];
  const values: Array<[string, string, string, string | null]> = [
    [
      "name",
      "description",
      HOME_DESCRIPTION,
      "BTB delivers premium exercise form guides, structured workouts, cardio protocols and practical nutrition tools. Find the movement. Own the form.",
    ],
    ["property", "og:title", HOME_TITLE, "BTB — Build The Body"],
    [
      "property",
      "og:description",
      HOME_DESCRIPTION,
      "Premium movement guides and training tools for people who want to build the body with intent.",
    ],
    ["property", "og:url", HOME_URL, null],
    [
      "property",
      "og:image",
      HOME_IMAGE,
      "/images/site/btb-movement-index-hero.jpg",
    ],
    ["name", "twitter:title", HOME_TITLE, "BTB — Build The Body"],
    [
      "name",
      "twitter:description",
      HOME_DESCRIPTION,
      "Premium movement guides and training tools for people who want to build the body with intent.",
    ],
    [
      "name",
      "twitter:image",
      HOME_IMAGE,
      "/images/site/btb-movement-index-hero.jpg",
    ],
  ];
  for (const [attribute, name, content, fallback] of values) {
    const existing = document.head.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${name}"]`
    );
    const element = existing ?? document.createElement("meta");
    element.setAttribute(attribute, name);
    element.content = content;
    if (!existing) document.head.append(element);
    restore.push(() => {
      if (!existing || fallback === null) element.remove();
      else element.content = fallback;
    });
  }
  const canonical =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ??
    document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = HOME_URL;
  if (!canonical.isConnected) document.head.append(canonical);
  return () => {
    document.title = HOME_TITLE;
    restore.forEach(callback => callback());
    canonical.remove();
  };
}
