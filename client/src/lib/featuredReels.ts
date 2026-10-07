export const FEATURED_REELS = [
  {
    id: "barbell-row",
    shortcode: "DeKXGoCskEV",
    title: "Own the barbell row.",
    topic: "Exercise demonstration",
    description:
      "Watch the published row Reel, then take the setup and coaching cues into the full form guide.",
    publishedAt: "2026-10-06",
    poster: "/images/reels/DeKXGoCskEV.webp",
    posterAlt:
      "Actual published BTB barbell-row Reel cover with a three-position technique illustration",
    guideHref: "/e/barbell-bent-over-row",
    guideLabel: "Open the row guide",
  },
  {
    id: "training-tools",
    shortcode: "DcwOQKdJ9PT",
    title: "Turn intent into a plan.",
    topic: "BTB training tools",
    description:
      "See BTB's published training-tools Reel, then explore the tools available on this website.",
    publishedAt: "2026-09-01",
    poster: "/images/reels/DcwOQKdJ9PT.webp",
    posterAlt:
      "Actual published BTB training-tools Reel cover showing the movement library on a phone",
    guideHref: "/workouts/tools",
    guideLabel: "Explore workout tools",
  },
  {
    id: "stay-focused",
    shortcode: "Dco_U3hBoC-",
    title: "Keep the rhythm.",
    topic: "Consistency & motivation",
    description:
      "Watch BTB's weekend-focus Reel, then read practical ways to build a training habit that lasts.",
    publishedAt: "2026-08-29",
    poster: "/images/reels/Dco_U3hBoC-.webp",
    posterAlt:
      "Actual published BTB stay-focused Reel cover showing friends socializing on Saturday",
    guideHref: "/learn/how-to-not-quit",
    guideLabel: "Read How To Not Quit",
  },
] as const;

export type FeaturedReel = (typeof FEATURED_REELS)[number];

export function instagramReelUrl(shortcode: string): string {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(shortcode))
    throw new Error("Invalid Instagram Reel shortcode");
  return `https://www.instagram.com/reel/${shortcode}/`;
}

export function instagramEmbedUrl(shortcode: string): string {
  return `${instagramReelUrl(shortcode)}embed/`;
}
