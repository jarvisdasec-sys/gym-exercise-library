/**
 * Meal Prep — cook-along plans and the meal catalogue. `/nutrition/meal-prep`
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Prep plans read as WORK ORDERS: numbered timeline, hazard rules, mono
 *    time stamps. The timeline is the signature element on this page.
 *  - Lime marks the active plan and protein only.
 *  - Coach-direct, imperative copy throughout.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { ArrowRight, ChefHat, Clock, Package } from "lucide-react";
import { MacroBar, MacroReadout } from "@/components/MacroBar";
import { getFood } from "@/lib/foods";
import {
  MEALS,
  PREP_PLANS,
  getMeal,
  itemMacros,
  mealMacros,
  type MealSlot,
} from "@/lib/meals";

const SLOT_ORDER: MealSlot[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Post-Workout",
];

export default function MealPrep() {
  const [planSlug, setPlanSlug] = useState(PREP_PLANS[0].slug);
  const [openMeal, setOpenMeal] = useState<string | null>(null);

  const plan = PREP_PLANS.find((p) => p.slug === planSlug) ?? PREP_PLANS[0];

  const planTotals = useMemo(() => {
    return plan.meals.reduce(
      (acc, slug) => {
        const meal = getMeal(slug);
        if (!meal) return acc;
        const m = mealMacros(meal);
        return {
          kcal: acc.kcal + m.kcal,
          protein: acc.protein + m.protein,
          carbs: acc.carbs + m.carbs,
          fat: acc.fat + m.fat,
          fiber: acc.fiber + m.fiber,
        };
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    );
  }, [plan]);

  const grouped = useMemo(
    () =>
      SLOT_ORDER.map((slot) => ({
        slot,
        items: MEALS.filter((m) => m.slot === slot),
      })).filter((g) => g.items.length > 0),
    [],
  );

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

      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              Prep Board · {PREP_PLANS.length} Plans
            </span>
          </div>
          <h1 className="display text-[2rem] font-bold leading-[0.9] text-white sm:text-[2.75rem]">
            Cook once.
            <br />
            <span className="text-lime">Eat all week.</span>
          </h1>
          <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/60">
            Pick a plan, follow the timeline, portion into containers. The single
            habit that stops a diet falling apart on a Wednesday night.
          </p>
        </div>
      </section>

      {/* ══ PLAN SELECTOR ════════════════════════════════════════════ */}
      <div className="container py-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="meta text-[1.1rem] leading-none text-white/12">
            01
          </span>
          <h2 className="display text-lg font-bold text-white">
            Choose your prep session
          </h2>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {PREP_PLANS.map((p) => {
            const on = p.slug === plan.slug;
            return (
              <button
                key={p.slug}
                onClick={() => setPlanSlug(p.slug)}
                className={`group border p-4 text-left transition-colors duration-200 ${
                  on
                    ? "border-lime bg-lime/[0.06]"
                    : "border-white/12 hover:border-white/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`display text-base font-bold leading-tight ${
                      on ? "text-lime" : "text-white group-hover:text-lime"
                    }`}
                  >
                    {p.name}
                  </span>
                  {on && (
                    <span className="mt-1 h-2 w-2 shrink-0 bg-lime" />
                  )}
                </div>
                <div className="meta mt-2 flex items-center gap-1.5 text-[0.4rem] text-white/40">
                  <Clock className="h-2.5 w-2.5" />
                  {p.session}
                </div>
                <div className="meta mt-1 flex items-center gap-1.5 text-[0.4rem] text-white/40">
                  <Package className="h-2.5 w-2.5" />
                  {p.yieldNote}
                </div>
              </button>
            );
          })}
        </div>

        {/* ══ ACTIVE PLAN ════════════════════════════════════════════ */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          {/* timeline */}
          <div>
            <div className="hazard-rule mb-4" />
            <div className="mb-1.5 flex items-baseline gap-3">
              <span className="meta text-[1.1rem] leading-none text-white/12">
                02
              </span>
              <h3 className="display text-xl font-bold text-white sm:text-2xl">
                {plan.name}
              </h3>
            </div>
            <p className="mb-6 max-w-2xl pl-0 text-sm leading-relaxed text-white/60 sm:pl-10">
              {plan.summary}
            </p>

            <div className="mb-3 flex items-center gap-2">
              <ChefHat className="h-3.5 w-3.5 text-lime" />
              <span className="meta text-[0.45rem] text-lime">
                Cook-along timeline
              </span>
            </div>

            {/* the signature element: a bolted-down work order timeline */}
            <ol className="border border-white/12">
              {plan.timeline.map((step, i) => (
                <li
                  key={step.time}
                  className={`flex gap-3 px-3.5 py-3 sm:gap-5 sm:px-4 ${
                    i === plan.timeline.length - 1
                      ? ""
                      : "border-b border-white/10"
                  }`}
                >
                  <span className="meta w-11 shrink-0 pt-0.5 text-[0.55rem] text-lime">
                    {step.time}
                  </span>
                  <span className="meta w-5 shrink-0 pt-0.5 text-[0.5rem] text-white/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.85rem] leading-relaxed text-white/80">
                    {step.action}
                  </span>
                </li>
              ))}
            </ol>

            {/* storage rules */}
            <div className="mt-6 border border-white/12 p-4">
              <div className="meta mb-3 text-[0.45rem] text-lime">
                Storage & reheating
              </div>
              <ul className="space-y-2.5">
                {plan.storage.map((s) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 bg-lime" />
                    <span className="text-[0.83rem] leading-relaxed text-white/70">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-white/10 pt-3 text-[0.72rem] leading-relaxed text-white/40">
                General food-safety guidance: cool cooked food quickly, keep the
                fridge at or below 5°C, and reheat until piping hot throughout.
                When in doubt about a container that has sat for days, throw it
                out.
              </p>
            </div>
          </div>

          {/* what the session produces */}
          <aside>
            <div className="lg:sticky lg:top-24">
              <div className="border border-lime/35 bg-lime/[0.04] p-4">
                <div className="meta mb-3 text-[0.42rem] text-lime">
                  One serving of each meal in this plan
                </div>
                <MacroReadout
                  kcal={planTotals.kcal}
                  protein={planTotals.protein}
                  carbs={planTotals.carbs}
                  fat={planTotals.fat}
                />
                <MacroBar
                  macros={planTotals}
                  height={7}
                  showLegend
                  className="mt-3"
                />
                <p className="mt-3 border-t border-white/10 pt-2.5 text-[0.7rem] leading-relaxed text-white/45">
                  This is the combined total of one portion of each meal below —
                  a reference figure, not a daily target.
                </p>
              </div>

              <div className="meta mb-2.5 mt-5 text-[0.45rem] text-white/40">
                Meals produced
              </div>
              <div className="flex flex-col gap-2">
                {plan.meals.map((slug) => {
                  const meal = getMeal(slug);
                  if (!meal) return null;
                  const m = mealMacros(meal);
                  return (
                    <button
                      key={slug}
                      onClick={() =>
                        setOpenMeal(openMeal === slug ? null : slug)
                      }
                      className="group border border-white/12 px-3.5 py-3 text-left transition-colors hover:border-lime"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-lime">
                          {meal.name}
                        </span>
                        <span className="display shrink-0 text-sm font-bold text-lime">
                          {Math.round(m.kcal)}
                        </span>
                      </div>
                      <div className="meta mt-1 text-[0.4rem] text-white/40">
                        {meal.slot} · {meal.prepTime} · P
                        {Math.round(m.protein)} C{Math.round(m.carbs)} F
                        {Math.round(m.fat)}
                      </div>
                      <MacroBar macros={m} height={4} className="mt-2" />
                    </button>
                  );
                })}
              </div>

              <Link
                href="/nutrition/builder"
                className="group mt-5 flex items-center justify-center gap-2 bg-lime px-4 py-3 text-background transition-transform duration-150 active:scale-[0.97]"
              >
                <span className="display text-sm font-bold">
                  Adjust in the builder
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </aside>
        </div>

        {/* ══ MEAL CATALOGUE ═══════════════════════════════════════ */}
        <div className="mt-14">
          <div className="hazard-rule mb-4" />
          <div className="mb-6 flex items-baseline gap-3">
            <span className="meta text-[1.1rem] leading-none text-white/12">
              03
            </span>
            <div>
              <h2 className="display text-xl font-bold text-white sm:text-2xl">
                Every meal, with the method
              </h2>
              <p className="mt-1 text-[0.8rem] text-white/50">
                Tap any meal for the ingredient weights and the steps. Macros
                are computed from the food index, not typed in.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            {grouped.map(({ slot, items }) => (
              <section key={slot}>
                <div className="mb-3.5 flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
                  <h3 className="display text-base font-bold text-white/85">
                    {slot}
                  </h3>
                  <span className="meta text-[0.42rem] text-white/35">
                    {items.length} {items.length === 1 ? "meal" : "meals"}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((meal) => (
                    <MealCard
                      key={meal.slug}
                      slug={meal.slug}
                      open={openMeal === meal.slug}
                      onToggle={() =>
                        setOpenMeal(openMeal === meal.slug ? null : meal.slug)
                      }
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
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

/* ── meal card ───────────────────────────────────────────────────── */
function MealCard({
  slug,
  open,
  onToggle,
}: {
  slug: string;
  open: boolean;
  onToggle: () => void;
}) {
  const meal = getMeal(slug);
  if (!meal) return null;
  const m = mealMacros(meal);

  return (
    <div
      className={`group relative border transition-colors duration-200 ${
        open ? "border-lime" : "border-white/12 hover:border-white/30"
      }`}
    >
      <span className="tick left-0 top-0 border-l border-t" />
      <span className="tick right-0 top-0 border-r border-t" />

      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full px-4 py-3.5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4
              className={`display text-base font-bold leading-tight ${
                open ? "text-lime" : "text-white group-hover:text-lime"
              }`}
            >
              {meal.name}
            </h4>
            <p className="mt-1.5 text-[0.78rem] leading-relaxed text-white/55">
              {meal.summary}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="display text-lg font-bold leading-none text-lime">
              {Math.round(m.kcal)}
            </div>
            <div className="meta mt-0.5 text-[0.38rem] text-white/40">kcal</div>
          </div>
        </div>

        <MacroBar macros={m} height={5} className="mt-3" />

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="meta text-[0.4rem] text-white/45">
            P{Math.round(m.protein)} · C{Math.round(m.carbs)} · F
            {Math.round(m.fat)}
          </span>
          <span className="meta flex items-center gap-1 text-[0.4rem] text-white/35">
            <Clock className="h-2.5 w-2.5" />
            {meal.prepTime}
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {meal.tags.map((t) => (
            <span
              key={t}
              className="meta border border-white/12 px-1.5 py-0.5 text-[0.36rem] text-white/45"
            >
              {t}
            </span>
          ))}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3.5">
          <div className="meta mb-2 text-[0.4rem] text-lime">Ingredients</div>
          <div className="border border-white/10">
            {meal.items.map((item, i) => {
              const food = getFood(item.slug);
              const im = itemMacros(item);
              return (
                <div
                  key={item.slug}
                  className={`flex items-baseline justify-between gap-2 px-2.5 py-1.5 ${
                    i === meal.items.length - 1
                      ? ""
                      : "border-b border-white/[0.07]"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate text-[0.78rem] text-white/80">
                    {food?.name ?? item.slug}
                  </span>
                  <span className="meta shrink-0 text-[0.4rem] text-white/40">
                    {item.grams} g
                  </span>
                  <span className="meta w-10 shrink-0 text-right text-[0.4rem] text-lime">
                    {Math.round(im.kcal)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="meta mb-2 mt-4 text-[0.4rem] text-lime">Method</div>
          <ol className="space-y-2">
            {meal.steps.map((s, i) => (
              <li key={s} className="flex gap-2.5">
                <span className="meta w-4 shrink-0 pt-[0.15rem] text-[0.42rem] text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.8rem] leading-relaxed text-white/70">
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

