/**
 * Calorie Tracker — the daily log. `/nutrition/tracker`
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - The day reads as a GAUGE PANEL: hairline-framed target rows, mono numerals,
 *    flat progress bars. No circular dials, no gradients.
 *  - Lime marks protein and progress toward a target the MEMBER set.
 *  - Coach-direct copy.
 *
 * COMPLIANCE: targets are entered by the member. This page never computes or
 * recommends a calorie or macro target, and it is not dietary advice.
 *
 * PERSISTENCE: localStorage on this device only. No account, no server.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, HeartPulse, Package, Plus, ScanLine, Search, Settings2, Trash2, X } from "lucide-react";
import { MacroBar, MacroReadout } from "@/components/MacroBar";
import {
  PackagedFoodPicker,
  type PackagedSelection,
} from "@/components/PackagedFoodPicker";
import { displayName } from "@/lib/offProducts";
import {
  loadCardioLog,
  saveCardioLog,
  sumCardio,
  type CardioEntry,
} from "@/lib/cardioLog";
import { FOODS, getFood, scale } from "@/lib/foods";
import { MEALS, mealMacros } from "@/lib/meals";
import {
  NO_TARGETS,
  SLOTS,
  loadLog,
  loadTargets,
  newId,
  saveLog,
  saveTargets,
  sumEntries,
  todayKey,
  type LoggedEntry,
  type Targets,
} from "@/lib/tracker";

export default function Tracker() {
  const [log, setLog] = useState<Record<string, LoggedEntry[]>>({});
  const [targets, setTargets] = useState<Targets>(NO_TARGETS);
  const [dateKey, setDateKey] = useState(() => todayKey());
  const [editTargets, setEditTargets] = useState(false);
  const [draft, setDraft] = useState<Targets>(NO_TARGETS);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [packagedOpen, setPackagedOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<string>("Breakfast");
  const [hydrated, setHydrated] = useState(false);

  /* load once on mount — never read localStorage during render */
  useEffect(() => {
    setLog(loadLog());
    const t = loadTargets();
    setTargets(t);
    setDraft(t);
    setHydrated(true);
  }, []);

  const entries = log[dateKey] ?? [];
  const totals = useMemo(() => sumEntries(entries), [entries]);
  const hasTargets = targets.kcal > 0;

  /**
   * Cardio logged on the same day, from a SEPARATE store.
   * Burned and eaten calories are different quantities: we show them side by
   * side and never net one off the other, which would encourage guesswork.
   */
  const [cardioLog, setCardioLog] = useState<Record<string, CardioEntry[]>>({});
  useEffect(() => setCardioLog(loadCardioLog()), []);
  const cardioToday = cardioLog[dateKey] ?? [];
  const cardioTotals = useMemo(() => sumCardio(cardioToday), [cardioToday]);

  function removeCardio(id: string) {
    const next = {
      ...cardioLog,
      [dateKey]: cardioToday.filter((c) => c.id !== id),
    };
    setCardioLog(next);
    saveCardioLog(next);
  }

  const persist = useCallback((next: Record<string, LoggedEntry[]>) => {
    setLog(next);
    saveLog(next);
  }, []);

  function shiftDay(days: number) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + days);
    setDateKey(todayKey(dt));
  }

  function addFood(slug: string) {
    const food = getFood(slug);
    if (!food) return;
    const m = scale(food, food.grams);
    const next = { ...log };
    next[dateKey] = [
      ...(next[dateKey] ?? []),
      {
        id: newId(),
        foodSlug: food.slug,
        mealSlug: null,
        name: food.name,
        grams: food.grams,
        kcal: m.kcal,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        fiber: m.fiber,
        slot,
      },
    ];
    persist(next);
    toast.success(`${food.name} logged`, {
      description: `${Math.round(m.kcal)} kcal · ${slot}`,
    });
  }

  function addMeal(mealSlug: string) {
    const meal = MEALS.find((m) => m.slug === mealSlug);
    if (!meal) return;
    const m = mealMacros(meal);
    const next = { ...log };
    next[dateKey] = [
      ...(next[dateKey] ?? []),
      {
        id: newId(),
        foodSlug: null,
        mealSlug: meal.slug,
        name: meal.name,
        grams: 0,
        kcal: m.kcal,
        protein: m.protein,
        carbs: m.carbs,
        fat: m.fat,
        fiber: m.fiber,
        slot: meal.slot,
      },
    ];
    persist(next);
    toast.success(`${meal.name} logged`, {
      description: `${Math.round(m.kcal)} kcal · ${meal.slot}`,
    });
  }

  /** Log a packaged product resolved from a barcode scan or brand search. */
  function addPackaged(sel: PackagedSelection) {
    const { product, grams, macros } = sel;
    const next = { ...log };
    next[dateKey] = [
      ...(next[dateKey] ?? []),
      {
        id: newId(),
        // Packaged items are not in our USDA table, so both slugs stay null and
        // the captured macros are stored directly on the entry.
        foodSlug: null,
        mealSlug: null,
        name: displayName(product),
        grams,
        kcal: macros.kcal,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        fiber: macros.fiber,
        slot,
      },
    ];
    persist(next);
    setPackagedOpen(false);
    toast.success(`${displayName(product)} logged`, {
      description: `${grams} g · ${Math.round(macros.kcal)} kcal · ${slot}`,
    });
  }

  function removeEntry(id: string) {
    const next = { ...log };
    next[dateKey] = (next[dateKey] ?? []).filter((e) => e.id !== id);
    persist(next);
  }

  function adjustGrams(id: string, grams: number) {
    const g = Math.max(1, Math.min(3000, Math.round(grams)));
    const next = { ...log };
    next[dateKey] = (next[dateKey] ?? []).map((e) => {
      if (e.id !== id || !e.foodSlug) return e;
      const food = getFood(e.foodSlug);
      if (!food) return e;
      const m = scale(food, g);
      return { ...e, grams: g, ...m };
    });
    persist(next);
  }

  function clearDay() {
    const next = { ...log };
    delete next[dateKey];
    persist(next);
    toast.success("Day cleared");
  }

  function commitTargets() {
    setTargets(draft);
    saveTargets(draft);
    setEditTargets(false);
    toast.success("Targets saved", {
      description: "Stored on this device only.",
    });
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FOODS.slice(0, 40);
    return FOODS.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 40);
  }, [query]);

  const bySlot = useMemo(
    () =>
      SLOTS.map((s) => ({
        slot: s,
        items: entries.filter((e) => e.slot === s),
      })).filter((g) => g.items.length > 0),
    [entries],
  );

  const isToday = dateKey === todayKey();
  const prettyDate = useMemo(() => {
    const [y, m, d] = dateKey.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [dateKey]);

  return (
    <div className="min-h-screen">
      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <SiteNav active="nutrition">
        <Link
          href="/nutrition/builder"
          className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
        >
          <span className="meta text-[0.5rem]">Meal Builder</span>
        </Link>
        <Link
          href="/nutrition"
          className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
        >
          <span className="meta text-[0.5rem]">Food Index</span>
        </Link>
      </SiteNav>

      <div className="hazard-rule" />

      <div className="container py-8">
        {/* ══ DAY NAV ═══════════════════════════════════════════════ */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => shiftDay(-1)}
              aria-label="Previous day"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-lime hover:text-lime active:scale-[0.97]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="display text-xl font-bold leading-none text-white sm:text-2xl">
                {isToday ? "Today" : prettyDate}
              </div>
              <div className="meta mt-1 text-[0.42rem] text-white/40">
                {isToday ? prettyDate : "Logged day"}
              </div>
            </div>
            <button
              onClick={() => shiftDay(1)}
              aria-label="Next day"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-lime hover:text-lime active:scale-[0.97]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {!isToday && (
              <button
                onClick={() => setDateKey(todayKey())}
                className="meta border border-white/15 px-2.5 py-1.5 text-[0.4rem] text-white/55 transition-colors hover:border-lime hover:text-lime"
              >
                Back to today
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDraft(targets);
                setEditTargets((v) => !v);
              }}
              className="flex items-center gap-2 border border-white/15 px-3 py-2 transition-colors hover:border-lime hover:text-lime"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span className="meta text-[0.45rem]">
                {hasTargets ? "Edit targets" : "Set targets"}
              </span>
            </button>
            {entries.length > 0 && (
              <button
                onClick={clearDay}
                className="flex items-center gap-2 border border-white/15 px-3 py-2 text-white/55 transition-colors hover:border-lime hover:text-lime"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="meta text-[0.45rem]">Clear day</span>
              </button>
            )}
          </div>
        </div>

        {/* ══ TARGET EDITOR ═════════════════════════════════════════ */}
        {editTargets && (
          <div className="mb-6 border border-lime/35 bg-lime/[0.04] p-5">
            <div className="meta mb-1.5 text-[0.45rem] text-lime">
              Your targets
            </div>
            <p className="mb-4 max-w-2xl text-[0.8rem] leading-relaxed text-white/60">
              Enter the numbers you are working to. We deliberately do not
              calculate these for you — appropriate intake depends on your body,
              training, health and goals. If you are unsure what to aim for, a
              registered dietitian or your doctor is the right place to get them.
            </p>
            <div className="grid gap-3 sm:grid-cols-4">
              {(
                [
                  ["kcal", "Calories", "kcal"],
                  ["protein", "Protein", "g"],
                  ["carbs", "Carbs", "g"],
                  ["fat", "Fat", "g"],
                ] as const
              ).map(([key, label, unit]) => (
                <div key={key}>
                  <label className="meta mb-1.5 block text-[0.4rem] text-white/45">
                    {label} ({unit})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={draft[key] || ""}
                    placeholder="—"
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        [key]: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="h-10 w-full border border-white/15 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/25 focus:border-lime focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                onClick={commitTargets}
                className="bg-lime px-4 py-2.5 text-background transition-transform active:scale-[0.97]"
              >
                <span className="display text-sm font-bold">Save targets</span>
              </button>
              <button
                onClick={() => setEditTargets(false)}
                className="border border-white/20 px-4 py-2.5 transition-colors hover:border-lime hover:text-lime"
              >
                <span className="display text-sm font-bold">Cancel</span>
              </button>
              {hasTargets && (
                <button
                  onClick={() => {
                    setDraft(NO_TARGETS);
                    setTargets(NO_TARGETS);
                    saveTargets(NO_TARGETS);
                    setEditTargets(false);
                    toast.success("Targets cleared");
                  }}
                  className="meta px-3 py-2.5 text-[0.45rem] text-white/45 transition-colors hover:text-lime"
                >
                  Clear targets
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* ══ LOG ═════════════════════════════════════════════════ */}
          <main className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="meta text-[1.1rem] leading-none text-white/12">
                  01
                </span>
                <h2 className="display text-lg font-bold text-white">
                  What you ate
                </h2>
              </div>
              <button
                onClick={() => setPickerOpen((v) => !v)}
                className="flex items-center gap-2 bg-lime px-3.5 py-2 text-background transition-transform active:scale-[0.97]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="display text-[0.8rem] font-bold">
                  Log food
                </span>
              </button>
            </div>

            {/* packaged food — scan or brand search */}
            <div className="mb-4">
              {packagedOpen ? (
                <PackagedFoodPicker
                  onConfirm={addPackaged}
                  onClose={() => setPackagedOpen(false)}
                  confirmLabel={`Log to ${slot}`}
                />
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setPickerOpen(false);
                      setPackagedOpen(true);
                    }}
                    className="flex items-center gap-2 border border-lime/40 bg-lime/[0.06] px-3.5 py-2.5 text-lime transition-colors hover:bg-lime/[0.12]"
                  >
                    <ScanLine className="h-3.5 w-3.5" />
                    <span className="meta text-[0.45rem] font-bold">
                      Scan a barcode
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setPickerOpen(false);
                      setPackagedOpen(true);
                    }}
                    className="flex items-center gap-2 border border-white/15 px-3.5 py-2.5 text-white/65 transition-colors hover:border-lime hover:text-lime"
                  >
                    <Package className="h-3.5 w-3.5" />
                    <span className="meta text-[0.45rem]">
                      Search a brand
                    </span>
                  </button>
                  <span className="meta text-[0.38rem] text-white/30">
                    For packaged foods
                  </span>
                </div>
              )}
            </div>

            {/* quick picker */}
            {pickerOpen && (
              <div className="mb-5 border border-white/15 p-3.5">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`meta border px-2.5 py-1.5 text-[0.4rem] transition-colors ${
                        slot === s
                          ? "border-lime bg-lime/10 text-lime"
                          : "border-white/15 text-white/50 hover:border-white/35 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search food to log..."
                    className="h-10 w-full border border-white/15 bg-white/[0.03] pl-9 pr-9 text-sm text-white placeholder:text-white/35 focus:border-lime focus:outline-none"
                  />
                  <button
                    onClick={() => setPickerOpen(false)}
                    aria-label="Close"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-lime"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="max-h-[260px] overflow-y-auto border border-white/10">
                  {results.map((food, i) => {
                    const per = scale(food, food.grams);
                    return (
                      <button
                        key={food.slug}
                        onClick={() => addFood(food.slug)}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-white/[0.04] ${
                          i === results.length - 1
                            ? ""
                            : "border-b border-white/[0.07]"
                        }`}
                      >
                        <Plus className="h-3 w-3 shrink-0 text-lime" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.82rem] text-white">
                            {food.name}
                          </span>
                          <span className="meta text-[0.38rem] text-white/35">
                            {food.serving}
                          </span>
                        </span>
                        <span className="display shrink-0 text-[0.82rem] font-bold text-lime">
                          {Math.round(per.kcal)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="meta mb-2 mt-4 text-[0.4rem] text-white/40">
                  Or log a whole meal
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MEALS.map((m) => (
                    <button
                      key={m.slug}
                      onClick={() => addMeal(m.slug)}
                      className="meta border border-white/12 px-2.5 py-1.5 text-[0.4rem] text-white/55 transition-colors hover:border-lime hover:text-lime"
                    >
                      {m.name} · {Math.round(mealMacros(m).kcal)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hydrated ? (
              <div className="border border-white/12 px-6 py-16 text-center">
                <span className="meta text-[0.45rem] text-white/35">
                  Loading your log…
                </span>
              </div>
            ) : entries.length === 0 ? (
              <div className="border border-dashed border-white/15 px-6 py-16 text-center">
                <div className="display text-lg font-bold text-white/60">
                  Nothing logged yet
                </div>
                <p className="mx-auto mt-2 max-w-sm text-[0.82rem] leading-relaxed text-white/45">
                  Log what you eat as you eat it — recalling a whole day at 10pm
                  is how portions get underestimated.
                </p>
                <button
                  onClick={() => setPickerOpen(true)}
                  className="mt-5 bg-lime px-4 py-2.5 text-background transition-transform active:scale-[0.97]"
                >
                  <span className="display text-sm font-bold">
                    Log your first item
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {bySlot.map(({ slot: s, items }) => {
                  const st = sumEntries(items);
                  return (
                    <section key={s}>
                      <div className="mb-2 flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
                        <h3 className="display text-sm font-bold text-white/85">
                          {s}
                        </h3>
                        <span className="meta text-[0.42rem] text-white/40">
                          {Math.round(st.kcal)} kcal · P
                          {Math.round(st.protein)} C{Math.round(st.carbs)} F
                          {Math.round(st.fat)}
                        </span>
                      </div>
                      <div className="border border-white/12">
                        {items.map((e, i) => (
                          <div
                            key={e.id}
                            className={`px-3 py-2.5 ${
                              i === items.length - 1
                                ? ""
                                : "border-b border-white/10"
                            }`}
                          >
                            <div className="flex items-baseline gap-2.5">
                              <span className="min-w-0 flex-1 truncate text-[0.85rem] font-semibold text-white">
                                {e.name}
                                {e.mealSlug && (
                                  <span className="meta ml-2 text-[0.36rem] text-lime">
                                    meal
                                  </span>
                                )}
                              </span>
                              <span className="display shrink-0 text-sm font-bold text-lime">
                                {Math.round(e.kcal)}
                              </span>
                              <button
                                onClick={() => removeEntry(e.id)}
                                aria-label={`Remove ${e.name}`}
                                className="shrink-0 text-white/30 transition-colors hover:text-lime"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                              {e.foodSlug ? (
                                <span className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    value={e.grams}
                                    onChange={(ev) =>
                                      adjustGrams(e.id, Number(ev.target.value))
                                    }
                                    className="h-6 w-16 border border-white/15 bg-white/[0.03] px-1.5 text-[0.72rem] text-white focus:border-lime focus:outline-none"
                                  />
                                  <span className="meta text-[0.38rem] text-white/35">
                                    grams
                                  </span>
                                </span>
                              ) : (
                                <span className="meta text-[0.38rem] text-white/35">
                                  1 × recipe
                                </span>
                              )}
                              <span className="meta text-[0.38rem] text-white/40">
                                P{e.protein.toFixed(1)} · C{e.carbs.toFixed(1)}{" "}
                                · F{e.fat.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </main>

          {/* ══ GAUGE PANEL ═════════════════════════════════════════ */}
          <aside>
            <div className="lg:sticky lg:top-24">
              <div className="mb-4 flex items-center gap-3">
                <span className="meta text-[1.1rem] leading-none text-white/12">
                  02
                </span>
                <h2 className="display text-lg font-bold text-white">
                  Day total
                </h2>
              </div>

              <div className="border border-lime/35 bg-lime/[0.04] p-4">
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

              {/* ══ CARDIO — shown separately, never netted off intake ══ */}
              <div className="mt-4 border border-white/12">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-3.5 w-3.5 text-lime" />
                    <span className="meta text-[0.42rem] text-lime">
                      Cardio today
                    </span>
                  </div>
                  <Link
                    href="/cardio"
                    className="meta text-[0.4rem] text-white/40 transition-colors hover:text-lime"
                  >
                    Log a session
                  </Link>
                </div>

                {cardioToday.length === 0 ? (
                  <p className="px-4 py-3.5 text-[0.78rem] leading-relaxed text-white/40">
                    No cardio logged. Sessions logged from the Cardio tab appear
                    here.
                  </p>
                ) : (
                  <>
                    <div className="divide-y divide-white/[0.07]">
                      {cardioToday.map((c) => (
                        <div
                          key={c.id}
                          className="group flex items-center gap-3 px-4 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[0.82rem] text-white">
                              {c.name}
                            </div>
                            <div className="meta text-[0.38rem] text-white/40">
                              {c.minutes} min · {c.intensity} ·{" "}
                              {c.met.toFixed(1)} MET
                            </div>
                          </div>
                          <span className="display shrink-0 text-[0.85rem] font-bold text-lime">
                            {c.kcal === null ? "—" : c.kcal}
                          </span>
                          <button
                            onClick={() => removeCardio(c.id)}
                            aria-label={`Remove ${c.name}`}
                            className="shrink-0 text-white/20 transition-colors hover:text-lime"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-baseline justify-between border-t border-white/10 px-4 py-2.5">
                      <span className="meta text-[0.4rem] text-white/45">
                        {cardioTotals.minutes} min total
                      </span>
                      <span className="text-[0.82rem] font-semibold text-white/80">
                        ≈ {Math.round(cardioTotals.kcal)} kcal burned
                      </span>
                    </div>
                    {cardioTotals.unknown > 0 && (
                      <p className="meta border-t border-white/10 px-4 py-2 text-[0.38rem] leading-relaxed text-white/35">
                        {cardioTotals.unknown} session
                        {cardioTotals.unknown > 1 ? "s" : ""} logged without a
                        bodyweight, so no estimate.
                      </p>
                    )}
                    <p className="border-t border-white/10 px-4 py-2.5 text-[0.68rem] leading-relaxed text-white/35">
                      Shown separately on purpose. Burn estimates are population
                      averages, so subtracting them from intake compounds the
                      error.
                    </p>
                  </>
                )}
              </div>

              {/* progress against member-set targets */}
              {hasTargets ? (
                <div className="mt-4 border border-white/12 p-4">
                  <div className="meta mb-3.5 text-[0.42rem] text-lime">
                    Against your targets
                  </div>
                  <div className="space-y-3.5">
                    <Gauge
                      label="Calories"
                      value={totals.kcal}
                      target={targets.kcal}
                      unit="kcal"
                    />
                    <Gauge
                      label="Protein"
                      value={totals.protein}
                      target={targets.protein}
                      unit="g"
                    />
                    <Gauge
                      label="Carbs"
                      value={totals.carbs}
                      target={targets.carbs}
                      unit="g"
                    />
                    <Gauge
                      label="Fat"
                      value={totals.fat}
                      target={targets.fat}
                      unit="g"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 border border-dashed border-white/15 p-4">
                  <div className="meta mb-1.5 text-[0.42rem] text-white/45">
                    No targets set
                  </div>
                  <p className="text-[0.78rem] leading-relaxed text-white/50">
                    Set your own calorie and macro targets to track progress
                    against them. We do not calculate these for you.
                  </p>
                  <button
                    onClick={() => {
                      setDraft(targets);
                      setEditTargets(true);
                    }}
                    className="meta mt-3 border border-white/20 px-3 py-2 text-[0.42rem] transition-colors hover:border-lime hover:text-lime"
                  >
                    Set targets
                  </button>
                </div>
              )}

              {/* week strip */}
              <div className="mt-4 border border-white/12 p-4">
                <div className="meta mb-3 text-[0.42rem] text-white/40">
                  Last 7 days
                </div>
                <WeekStrip
                  log={log}
                  target={targets.kcal}
                  activeKey={dateKey}
                  onPick={setDateKey}
                />
              </div>

              <p className="mt-4 text-[0.7rem] leading-relaxed text-white/40">
                Your log lives in this browser on this device. Clearing site data
                or switching phones will not carry it over, and nothing is
                uploaded anywhere.
              </p>
              <p className="mt-2.5 text-[0.7rem] leading-relaxed text-white/40">
                General reference information only, not dietary advice. Speak to
                a registered dietitian or your doctor about intake specific to
                you.
              </p>
            </div>
          </aside>
        </div>
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

/* ── gauge row ───────────────────────────────────────────────────── */
function Gauge({
  label,
  value,
  target,
  unit,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
}) {
  if (target <= 0) {
    return (
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="meta text-[0.4rem] text-white/40">{label}</span>
          <span className="meta text-[0.4rem] text-white/30">not set</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full bg-white/[0.06]" />
      </div>
    );
  }
  const pct = (value / target) * 100;
  const over = pct > 100;
  const remaining = target - value;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="meta text-[0.4rem] text-white/45">{label}</span>
        <span className="meta text-[0.4rem] text-white/60">
          {Math.round(value)} / {Math.round(target)} {unit}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden bg-white/[0.06]">
        <div
          className="h-full transition-[width] duration-300"
          style={{
            width: `${Math.min(100, pct)}%`,
            background: over ? "oklch(0.72 0.19 45)" : "var(--btb-lime)",
          }}
        />
      </div>
      <div className="meta mt-1 text-[0.36rem] text-white/35">
        {over
          ? `${Math.round(-remaining)} ${unit} over`
          : `${Math.round(remaining)} ${unit} left`}
      </div>
    </div>
  );
}

/* ── week strip ──────────────────────────────────────────────────── */
function WeekStrip({
  log,
  target,
  activeKey,
  onPick,
}: {
  log: Record<string, LoggedEntry[]>;
  target: number;
  activeKey: string;
  onPick: (key: string) => void;
}) {
  const days = useMemo(() => {
    const out: { key: string; label: string; kcal: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      const kcal = sumEntries(log[key] ?? []).kcal;
      out.push({
        key,
        label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
        kcal,
      });
    }
    return out;
  }, [log]);

  const max = Math.max(target || 0, ...days.map((d) => d.kcal), 1);

  return (
    <div className="flex items-end gap-1.5">
      {days.map((d) => {
        const h = Math.max(2, (d.kcal / max) * 56);
        const on = d.key === activeKey;
        return (
          <button
            key={d.key}
            onClick={() => onPick(d.key)}
            className="group flex flex-1 flex-col items-center gap-1.5"
            title={`${d.key}: ${Math.round(d.kcal)} kcal`}
          >
            <span className="flex h-[56px] w-full items-end">
              <span
                className="w-full transition-colors duration-150"
                style={{
                  height: `${h}px`,
                  background: on
                    ? "var(--btb-lime)"
                    : d.kcal > 0
                      ? "oklch(0.45 0 0)"
                      : "oklch(1 0 0 / 8%)",
                }}
              />
            </span>
            <span
              className={`meta text-[0.38rem] ${
                on ? "text-lime" : "text-white/35"
              }`}
            >
              {d.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
