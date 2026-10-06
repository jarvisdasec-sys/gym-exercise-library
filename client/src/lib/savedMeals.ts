import type { OffProduct } from "@/lib/offProducts";

export type SavedMealItem = {
  key: string;
  slug: string | null;
  product?: OffProduct;
  grams: number;
};

export type SavedMeal = {
  id: string;
  name: string;
  slot: string;
  createdAt: string;
  items: SavedMealItem[];
};

const STORAGE_KEY = "btb-saved-meals";

export function loadSavedMeals(): SavedMeal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedMeals(meals: SavedMeal[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meals.slice(0, 20)));
}

export function makeSavedMeal(name: string, slot: string, items: SavedMealItem[]): SavedMeal {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim() || `${slot} plate`,
    slot,
    createdAt: new Date().toISOString(),
    items,
  };
}
