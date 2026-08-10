/**
 * Cardio session page — one mode, with technique, mistakes and a logger.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"): numbered bands, hairline rules,
 * mono uppercase labels, lime for state and one primary action.
 *
 * HONESTY RULE: the calorie figure only appears once a bodyweight exists, and it
 * is always labelled as an estimate with the Compendium MET shown beside it, so
 * the member can see exactly where the number came from.
 */
import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ClipboardList,
  Flame,
  Info,
  Minus,
  Plus,
  Scale,
  Timer,
} from "lucide-react";
import { CARDIO_CATEGORY_META, estimateKcal, getCardio } from "@/lib/cardio";
import {
  LB_PER_KG,
  loadCardioLog,
  loadWeightKg,
  saveCardioLog,
  saveWeightKg,
  type CardioEntry,
} from "@/lib/cardioLog";
import { todayKey, newId } from "@/lib/tracker";

const PRESET_MINUTES = [10, 15, 20, 30, 45, 60];

export default function CardioSession() {
  const { slug } = useParams<{ slug: string }>();
  const exercise = getCardio(slug ?? "");

  const [tier, setTier] = useState(1);
  const [minutes, setMinutes] = useState(30);
  const [weightKg, setWeightKg] = useState<number | null>(() => loadWeightKg());
  const [weightInput, setWeightInput] = useState("");
  const [unit, setUnit] = useState<"kg" | "lb">("lb");
  const [logged, setLogged] = useState(false);

  const intensity = exercise?.intensities[tier] ?? exercise?.intensities[0];

  const kcal = useMemo(
    () =>
      intensity ? estimateKcal(intensity.met, minutes, weightKg) : null,
    [intensity, minutes, weightKg],
  );

  function commitWeight() {
    const raw = Number(weightInput);
    if (!raw || raw <= 0) return;
    const kg = unit === "kg" ? raw : raw / LB_PER_KG;
    const rounded = Math.round(kg * 10) / 10;
    setWeightKg(rounded);
    saveWeightKg(rounded);
    setWeightInput("");
  }

  function logSession() {
    if (!exercise || !intensity) return;
    const entry: CardioEntry = {
      id: newId(),
      slug: exercise.slug,
      name: exercise.name,
      intensity: intensity.label,
      met: intensity.met,
      minutes,
      kcal: kcal === null ? null : Math.round(kcal),
    };
    const log = loadCardioLog();
    const key = todayKey();
    log[key] = [...(log[key] ?? []), entry];
    saveCardioLog(log);
    setLogged(true);
    window.setTimeout(() => setLogged(false), 2600);
  }

  if (!exercise) {
    return (
      <div className="min-h-screen">
        <SiteNav active="cardio" />
        <div className="container py-20 text-center">
          <p className="display text-2xl font-semibold text-white/50">
            That cardio mode does not exist.
          </p>
          <Link
            href="/cardio"
            className="meta mt-5 inline-flex items-center gap-2 border border-lime/40 bg-lime/8 px-4 py-2.5 text-[0.5rem] text-lime"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to cardio index
          </Link>
        </div>
      </div>
    );
  }

  const meta = CARDIO_CATEGORY_META[exercise.category];

  return (
    <div className="min-h-screen">
      <SiteNav active="cardio">
        <Link
          href="/cardio"
          className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="meta text-[0.5rem]">All Cardio</span>
        </Link>
      </SiteNav>

      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7 sm:py-9">
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <span className="meta border border-lime/40 bg-lime/8 px-2.5 py-1 text-[0.42rem] text-lime">
              {meta.label}
            </span>
            <span className="meta border border-white/15 px-2.5 py-1 text-[0.42rem] text-white/55">
              {exercise.equipment}
            </span>
          </div>
          <h1 className="display text-[2.2rem] font-bold uppercase leading-[0.9] text-white sm:text-[3rem]">
            {exercise.name}
          </h1>
          <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-white/65">
            {exercise.summary}
          </p>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
          {/* ── LEFT: coaching content ──────────────────────────── */}
          <div className="min-w-0 space-y-8">
            {/* effort tiers */}
            <section>
              <div className="mb-3.5 flex items-baseline gap-3">
                <span className="meta text-[0.5rem] text-white/25">01</span>
                <h2 className="display text-xl font-bold uppercase text-white">
                  Effort Tiers
                </h2>
              </div>
              <div className="divide-y divide-white/10 border border-white/12">
                {exercise.intensities.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setTier(i)}
                    className={`flex w-full items-start gap-3.5 p-3.5 text-left transition-colors duration-200 ${
                      i === tier ? "bg-lime/[0.07]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-9 w-[3px] shrink-0 ${
                        i === tier ? "bg-lime" : "bg-white/12"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-2.5">
                        <span
                          className={`display text-base font-semibold ${
                            i === tier ? "text-lime" : "text-white"
                          }`}
                        >
                          {t.label}
                        </span>
                        <span className="meta text-[0.42rem] text-white/45">
                          {t.met.toFixed(1)} MET
                        </span>
                      </span>
                      <span className="mt-1 block text-[0.8rem] leading-relaxed text-white/60">
                        {t.effort}
                      </span>
                      <span className="meta mt-1.5 block text-[0.38rem] text-white/30">
                        Compendium: {t.source}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* technique */}
            <section>
              <div className="mb-3.5 flex items-baseline gap-3">
                <span className="meta text-[0.5rem] text-white/25">02</span>
                <h2 className="display text-xl font-bold uppercase text-white">
                  Technique
                </h2>
              </div>
              <ol className="border border-white/12 divide-y divide-white/10">
                {exercise.technique.map((t, i) => (
                  <li key={i} className="flex gap-3.5 p-3.5">
                    <span className="meta shrink-0 text-[0.45rem] text-lime">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.85rem] leading-relaxed text-white/75">
                      {t}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* mistakes */}
            <section>
              <div className="mb-3.5 flex items-baseline gap-3">
                <span className="meta text-[0.5rem] text-white/25">03</span>
                <h2 className="display text-xl font-bold uppercase text-white">
                  Common Mistakes
                </h2>
              </div>
              <ul className="border border-white/12 divide-y divide-white/10">
                {exercise.mistakes.map((m, i) => (
                  <li key={i} className="flex gap-3.5 p-3.5">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime/70" />
                    <span className="text-[0.85rem] leading-relaxed text-white/70">
                      {m}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* impact + starter */}
            <section className="grid gap-3 sm:grid-cols-2">
              <div className="relative border border-white/12 p-4">
                <span className="tick left-0 top-0 border-l border-t" />
                <div className="meta mb-2 text-[0.42rem] text-lime">
                  Joint Impact
                </div>
                <p className="text-[0.82rem] leading-relaxed text-white/65">
                  {exercise.impact}
                </p>
              </div>
              <div className="relative border border-lime/30 bg-lime/[0.04] p-4">
                <span className="tick left-0 top-0 border-l border-t opacity-100" />
                <div className="meta mb-2 text-[0.42rem] text-lime">
                  Start Here Today
                </div>
                <p className="text-[0.82rem] leading-relaxed text-white/75">
                  {exercise.starter}
                </p>
              </div>
            </section>
          </div>

          {/* ── RIGHT: session logger ───────────────────────────── */}
          <aside className="lg:sticky lg:top-24">
            <div className="relative border border-white/15">
              <span className="tick left-0 top-0 border-l border-t opacity-100" />
              <span className="tick right-0 top-0 border-r border-t opacity-100" />

              <div className="border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-3.5 w-3.5 text-lime" />
                  <span className="meta text-[0.45rem] text-lime">
                    Log this session
                  </span>
                </div>
              </div>

              <div className="p-4">
                {/* duration */}
                <div className="meta mb-2 text-[0.4rem] text-white/45">
                  Duration
                </div>
                <div className="flex items-stretch border border-white/15">
                  <button
                    onClick={() => setMinutes((m) => Math.max(1, m - 5))}
                    aria-label="Less time"
                    className="flex w-10 items-center justify-center border-r border-white/15 text-white/60 transition-colors hover:text-lime"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex flex-1 items-center justify-center gap-1.5 py-2.5">
                    <Timer className="h-3.5 w-3.5 text-white/35" />
                    <span className="display text-lg font-bold text-white">
                      {minutes}
                    </span>
                    <span className="meta text-[0.4rem] text-white/40">min</span>
                  </div>
                  <button
                    onClick={() => setMinutes((m) => Math.min(300, m + 5))}
                    aria-label="More time"
                    className="flex w-10 items-center justify-center border-l border-white/15 text-white/60 transition-colors hover:text-lime"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PRESET_MINUTES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMinutes(m)}
                      className={`meta border px-2 py-1 text-[0.4rem] transition-colors ${
                        minutes === m
                          ? "border-lime text-lime"
                          : "border-white/12 text-white/45 hover:border-white/30"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* selected effort echo */}
                <div className="mt-4 border-t border-white/10 pt-3.5">
                  <div className="meta mb-1.5 text-[0.4rem] text-white/45">
                    Effort
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="display text-base font-semibold text-lime">
                      {intensity?.label}
                    </span>
                    <span className="meta text-[0.42rem] text-white/40">
                      {intensity?.met.toFixed(1)} MET
                    </span>
                  </div>
                </div>

                {/* estimate, or the honest absence of one */}
                {kcal !== null ? (
                  <div className="mt-4 border border-lime/30 bg-lime/[0.05] p-3.5">
                    <div className="flex items-center gap-2">
                      <Flame className="h-3.5 w-3.5 text-lime" />
                      <span className="meta text-[0.4rem] text-lime">
                        Estimated cost
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="display text-3xl font-bold leading-none text-lime">
                        {Math.round(kcal)}
                      </span>
                      <span className="meta text-[0.45rem] text-white/50">
                        kcal
                      </span>
                    </div>
                    <p className="meta mt-2 text-[0.38rem] leading-relaxed text-white/40">
                      {intensity?.met.toFixed(1)} MET ×{" "}
                      {weightKg?.toFixed(1)} kg × {(minutes / 60).toFixed(2)} h
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 border border-white/20 p-3.5">
                    <div className="flex items-center gap-2">
                      <Scale className="h-3.5 w-3.5 text-lime" />
                      <span className="meta text-[0.4rem] text-lime">
                        Bodyweight needed
                      </span>
                    </div>
                    <p className="mt-2 text-[0.76rem] leading-relaxed text-white/55">
                      Energy cost scales with mass. Enter your weight and the
                      estimate appears — we will not guess it for you.
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <div className="flex border border-white/15">
                        {(["lb", "kg"] as const).map((u) => (
                          <button
                            key={u}
                            onClick={() => setUnit(u)}
                            className={`meta px-2 py-1.5 text-[0.4rem] transition-colors ${
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
                        placeholder={unit}
                        className="h-8 min-w-0 flex-1 border border-white/15 bg-white/[0.03] px-2 text-sm text-white placeholder:text-white/30 focus:border-lime focus:outline-none"
                      />
                      <button
                        onClick={commitWeight}
                        className="meta h-8 shrink-0 border border-lime/40 bg-lime/10 px-2.5 text-[0.4rem] text-lime"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={logSession}
                  className="mt-4 flex w-full items-center justify-center gap-2 bg-lime px-4 py-3 text-background transition-transform duration-150 active:scale-[0.97]"
                >
                  {logged ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="display text-sm font-bold">
                        Logged for today
                      </span>
                    </>
                  ) : (
                    <span className="display text-sm font-bold">
                      Log {minutes} min
                    </span>
                  )}
                </button>

                <Link
                  href="/nutrition/tracker"
                  className="meta mt-2.5 flex items-center justify-center gap-2 border border-white/15 px-3 py-2.5 text-[0.42rem] text-white/60 transition-colors hover:border-lime hover:text-lime"
                >
                  View today in the tracker
                </Link>

                <div className="mt-3.5 flex gap-2 border-t border-white/10 pt-3">
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-white/30" />
                  <p className="text-[0.68rem] leading-relaxed text-white/40">
                    Estimated from the 2024 Adult Compendium. Burned calories are
                    kept separate from what you eat — we never net them off.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="mt-8 border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7">
          <Link
            href="/cardio"
            className="meta inline-flex items-center gap-2 border border-white/15 px-3.5 py-2.5 text-[0.45rem] text-white/60 transition-colors hover:border-lime hover:text-lime"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All cardio modes
          </Link>
        </div>
      </footer>
    </div>
  );
}
