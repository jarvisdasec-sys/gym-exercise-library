/**
 * Cardio hub — the conditioning index.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Industrial inventory board: numbered rows, hairline rules, mono uppercase
 *    labels, hazard divider between major bands. No cards with soft shadows.
 *  - Lime marks state and ONE primary action per view. Everything else is
 *    white on near-black.
 *  - Coach-direct copy, imperative voice, no marketing filler.
 *
 * HONESTY RULE: every MET value is attributed to the 2024 Adult Compendium, and
 * calorie figures only appear once the member has entered a bodyweight. We never
 * invent a mass to make a number appear.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { ArrowRight, Info, Scale, Search, Timer, X } from "lucide-react";
import {
  CARDIO,
  CARDIO_CATEGORY_META,
  PROTOCOLS,
  estimateKcal,
  type CardioCategory,
} from "@/lib/cardio";
import { LB_PER_KG, loadWeightKg, saveWeightKg } from "@/lib/cardioLog";

const CATEGORY_ORDER: CardioCategory[] = [
  "run",
  "ride",
  "row",
  "climb",
  "water",
  "rope",
  "impact",
  "walk",
];

export default function Cardio() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<CardioCategory | "all">("all");

  /* bodyweight — needed for any calorie estimate, held on this device only */
  const [weightKg, setWeightKg] = useState<number | null>(() => loadWeightKg());
  const [unit, setUnit] = useState<"kg" | "lb">("lb");
  const [weightInput, setWeightInput] = useState("");

  function commitWeight() {
    const raw = Number(weightInput);
    if (!raw || raw <= 0) return;
    const kg = unit === "kg" ? raw : raw / LB_PER_KG;
    const rounded = Math.round(kg * 10) / 10;
    setWeightKg(rounded);
    saveWeightKg(rounded);
    setWeightInput("");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARDIO.filter((c) => {
      if (activeCat !== "all" && c.category !== activeCat) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.equipment.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        CARDIO_CATEGORY_META[c.category].label.toLowerCase().includes(q)
      );
    });
  }, [query, activeCat]);

  /* group the filtered set so the wall keeps its section rhythm */
  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        cat,
        items: filtered.filter((c) => c.category === cat),
      })).filter((g) => g.items.length > 0),
    [filtered],
  );

  const displayWeight =
    weightKg === null
      ? ""
      : unit === "kg"
        ? `${weightKg.toFixed(1)} kg`
        : `${Math.round(weightKg * LB_PER_KG)} lb`;

  return (
    <div className="min-h-screen">
      <SiteNav active="cardio">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH CARDIO / EQUIPMENT"
            className="meta h-10 w-full border border-white/12 bg-white/[0.03] pl-9 pr-8 text-[0.55rem] text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-lime"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-lime"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="hidden h-10 shrink-0 items-center gap-2 bg-lime px-3.5 sm:flex">
          <span className="meta text-[0.7rem] font-bold text-black">
            {String(filtered.length).padStart(2, "0")}
          </span>
          <span className="meta text-[0.45rem] font-bold text-black/70">
            Modes
          </span>
        </div>
      </SiteNav>

      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8 sm:py-10">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              Conditioning Index · Rev. 01
            </span>
          </div>
          <h1 className="display text-[2.5rem] font-bold leading-[0.88] text-white sm:text-[3.5rem]">
            Build the engine.
            <br />
            <span className="text-lime">Earn the recovery.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
            {CARDIO.length} ways to raise your heart rate, each with three honest
            effort tiers, the technique that keeps it efficient and the mistakes
            that waste the session. Log what you do and see the estimated cost.
          </p>

          <div className="mt-7 grid max-w-lg grid-cols-3 divide-x divide-white/12 border border-white/12">
            {[
              { n: String(CARDIO.length), l: "Modes" },
              { n: String(PROTOCOLS.length), l: "Protocols" },
              { n: "08", l: "Categories" },
            ].map((s) => (
              <div key={s.l} className="px-4 py-3.5">
                <div className="display text-2xl font-bold text-lime">
                  {s.n}
                </div>
                <div className="meta mt-1 text-[0.4rem] text-white/45">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BODYWEIGHT — required before any calorie figure ══════════ */}
      <section className="border-b border-white/10 bg-white/[0.015]">
        <div className="container py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
              <div>
                <h2 className="display text-base font-semibold text-white">
                  {weightKg
                    ? `Estimating for ${displayWeight}`
                    : "Set your bodyweight for calorie estimates"}
                </h2>
                <p className="mt-1 max-w-lg text-[0.78rem] leading-relaxed text-white/55">
                  Energy cost scales with body mass, so without a weight we show
                  effort and duration only — we will not invent a figure. Stored
                  on this device, never sent anywhere.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex border border-white/15">
                {(["lb", "kg"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`meta px-2.5 py-2 text-[0.42rem] transition-colors ${
                      unit === u
                        ? "bg-lime text-black"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {u.toUpperCase()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                inputMode="decimal"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitWeight()}
                placeholder={weightKg ? displayWeight : `Weight in ${unit}`}
                className="h-10 w-28 border border-white/15 bg-white/[0.03] px-2.5 text-sm text-white placeholder:text-white/30 focus:border-lime focus:outline-none"
              />
              <button
                onClick={commitWeight}
                className="meta h-10 shrink-0 bg-lime px-3.5 text-[0.45rem] font-bold text-black transition-transform duration-150 active:scale-[0.97]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CATEGORY RAIL ════════════════════════════════════════════ */}
      <section className="sticky top-16 z-30 border-b border-white/10 bg-background/94 backdrop-blur-xl sm:top-[4.5rem]">
        <div className="container flex gap-1.5 overflow-x-auto py-3">
          <button
            onClick={() => setActiveCat("all")}
            className={`meta shrink-0 border px-3 py-2 text-[0.45rem] transition-colors duration-200 ${
              activeCat === "all"
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/12 text-white/55 hover:border-white/30 hover:text-white"
            }`}
          >
            All Modes
          </button>
          {CATEGORY_ORDER.map((cat) => {
            const count = CARDIO.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`meta flex shrink-0 items-center gap-2 border px-3 py-2 text-[0.45rem] transition-colors duration-200 ${
                  activeCat === cat
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-white/12 text-white/55 hover:border-white/30 hover:text-white"
                }`}
              >
                {CARDIO_CATEGORY_META[cat].label}
                <span className="text-[0.4rem] opacity-60">
                  {String(count).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ══ THE WALL ═════════════════════════════════════════════════ */}
      <div className="container py-9">
        {grouped.length === 0 && (
          <div className="border border-dashed border-white/15 px-6 py-16 text-center">
            <p className="display text-xl font-semibold text-white/45">
              Nothing matches that.
            </p>
            <p className="mt-2 text-sm text-white/40">
              Try a different term, or clear the search.
            </p>
          </div>
        )}

        {grouped.map((group, gi) => {
          const meta = CARDIO_CATEGORY_META[group.cat];
          return (
            <section key={group.cat} className={gi === 0 ? "" : "mt-12"}>
              {/* section header — inventory board rhythm */}
              <div className="mb-4">
                <div className="hazard-rule mb-4" />
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="meta text-[0.55rem] text-white/25">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <h2 className="display text-[1.7rem] font-bold uppercase leading-none text-white sm:text-[2.1rem]">
                      {meta.label}
                    </h2>
                  </div>
                  <span className="meta border border-white/15 px-2.5 py-1 text-[0.42rem] text-white/50">
                    {String(group.items.length).padStart(2, "0")} Modes
                  </span>
                </div>
                <p className="meta mt-2 text-[0.45rem] text-white/40">
                  {meta.blurb}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {group.items.map((c, i) => {
                  const mid = c.intensities[1] ?? c.intensities[0];
                  const est = estimateKcal(mid.met, 30, weightKg);
                  return (
                    <Link
                      key={c.slug}
                      href={`/cardio/${c.slug}`}
                      className="group relative border border-white/12 p-4 transition-colors duration-200 hover:border-lime/50"
                    >
                      <span className="tick left-0 top-0 border-l border-t" />
                      <span className="tick right-0 top-0 border-r border-t" />

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="meta mb-1.5 text-[0.4rem] text-white/30">
                            {String(i + 1).padStart(2, "0")} ·{" "}
                            {c.equipment}
                          </div>
                          <h3 className="display text-lg font-semibold leading-tight text-white transition-colors group-hover:text-lime">
                            {c.name}
                          </h3>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/25 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-lime" />
                      </div>

                      <p className="mt-2.5 text-[0.8rem] leading-relaxed text-white/55">
                        {c.summary}
                      </p>

                      {/* effort tiers as a MET strip */}
                      <div className="mt-3.5 flex divide-x divide-white/10 border-t border-white/10 pt-3">
                        {c.intensities.map((t) => (
                          <div key={t.label} className="flex-1 px-2 first:pl-0">
                            <div className="meta text-[0.38rem] text-white/40">
                              {t.label}
                            </div>
                            <div className="display mt-0.5 text-sm font-bold text-lime">
                              {t.met.toFixed(1)}
                              <span className="meta ml-1 text-[0.35rem] text-white/35">
                                MET
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {est !== null && (
                        <div className="meta mt-2.5 text-[0.4rem] text-white/40">
                          ≈ {Math.round(est)} kcal for 30 min at{" "}
                          {mid.label.toLowerCase()}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* ══ PROTOCOLS ═════════════════════════════════════════════ */}
        <section className="mt-14">
          <div className="hazard-rule mb-4" />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <span className="meta text-[0.55rem] text-white/25">
                {String(grouped.length + 1).padStart(2, "0")}
              </span>
              <h2 className="display text-[1.7rem] font-bold uppercase leading-none text-white sm:text-[2.1rem]">
                Interval Protocols
              </h2>
            </div>
            <span className="meta border border-white/15 px-2.5 py-1 text-[0.42rem] text-white/50">
              {String(PROTOCOLS.length).padStart(2, "0")} Structures
            </span>
          </div>
          <p className="meta mt-2 text-[0.45rem] text-white/40">
            Established structures you can apply to any mode above.
          </p>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {PROTOCOLS.map((p, i) => (
              <div
                key={p.slug}
                className="relative border border-white/12 p-4"
              >
                <span className="tick left-0 top-0 border-l border-t" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="meta mb-1.5 text-[0.4rem] text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="display text-lg font-semibold text-white">
                      {p.name}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 border border-lime/30 bg-lime/[0.06] px-2 py-1">
                    <Timer className="h-3 w-3 text-lime" />
                    <span className="meta text-[0.4rem] text-lime">
                      {p.duration}
                    </span>
                  </div>
                </div>

                <div className="mt-3 border-y border-white/10 py-2.5">
                  <div className="meta text-[0.38rem] text-white/40">
                    Structure
                  </div>
                  <div className="display mt-1 text-sm font-semibold text-lime">
                    {p.structure}
                  </div>
                </div>

                <p className="mt-3 text-[0.8rem] leading-relaxed text-white/60">
                  {p.detail}
                </p>
                <p className="mt-2.5 text-[0.75rem] leading-relaxed text-white/40">
                  {p.origin}
                </p>
                <p className="meta mt-2.5 text-[0.4rem] text-lime/70">
                  Best on: {p.suits}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SOURCE NOTE ═══════════════════════════════════════════ */}
        <div className="mt-12 flex gap-3 border border-white/12 bg-white/[0.02] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
          <div>
            <p className="text-[0.8rem] leading-relaxed text-white/60">
              MET values are taken from the{" "}
              <a
                href="https://pacompendium.com/"
                target="_blank"
                rel="noreferrer"
                className="text-lime/85 underline decoration-lime/30 underline-offset-2"
              >
                2024 Adult Compendium of Physical Activities
              </a>
              , the standard reference for the energy cost of human activity.
              Calories are estimated as MET × bodyweight × hours.
            </p>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-white/40">
              These are population averages. Your own cost varies with fitness,
              efficiency, terrain and body composition, so treat every figure as
              an estimate rather than a measurement — it will not match a watch
              exactly, and neither is exact.
            </p>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
      <footer className="mt-6 border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8">
          <p className="display text-sm font-semibold text-lime">
            Stay consistent. Stay disciplined. Build the body.
          </p>
          <p className="meta mt-2 text-[0.42rem] text-white/35">
            © 2024 Build The Body · General reference information, not medical
            or individual exercise advice
          </p>
        </div>
      </footer>
    </div>
  );
}
