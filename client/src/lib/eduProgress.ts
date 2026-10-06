const BOOKMARKS_KEY = "btb.education.bookmarks.v1";
const COMPLETED_KEY = "btb.education.completed.v1";

function load(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function save(key: string, values: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(values))));
}

export function loadEduBookmarks() { return load(BOOKMARKS_KEY); }
export function loadEduCompleted() { return load(COMPLETED_KEY); }
export function toggleEduBookmark(slug: string, current: string[]) {
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  save(BOOKMARKS_KEY, next);
  return next;
}
export function toggleEduCompleted(slug: string, current: string[]) {
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  save(COMPLETED_KEY, next);
  return next;
}
