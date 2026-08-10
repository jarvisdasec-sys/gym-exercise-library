/**
 * Cardio session log + bodyweight, stored on the member's own device.
 *
 * WHY IT IS SEPARATE FROM THE FOOD LOG: burned calories and eaten calories are
 * different quantities and must never be summed into one figure. Keeping them in
 * separate stores makes it structurally impossible to accidentally add a run to a
 * day's intake. The tracker displays them side by side and lets the member draw
 * their own conclusion.
 *
 * WHY BODYWEIGHT LIVES HERE: the MET formula needs mass. It is personal data, so
 * it stays in localStorage and is never transmitted.
 */
export interface CardioEntry {
  id: string;
  /** cardio slug from lib/cardio.ts */
  slug: string;
  /** display name captured at log time */
  name: string;
  /** which intensity tier was selected */
  intensity: string;
  /** MET used for the estimate, recorded so the number stays explainable */
  met: number;
  minutes: number;
  /** estimated kcal, or null when no bodyweight was set at log time */
  kcal: number | null;
}

const LOG_KEY = "btb.cardio.log.v1";
const WEIGHT_KEY = "btb.cardio.weight.v1";

export function loadCardioLog(): Record<string, CardioEntry[]> {
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

export function saveCardioLog(log: Record<string, CardioEntry[]>): void {
  try {
    window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    /* storage blocked — UI still works, it just will not persist */
  }
}

/** Stored bodyweight in kg, or null when the member has not set one. */
export function loadWeightKg(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WEIGHT_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function saveWeightKg(kg: number | null): void {
  try {
    if (kg && kg > 0) window.localStorage.setItem(WEIGHT_KEY, String(kg));
    else window.localStorage.removeItem(WEIGHT_KEY);
  } catch {
    /* ignore */
  }
}

export const LB_PER_KG = 2.20462;

export function sumCardio(entries: CardioEntry[]) {
  return entries.reduce(
    (a, e) => ({
      minutes: a.minutes + e.minutes,
      kcal: a.kcal + (e.kcal ?? 0),
      /** how many entries had no bodyweight, so the UI can be honest */
      unknown: a.unknown + (e.kcal === null ? 1 : 0),
    }),
    { minutes: 0, kcal: 0, unknown: 0 },
  );
}
