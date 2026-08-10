/**
 * Education registry — aggregates every article and provides lookups.
 *
 * WHY A SEPARATE FILE: the articles live in topic files (eduTraining, eduFloor,
 * eduRecovery) so each stays readable. This module is the single import point
 * for pages, and the only place that knows the ordering of sections.
 */
import { EDU_SECTIONS, type EduArticle, type EduSectionKey } from "./education";
import { START_HERE_ARTICLES, TRAINING_ARTICLES } from "./eduTraining";
import { ETIQUETTE_ARTICLES, NUTRITION_ARTICLES } from "./eduFloor";
import { RECOVERY_ARTICLES, SUPPLEMENT_ARTICLES } from "./eduRecovery";
import { MYTH_ARTICLES } from "./eduMyths";

export const EDU_ARTICLES: EduArticle[] = [
  ...START_HERE_ARTICLES,
  ...TRAINING_ARTICLES,
  ...MYTH_ARTICLES,
  ...ETIQUETTE_ARTICLES,
  ...NUTRITION_ARTICLES,
  ...RECOVERY_ARTICLES,
  ...SUPPLEMENT_ARTICLES,
];

export function articlesInSection(key: EduSectionKey): EduArticle[] {
  return EDU_ARTICLES.filter((a) => a.section === key);
}

export function findArticle(slug: string): EduArticle | undefined {
  return EDU_ARTICLES.find((a) => a.slug === slug);
}

export function sectionMeta(key: EduSectionKey) {
  return EDU_SECTIONS.find((s) => s.key === key);
}

/** Total read time across the library, shown on the hub masthead. */
export function totalReadMinutes(): number {
  return EDU_ARTICLES.reduce((sum, a) => sum + a.minutes, 0);
}

/** Previous / next within the same section, for article footers. */
export function articleNeighbours(slug: string) {
  const article = findArticle(slug);
  if (!article) return { prev: undefined, next: undefined };
  const siblings = articlesInSection(article.section);
  const i = siblings.findIndex((a) => a.slug === slug);
  return {
    prev: i > 0 ? siblings[i - 1] : undefined,
    next: i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : undefined,
  };
}
