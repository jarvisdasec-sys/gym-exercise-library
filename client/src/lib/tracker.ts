/**
 * Calorie tracker persistence.
 *
 * This is a STATIC site, so the log lives in localStorage on the member's own
 * device. It is deliberately not synced anywhere: no accounts, no server, and
 * nothing leaves the phone. That also means the log is per-device — worth
 * surfacing in the UI so nobody expects it to follow them between devices.
 *
 * COMPLIANCE: targets are entered BY THE MEMBER. We never compute or prescribe
 * a calorie or macro target for an individual.
 */

export interface LoggedEntry {
  /** unique row id */
  id: string;
  /** food slug from lib/foods.ts, or null for a logged meal */
  foodSlug: string | null;
  /** meal slug from lib/meals.ts when a whole meal was logged */
  mealSlug: string | null;
  /** display name captured at log time */
  name: string;
  /** grams (foods) — meals log at 1× the recipe */
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  /** which part of the day */
  slot: string;
}

export interface DayLog {
  /** ISO date, YYYY-MM-DD, in the member's local timezone */
  date: string;
  entries: LoggedEntry[];
}

export interface Targets {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

const LOG_KEY = "btb.nutrition.log.v1";
const TARGET_KEY = "btb.nutrition.targets.v1";

/** Local (not UTC) ISO date, so "today" matches the member's calendar. */
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadLog(): Record<string, LoggedEntry[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveLog(log: Record<string, LoggedEntry[]>): void {
  try {
    window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    /* storage full or blocked — the UI stays usable, it just will not persist */
  }
}

/** No default targets are prescribed. Zero means "not set". */
export const NO_TARGETS: Targets = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

export function loadTargets(): Targets {
  if (typeof window === "undefined") return { ...NO_TARGETS };
  try {
    const raw = window.localStorage.getItem(TARGET_KEY);
    if (!raw) return { ...NO_TARGETS };
    const p = JSON.parse(raw);
    return {
      kcal: Number(p.kcal) || 0,
      protein: Number(p.protein) || 0,
      carbs: Number(p.carbs) || 0,
      fat: Number(p.fat) || 0,
    };
  } catch {
    return { ...NO_TARGETS };
  }
}

export function saveTargets(t: Targets): void {
  try {
    window.localStorage.setItem(TARGET_KEY, JSON.stringify(t));
  } catch {
    /* ignore */
  }
}

export function sumEntries(entries: LoggedEntry[]) {
  return entries.reduce(
    (a, e) => ({
      kcal: a.kcal + e.kcal,
      protein: a.protein + e.protein,
      carbs: a.carbs + e.carbs,
      fat: a.fat + e.fat,
      fiber: a.fiber + e.fiber,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export const SLOTS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Post-Workout",
] as const;

