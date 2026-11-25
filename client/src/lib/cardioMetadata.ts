import type { CardioExercise } from "./cardio";

export const BTB_PUBLIC_ORIGIN = "https://www.btbfitnessandhealth.com";

export const CARDIO_HUB_METADATA = {
  title: "Cardio Workouts & Training Guides | BTB Fitness",
  description:
    "Explore 18 cardio modes: running, cycling, rowing, walking, swimming and intervals. Compare effort, technique cues, mistakes and starter sessions.",
  url: `${BTB_PUBLIC_ORIGIN}/cardio`,
  image: `${BTB_PUBLIC_ORIGIN}/images/site/btb-cardio-hero.jpg`,
  imageAlt: "Cardio training in the BTB Fitness & Health guide library",
} as const;

// Search-intent overrides for guides whose default title/description does not
// match how people search for them. Every override must stay unique and within
// the same length limits enforced by cardioMetadata.test.ts.
const CARDIO_GUIDE_SEO_OVERRIDES: Record<
  string,
  { title: string; description: string }
> = {
  "ski-erg": {
    title: "Ski Erg Benefits, Form & Starter Workout | BTB Fitness",
    description:
      "Ski erg benefits: full-body, low-impact conditioning that is easy on the knees. Learn stroke technique, three effort tiers and a starter session.",
  },
};

export function getCardioGuideMetadata(exercise: CardioExercise) {
  const override = CARDIO_GUIDE_SEO_OVERRIDES[exercise.slug];
  if (override) {
    return {
      ...override,
      url: `${BTB_PUBLIC_ORIGIN}/cardio/${exercise.slug}`,
      image: `${BTB_PUBLIC_ORIGIN}/images/site/btb-cardio-hero.jpg`,
      imageAlt: `${exercise.name} cardio guide from BTB Fitness & Health`,
    } as const;
  }
  const suffix = " Cardio Guide | BTB Fitness";
  const availableNameLength = 60 - suffix.length;
  const conciseName =
    exercise.name.length > availableNameLength
      ? `${exercise.name.slice(0, availableNameLength - 1).trimEnd()}…`
      : exercise.name;
  const title = `${conciseName}${suffix}`;
  const description = `Learn ${exercise.name.toLowerCase()} technique, three effort tiers, common mistakes, and a starter session. A practical cardio guide from BTB Fitness & Health.`;

  return {
    title,
    description,
    url: `${BTB_PUBLIC_ORIGIN}/cardio/${exercise.slug}`,
    image: `${BTB_PUBLIC_ORIGIN}/images/site/btb-cardio-hero.jpg`,
    imageAlt: `${exercise.name} cardio guide from BTB Fitness & Health`,
  } as const;
}
