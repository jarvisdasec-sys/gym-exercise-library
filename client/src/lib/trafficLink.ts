import { APP_STORE_URL, PLANNER_URL } from "./growth";

/** Fixed labels only; never capture link text, form values or arbitrary URLs. */
export function growthLinkTarget(href: string) {
  if (href === "/7-day-starter" || href === "/7-day-starter/") return "starter_plan";
  if (href === "/downloads/btb-7-day-starter-plan.pdf") return "starter_pdf";
  if (href === "/exercises" || /^\/e\/[a-z0-9][a-z0-9-]*$/.test(href)) return "exercise_guide";
  if (href === PLANNER_URL) return "recipe_planner";
  if (href === "/start" || href === "/start#btb-inquiry") return "start_here";
  if (href === "/plus") return "plus_interest";
  if (href === "/downloads/btb-weekly-starter.html") return "starter_worksheet";
  if (href === APP_STORE_URL) return "app_store";
  return null;
}