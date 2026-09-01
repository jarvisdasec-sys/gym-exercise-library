import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { EXERCISES } from "@/lib/exercises";
import { TRAINING_PROGRAMS, type TrainingProgram } from "@/lib/programs";

export default function ProgramsPanel() {
  return (
    <section aria-label="Training programs" className="grid gap-3">
      {TRAINING_PROGRAMS.map(program => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </section>
  );
}

function ProgramCard({ program }: { program: TrainingProgram }) {
  const [weekNumber, setWeekNumber] = useState(1);
  const [dayNumber, setDayNumber] = useState(1);
  const week = program.weeks[weekNumber - 1];
  const scheduled = week.workouts[dayNumber - 1];

  return (
    <details className="border border-white/12 bg-plate open:border-lime/35">
      <summary className="cursor-pointer list-none p-5 marker:hidden sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="meta text-[0.42rem] text-lime">{program.goal}</p>
            <h2 className="display mt-2 text-2xl font-bold text-white">
              {program.name}
            </h2>
          </div>
          <div className="flex gap-2">
            <Meta icon={CalendarDays} value={`${program.durationWeeks} weeks`} />
            <Meta icon={Clock3} value={`${program.daysPerWeek} days/week`} />
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/55">
          {program.description}
        </p>
      </summary>

      <div className="border-t border-white/12 p-5 sm:p-6">
        <div>
          <p className="meta text-[0.42rem] text-white/45">Select week</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {program.weeks.map(item => (
              <button
                key={item.week}
                type="button"
                aria-pressed={weekNumber === item.week}
                onClick={() => {
                  setWeekNumber(item.week);
                  setDayNumber(1);
                }}
                className={`meta min-h-9 min-w-10 shrink-0 border px-3 text-[0.45rem] ${
                  weekNumber === item.week
                    ? "border-lime bg-lime text-black"
                    : "border-white/15 text-white/60 hover:border-lime"
                }`}
              >
                {item.week}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="meta text-[0.42rem] text-white/45">Select training day</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {week.workouts.map(workout => (
              <button
                key={workout.id}
                type="button"
                aria-pressed={dayNumber === workout.day}
                onClick={() => setDayNumber(workout.day)}
                className={`min-w-0 border p-3 text-left ${
                  dayNumber === workout.day
                    ? "border-lime bg-lime/[0.06]"
                    : "border-white/15 hover:border-lime"
                }`}
              >
                <span className="meta text-[0.4rem] text-lime">
                  Day {workout.day}
                </span>
                <span className="display mt-1 block truncate text-sm font-semibold text-white">
                  {workout.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border-y border-white/12 py-5">
          <div>
            <p className="meta text-[0.42rem] text-lime">
              {program.name} · Week {week.week} · Day {scheduled.day}
            </p>
            <h3 className="display mt-2 text-xl font-bold text-white">
              {scheduled.name}
            </h3>
            <p className="mt-2 text-xs text-white/50">{week.focus}</p>
          </div>
          <Link
            href={`/workouts/programs/${program.id}/${week.week}/${scheduled.day}`}
            className="meta inline-flex min-h-11 items-center gap-2 bg-lime px-4 text-[0.48rem] font-bold text-black"
          >
            Start workout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <ScheduleBlock title="Warm-up" items={scheduled.warmup} />
            <div className="my-5">
              <p className="meta text-[0.42rem] text-lime">Working exercises</p>
              <div className="mt-2 divide-y divide-white/10 border-y border-white/10">
                {scheduled.workout.blocks.flatMap(block => block.items).map((item, index) => {
                  const exercise = EXERCISES.find(entry => entry.slug === item.slug);
                  if (!exercise) return null;
                  return (
                    <div
                      key={`${item.slug}-${index}`}
                      className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/e/${exercise.slug}`}
                          className="display font-semibold text-white hover:text-lime"
                        >
                          {exercise.name}
                        </Link>
                        <p className="mt-1 text-xs leading-relaxed text-white/45">
                          {item.cue}
                        </p>
                      </div>
                      <p className="meta whitespace-nowrap text-[0.42rem] text-lime">
                        {item.sets} sets · {item.reps} · {item.rest} rest
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <ScheduleBlock title="Cooldown" items={scheduled.cooldown} />
          </div>

          <aside className="border-l-2 border-lime pl-4">
            <p className="meta text-[0.42rem] text-lime">Program overview</p>
            <p className="mt-3 text-xs leading-relaxed text-white/55">
              {scheduled.workout.intent}
            </p>
            <p className="meta mt-4 text-[0.4rem] leading-relaxed text-white/40">
              Complete days in order. Use rest days between demanding sessions
              and repeat a week when the written work is not yet controlled.
            </p>
          </aside>
        </div>
      </div>
    </details>
  );
}

function Meta({ icon: Icon, value }: { icon: typeof CalendarDays; value: string }) {
  return (
    <span className="meta inline-flex items-center gap-1.5 border border-white/15 px-2 py-1.5 text-[0.4rem] text-white/55">
      <Icon className="h-3.5 w-3.5 text-lime" />
      {value}
    </span>
  );
}

function ScheduleBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <p className="meta text-[0.42rem] text-lime">{title}</p>
      <ol className="mt-2 grid gap-1.5">
        {items.map((item, index) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-white/55">
            <span className="meta shrink-0 text-[0.4rem] text-lime/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}