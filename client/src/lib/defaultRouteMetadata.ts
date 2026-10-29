import { getBlogPost } from "@/lib/blog";

export function applyFallbackRouteMetadata(path: string) {
  const normalized = path.replace(/\/+$/, "") || "/";
  // These pages have their own tested metadata owner.
  if (
    [
      "/",
      "/start",
      "/plus",
      "/exercises",
      "/instagram",
      "/workouts/groups",
    ].includes(normalized) ||
    normalized.startsWith("/e/")
  )
    return;
  const labels: Record<string, string> = {
    "/blog": "BTB Fitness & Health Blog",
    "/blog/contribute": "Post to the BTB Blog",
    "/workouts": "Workout Sessions",
    "/wod": "Workout of the Day",
    "/cardio": "Cardio Sessions",
    "/mobility": "Mobility & Flow",
    "/nutrition": "Nutrition Tools",
    "/nutrition/builder": "Meal Builder",
    "/nutrition/meal-prep": "Meal Preparation",
    "/nutrition/tracker": "Nutrition Tracker",
    "/calculators": "Fitness Calculators",
    "/learn": "Training & Nutrition Education",
    "/stickers": "Exercise QR Stickers",
    "/account": "Member Dashboard",
    "/saved": "Saved Movements",
    "/reset-password": "Reset Password",
    "/workouts/tools": "Workout Tools",
    "/workouts/builder": "Workout Builder",
  };
  const blogPost = normalized.startsWith("/blog/") && normalized !== "/blog/contribute"
    ? getBlogPost(normalized.slice("/blog/".length))
    : undefined;
  const isCommunityPost = normalized.startsWith("/blog/") && normalized !== "/blog/contribute" && !blogPost;
  const label = blogPost?.title ?? (isCommunityPost ? "Community Blog Post" : labels[normalized] ?? "Training & Nutrition Tools");
  const title = `${label} | BTB Fitness & Health`;
  const description = blogPost?.summary ?? (isCommunityPost
    ? "A community contribution published directly to the BTB Fitness & Health blog."
    : normalized === "/blog"
    ? "Read practical BTB stories about weight lifting, health, cardio and gear—and contribute an idea of your own."
      : normalized === "/blog/contribute"
        ? "Publish an article, short post, image or idea directly to the BTB blog. No account, email or editorial approval is required."
      : `Explore ${label.toLowerCase()} from BTB Fitness & Health. Practical education and tools to build a repeatable routine.`);
  const canonicalUrl = `https://www.btbfitnessandhealth.com${normalized}`;
  document.title = title;
  for (const [attribute, name, value] of [
    ["name", "description", description],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:url", canonicalUrl],
    [
      "property",
      "og:image",
      "https://www.btbfitnessandhealth.com/images/site/btb-movement-index-hero.jpg",
    ],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
  ]) {
    let node = document.head.querySelector<HTMLMetaElement>(
      `meta[${attribute}="${name}"]`
    );
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute(attribute, name);
      document.head.append(node);
    }
    node.content = value;
  }
  let canonical = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]'
  );
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = canonicalUrl;
}
