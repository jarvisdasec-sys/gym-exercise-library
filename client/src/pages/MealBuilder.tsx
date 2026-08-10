/**
 * Meal Builder — assemble a plate and watch the macros total. `/nutrition/builder`
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Two-column workbench: food picker rail on the left, the running plate on
 *    the right. Never a lone centered column.
 *  - Lime = protein and one primary action only. Hairlines over shadows.
 *  - Mono numerals for all instrumentation. Coach-direct copy.
 *
 * Totals are COMPUTED from lib/foods.ts, so they cannot drift from the data.
 *
 * Plate rows come from two sources: our USDA reference table, and packaged
 * products scanned or searched from Open Food Facts. A PlateItem therefore
 * carries either a `slug` (USDA) or an embedded `product` (packaged), and all
 * totals are derived from whichever is present — macros are never duplicated.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { toast } from "sonner";
import { Check, Minus, Package, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import { MacroBar, MacroReadout } from "@/components/MacroBar";
import {
  PackagedFoodPicker,
  type PackagedSelection,
} from "@/components/PackagedFoodPicker";
import {
  displayName,
  scaleProduct,
  type OffProduct,
} from "@/lib/offProducts";
import {
  CATEGORY_META,
  FOODS,
  getFood,
  scale,
  type FoodCategory,
} from "@/lib/foods";
import { MEALS, mealMacros } from "@/lib/meals";
import {
  SLOTS,
  loadLog,
  newId,
  saveLog,
  todayKey,
} from "@/lib/tracker";

const CATEGORIES = Object.keys(CATEGORY_META) as FoodCategory[];

interface PlateItem {
  /** stable identity for React keys, dedupe and removal */
  key: string;
  /** USDA food slug, or null when this row is a packaged product */
  slug: string | null;
  /** the Open Food Facts product, when packaged */
  product?: OffProduct;
  grams: number;
}

/** Resolve a plate row to a name and scaled macros, whatever its source. */
function resolveItem(item: PlateItem) {
  if (item.product) {
    return {
      name: displayName(item.product),
      macros: scaleProduct(item.product, item.grams),
      servingGrams: item.product.servingGrams ?? 100,
      packaged: true,
    };
  }
  const food = item.slug ? getFood(item.slug) : null;
  if (!food) return null;
  return {
    name: food.name,
    macros: scale(food, item.grams),
    servingGrams: food.grams,
    packaged: false,
  };
}

