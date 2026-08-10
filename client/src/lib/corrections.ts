/**
 * Local corrections for packaged products.
 *
 * WHY THIS EXISTS: Open Food Facts is crowd-sourced. Live probing turned up
 * barcodes resolving to an entirely different product, missing serving weights,
 * and stale nutrition panels. Rather than force a member to log something they
 * know is wrong, they can override the name and macros — and the correction is
 * remembered for that barcode so they never fix it twice.
 *
 * SCOPE: this is a STATIC site, so corrections live in localStorage on the
 * member's own device. Nothing is uploaded, and nothing is pushed back to Open
 * Food Facts — the public database is left untouched, which is the honest
 * behaviour when we cannot verify the correction ourselves.
 */
import type { OffProduct } from "./offProducts";

const KEY = "btb.nutrition.corrections.v1";

/** A member's corrected values for one barcode. All fields are per 100 g. */
export interface Correction {
  /** barcode this correction applies to */
  code: string;
  name: string;
  brand: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  /** grams in one serving, or null when the member left it unknown */
  servingGrams: number | null;
  /** epoch ms, so the UI can say when it was corrected */
  savedAt: number;
}

export type CorrectionMap = Record<string, Correction>;

export function loadCorrections(): CorrectionMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as CorrectionMap) : {};
  } catch {
    return {};
  }
}

function save(map: CorrectionMap): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* quota or private mode — corrections simply will not persist */
  }
}

export function getCorrection(code: string): Correction | null {
  return loadCorrections()[code] ?? null;
}

export function saveCorrection(correction: Correction): void {
  const map = loadCorrections();
  map[correction.code] = correction;
  save(map);
}

export function clearCorrection(code: string): void {
  const map = loadCorrections();
  delete map[code];
  save(map);
}

/**
 * Apply a stored correction on top of a fetched product.
 * Returns the product unchanged when there is nothing corrected for it.
 */
export function applyCorrection(product: OffProduct): {
  product: OffProduct;
  corrected: boolean;
  savedAt: number | null;
} {
  const c = getCorrection(product.code);
  if (!c) return { product, corrected: false, savedAt: null };
  return {
    product: {
      ...product,
      name: c.name,
      brand: c.brand,
      kcal: c.kcal,
      protein: c.protein,
      carbs: c.carbs,
      fat: c.fat,
      fiber: c.fiber,
      servingGrams: c.servingGrams,
      // A corrected entry always has usable energy by definition.
      incomplete: false,
    },
    corrected: true,
    savedAt: c.savedAt,
  };
}

/** Build a Correction from edited values, clamped to sane ranges. */
export function buildCorrection(input: {
  code: string;
  name: string;
  brand: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingGrams: number | null;
}): Correction {
  const clamp = (v: number, max: number) =>
    Math.max(0, Math.min(max, Math.round((Number(v) || 0) * 10) / 10));
  return {
    code: input.code,
    name: input.name.trim() || "Unnamed product",
    brand: input.brand.trim(),
    // Energy per 100 g cannot exceed pure fat (~900 kcal); allow headroom.
    kcal: clamp(input.kcal, 1000),
    protein: clamp(input.protein, 100),
    carbs: clamp(input.carbs, 100),
    fat: clamp(input.fat, 100),
    fiber: clamp(input.fiber, 100),
    servingGrams:
      input.servingGrams !== null && input.servingGrams > 0
        ? Math.min(2000, Math.round(input.servingGrams * 10) / 10)
        : null,
    savedAt: Date.now(),
  };
}

/**
 * Sanity check: do the macros roughly account for the stated calories?
 * Uses Atwater factors (P/C 4, F 9). Returns null when it looks consistent,
 * or a human-readable warning when it does not. This warns, never blocks —
 * the member may be copying an odd but genuine label.
 */
export function macroSanityWarning(v: {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}): string | null {
  const derived = v.protein * 4 + v.carbs * 4 + v.fat * 9;
  if (v.kcal === 0 && derived === 0) return null;
  if (derived === 0 && v.kcal > 0) {
    return "Calories are set but all macros are zero. Check the label.";
  }
  if (v.kcal === 0 && derived > 20) {
    return "Macros are set but calories are zero. Check the label.";
  }
  const diff = Math.abs(derived - v.kcal);
  // Labels legitimately round, and fibre/polyols shift things, so stay loose.
  if (diff > Math.max(60, v.kcal * 0.3)) {
    return `These macros work out to about ${Math.round(derived)} kcal, not ${Math.round(v.kcal)}. Worth a second look.`;
  }
  if (v.protein + v.carbs + v.fat > 100) {
    return "Protein, carbs and fat add up to more than 100 g per 100 g. Check the figures.";
  }
  return null;
}
