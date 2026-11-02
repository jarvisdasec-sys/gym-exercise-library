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

export function getCardioGuideMetadata(exercise: CardioExercise) {
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
