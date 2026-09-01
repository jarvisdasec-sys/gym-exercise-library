import { useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { formatWodDate, getWodForDate } from "@/lib/wod";
import {
  completeWorkout,
  saveWorkout,
  type ToolWorkout,
} from "@/lib/workoutTools";
import {
  AlertTriangle,
  Clock,
  Droplets,
  Fuel,
  Gauge,
  PackageOpen,
} from "lucide-react";

export default function WorkoutOfDay() {
  const today = new Date();
  const workout = getWodForDate(today);
  const [notice, setNotice] = useState("");
  const toolWorkout: ToolWorkout = {
    id: `wod-${today.toISOString().slice(0, 10)}`,
    title: workout.title,
    duration: Number.parseInt(workout.duration) || 45,
    format: "Standard",
    warmup: workout.warmUp,
    cooldown: workout.coolDown,
    exercises: workout.exercises.map((x, index) => ({
      id: `wod-${index}`,
      slug: "",
      name: x.name,
      primary: workout.category,
      equipment: workout.equipment.join(" · "),
      difficulty: workout.difficulty,
      sets: Number.parseInt(x.prescription) || 1,
      reps: x.prescription,
      rest: x.rest || "60 sec",
    })),
  };

  return (
    <div className="min-h-screen">
      <SiteNav active="workouts" />

      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8 sm:py-10">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              Daily Training Sheet · {formatWodDate(today)}
            </span>
          </div>
          <h1 className="display text-[2.5rem] font-bold leading-[0.88] text-white sm:text-[3.5rem]">
            Workout of the day.
            <br />
            <span className="text-lime">{workout.title}</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
            One complete session selected by the calendar. Adjust the pace and
            movement options to match your current ability.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="#main-workout"
              className="meta bg-lime px-4 py-3 text-[0.48rem] font-bold text-black"
            >
              Start WOD
            </a>
            <button
              className="meta border border-white/20 px-4 py-3 text-[0.48rem] text-white"
              onClick={() => {
                saveWorkout(toolWorkout);
                setNotice("WOD saved on this device.");
              }}
            >
              Save WOD
            </button>
            <button
              className="meta border border-white/20 px-4 py-3 text-[0.48rem] text-white"
              onClick={() => {
                completeWorkout(toolWorkout);
                setNotice("WOD marked complete.");
              }}
            >
              Mark Complete
            </button>
            <Link
              href="/workouts/tools"
              className="meta border border-lime px-4 py-3 text-[0.48rem] text-lime"
            >
              Workout Tools
            </Link>
          </div>
          {notice && (
            <p role="status" className="mt-3 text-xs text-lime">
              {notice}
            </p>
          )}
        </div>
      </section>

      <main className="container py-8 sm:py-10">
        <section className="grid border border-white/12 sm:grid-cols-2 lg:grid-cols-4">
          <Fact icon={Gauge} label="Category" value={workout.category} />
          <Fact
            icon={AlertTriangle}
            label="Difficulty"
            value={workout.difficulty}
          />
          <Fact icon={Clock} label="Duration" value={workout.duration} />
          <Fact
            icon={PackageOpen}
            label="Equipment"
            value={workout.equipment.join(" · ")}
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)]">
          <div className="space-y-6">
            <TrainingBlock index="01" title="Warm-up" items={workout.warmUp} />

            <section
              id="main-workout"
              className="relative border border-white/12 bg-plate p-5 sm:p-6"
            >
              <CornerTicks />
              <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
                <h2 className="display text-2xl font-bold text-white">
                  Main workout
                </h2>
                <span className="meta text-[0.5rem] text-lime">02</span>
              </div>
              <ol className="divide-y divide-white/10">
                {workout.exercises.map((exercise, index) => (
                  <li
                    key={exercise.name}
                    className="grid gap-3 py-4 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-start"
                  >
                    <span className="meta text-[0.5rem] text-lime/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="display text-lg font-semibold text-white">
                        {exercise.name}
                      </h3>
                      {exercise.modification && (
                        <p className="mt-1.5 text-xs leading-relaxed text-white/50">
                          Modify: {exercise.modification}
                        </p>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <p className="meta text-[0.5rem] font-bold text-lime">
                        {exercise.prescription}
                      </p>
                      {exercise.rest && (
                        <p className="meta mt-1.5 text-[0.4rem] text-white/45">
                          Rest · {exercise.rest}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <TrainingBlock
              index="03"
              title="Cool-down"
              items={workout.coolDown}
            />
          </div>

          <aside className="space-y-4">
            <Guidance
              icon={Droplets}
              title="Hydration"
              text={workout.hydration}
            />
            <Guidance
              icon={Fuel}
              title="Pre-workout fuel"
              text={workout.preWorkout}
            />
            <Guidance
              icon={Fuel}
              title="Post-workout fuel"
              text={workout.postWorkout}
            />
            <section className="border border-lime/35 bg-lime/[0.04] p-5">
              <div className="flex items-center gap-2 text-lime">
                <AlertTriangle className="h-4 w-4" />
                <h2 className="meta text-[0.5rem] font-bold">
                  Safety / modifications
                </h2>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/65">
                {workout.safety}
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-white/12 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <Icon className="h-4 w-4 text-lime" />
      <p className="meta mt-3 text-[0.4rem] text-white/40">{label}</p>
      <p className="display mt-1.5 text-base font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function TrainingBlock({
  index,
  title,
  items,
}: {
  index: string;
  title: string;
  items: string[];
}) {
  return (
    <section className="relative border border-white/12 p-5 sm:p-6">
      <CornerTicks />
      <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
        <h2 className="display text-2xl font-bold text-white">{title}</h2>
        <span className="meta text-[0.5rem] text-lime">{index}</span>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map(item => (
          <li key={item} className="flex gap-2 text-sm text-white/65">
            <span className="text-lime">—</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Guidance({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Droplets;
  title: string;
  text: string;
}) {
  return (
    <section className="border border-white/12 p-5">
      <div className="flex items-center gap-2 text-lime">
        <Icon className="h-4 w-4" />
        <h2 className="meta text-[0.5rem] font-bold">{title}</h2>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/60">{text}</p>
    </section>
  );
}

function CornerTicks() {
  return (
    <>
      <span className="tick-static absolute -left-px -top-px h-2.5 w-2.5 border-l-2 border-t-2 border-lime" />
      <span className="tick-static absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-lime" />
    </>
  );
}