export default function MealBuilder() {
  const [plate, setPlate] = useState<PlateItem[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<FoodCategory | "all">("all");
  const [slot, setSlot] = useState<string>("Lunch");
  const [packagedOpen, setPackagedOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOODS.filter((f) => {
      if (cat !== "all" && f.category !== cat) return false;
      if (!q) return true;
      return f.name.toLowerCase().includes(q);
    }).slice(0, 60);
  }, [query, cat]);

  const totals = useMemo(
    () =>
      plate.reduce(
        (acc, item) => {
          const resolved = resolveItem(item);
          if (!resolved) return acc;
          const m = resolved.macros;
          return {
            kcal: acc.kcal + m.kcal,
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat,
            fiber: acc.fiber + m.fiber,
          };
        },
        { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      ),
    [plate],
  );

  function addFood(slug: string) {
    const food = getFood(slug);
    if (!food) return;
    setPlate((p) => {
      const existing = p.find((i) => i.key === slug);
      if (existing) {
        return p.map((i) =>
          i.key === slug ? { ...i, grams: i.grams + food.grams } : i,
        );
      }
      return [...p, { key: slug, slug, grams: food.grams }];
    });
  }

  /** Add a scanned or searched packaged product to the plate. */
  function addPackaged(sel: PackagedSelection) {
    const { product, grams } = sel;
    const key = `off:${product.code}`;
    setPlate((p) => {
      const existing = p.find((i) => i.key === key);
      if (existing) {
        return p.map((i) =>
          i.key === key ? { ...i, grams: i.grams + grams } : i,
        );
      }
      return [...p, { key, slug: null, product, grams }];
    });
    setPackagedOpen(false);
    toast.success(`${displayName(product)} added`, {
      description: `${grams} g on the plate. Adjust it on the right.`,
    });
  }

  function setGrams(key: string, grams: number) {
    const g = Math.max(0, Math.min(2000, Math.round(grams)));
    setPlate((p) => p.map((i) => (i.key === key ? { ...i, grams: g } : i)));
  }

  function remove(key: string) {
    setPlate((p) => p.filter((i) => i.key !== key));
  }

  /** Load one of the ready-made meals into the workbench as a starting point. */
  function loadMeal(mealSlug: string) {
    const meal = MEALS.find((m) => m.slug === mealSlug);
    if (!meal) return;
    setPlate(
      meal.items.map((i) => ({ key: i.slug, slug: i.slug, grams: i.grams })),
    );
    setSlot(meal.slot);
    toast.success(`${meal.name} loaded`, {
      description: "Adjust the grams to match what you actually ate.",
    });
  }

  /** Send the assembled plate to today's log. */
  function logPlate() {
    if (plate.length === 0) return;
    const log = loadLog();
    const key = todayKey();
    const entries = log[key] ? [...log[key]] : [];
    for (const item of plate) {
      const resolved = resolveItem(item);
      if (!resolved) continue;
      const m = resolved.macros;
      entries.push({
        id: newId(),
        foodSlug: item.slug,
        mealSlug: null,
        name: resolved.name,
        grams: item.grams,
        kcal: m.kcal,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        fiber: m.fiber,
        slot,
      });
    }
    log[key] = entries;
    saveLog(log);
    toast.success(`${plate.length} items logged to ${slot}`, {
      description: `${Math.round(totals.kcal)} kcal added to today.`,
    });
    setPlate([]);
  }

  return (
    <div className="min-h-screen">
      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <SiteNav active="nutrition">
        <Link
          href="/nutrition/tracker"
          className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
        >
          <span className="meta text-[0.5rem]">Tracker</span>
        </Link>
        <Link
          href="/nutrition"
          className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
        >
          <span className="meta text-[0.5rem]">Food Index</span>
        </Link>
      </SiteNav>

      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              Meal Workbench
            </span>
          </div>
          <h1 className="display text-[2rem] font-bold leading-[0.9] text-white sm:text-[2.75rem]">
            Build the plate.
            <br />
            <span className="text-lime">Read the numbers.</span>
          </h1>
          <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/60">
            Add foods, set the grams, and the macros total as you go. Start from
            a ready-made meal if you want a base to adjust.
          </p>
        </div>
      </section>

      {/* ══ WORKBENCH ════════════════════════════════════════════════ */}
      <div className="container flex flex-col gap-8 py-8 lg:flex-row lg:gap-10">
        {/* ── picker ────────────────────────────────────────────────── */}
        <section className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-3">
            <span className="meta text-[1.1rem] leading-none text-white/12">
              01
            </span>
            <h2 className="display text-lg font-bold text-white">
              Pick your foods
            </h2>
          </div>

          {/* packaged foods — scan a barcode or search a brand */}
          <div className="mb-4">
            {packagedOpen ? (
              <PackagedFoodPicker
                onConfirm={addPackaged}
                onClose={() => setPackagedOpen(false)}
                confirmLabel="Add to plate"
              />
            ) : (
              <button
                onClick={() => setPackagedOpen(true)}
                className="flex w-full items-center gap-3 border border-lime/40 bg-lime/[0.05] px-3.5 py-3 text-left transition-colors duration-200 hover:bg-lime/[0.11]"
              >
                <Package className="h-4 w-4 shrink-0 text-lime" />
                <span className="min-w-0 flex-1">
                  <span className="meta block text-[0.45rem] font-bold text-lime">
                    Add a packaged food
                  </span>
                  <span className="meta mt-1 block text-[0.38rem] text-white/45">
                    Scan the barcode or search the brand
                  </span>
                </span>
              </button>
            )}
          </div>

          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 100 foods..."
              className="h-11 w-full border border-white/15 bg-white/[0.03] pl-9 pr-9 text-sm text-white placeholder:text-white/35 focus:border-lime focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-lime"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5">
            <CatChip
              label="All"
              selected={cat === "all"}
              onClick={() => setCat("all")}
            />
            {CATEGORIES.map((c) => (
              <CatChip
                key={c}
                label={CATEGORY_META[c].label}
                selected={cat === c}
                onClick={() => setCat(c)}
              />
            ))}
          </div>

          <div className="max-h-[520px] overflow-y-auto border border-white/12">
            {results.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-white/45">
                No food matched. Try a shorter search.
              </p>
            ) : (
              results.map((food, i) => {
                const onPlate = plate.some((p) => p.key === food.slug);
                const per = scale(food, food.grams);
                return (
                  <button
                    key={food.slug}
                    onClick={() => addFood(food.slug)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/[0.04] sm:px-4 ${
                      i === results.length - 1
                        ? ""
                        : "border-b border-white/10"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center border ${
                        onPlate
                          ? "border-lime bg-lime text-background"
                          : "border-white/20 text-white/45"
                      }`}
                    >
                      {onPlate ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-white">
                        {food.name}
                      </span>
                      <span className="meta text-[0.4rem] text-white/35">
                        {food.serving}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="display block text-sm font-bold leading-none text-lime">
                        {Math.round(per.kcal)}
                      </span>
                      <span className="meta text-[0.38rem] text-white/35">
                        P{Math.round(per.protein)} C{Math.round(per.carbs)} F
                        {Math.round(per.fat)}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* ready-made starting points */}
          <div className="mt-7">
            <div className="hazard-rule mb-3.5" />
            <div className="mb-3 flex items-baseline gap-3">
              <span className="meta text-[1.1rem] leading-none text-white/12">
                02
              </span>
              <div>
                <h2 className="display text-lg font-bold text-white">
                  Or start from a meal
                </h2>
                <p className="mt-1 text-[0.78rem] text-white/50">
                  Loads the full recipe onto the plate. Adjust from there.
                </p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {MEALS.map((m) => {
                const mm = mealMacros(m);
                return (
                  <button
                    key={m.slug}
                    onClick={() => loadMeal(m.slug)}
                    className="group border border-white/12 px-3.5 py-3 text-left transition-colors duration-200 hover:border-lime"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-lime">
                        {m.name}
                      </span>
                      <span className="display shrink-0 text-sm font-bold text-lime">
                        {Math.round(mm.kcal)}
                      </span>
                    </div>
                    <div className="meta mt-1 text-[0.4rem] text-white/40">
                      {m.slot} · P{Math.round(mm.protein)} C
                      {Math.round(mm.carbs)} F{Math.round(mm.fat)}
                    </div>
                    <MacroBar macros={mm} height={4} className="mt-2" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── the plate ─────────────────────────────────────────────── */}
        <aside className="lg:w-[380px] lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="meta text-[1.1rem] leading-none text-white/12">
                  03
                </span>
                <h2 className="display text-lg font-bold text-white">
                  Your plate
                </h2>
              </div>
              {plate.length > 0 && (
                <button
                  onClick={() => setPlate([])}
                  className="flex items-center gap-1.5 text-white/40 transition-colors hover:text-lime"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span className="meta text-[0.4rem]">Clear</span>
                </button>
              )}
            </div>

            {plate.length === 0 ? (
              <div className="border border-dashed border-white/15 px-5 py-12 text-center">
                <div className="display text-base font-bold text-white/55">
                  Empty plate
                </div>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-white/40">
                  Add foods from the list, or load one of the meals below it to
                  start from a base.
                </p>
              </div>
            ) : (
              <>
                {/* totals */}
                <div className="border border-lime/35 bg-lime/[0.04] p-4">
                  <div className="meta mb-3 text-[0.42rem] text-lime">
                    Plate total · {plate.length}{" "}
                    {plate.length === 1 ? "item" : "items"}
                  </div>
                  <MacroReadout
                    kcal={totals.kcal}
                    protein={totals.protein}
                    carbs={totals.carbs}
                    fat={totals.fat}
                    size="lg"
                  />
                  <MacroBar
                    macros={totals}
                    height={8}
                    showLegend
                    className="mt-3.5"
                  />
                  <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-2.5">
                    <span className="meta text-[0.4rem] text-white/40">
                      Fiber
                    </span>
                    <span className="text-[0.82rem] font-semibold text-white/80">
                      {totals.fiber.toFixed(1)} g
                    </span>
                  </div>
                </div>

                {/* items */}
                <div className="mt-3 border border-white/12">
                  {plate.map((item, i) => {
                    const resolved = resolveItem(item);
                    if (!resolved) return null;
                    const m = resolved.macros;
                    return (
                      <div
                        key={item.key}
                        className={`px-3 py-2.5 ${
                          i === plate.length - 1
                            ? ""
                            : "border-b border-white/10"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[0.82rem] font-semibold text-white">
                              {resolved.name}
                            </span>
                            {resolved.packaged && (
                              <span className="meta mt-0.5 block text-[0.34rem] text-lime/60">
                                Packaged · Open Food Facts
                              </span>
                            )}
                          </span>
                          <span className="display shrink-0 text-sm font-bold text-lime">
                            {Math.round(m.kcal)}
                          </span>
                          <button
                            onClick={() => remove(item.key)}
                            aria-label={`Remove ${resolved.name}`}
                            className="shrink-0 text-white/30 transition-colors hover:text-lime"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              setGrams(item.key, item.grams - 10)
                            }
                            aria-label="Less"
                            className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-lime hover:text-lime active:scale-[0.97]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={item.grams}
                              onChange={(e) =>
                                setGrams(item.key, Number(e.target.value))
                              }
                              className="h-7 w-full border border-white/15 bg-white/[0.03] px-2 pr-7 text-[0.8rem] text-white focus:border-lime focus:outline-none"
                            />
                            <span className="meta pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[0.4rem] text-white/35">
                              g
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setGrams(item.key, item.grams + 10)
                            }
                            aria-label="More"
                            className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-lime hover:text-lime active:scale-[0.97]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() =>
                              setGrams(item.key, resolved.servingGrams)
                            }
                            className="meta shrink-0 border border-white/15 px-2 py-1.5 text-[0.38rem] text-white/50 transition-colors hover:border-lime hover:text-lime"
                          >
                            1 serving
                          </button>
                        </div>

                        <div className="meta mt-1.5 text-[0.38rem] text-white/35">
                          P{m.protein.toFixed(1)} · C{m.carbs.toFixed(1)} · F
                          {m.fat.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* log it */}
                <div className="mt-4 border border-white/12 p-3.5">
                  <div className="meta mb-2 text-[0.4rem] text-white/40">
                    Log this plate as
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {SLOTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSlot(s)}
                        className={`meta border px-2.5 py-1.5 text-[0.4rem] transition-colors duration-150 ${
                          slot === s
                            ? "border-lime bg-lime/10 text-lime"
                            : "border-white/15 text-white/50 hover:border-white/35 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={logPlate}
                    className="flex w-full items-center justify-center gap-2 bg-lime px-4 py-3 text-background transition-transform duration-150 active:scale-[0.97]"
                  >
                    <Check className="h-4 w-4" />
                    <span className="display text-sm font-bold">
                      Add to today's log
                    </span>
                  </button>
                  <p className="mt-2.5 text-[0.68rem] leading-relaxed text-white/40">
                    Saved on this device only. Nothing is uploaded anywhere.
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      <footer className="border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7 text-center">
          <p className="meta text-[0.45rem] text-white/35">
            Stay consistent. Stay disciplined. Build the body.
          </p>
        </div>
      </footer>
    </div>
  );
}

function CatChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`meta border px-2.5 py-1.5 text-[0.4rem] transition-colors duration-150 ${
        selected
          ? "border-lime bg-lime/10 text-lime"
          : "border-white/12 text-white/50 hover:border-white/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
