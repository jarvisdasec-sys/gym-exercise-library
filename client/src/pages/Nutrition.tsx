/**
 * Nutrition — the food reference board. `/nutrition`
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Same industrial index language as the plate wall and session board:
 *    lime hairlines, mono numerals, hazard rule per section, corner ticks.
 *  - Foods are listed as a DATA BOARD (rows with instrumentation), not as
 *    photo cards. The macro bar is the visual event.
 *  - Lime = protein throughout, so the eye reads the training macro first.
 *  - Copy stays coach-direct and imperative. No hype.
 *
 * COMPLIANCE: general nutritional reference information, not dietary advice.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import {
  ArrowRight,
  Brain,
  ChevronDown,
  Droplets,
  ScanLine,
  Search,
  TimerReset,
  Utensils,
} from "lucide-react";
import { MacroBar } from "@/components/MacroBar";
import {
  CATEGORY_META,
  FOODS,
  perServing,
  type Food,
  type FoodCategory,
} from "@/lib/foods";
import { MEALS, PREP_PLANS } from "@/lib/meals";

const CATEGORIES = Object.keys(CATEGORY_META) as FoodCategory[];

type SortKey = "protein" | "kcal" | "name";

const COMPARISON_ROWS = [
  ["Target Goal", "Restore training fuel and support the next high-output session.", "Create flexibility for a social meal without abandoning the weekly plan."],
  ["Macro Allocation", "Carbohydrate-forward; keep protein fixed and fat controlled.", "Choose the meal you want, then anchor it with protein and a defined portion."],
  ["Timing Window", "Schedule post-leg day or after your highest-volume training block.", "Use a single planned meal - not an untracked all-day event."],
  ["Frequency", "Use strategically when training demand and adherence warrant it.", "Use occasionally; the weekly calorie average remains the guardrail."],
];

const RULES = [
  ["Earn the Surplus", "Time the extra carbohydrate around high-volume work. A refeed supports a session you have earned; it is not a replacement for consistent training.", "Schedule Post-Leg Day"],
  ["Keep Protein Fixed", "Keep your usual protein target in place so the higher-calorie meal does not crowd out the building material your recovery needs.", "Protein Stays Constant"],
  ["Set the Perimeter", "Choose the restaurant, meal, and portion before sitting down. A clear boundary turns flexibility into a decision instead of a drift.", "One Defined Meal"],
  ["Hydration & Sodium Balance", "Drink normally and expect temporary scale movement after higher sodium or carbohydrate intake. Return to routine rather than reacting with restriction.", "Cap Fat Under 30g"],
] as const;

export default function Nutrition() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<FoodCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("protein");
  const [basis, setBasis] = useState<"serving" | "100g">("serving");
  const [openRule, setOpenRule] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = FOODS.filter((f) => {
      if (active !== "all" && f.category !== active) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.usdaName.toLowerCase().includes(q) ||
        CATEGORY_META[f.category].label.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      const av = basis === "serving" ? perServing(a) : a;
      const bv = basis === "serving" ? perServing(b) : b;
      return sort === "protein"
        ? bv.protein - av.protein
        : bv.kcal - av.kcal;
    });
    return list;
  }, [query, active, sort, basis]);

  /** Group the filtered list back into category sections. */
  const sections = useMemo(() => {
    const order = active === "all" ? CATEGORIES : [active];
    return order
      .map((cat) => ({
        cat,
        items: filtered.filter((f) => f.category === cat),
      }))
      .filter((s) => s.items.length > 0);
  }, [filtered, active]);

  return (
    <div className="min-h-screen">
      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <SiteNav active="nutrition" />

      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8 sm:py-10">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              Food Index · USDA Sourced
            </span>
          </div>
          <h1 className="display text-[2.5rem] font-bold leading-[0.88] text-white sm:text-[3.5rem]">
            Know what you eat.
            <br />
            <span className="text-lime">Then eat on purpose.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
            Whole-food macros come from the USDA FoodData Central database.
            Packaged foods you scan come from Open Food Facts. Build a meal,
            check the split, log the day. Weigh your food — guessing is how
            progress stalls.
          </p>

          <div className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-white/12 border border-white/12">
            {[
              { n: String(FOODS.length), l: "Foods" },
              { n: String(MEALS.length), l: "Meals" },
              { n: String(PREP_PLANS.length), l: "Prep Plans" },
            ].map((s) => (
              <div key={s.l} className="px-4 py-3">
                <div className="display text-2xl font-bold leading-none text-lime">
                  {s.n}
                </div>
                <div className="meta mt-1 text-[0.4rem] text-white/45">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* Primary actions — one lime fill only, per the style contract. */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/nutrition/builder"
              className="group flex items-center gap-2 bg-lime px-5 py-3 text-background transition-transform duration-150 active:scale-[0.97]"
            >
              <span className="display text-sm font-bold">Build a Meal</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/nutrition/tracker"
              className="flex items-center gap-2 border border-white/20 px-5 py-3 transition-colors duration-200 hover:border-lime hover:text-lime"
            >
              <span className="display text-sm font-bold">Calorie Tracker</span>
            </Link>
            <Link
              href="/nutrition/meal-prep"
              className="flex items-center gap-2 border border-white/20 px-5 py-3 transition-colors duration-200 hover:border-lime hover:text-lime"
            >
              <span className="display text-sm font-bold">Meal Prep</span>
            </Link>
          </div>

          {/* packaged foods live in the tracker and builder, not this index */}
          <div className="mt-5 flex max-w-xl flex-wrap items-center gap-2.5 border border-lime/30 bg-lime/[0.04] px-4 py-3">
            <ScanLine className="h-4 w-4 shrink-0 text-lime" />
            <p className="min-w-0 flex-1 text-[0.8rem] leading-relaxed text-white/65">
              Eating something out of a packet? Scan the barcode in the{" "}
              <Link
                href="/nutrition/tracker"
                className="text-lime underline decoration-lime/35 underline-offset-2"
              >
                tracker
              </Link>{" "}
              or the{" "}
              <Link
                href="/nutrition/builder"
                className="text-lime underline decoration-lime/35 underline-offset-2"
              >
                meal builder
              </Link>{" "}
              to pull its macros straight off the label.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#1a1a1a] bg-[#0b0b0b]">
        <div className="container py-9 sm:py-12">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#8CFF00]" />
            <span className="meta text-[0.45rem] text-[#8CFF00]">
              Calorie-Deficit Guardrails
            </span>
          </div>
          <h2 className="display text-2xl font-bold leading-none text-white sm:text-3xl">
            Cheat Meals &amp; <span className="text-[#8CFF00]">Refeed Science.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            A planned refeed is a carbohydrate-focused tool inside your weekly
            calorie plan. A cheat meal is a flexible social choice. Neither is
            a license to erase the deficit you built all week.
          </p>

          <div className="mt-7 overflow-hidden border border-[#1a1a1a]">
            <div className="grid grid-cols-[7rem_1fr_1fr] border-b border-[#1a1a1a] bg-white/[0.02] sm:grid-cols-[10rem_1fr_1fr]">
              <div className="p-3" />
              <div className="border-l border-[#1a1a1a] p-3">
                <span className="meta text-[0.5rem] font-bold text-[#8CFF00]">CONTROLLED REFEED</span>
              </div>
              <div className="border-l border-[#1a1a1a] p-3">
                <span className="meta text-[0.5rem] font-bold text-white/70">FLEXIBLE CHEAT MEAL</span>
              </div>
            </div>
            {COMPARISON_ROWS.map(([metric, refeed, meal]) => (
              <div key={metric} className="grid grid-cols-[7rem_1fr_1fr] border-b border-[#1a1a1a] last:border-b-0 sm:grid-cols-[10rem_1fr_1fr]">
                <div className="meta bg-white/[0.015] p-3 text-[0.45rem] font-bold text-white/50">{metric}</div>
                <p className="border-l border-[#1a1a1a] p-3 text-xs leading-relaxed text-white/70">{refeed}</p>
                <p className="border-l border-[#1a1a1a] p-3 text-xs leading-relaxed text-white/60">{meal}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              [TimerReset, "HORMONAL RESET", "Planned flexibility", "Use a structured higher-carb day to support adherence - not to chase a metabolic shortcut."],
              [Utensils, "GLYCOGEN STORE", "Schedule Post-Leg Day", "Refill fuel after the work that created the demand. Keep the meal carbohydrate-forward."],
              [Brain, "PSYCHOLOGICAL SUSTAINABILITY", "Cap Fat Under 30g", "Keep the meal enjoyable but bounded so calorie density does not quietly undo the weekly deficit."],
            ].map(([Icon, badge, metric, copy]) => {
              const CalloutIcon = Icon as typeof TimerReset;
              return (
                <article key={badge as string} className="border border-[#1a1a1a] bg-[#101010] p-4">
                  <CalloutIcon className="h-5 w-5 text-[#8CFF00]" />
                  <span className="meta mt-4 inline-block border border-[#8CFF00]/35 px-1.5 py-1 text-[0.4rem] font-bold text-[#8CFF00]">{badge as string}</span>
                  <p className="display mt-3 text-lg font-bold text-white">{metric as string}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">{copy as string}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
            <div>
              <div className="flex items-center gap-2 text-[#8CFF00]">
                <Droplets className="h-4 w-4" />
                <span className="meta text-[0.48rem] font-bold">PROTOCOL CHECKLIST</span>
              </div>
              <h3 className="display mt-3 text-2xl font-bold text-white">Rules of Engagement.</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Open each rule before the meal. Your plan should be clear enough to follow when appetite and social pressure are both high.
              </p>
            </div>
            <div className="border border-[#1a1a1a]">
              {RULES.map(([title, copy, metric], index) => {
                const expanded = openRule === index;
                return (
                  <div key={title} className="border-b border-[#1a1a1a] last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenRule(expanded ? null : index)}
                      aria-expanded={expanded}
                      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-[#8CFF00]/[0.05]"
                    >
                      <span className="meta text-[0.48rem] text-[#8CFF00]">0{index + 1}</span>
                      <span className="flex-1 text-sm font-semibold text-white">{title}</span>
                      <ChevronDown className={`h-4 w-4 text-[#8CFF00] transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </button>
                    {expanded && (
                      <div className="border-t border-[#1a1a1a] bg-black/25 px-4 py-4 pl-12">
                        <span className="meta border border-[#8CFF00]/35 px-1.5 py-1 text-[0.4rem] font-bold text-[#8CFF00]">{metric}</span>
                        <p className="mt-3 text-sm leading-relaxed text-white/65">{copy}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ BOARD ════════════════════════════════════════════════════ */}
      <div className="container flex flex-col gap-8 py-8 lg:flex-row lg:gap-10">
        {/* ── left rail ─────────────────────────────────────────────── */}
        <aside className="lg:w-[240px] lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            {/* mobile search */}
            <div className="relative mb-5 sm:hidden">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food..."
                className="h-10 w-full border border-white/15 bg-white/[0.03] pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-lime focus:outline-none"
              />
            </div>

            <div className="meta mb-3 text-[0.45rem] text-white/40">
              Categories
            </div>
            <nav className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0 lg:border lg:border-white/12">
              <RailButton
                label="All Foods"
                index="—"
                count={FOODS.length}
                selected={active === "all"}
                onClick={() => setActive("all")}
              />
              {CATEGORIES.map((cat) => (
                <RailButton
                  key={cat}
                  label={CATEGORY_META[cat].label}
                  index={CATEGORY_META[cat].index}
                  count={FOODS.filter((f) => f.category === cat).length}
                  selected={active === cat}
                  onClick={() => setActive(cat)}
                />
              ))}
            </nav>

            {/* controls */}
            <div className="mt-6 border border-white/12 p-3">
              <div className="meta mb-2 text-[0.4rem] text-white/40">
                Show values per
              </div>
              <div className="mb-4 flex border border-white/12">
                {(["serving", "100g"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasis(b)}
                    className={`flex-1 px-2 py-1.5 transition-colors duration-150 ${
                      basis === b
                        ? "bg-lime text-background"
                        : "text-white/55 hover:text-lime"
                    }`}
                  >
                    <span className="meta text-[0.4rem]">
                      {b === "serving" ? "Serving" : "100 g"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="meta mb-2 text-[0.4rem] text-white/40">
                Sort by
              </div>
              <div className="flex flex-col gap-1">
                {(
                  [
                    ["protein", "Most protein"],
                    ["kcal", "Most calories"],
                    ["name", "Name (A–Z)"],
                  ] as const
                ).map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setSort(k)}
                    className={`flex items-center gap-2 px-1 py-1 text-left transition-colors duration-150 ${
                      sort === k ? "text-lime" : "text-white/55 hover:text-white"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 ${
                        sort === k ? "bg-lime" : "bg-white/25"
                      }`}
                    />
                    <span className="meta text-[0.4rem]">{l}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 border border-white/12 p-3">
              <div className="meta mb-1.5 text-[0.4rem] text-lime">
                Reading the bar
              </div>
              <MacroBar
                macros={{ protein: 30, carbs: 40, fat: 12 }}
                showLegend
                height={7}
              />
              <p className="mt-2.5 text-[0.7rem] leading-relaxed text-white/45">
                Bars show the share of calories from each macro — not grams.
                Lime is always protein.
              </p>
            </div>
          </div>
        </aside>

        {/* ── food board ────────────────────────────────────────────── */}
        <main className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-3">
            <span className="meta text-[0.45rem] text-white/45">
              {filtered.length}{" "}
              {filtered.length === 1 ? "food" : "foods"}
              {query && " matched"}
            </span>
            <span className="meta text-[0.45rem] text-white/30">
              Per {basis === "serving" ? "serving" : "100 g"}
            </span>
          </div>

          {sections.length === 0 ? (
            <div className="border border-white/12 px-6 py-16 text-center">
              <div className="display text-lg font-bold text-white/70">
                Nothing matched
              </div>
              <p className="mt-2 text-sm text-white/45">
                Try a shorter search, or clear it to see all {FOODS.length}{" "}
                foods.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActive("all");
                }}
                className="mt-5 border border-white/20 px-4 py-2 transition-colors hover:border-lime hover:text-lime"
              >
                <span className="meta text-[0.45rem]">Reset the board</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {sections.map(({ cat, items }) => (
                <section key={cat}>
                  {/* category header — one hazard rule per section */}
                  <div className="mb-4">
                    <div className="hazard-rule mb-3.5" />
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div className="flex items-baseline gap-3">
                        <span className="meta text-[1.4rem] leading-none text-white/12">
                          {CATEGORY_META[cat].index}
                        </span>
                        <div>
                          <h2 className="display text-xl font-bold text-white sm:text-2xl">
                            {CATEGORY_META[cat].label}
                          </h2>
                          <p className="mt-1 text-[0.78rem] text-white/50">
                            {CATEGORY_META[cat].blurb}
                          </p>
                        </div>
                      </div>
                      <span className="meta shrink-0 text-[0.45rem] text-white/35">
                        {items.length} items
                      </span>
                    </div>
                  </div>

                  <div className="border border-white/12">
                    {items.map((food, i) => (
                      <FoodRow
                        key={food.slug}
                        food={food}
                        basis={basis}
                        last={i === items.length - 1}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* provenance + compliance */}
          <div className="mt-12 border border-white/12 p-5">
            <div className="meta mb-2 text-[0.45rem] text-lime">
              Where these numbers come from
            </div>
            <p className="text-[0.8rem] leading-relaxed text-white/55">
              Macros are per 100 g from the{" "}
              <a
                href="https://fdc.nal.usda.gov/"
                target="_blank"
                rel="noreferrer"
                className="text-lime underline decoration-lime/40 underline-offset-2"
              >
                USDA FoodData Central
              </a>{" "}
              database (SR Legacy and Foundation Foods), and serving values are
              scaled from those figures. Whey isolate is the one exception — no
              USDA entry exists, so it carries a typical label value. Brand-name
              products will differ from these reference figures; read your own
              labels.
            </p>
            <p className="mt-3 text-[0.8rem] leading-relaxed text-white/45">
              This board is general nutritional reference information, not
              dietary advice for any individual. For guidance specific to your
              own health, medication or conditions, speak to a registered
              dietitian or your doctor.
            </p>
          </div>
        </main>
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

/* ── rail button ─────────────────────────────────────────────────── */
function RailButton({
  label,
  index,
  count,
  selected,
  onClick,
}: {
  label: string;
  index: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 border px-3 py-2 text-left transition-colors duration-200 lg:w-full lg:border-0 lg:border-b lg:border-white/10 lg:px-3.5 lg:py-2.5 lg:last:border-b-0 ${
        selected
          ? "border-lime bg-lime/10 text-lime lg:bg-lime/10"
          : "border-white/12 text-white/60 hover:border-white/30 hover:text-white lg:hover:bg-white/[0.03]"
      }`}
    >
      <span className="meta hidden text-[0.5rem] opacity-40 lg:inline">
        {index}
      </span>
      <span className="meta flex-1 text-[0.45rem]">{label}</span>
      <span className="meta text-[0.45rem] opacity-50">{count}</span>
    </button>
  );
}

/* ── food row ────────────────────────────────────────────────────── */
function FoodRow({
  food,
  basis,
  last,
}: {
  food: Food;
  basis: "serving" | "100g";
  last: boolean;
}) {
  const [open, setOpen] = useState(false);
  const v = basis === "serving" ? perServing(food) : food;
  const amount = basis === "serving" ? food.serving : "100 g";

  return (
    <div
      className={`group relative ${last ? "" : "border-b border-white/10"} ${
        open ? "bg-white/[0.03]" : ""
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors duration-150 hover:bg-white/[0.035] sm:gap-4 sm:px-4"
      >
        {/* corner registration ticks */}
        <span className="tick left-0 top-0 border-l border-t" />
        <span className="tick right-0 top-0 border-r border-t" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-sm font-semibold text-white group-hover:text-lime">
              {food.name}
            </span>
            <span className="meta text-[0.4rem] text-white/35">{amount}</span>
          </div>
          <MacroBar
            macros={v}
            height={5}
            className="mt-2 max-w-[280px]"
          />
        </div>

        {/* numeric readout */}
        <div className="hidden shrink-0 grid-cols-4 gap-3 text-right sm:grid sm:w-[220px]">
          <Cell value={Math.round(v.kcal)} label="kcal" lime />
          <Cell value={`${Math.round(v.protein)}`} label="P" />
          <Cell value={`${Math.round(v.carbs)}`} label="C" />
          <Cell value={`${Math.round(v.fat)}`} label="F" />
        </div>

        {/* compact readout on mobile */}
        <div className="shrink-0 text-right sm:hidden">
          <div className="display text-base font-bold leading-none text-lime">
            {Math.round(v.kcal)}
          </div>
          <div className="meta mt-0.5 text-[0.4rem] text-white/40">
            P{Math.round(v.protein)} C{Math.round(v.carbs)} F
            {Math.round(v.fat)}
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/10 px-3 pb-4 pt-3.5 sm:px-4">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <div>
              <div className="meta mb-1.5 text-[0.4rem] text-lime">
                Coach note
              </div>
              <p className="text-[0.82rem] leading-relaxed text-white/70">
                {food.note}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-1.5">
                <Meta label="Fiber" value={`${v.fiber.toFixed(1)} g`} />
                <Meta label="Serving" value={food.serving} />
                <Meta
                  label="Source"
                  value={
                    food.fdcId ? `USDA #${food.fdcId}` : "Typical label value"
                  }
                />
              </div>
              <p className="mt-2.5 text-[0.68rem] leading-relaxed text-white/35">
                {food.usdaName}
              </p>
            </div>

            <div className="border border-white/12 p-3">
              <div className="meta mb-2 text-[0.4rem] text-white/40">
                Calorie split
              </div>
              <MacroBar macros={v} height={8} showLegend />
              <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                <Line label="Protein" value={`${v.protein.toFixed(1)} g`} />
                <Line label="Carbohydrate" value={`${v.carbs.toFixed(1)} g`} />
                <Line label="Fat" value={`${v.fat.toFixed(1)} g`} />
                <Line
                  label="Energy"
                  value={`${Math.round(v.kcal)} kcal`}
                  lime
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Cell({
  value,
  label,
  lime = false,
}: {
  value: string | number;
  label: string;
  lime?: boolean;
}) {
  return (
    <div>
      <div
        className={`display text-base font-bold leading-none ${
          lime ? "text-lime" : "text-white/85"
        }`}
      >
        {value}
      </div>
      <div className="meta mt-1 text-[0.38rem] text-white/35">{label}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="meta text-[0.4rem] text-white/35">{label}</span>
      <span className="text-[0.78rem] text-white/70">{value}</span>
    </span>
  );
}

function Line({
  label,
  value,
  lime = false,
}: {
  label: string;
  value: string;
  lime?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="meta text-[0.4rem] text-white/40">{label}</span>
      <span
        className={`text-[0.82rem] font-semibold ${
          lime ? "text-lime" : "text-white/85"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
