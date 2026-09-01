import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import WorkoutTimer from "@/components/WorkoutTimer";
import { EXERCISES } from "@/lib/exercises";
import {
  completeWorkout,
  generateWorkout,
  initialReadiness,
  options,
  readState,
  removeSaved,
  saveWorkout,
  swapExercise,
  updateChallenge,
  type Readiness,
  type ToolWorkout,
} from "@/lib/workoutTools";
const tabs = [
  "Generator",
  "Timers",
  "Saved & History",
  "Challenges",
  "Programs",
] as const;
type Tab = (typeof tabs)[number];
const programs = [
  ["Beginner Fitness", "4 weeks · 3 days"],
  ["Fat Loss", "6 weeks · 4 days"],
  ["Muscle Gain", "8 weeks · 4 days"],
  ["Strength", "12 weeks · 3 days"],
  ["Conditioning", "6 weeks · 4 days"],
];
const challenges = [
  ["daily", "Daily movement", 10, "minutes"],
  ["weekly", "Weekly controlled squats", 100, "reps"],
  ["monthly", "Monthly training", 600, "minutes"],
] as const;
export default function WorkoutTools() {
  const [tab, setTab] = useState<Tab>("Generator"),
    [input, setInput] = useState<Readiness>(initialReadiness),
    [workout, setWorkout] = useState<ToolWorkout | null>(null),
    [state, setState] = useState(readState),
    [notice, setNotice] = useState(""),
    [performance, setPerformance] = useState<Record<string, string>>({});
  const equipment = useMemo(
    () => ["All Equipment", ...Array.from(new Set(EXERCISES.map(x => x.equipment)))],
    []
  );
  const update = (key: keyof Readiness, value: string | number) =>
    setInput(v => ({ ...v, [key]: value }));
  const generate = () => {
    const next = generateWorkout(EXERCISES, input);
    setWorkout(next);
    setNotice(
      next
        ? "Workout generated from the BTB exercise library."
        : "No movements match those selections."
    );
  };
  const share = () =>
    workout &&
    navigator
      .share?.({
        title: workout.title,
        text: workout.exercises.map(x => x.name).join(", "),
      })
      .catch(() => {});
  return (
    <div className="min-h-screen">
      <SiteNav active="workouts" />
      <header className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8">
          <p className="meta text-[0.45rem] text-lime">
            Workout Tools · Rev. 01
          </p>
          <h1 className="display mt-3 text-4xl font-bold text-white sm:text-5xl">
            Build today&apos;s <span className="text-lime">session.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/60">
            Generate, time, save, complete, and track a workout using the
            production BTB exercise library.
          </p>
        </div>
      </header>
      <main className="container py-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {tabs.map(x => (
            <button
              key={x}
              aria-pressed={tab === x}
              className={`meta whitespace-nowrap border px-3 py-2 text-[0.48rem] ${tab === x ? "border-lime bg-lime/10 text-lime" : "border-white/15 text-white/60"}`}
              onClick={() => setTab(x)}
            >
              {x}
            </button>
          ))}
          <Link
            href="/workouts/builder"
            className="meta whitespace-nowrap border border-lime bg-lime px-3 py-2 text-[0.48rem] font-bold text-black"
          >
            Build your own
          </Link>
        </div>
        {tab === "Generator" && (
          <section className="border border-white/12 bg-plate p-5 sm:p-7">
            <h2 className="display text-2xl font-bold text-white">
              Workout generator
            </h2>
            <p className="mt-2 text-xs text-white/55">
              Readiness inputs adjust training volume and intensity. They do not
              diagnose injury.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                label="Goal"
                value={input.goal}
                items={options.goals}
                onChange={v => update("goal", v)}
              />
              <Select
                label="Experience"
                value={input.level}
                items={options.levels}
                onChange={v => update("level", v)}
              />
              <Select
                label="Duration"
                value={String(input.duration)}
                items={options.durations.map(String)}
                onChange={v => update("duration", Number(v))}
              />
              <Select
                label="Body focus"
                value={input.focus}
                items={options.focus}
                onChange={v => update("focus", v)}
              />
              <Select
                label="Equipment"
                value={input.equipment}
                items={equipment}
                onChange={v => update("equipment", v)}
              />
              <Select
                label="Energy"
                value={input.energy}
                items={options.energy}
                onChange={v => update("energy", v)}
              />
              <Select
                label="Soreness"
                value={input.soreness}
                items={options.soreness}
                onChange={v => update("soreness", v)}
              />
              <Select
                label="Available intensity"
                value={input.intensity}
                items={options.intensity}
                onChange={v => update("intensity", v)}
              />
            </div>
            <button
              className="meta mt-5 bg-lime px-5 py-3 text-[0.5rem] font-bold text-black"
              onClick={generate}
            >
              Generate complete workout
            </button>
            {notice && (
              <p role="status" className="mt-3 text-sm text-lime">
                {notice}
              </p>
            )}
            {workout && (
              <Generated
                workout={workout}
                performance={performance}
                setPerformance={setPerformance}
                onSwap={i => setWorkout(swapExercise(workout, i, EXERCISES))}
                onSave={() => {
                  setState(saveWorkout(workout));
                  setNotice("Workout saved on this device.");
                }}
                onComplete={() => {
                  setState(completeWorkout(workout, performance));
                  setNotice("Workout marked complete and added to history.");
                }}
                onShare={share}
              />
            )}
          </section>
        )}
        {tab === "Timers" && <WorkoutTimer />}
        {tab === "Saved & History" && (
          <section className="grid gap-6 lg:grid-cols-2">
            <List
              title="Saved workouts"
              empty="No saved workouts yet."
              items={state.saved}
              action={x => (
                <button
                  className="text-lime"
                  onClick={() => setState(removeSaved(x.id))}
                >
                  Remove
                </button>
              )}
            />
            <List
              title="Workout history"
              empty="No completed workouts yet."
              items={state.history}
            />
          </section>
        )}
        {tab === "Challenges" && (
          <section className="grid gap-4 md:grid-cols-3">
            {challenges.map(([id, title, goal, unit]) => {
              const value = state.challenges[id] || 0;
              return (
                <article key={id} className="border border-white/12 p-5">
                  <p className="meta text-[0.45rem] text-lime">Challenge</p>
                  <h2 className="display mt-2 text-xl font-bold text-white">
                    {title}
                  </h2>
                  <progress
                    className="mt-4 w-full accent-lime"
                    max={goal}
                    value={value}
                  />
                  <p className="mt-2 text-xs text-white/55">
                    {value} / {goal} {unit}
                  </p>
                  <input
                    aria-label={`Update ${title}`}
                    className="mt-3 w-full border border-white/20 bg-black p-2 text-white"
                    type="number"
                    min="0"
                    value={value}
                    onChange={e =>
                      setState(updateChallenge(id, Number(e.target.value)))
                    }
                  />
                </article>
              );
            })}
          </section>
        )}
        {tab === "Programs" && (
          <section className="grid gap-3 sm:grid-cols-2">
            {programs.map(([name, summary]) => (
              <details key={name} className="border border-white/12 p-5">
                <summary className="display cursor-pointer text-xl font-bold text-white">
                  {name}
                </summary>
                <p className="mt-3 text-sm text-lime">{summary}</p>
                <p className="mt-2 text-xs text-white/55">
                  Alternate full-body foundations and focused sessions. Progress
                  one variable at a time.
                </p>
              </details>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
function Select({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-1">
      <span className="meta text-[0.42rem] text-white/50">{label}</span>
      <select
        className="border border-white/20 bg-black p-2 text-sm text-white"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {items.map(x => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
}
function Generated({
  workout,
  performance,
  setPerformance,
  onSwap,
  onSave,
  onComplete,
  onShare,
}: {
  workout: ToolWorkout;
  performance: Record<string, string>;
  setPerformance: (v: Record<string, string>) => void;
  onSwap: (i: number) => void;
  onSave: () => void;
  onComplete: () => void;
  onShare: () => void;
}) {
  return (
    <article className="mt-7 border-t border-white/12 pt-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="display text-2xl font-bold text-white">
            {workout.title}
          </h2>
          <p className="meta mt-2 text-[0.45rem] text-lime">
            {workout.duration} min · {workout.exercises.length} movements
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Action onClick={onSave}>Save</Action>
          <Action onClick={onComplete}>Mark complete</Action>
          <Action onClick={() => window.print()}>Print</Action>
          <Action onClick={onShare}>Share</Action>
        </div>
      </div>
      <div className="mt-5">
        <Block title="Warm-up" items={workout.warmup} />
      </div>
      <ol className="mt-5 grid gap-3">
        {workout.exercises.map((x, i) => (
          <li
            key={x.id}
            className="grid gap-3 border border-white/12 p-4 sm:grid-cols-[1fr_auto]"
          >
            <div>
              {x.libraryEntry === false ? (
                <span className="display text-lg font-semibold text-white">
                  {x.name}
                </span>
              ) : (
                <Link
                  href={`/e/${x.slug}`}
                  className="display text-lg font-semibold text-white hover:text-lime"
                >
                  {x.name}
                </Link>
              )}
              <p className="meta mt-1 text-[0.42rem] text-lime">
                {x.sets} sets · {x.reps}{x.time ? ` · ${x.time}` : ""} · {x.rest} rest
              </p>
              <p className="mt-1 text-xs text-white/45">
                {x.primary} · {x.equipment}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                aria-label={`${x.name} performance`}
                placeholder="Weight / reps"
                className="w-32 border border-white/20 bg-black p-2 text-xs text-white"
                value={performance[x.id] || ""}
                onChange={e =>
                  setPerformance({ ...performance, [x.id]: e.target.value })
                }
              />
              <Action onClick={() => onSwap(i)}>Swap exercise</Action>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5">
        <Block title="Cool-down" items={workout.cooldown} />
      </div>
      <p className="mt-4 border-l-2 border-lime bg-lime/[0.04] p-4 text-xs text-white/60">
        Progressive overload: when every prescribed rep is controlled for two
        sessions, add 1–2 reps or increase load 2–5%. Change one variable at a
        time.
      </p>
    </article>
  );
}
function Action({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="meta border border-white/20 px-3 py-2 text-[0.45rem] text-white hover:border-lime hover:text-lime"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-white/12 p-4">
      <h3 className="display font-bold text-white">{title}</h3>
      <ul className="mt-2 space-y-1 text-xs text-white/55">
        {items.map(x => (
          <li key={x}>— {x}</li>
        ))}
      </ul>
    </section>
  );
}
function List({
  title,
  empty,
  items,
  action,
}: {
  title: string;
  empty: string;
  items: ToolWorkout[];
  action?: (x: ToolWorkout) => React.ReactNode;
}) {
  return (
    <section className="border border-white/12 p-5">
      <h2 className="display text-2xl font-bold text-white">{title}</h2>
      {!items.length ? (
        <p className="mt-4 text-sm text-white/50">{empty}</p>
      ) : (
        <div className="mt-4 grid gap-2">
          {items.map(x => (
            <article key={x.id} className="border border-white/10 p-3">
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="display font-semibold text-white">
                    {x.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/45">
                    {x.exercises.length} movements · {x.duration} min · {x.format}
                  </p>
                </div>
                {action?.(x)}
              </div>
              <ul className="mt-2 space-y-1 text-[0.65rem] text-white/40">
                {x.exercises.map(ex => (
                  <li key={ex.id}>
                    {ex.name} — {ex.sets} sets · {ex.reps}
                    {ex.time ? ` · ${ex.time}` : ""} · {ex.rest} rest
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
