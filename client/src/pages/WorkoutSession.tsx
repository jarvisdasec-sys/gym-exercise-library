/**
 * WorkoutSession — a single training day, run top to bottom. `/workouts/:slug`
 *
 * This is used ON THE GYM FLOOR, mid-session, on a phone. So:
 *  - The movement list is the page. No hero, minimal chrome above it.
 *  - Every row is tappable and opens that exercise's blueprint.
 *  - Set-tracking checkboxes let a member mark off completed work as they go
 *    (session-local only — nothing is stored server-side).
 *
 * STYLE CONTRACT (ideas.md): lime hairlines, mono numerals, hazard rule per
 * section, corner registration ticks, coach-direct imperative copy.
 */

import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Link, useParams } from "wouter";
import { Check, Clock, Layers, Printer, RotateCcw, TriangleAlert } from "lucide-react";
import { INDEXED_EXERCISES } from "@/lib/exercises";
import { WORKOUTS, getWorkout, totalExercises, totalSets } from "@/lib/workouts";
import { getProgramWorkout } from "@/lib/programs";

export default function WorkoutSession() {
  const params = useParams<{
    slug?: string;
    programId?: string;
    week?: string;
    day?: string;
  }>();
  const programWorkout = useMemo(
    () =>
      params.programId
        ? getProgramWorkout(
            params.programId,
            Number(params.week),
            Number(params.day),
          )
        : null,
    [params.day, params.programId, params.week],
  );
  const workout = useMemo(
    () => programWorkout?.workout ?? (params.slug ? getWorkout(params.slug) : null),
    [params.slug, programWorkout],
  );

  /** Completed movement keys, e.g. "0-2". Session-local, resets on reload. */
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (!workout) {
    return (
      <div className="flex min-h-screen flex-col">
        <SessionBar />
        <div className="container flex flex-1 flex-col items-start justify-center py-24">
          <p className="display text-3xl font-bold text-white">
            Session not found
          </p>
          <Link
            href="/workouts"
            className="mt-7 bg-lime px-5 py-3 transition-colors duration-200 hover:bg-lime-dim"
          >
            <span className="meta text-[0.55rem] font-bold text-black">
              All sessions
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const moves = totalExercises(workout);
  const sets = totalSets(workout);
  const completed = done.size;
  const pct = moves > 0 ? Math.round((completed / moves) * 100) : 0;

  const others = WORKOUTS.filter((w) => w.slug !== workout.slug).slice(0, 4);

  return (
    <div className="min-h-screen">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 14mm; }
          html, body { background: #fff !important; }
          body { background-image: none !important; }
          .no-print { display: none !important; }
          .p-sheet, .p-sheet * {
            background: transparent !important;
            color: #000 !important;
            border-color: #999 !important;
          }
          .p-row { break-inside: avoid; }
        }
      `}</style>

      <SessionBar />

      {/* ══ SESSION HEADER ═══════════════════════════════════════════ */}
      <div className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="meta border border-lime/40 bg-lime/10 px-2 py-1 text-[0.42rem] text-lime">
                  {workout.tag}
                </span>
                <span className="meta border border-white/15 px-2 py-1 text-[0.42rem] text-white/55">
                  {workout.level}
                </span>
              </div>

              <h1 className="display mt-3.5 text-[2rem] font-bold leading-none text-white sm:text-[3rem]">
                {workout.name}
              </h1>
              <p className="meta mt-2.5 text-[0.5rem] text-lime/75">
                {workout.focus}
              </p>
            </div>

            <div className="no-print flex shrink-0 items-stretch gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 border border-white/15 px-3.5 transition-colors duration-200 hover:border-lime hover:text-lime"
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="meta text-[0.5rem]">Print</span>
              </button>
              {completed > 0 && (
                <button
                  onClick={() => setDone(new Set())}
                  className="flex items-center gap-2 border border-white/15 px-3.5 transition-colors duration-200 hover:border-lime hover:text-lime"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="meta text-[0.5rem]">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* readout */}
          <div className="mt-6 grid grid-cols-3 border border-white/12 divide-x divide-white/12 sm:max-w-lg">
            {[
              { icon: Layers, n: String(moves), l: "Movements" },
              { icon: Layers, n: String(sets), l: "Working Sets" },
              { icon: Clock, n: workout.duration, l: "Duration" },
            ].map((s, i) => (
              <div key={i} className="px-4 py-3">
                <div className="meta text-base font-bold text-lime">{s.n}</div>
                <div className="meta mt-1.5 text-[0.4rem] text-white/50">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/60">
            {workout.intent}
          </p>

          {/* progress */}
          {completed > 0 && (
            <div className="no-print mt-5 sm:max-w-lg">
              <div className="flex items-center justify-between">
                <span className="meta text-[0.42rem] text-lime">
                  {completed} of {moves} done
                </span>
                <span className="meta text-[0.42rem] text-white/45">
                  {pct}%
                </span>
              </div>
              <div className="mt-2 h-1 w-full bg-white/10">
                <div
                  className="h-full bg-lime transition-[width] duration-200"
                  style={{
                    width: `${pct}%`,
                    transitionTimingFunction: "var(--ease-out-snap)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ THE SHEET ════════════════════════════════════════════════ */}
      <div className="container py-8">
        <div className="p-sheet flex flex-col gap-9 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            {programWorkout && (
              <RoutineSteps title="Warm-up" items={programWorkout.warmup} />
            )}
            {workout.blocks.map((block, bi) => (
              <section key={bi} className="mb-9 last:mb-0">
                <div className="hazard-rule mb-3" />
                <div className="flex items-baseline gap-3">
                  <span className="meta shrink-0 text-[0.5rem] font-bold text-lime/55">
                    {String(bi + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display text-xl font-bold leading-none text-white sm:text-2xl">
                    {block.title}
                  </h2>
                </div>
                <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-white/55">
                  {block.note}
                </p>

                <div className="mt-4 flex flex-col">
                  {block.items.map((item, ii) => {
                    const ex = INDEXED_EXERCISES.find(
                      (e) => e.slug === item.slug,
                    );
                    if (!ex) return null;
                    const key = `${bi}-${ii}`;
                    const isDone = done.has(key);

                    return (
                      <div
                        key={key}
                        className={`p-row group relative flex gap-3 border-b border-white/10 py-3.5 transition-colors duration-200 ${
                          isDone ? "opacity-45" : ""
                        }`}
                      >
                        {/* check-off control */}
                        <button
                          onClick={() => toggle(key)}
                          className={`no-print mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition-colors duration-200 ${
                            isDone
                              ? "border-lime bg-lime"
                              : "border-white/25 hover:border-lime"
                          }`}
                          aria-label={
                            isDone
                              ? `Mark ${ex.name} incomplete`
                              : `Mark ${ex.name} complete`
                          }
                          aria-pressed={isDone}
                        >
                          {isDone && (
                            <Check className="h-3.5 w-3.5 text-black" />
                          )}
                        </button>

                        {/* thumbnail */}
                        <Link
                          href={`/e/${ex.slug}`}
                          className="relative hidden shrink-0 overflow-hidden border border-white/12 transition-colors duration-200 hover:border-lime sm:block"
                          style={{ width: 56, height: 70 }}
                        >
                          <img
                            src={ex.image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover object-top"
                          />
                        </Link>

                        {/* detail */}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/e/${ex.slug}`}
                            className="flex items-baseline gap-2"
                          >
                            <span className="meta shrink-0 text-[0.42rem] font-bold text-lime/55">
                              {ex.plate}
                            </span>
                            <h3
                              className={`display truncate text-[1.05rem] font-semibold leading-tight transition-colors duration-200 hover:text-lime ${
                                isDone
                                  ? "text-white/60 line-through"
                                  : "text-white"
                              }`}
                            >
                              {ex.name}
                            </h3>
                          </Link>

                          {/* prescription */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Spec label="Sets" value={item.sets} lime />
                            <Spec label="Reps" value={item.reps} />
                            <Spec label="Rest" value={item.rest} />
                          </div>

                          <p className="mt-2.5 text-xs leading-relaxed text-white/50">
                            <span className="meta text-[0.4rem] text-lime">
                              Cue ·{" "}
                            </span>
                            {item.cue}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
            {programWorkout && (
              <RoutineSteps title="Cooldown" items={programWorkout.cooldown} />
            )}
          </div>

          {/* ── side column: session rules ───────────────────────────── */}
          <aside className="w-full shrink-0 lg:w-[280px]">
            <div className="relative border border-lime/35 p-4">
              <span className="absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 border-lime" />
              <span className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-lime" />
              <div className="flex items-center gap-2">
                <TriangleAlert className="h-3.5 w-3.5 text-lime" />
                <span className="meta text-[0.45rem] font-bold text-lime">
                  Run it like this
                </span>
              </div>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {workout.rules.map((r, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="meta mt-0.5 shrink-0 text-[0.42rem] text-lime/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs leading-relaxed text-white/60">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="no-print mt-3 border border-white/12 p-4">
              <p className="display text-sm font-semibold leading-snug text-lime">
                Stay consistent.
                <br />
                Stay disciplined.
                <br />
                Build the body.
              </p>
              <p className="meta mt-3 text-[0.4rem] leading-relaxed text-muted-foreground">
                Tap any movement to open its blueprint. Tick it off as you go.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ══ OTHER SESSIONS ═══════════════════════════════════════════ */}
      <div className="no-print container pb-14">
        <div className="hazard-rule mb-3" />
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-xl font-bold text-white sm:text-2xl">
            Other sessions
          </h2>
          <Link
            href="/workouts"
            className="meta shrink-0 border border-lime/35 px-2.5 py-1 text-[0.45rem] text-lime transition-colors hover:bg-lime/10"
          >
            All sessions
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((w) => (
            <Link
              key={w.slug}
              href={`/workouts/${w.slug}`}
              className="group border border-white/12 p-4 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-lime"
            >
              <h3 className="display text-base font-semibold text-white transition-colors duration-200 group-hover:text-lime">
                {w.name}
              </h3>
              <p className="meta mt-1.5 text-[0.4rem] text-white/45">
                {w.focus}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7">
          <p className="meta text-[0.42rem] text-muted-foreground">
            © 2024 Build The Body (BTB) · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

function SessionBar() {
  return (
    <SiteNav active="workouts">
      <Link
        href="/workouts"
        className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
      >
        <span className="meta text-[0.5rem]">All Sessions</span>
      </Link>
    </SiteNav>
  );
}

function Spec({
  label,
  value,
  lime = false,
}: {
  label: string;
  value: string;
  lime?: boolean;
}) {
  return (
    <span
      className={`meta flex items-baseline gap-1.5 border px-2 py-1 text-[0.42rem] ${
        lime ? "border-lime/40 bg-lime/8" : "border-white/15"
      }`}
    >
      <span className={lime ? "text-lime/70" : "text-white/40"}>{label}</span>
      <span className={lime ? "font-bold text-lime" : "text-white/75"}>
        {value}
      </span>
    </span>
  );
}

function RoutineSteps({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mb-9 last:mb-0">
      <div className="hazard-rule mb-3" />
      <h2 className="display text-xl font-bold leading-none text-white sm:text-2xl">
        {title}
      </h2>
      <ol className="mt-4 grid gap-2 border-y border-white/10 py-4">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 text-xs leading-relaxed text-white/60">
            <span className="meta shrink-0 text-[0.42rem] text-lime/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}
