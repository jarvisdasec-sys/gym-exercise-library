/**
 * Workouts — the session index. `/workouts`
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Same industrial index language as the plate wall: lime hairlines, mono
 *    numerals, hazard rules, corner registration ticks.
 *  - Sessions are listed as ROUTINE CARDS on a board, not marketing tiles.
 *  - Copy stays coach-direct and imperative. No hype.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { ArrowRight, Clock, Layers } from "lucide-react";
import { INDEXED_EXERCISES } from "@/lib/exercises";
import {
  WORKOUTS,
  totalExercises,
  totalSets,
  type SplitTag,
} from "@/lib/workouts";

const TAGS: (SplitTag | "All")[] = [
  "All",
  "Push",
  "Pull",
  "Shoulders",
  "Legs",
  "Arms",
  "Full Body",
  "Core",
];

/** Suggested weekly structures assembled from the sessions above. */
const SPLITS = [
  {
    name: "Push / Pull / Legs",
    days: "6 days",
    note: "Highest volume. Run each session twice a week.",
    sequence: ["push-day", "pull-day", "legs-and-glutes"],
  },
  {
    name: "Upper / Lower",
    days: "4 days",
    note: "Best balance of volume and recovery for most people.",
    sequence: ["upper-body", "lower-body"],
  },
  {
    name: "Bro Split",
    days: "5 days",
    note: "One body part per day. Maximum focus per muscle.",
    sequence: [
      "push-day",
      "pull-day",
      "shoulder-day",
      "legs-and-glutes",
      "arm-day",
    ],
  },
  {
    name: "Full Body",
    days: "3 days",
    note: "Start here if you are new. Every muscle, every session.",
    sequence: ["full-body-starter", "machine-circuit"],
  },
];

export default function Workouts() {
  const [tag, setTag] = useState<SplitTag | "All">("All");

  const list = useMemo(
    () => (tag === "All" ? WORKOUTS : WORKOUTS.filter(w => w.tag === tag)),
    [tag]
  );

  return (
    <div className="min-h-screen">
      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <SiteNav active="workouts" />

      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8 sm:py-10">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              Session Index · Rev. 01
            </span>
          </div>

          <h1 className="display text-[2.5rem] font-bold leading-[0.88] text-white sm:text-[3.5rem]">
            Pick a day.
            <br />
            <span className="text-lime">Run the sheet.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
            Each session lists the movements in order, with sets, reps, rest and
            the cue that matters. Every exercise links to its blueprint. Work
            top to bottom.
          </p>
          <Link
            href="/workouts/tools"
            className="meta mt-5 inline-flex border border-lime bg-lime px-4 py-3 text-[0.5rem] font-bold text-black"
          >
            Open Workout Tools
          </Link>

          <div className="mt-7 grid max-w-lg grid-cols-3 border border-white/12 divide-x divide-white/12">
            {[
              { n: String(WORKOUTS.length), l: "Sessions" },
              { n: String(INDEXED_EXERCISES.length), l: "Plates Used" },
              { n: String(SPLITS.length), l: "Weekly Splits" },
            ].map(s => (
              <div key={s.l} className="px-4 py-3.5">
                <div className="meta text-xl font-bold text-lime">{s.n}</div>
                <div className="meta mt-1.5 text-[0.42rem] text-white/50">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SESSION BOARD ════════════════════════════════════════════ */}
      <div className="container py-9">
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          {TAGS.map(t => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`border px-2.5 py-1.5 transition-colors duration-200 ${
                tag === t
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-white/12 text-white/55 hover:border-white/40 hover:text-white"
              }`}
            >
              <span className="meta text-[0.45rem]">{t}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((w, i) => (
            <Link
              key={w.slug}
              href={`/workouts/${w.slug}`}
              className="group rise-in relative flex flex-col border border-white/12 bg-plate p-5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-lime"
              style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
            >
              <span className="tick top-1 left-1 border-t-2 border-l-2" />
              <span className="tick bottom-1 right-1 border-b-2 border-r-2" />

              <div className="flex items-start justify-between gap-3">
                <span className="meta text-[0.5rem] font-bold text-lime/55">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="meta border border-white/15 px-1.5 py-0.5 text-[0.4rem] text-white/50">
                  {w.level}
                </span>
              </div>

              <h2 className="display mt-3 text-[1.5rem] font-bold leading-none text-white transition-colors duration-200 group-hover:text-lime">
                {w.name}
              </h2>

              <p className="meta mt-2 text-[0.45rem] text-lime/75">{w.focus}</p>

              <p className="mt-3.5 flex-1 text-sm leading-relaxed text-white/60">
                {w.summary}
              </p>

              <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-3.5">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-lime" />
                  <span className="meta text-[0.42rem] text-white/55">
                    {totalExercises(w)} moves · {totalSets(w)} sets
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-lime" />
                  <span className="meta text-[0.42rem] text-white/55">
                    {w.duration}
                  </span>
                </span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-white/30 transition-colors duration-200 group-hover:text-lime" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ WEEKLY SPLITS ════════════════════════════════════════════ */}
      <div className="container pb-14">
        <div className="hazard-rule mb-3" />
        <h2 className="display text-2xl font-bold text-white sm:text-3xl">
          Build the week
        </h2>
        <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/60">
          Four ways to arrange the sessions above. Pick the one that matches how
          many days you can train, then repeat it.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SPLITS.map(s => (
            <div key={s.name} className="border border-white/12 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="display text-base font-semibold text-white">
                  {s.name}
                </h3>
                <span className="meta shrink-0 border border-lime/35 px-1.5 py-0.5 text-[0.4rem] text-lime">
                  {s.days}
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-white/55">
                {s.note}
              </p>
              <div className="mt-3.5 flex flex-col gap-1.5 border-t border-white/10 pt-3">
                {s.sequence.map(slug => {
                  const w = WORKOUTS.find(x => x.slug === slug);
                  if (!w) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/workouts/${slug}`}
                      className="meta flex items-center justify-between gap-2 text-[0.42rem] text-white/60 transition-colors hover:text-lime"
                    >
                      <span className="truncate">{w.name}</span>
                      <ArrowRight className="h-2.5 w-2.5 shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="container py-10 sm:py-12">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              Recovery Protocol
            </span>
          </div>
          <h2 className="display text-2xl font-bold leading-none text-white sm:text-3xl">
            Off-Day <span className="text-lime">Optimization.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Rest days are training support days. Lower fatigue, keep the basic
            habits intact, and show up ready for the next hard session.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Move Light",
                "Walk 20–40 minutes at a conversational pace. Add easy mobility for the joints and positions that felt restricted in training.",
              ],
              [
                "Keep Protein In",
                "Recovery still needs building material. Keep protein consistent with training days and build meals around whole-food staples.",
              ],
              [
                "Hydrate on Purpose",
                "Carry water, salt meals appropriately for your needs, and use urine color plus thirst as practical signals—not a punishment target.",
              ],
              [
                "Protect Sleep + CNS",
                "Reduce late stimulants, keep a repeatable wind-down, and prioritize a full night after demanding work. Recovery is where adaptation lands.",
              ],
            ].map(([title, copy], index) => (
              <article
                key={title}
                className="relative border border-white/12 bg-background p-4"
              >
                <span className="meta text-[0.45rem] text-lime/60">
                  0{index + 1}
                </span>
                <h3 className="display mt-3 text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="display text-sm font-semibold text-lime">
            Stay consistent. Stay disciplined. Build the body.
          </p>
          <p className="meta text-[0.42rem] text-muted-foreground">
            © 2024 Build The Body (BTB) · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
