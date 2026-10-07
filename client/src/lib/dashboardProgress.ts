import { EDU_ARTICLES } from "./eduIndex";
import { loadEduBookmarks, loadEduCompleted } from "./eduProgress";
import { loadCardioLog } from "./cardioLog";

export type DashboardProgress = {
  educationCompleted: string[];
  educationBookmarks: string[];
  mobilityCompleted: string[];
  cardioMinutes: number;
  cardioKcal: number;
  cardioUnknown: number;
};

export function loadDashboardProgress(): DashboardProgress {
  const knownArticles = new Set(EDU_ARTICLES.map(article => article.slug));
  const articles = (values: string[]) =>
    Array.from(new Set(values)).filter(slug => knownArticles.has(slug));
  let mobilityCompleted: string[] = [];
  if (typeof window !== "undefined") {
    try {
      const value = JSON.parse(
        window.localStorage.getItem("btb.mobility.completed.v1") ?? "[]"
      );
      if (Array.isArray(value))
        mobilityCompleted = Array.from(
          new Set(
            value.filter(
              (item): item is string =>
                typeof item === "string" && item.length > 0 && item.length < 100
            )
          )
        );
    } catch {
      /* Device storage may be unavailable or contain damaged data. */
    }
  }
  let cardioMinutes = 0,
    cardioKcal = 0,
    cardioUnknown = 0;
  for (const day of Object.values(loadCardioLog())) {
    if (!Array.isArray(day)) continue;
    for (const entry of day) {
      if (
        !entry ||
        typeof entry !== "object" ||
        !Number.isFinite(entry.minutes) ||
        entry.minutes < 0
      )
        continue;
      cardioMinutes += entry.minutes;
      if (
        typeof entry.kcal === "number" &&
        Number.isFinite(entry.kcal) &&
        entry.kcal >= 0
      )
        cardioKcal += entry.kcal;
      else cardioUnknown += 1;
    }
  }
  return {
    educationCompleted: articles(loadEduCompleted()),
    educationBookmarks: articles(loadEduBookmarks()),
    mobilityCompleted,
    cardioMinutes,
    cardioKcal,
    cardioUnknown,
  };
}
