import { ROUTES } from "./routes";
import {
  captureTrafficClick,
  hasTrafficPrivacyOptOut,
  isPublicTrafficPath,
  sanitizeTrafficDestination,
} from "./trafficAnalytics";

export const INSTAGRAM_URL = "https://www.instagram.com/btbfitnessandhealth/";
export const BTB_PUBLIC_ORIGIN = "https://www.btbfitnessandhealth.com";
export const INSTAGRAM_PAGE_URL = `${BTB_PUBLIC_ORIGIN}/instagram`;
export const INSTAGRAM_BIO_URL = `${INSTAGRAM_PAGE_URL}?utm_source=instagram&utm_medium=bio&utm_campaign=btb_profile`;
export const INSTAGRAM_TITLE =
  "BTB Instagram Hub — Exercise Guides & Training Tools";
export const INSTAGRAM_DESCRIPTION =
  "Go beyond the Reel with BTB exercise form guides, workouts, nutrition tools, mobility routines and practical training education. Pick your next step.";
export const INSTAGRAM_PREVIEW_IMAGE = `${BTB_PUBLIC_ORIGIN}/images/social/btb-instagram-preview.jpg`;

export const FEATURED_INSTAGRAM_EXERCISE = {
  title: "Barbell Bent-Over Row",
  href: "/e/barbell-bent-over-row",
  image: "/images/social/btb-row-preview.webp",
  description:
    "Take the form breakdown into your next session. Open the full guide for setup, coaching cues, safety notes and video guidance.",
} as const;

export const INSTAGRAM_DESTINATIONS = [
  {
    id: "movement-index",
    title: "Find your movement",
    description:
      "Browse the exercise library and learn the setup before you lift.",
    href: ROUTES.exercises,
    label: "Exercise guides",
  },
  {
    id: "workout-of-day",
    title: "Train today",
    description:
      "See the Workout of the Day, with exercises, equipment and session guidance.",
    href: ROUTES.wod,
    label: "Today's workout",
  },
  {
    id: "meal-builder",
    title: "Build your next meal",
    description:
      "Explore foods and assemble a meal with the existing nutrition tools.",
    href: ROUTES.mealBuilder,
    label: "Meal Builder",
  },
  {
    id: "calculators",
    title: "Understand the numbers",
    description:
      "Use BMI, strength and nutrition estimates as educational starting points.",
    href: ROUTES.calculators,
    label: "Fitness calculators",
  },
  {
    id: "mobility",
    title: "Make room to move",
    description:
      "Explore mobility, yoga and movement sessions alongside your training.",
    href: ROUTES.mobility,
    label: "Mobility & flow",
  },
  {
    id: "education",
    title: "Learn the why",
    description: "Read practical training, nutrition and recovery education.",
    href: ROUTES.education,
    label: "BTB education",
  },
] as const;

export const INSTAGRAM_WORKOUTS = [
  {
    title: "Pull Day",
    href: "/workouts/pull-day",
    description: "Back and biceps session",
  },
  {
    title: "Upper Body",
    href: "/workouts/upper-body",
    description: "Upper-body training session",
  },
  {
    title: "Lower Body",
    href: "/workouts/lower-body",
    description: "Lower-body training session",
  },
  {
    title: "Full-Body Starter",
    href: "/workouts/full-body-starter",
    description: "A beginner-friendly session",
  },
] as const;

/** Analytics is optional and must never prevent normal navigation. */
export function trackSocialClick(destination: string, placement: string): void {
  if (
    typeof window === "undefined" ||
    hasTrafficPrivacyOptOut() ||
    !isPublicTrafficPath(window.location.pathname)
  )
    return;
  const safeDestination = sanitizeTrafficDestination(destination);
  if (!safeDestination) return;
  void captureTrafficClick(safeDestination, placement);
  const analytics = (
    window as Window & {
      umami?: {
        track: (
          event: string,
          data: Record<string, string>
        ) => void | Promise<unknown>;
      };
    }
  ).umami;
  if (!analytics?.track) return;
  const data: Record<string, string> = {
    destination: safeDestination,
    placement,
  };
  const params = new URLSearchParams(window.location.search);
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const value = params.get(key);
    // Only controlled campaign labels; do not forward arbitrary query strings or PII.
    if (value && /^[a-zA-Z0-9_.-]{1,80}$/.test(value)) data[key] = value;
  }
  try {
    const pending = analytics.track("btb_social_click", data);
    if (pending && typeof pending.catch === "function")
      void pending.catch(() => undefined);
  } catch {
    // Analytics is optional; the anchor still performs normal navigation.
  }
}
