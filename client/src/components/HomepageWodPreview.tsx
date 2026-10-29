import { ArrowRight, Clock, Flame, Gauge, PackageOpen } from "lucide-react";
import { useDailyWod } from "@/hooks/useDailyWod";

export function HomepageWodPreview() {
  const { workout } = useDailyWod();

  return (
    <section className="border-b border-white/10 bg-black py-9 sm:py-12" aria-labelledby="home-wod-heading">
      <div className="container">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-8 bg-lime" />
          <span className="meta text-[0.48rem] font-bold tracking-[0.14em] text-lime">WORKOUT OF THE DAY</span>
        </div>
        <article className="grid gap-6 border border-lime/70 bg-plate p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 id="home-wod-heading" className="display text-3xl font-bold leading-tight text-white sm:text-4xl">Today's training.<br /><span className="text-lime">One clear session.</span></h2>
            <p className="display mt-3 text-xl font-semibold text-lime">{workout.title}</p>
            <div className="mt-5 grid grid-cols-1 divide-y divide-white/10 border border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <Fact icon={Gauge} label="Level" value={workout.difficulty} />
              <Fact icon={Clock} label="Time" value={workout.duration} />
              <Fact icon={PackageOpen} label="Equipment" value={workout.equipment.join(" · ")} />
            </div>
          </div>
          <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className="meta text-[0.44rem] font-bold text-lime">SESSION PREVIEW</p>
            <ul className="mt-3 space-y-2.5">
              {workout.exercises.slice(0, 4).map((exercise) => (
                <li key={exercise.name} className="flex items-baseline justify-between gap-4 border-b border-white/[0.08] pb-2 text-sm">
                  <span className="text-white/80">{exercise.name}</span>
                  <span className="meta shrink-0 text-right text-[0.4rem] text-white/50">{exercise.prescription}</span>
                </li>
              ))}
            </ul>
            <a href="/wod" className="mt-5 inline-flex min-h-11 items-center gap-3 bg-lime px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-white">
              View today's workout <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="min-w-0 p-3">
      <div className="flex items-center gap-2 text-lime"><Icon className="h-3.5 w-3.5" aria-hidden="true" /><span className="meta text-[0.4rem]">{label}</span></div>
      <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
