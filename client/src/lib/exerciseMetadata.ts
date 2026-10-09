import type { Exercise } from "@/lib/exercises";

export const BTB_SITE_ORIGIN = "https://www.btbfitnessandhealth.com";

export type ExerciseGuideMetadata = {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
};

export function exerciseGuideUrl(slug: string): string {
  return `${BTB_SITE_ORIGIN}/e/${slug}`;
}

export function absolutePublicUrl(value: string): string {
  return value.startsWith("http") ? value : `${BTB_SITE_ORIGIN}${value}`;
}

export function getExerciseGuideMetadata(
  exercise: Exercise
): ExerciseGuideMetadata {
  return {
    title: `${exercise.name} Form Guide | BTB Fitness & Health`,
    description: `${exercise.name} form guide: setup, execution, coaching cues, common mistakes, breathing, tempo, and safety notes for ${exercise.primary.toLowerCase()}.`,
    url: exerciseGuideUrl(exercise.slug),
    image: absolutePublicUrl(exercise.image),
    imageAlt: `${exercise.name} exercise form guide`,
  };
}

type MetaAttribute = "name" | "property";

function updateMeta(
  attribute: MetaAttribute,
  name: string,
  content: string
): () => void {
  const selector = `meta[${attribute}="${name}"]`;
  const previous = document.head.querySelector<HTMLMetaElement>(selector);
  const original = previous?.getAttribute("content") ?? null;
  const element = previous ?? document.createElement("meta");
  element.setAttribute(attribute, name);
  element.content = content;
  if (!previous) document.head.append(element);

  return () => {
    if (!previous) element.remove();
    else if (original === null) previous.removeAttribute("content");
    else previous.setAttribute("content", original);
  };
}

function updateCanonical(url: string | null): () => void {
  const previous = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  const original = previous?.getAttribute("href") ?? null;

  if (url === null) {
    previous?.remove();
    return () => {
      if (previous && original !== null) {
        previous.setAttribute("href", original);
        document.head.append(previous);
      }
    };
  }

  const element = previous ?? document.createElement("link");
  element.rel = "canonical";
  element.href = url;
  if (!previous) document.head.append(element);
  return () => {
    if (!previous) element.remove();
    else if (original === null) previous.removeAttribute("href");
    else previous.setAttribute("href", original);
  };
}

/**
 * Applies route-specific metadata for a public guide. Passing null deliberately
 * marks an unknown plate as non-indexable instead of leaving a prior guide's
 * title, canonical, or social preview in place.
 */
export function applyExerciseGuideMetadata(
  exercise: Exercise | null
): () => void {
  if (!exercise) {
    const previousTitle = document.title;
    document.title = "Exercise Guide Not Found | BTB Fitness & Health";
    const cleanups = [
      updateMeta(
        "name",
        "description",
        "The requested BTB exercise guide was not found."
      ),
      updateMeta("name", "robots", "noindex,nofollow"),
      updateCanonical(null),
    ];
    return () => {
      document.title = previousTitle;
      cleanups.reverse().forEach(cleanup => cleanup());
    };
  }

  const metadata = getExerciseGuideMetadata(exercise);
  const previousTitle = document.title;
  document.title = metadata.title;
  const cleanups = [
    updateMeta("name", "description", metadata.description),
    updateMeta("name", "robots", "index,follow,max-image-preview:large"),
    updateMeta("property", "og:type", "article"),
    updateMeta("property", "og:title", metadata.title),
    updateMeta("property", "og:description", metadata.description),
    updateMeta("property", "og:url", metadata.url),
    updateMeta("property", "og:image", metadata.image),
    updateMeta("property", "og:image:alt", metadata.imageAlt),
    updateMeta("name", "twitter:card", "summary_large_image"),
    updateMeta("name", "twitter:title", metadata.title),
    updateMeta("name", "twitter:description", metadata.description),
    updateMeta("name", "twitter:image", metadata.image),
    updateCanonical(metadata.url),
  ];

  return () => {
    document.title = previousTitle;
    cleanups.reverse().forEach(cleanup => cleanup());
  };
}
