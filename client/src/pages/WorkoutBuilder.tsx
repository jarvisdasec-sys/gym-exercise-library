import { useMemo, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/contexts/AuthContext";
import { EXERCISES, type Exercise } from "@/lib/exercises";
import { createCustomWorkout, saveWorkout } from "@/lib/workoutTools";

type BuilderExercise = Exercise & {
  sets: number;
  reps: string;
  time: string;
  rest: string;
};

const defaultPrescription = {
  sets: 3,
  reps: "8-12",
  time: "",
  rest: "60 sec",
};

export default function WorkoutBuilder() {
  const { user } = useAuth();
  const [title, setTitle] = useState("My BTB Workout"),
    [format, setFormat] = useState("Standard"),
    [duration, setDuration] = useState(45),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<BuilderExercise[]>([]),
    [notice, setNotice] = useState(""),
    [noticeIsError, setNoticeIsError] = useState(false);
  const choices = useMemo(
    () =>
      EXERCISES.filter(x =>
        `${x.name} ${x.primary} ${x.equipment}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );
  const move = (i: number, d: number) => {
    const n = i + d;
    if (n < 0 || n >= selected.length) return;
    const copy = [...selected];
    [copy[i], copy[n]] = [copy[n], copy[i]];
    setSelected(copy);
  };
  const updatePrescription = (
    slug: string,
    patch: Partial<Pick<BuilderExercise, "sets" | "reps" | "time" | "rest">>
  ) =>
    setSelected(v =>
      v.map(x => (x.slug === slug ? { ...x, ...patch } : x))
    );
  const save = () => {
    if (!selected.length) {
      setNoticeIsError(true);
      setNotice("Add at least one movement.");
      return;
    }
    try {
      saveWorkout(createCustomWorkout(title, format, duration, selected), user?.id);
      setNoticeIsError(false);
      setNotice("Custom workout saved on this device.");
    } catch {
      setNoticeIsError(true);
      setNotice(
        "Could not save this workout. Check that your browser allows local storage and try again."
      );
    }
  };
  return (
    <div className="min-h-screen">
      <SiteNav active="workouts" />
      <header className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8">
          <p className="meta text-[0.45rem] text-lime">
            Workout Builder · Rev. 01
          </p>
          <h1 className="display mt-3 text-4xl font-bold text-white sm:text-5xl">
            Build your own <span className="text-lime">workout.</span>
          </h1>
        </div>
      </header>
      <main className="container grid gap-6 py-8 lg:grid-cols-[1fr_22rem]">
        <section className="border border-white/12 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="meta text-[0.42rem] text-white/50">Name</span>
              <input
                className="border border-white/20 bg-black p-2 text-white"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="meta text-[0.42rem] text-white/50">Format</span>
              <select
                className="border border-white/20 bg-black p-2 text-white"
                value={format}
                onChange={e => setFormat(e.target.value)}
              >
                {["Standard", "Superset", "Circuit"].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="meta text-[0.42rem] text-white/50">Minutes</span>
              <input
                className="border border-white/20 bg-black p-2 text-white"
                type="number"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
              />
            </label>
          </div>
          <input
            aria-label="Search movements"
            className="mt-5 w-full border border-white/20 bg-black p-3 text-white"
            placeholder="Search exercise, muscle, or equipment"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="mt-4 grid max-h-[42rem] gap-2 overflow-y-auto">
            {choices.map(x => (
              <article
                key={x.slug}
                className="flex items-center justify-between gap-3 border border-white/10 p-3"
              >
                <div>
                  <Link
                    href={`/e/${x.slug}`}
                    className="display font-semibold text-white"
                  >
                    {x.name}
                  </Link>
                  <p className="mt-1 text-xs text-white/45">
                    {x.primary} · {x.equipment}
                  </p>
                </div>
                <button
                  disabled={selected.some(y => y.slug === x.slug)}
                  className="meta border border-lime px-3 py-2 text-[0.45rem] text-lime disabled:opacity-30"
                  onClick={() =>
                    setSelected(v => [...v, { ...x, ...defaultPrescription }])
                  }
                >
                  Add
                </button>
              </article>
            ))}
          </div>
        </section>
        <aside className="h-fit border border-lime/40 bg-plate p-5 lg:sticky lg:top-24">
          <h2 className="display text-2xl font-bold text-white">{title}</h2>
          <p className="meta mt-2 text-[0.45rem] text-lime">
            {format} · {duration} min
          </p>
          {notice && (
            <p
              role={noticeIsError ? "alert" : "status"}
              className={`mt-3 text-xs ${noticeIsError ? "text-red-400" : "text-lime"}`}
            >
              {notice}
            </p>
          )}
          <ol className="mt-5 grid gap-2">
            {selected.map((x, i) => (
              <li key={x.slug} className="border border-white/10 p-3">
                <span className="display font-semibold text-white">
                  {x.name}
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <label className="grid gap-0.5">
                    <span className="meta text-[0.38rem] text-white/50">Sets</span>
                    <input
                      aria-label={`${x.name} sets`}
                      type="number"
                      min={1}
                      className="w-full min-w-0 border border-white/20 bg-black p-1.5 text-xs text-white"
                      value={x.sets || ""}
                      onChange={e =>
                        updatePrescription(x.slug, {
                          sets: e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)),
                        })
                      }
                      onBlur={() => {
                        if (!x.sets || x.sets < 1)
                          updatePrescription(x.slug, { sets: 1 });
                      }}
                    />
                  </label>
                  <label className="grid gap-0.5">
                    <span className="meta text-[0.38rem] text-white/50">Reps</span>
                    <input
                      aria-label={`${x.name} reps`}
                      className="w-full min-w-0 border border-white/20 bg-black p-1.5 text-xs text-white"
                      placeholder="8-12"
                      value={x.reps}
                      onChange={e =>
                        updatePrescription(x.slug, { reps: e.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-0.5">
                    <span className="meta text-[0.38rem] text-white/50">Time</span>
                    <input
                      aria-label={`${x.name} time`}
                      className="w-full min-w-0 border border-white/20 bg-black p-1.5 text-xs text-white"
                      placeholder="30 sec"
                      value={x.time}
                      onChange={e =>
                        updatePrescription(x.slug, { time: e.target.value })
                      }
                    />
                  </label>
                  <label className="grid gap-0.5">
                    <span className="meta text-[0.38rem] text-white/50">Rest</span>
                    <input
                      aria-label={`${x.name} rest`}
                      className="w-full min-w-0 border border-white/20 bg-black p-1.5 text-xs text-white"
                      placeholder="60 sec"
                      value={x.rest}
                      onChange={e =>
                        updatePrescription(x.slug, { rest: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="mt-2 flex gap-2">
                  <button disabled={!i} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button
                    disabled={i === selected.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    className="text-lime"
                    onClick={() =>
                      setSelected(v => v.filter(y => y.slug !== x.slug))
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <button
            className="meta mt-5 w-full bg-lime p-3 text-[0.5rem] font-bold text-black"
            onClick={save}
          >
            Save workout
          </button>
          <button
            className="meta mt-2 w-full border border-white/20 p-3 text-[0.5rem] text-white"
            onClick={() => window.print()}
          >
            Print / PDF
          </button>
        </aside>
      </main>
    </div>
  );
}
