import { useState } from "react";
import {
  Accessibility,
  ChevronDown,
  Clock3,
  HeartPulse,
  Move,
  Sparkles,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

const FILTERS = [
  "All",
  "Pre-Workout Prep",
  "Post-Workout Recovery",
  "Core & Stability",
  "Active Cardio",
] as const;

type Filter = (typeof FILTERS)[number];

type Routine = {
  movement: string;
  target: string;
  cue: string;
};

const FLOWS: {
  id: string;
  title: string;
  icon: typeof Move;
  label: string;
  duration: string;
  filters: Filter[];
  tags: string[];
  description: string;
  routine: Routine[];
}[] = [
  {
    id: "yoga",
    title: "Yoga Reset",
    icon: Move,
    label: "Range you can control",
    duration: "8 min",
    filters: ["Pre-Workout Prep", "Post-Workout Recovery"],
    tags: ["Hip Mobility", "T-Spine", "Ankles"],
    description:
      "Open the positions your squat, hinge, and press demand. Move slowly enough to keep every range under control.",
    routine: [
      {
        movement: "Cat-Cow to Thread the Needle",
        target: "6 controlled reps / side",
        cue: "Let the ribcage rotate; do not force the shoulder into the floor.",
      },
      {
        movement: "World's Greatest Stretch",
        target: "45 sec / side",
        cue: "Drive the back heel long and keep the front foot rooted.",
      },
      {
        movement: "Down Dog Pedal",
        target: "60 sec",
        cue: "Press the floor away and alternate heels without rounding hard through the back.",
      },
    ],
  },
  {
    id: "pilates",
    title: "Pilates Control",
    icon: Accessibility,
    label: "Stability before intensity",
    duration: "10 min",
    filters: ["Core & Stability", "Post-Workout Recovery"],
    tags: ["Core Control", "Posterior Chain", "Posture"],
    description:
      "Build trunk control and posterior-chain endurance so your positions stay solid when the load gets heavy.",
    routine: [
      {
        movement: "Dead Bug with Exhale",
        target: "8 reps / side",
        cue: "Keep low back gently connected to the floor while the opposite limbs reach long.",
      },
      {
        movement: "Glute Bridge March",
        target: "10 reps / side",
        cue: "Keep pelvis level; the standing glute owns the rep.",
      },
      {
        movement: "Swimming Hold",
        target: "3 x 20 sec",
        cue: "Lengthen from the crown of the head, not by cranking the low back.",
      },
    ],
  },
  {
    id: "rhythm",
    title: "Rhythm Cardio",
    icon: HeartPulse,
    label: "Conditioning with a pulse",
    duration: "15 min",
    filters: ["Active Cardio", "Pre-Workout Prep"],
    tags: ["Agility", "Endurance", "Calorie Burn"],
    description:
      "Use music-driven movement to build coordination and conditioning without turning every cardio day into a max-effort test.",
    routine: [
      {
        movement: "Step Touch + Arm Sweep",
        target: "2 min easy",
        cue: "Land softly and let the arms move from the upper back, not just the hands.",
      },
      {
        movement: "Grapevine with Knee Drive",
        target: "3 x 45 sec",
        cue: "Stay light on the feet and keep the knee drive controlled, not ballistic.",
      },
      {
        movement: "Low-Impact Dance Intervals",
        target: "6 min, 30 sec on / 30 sec easy",
        cue: "Choose a pace that leaves enough in reserve for your next strength session.",
      },
    ],
  },
];

export default function Mobility() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [openRoutine, setOpenRoutine] = useState<string | null>(null);

  const visibleFlows = FLOWS.filter(
    (flow) => activeFilter === "All" || flow.filters.includes(activeFilter),
  );

  return (
    <div className="min-h-screen bg-[#0b0b0b]">
      <SiteNav active="mobility" />
      <section className="border-b border-[#1a1a1a]">
        <div className="hazard-rule" />
        <div className="container py-9 sm:py-12">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#8CFF00]" />
            <span className="meta text-[0.45rem] text-[#8CFF00]">
              Movement Capacity · Rev. 02
            </span>
          </div>
          <h1 className="display text-[2.6rem] font-bold leading-[0.88] text-white sm:text-[3.8rem]">
            Move better.
            <br />
            <span className="text-[#8CFF00]">Lift longer.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65">
            Select a training need, run a focused routine, and own the ranges
            your strength work asks for.
          </p>
        </div>
      </section>

      <main className="container py-8 sm:py-10">
        <div className="no-scrollbar -mx-4 mb-7 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {FILTERS.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 border px-3 py-2 transition-colors ${
                  selected
                    ? "border-[#8CFF00] bg-[#8CFF00] text-black"
                    : "border-[#1a1a1a] bg-white/[0.02] text-white/60 hover:border-[#8CFF00]/55 hover:text-white"
                }`}
              >
                <span className="meta text-[0.5rem] font-bold">{filter}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {visibleFlows.map((flow, index) => {
            const Icon = flow.icon;
            const expanded = openRoutine === flow.id;
            return (
              <article
                key={flow.id}
                className="relative overflow-hidden border border-[#1a1a1a] bg-[#101010] transition-colors hover:border-[#8CFF00]/45"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="meta text-[0.48rem] text-[#8CFF00]/65">
                        0{index + 1} / ROUTINE MODULE
                      </span>
                      <Icon className="mt-5 h-7 w-7 text-[#8CFF00]" />
                    </div>
                    <span className="meta flex items-center gap-1.5 border border-white/10 px-2 py-1 text-[0.46rem] text-white/55">
                      <Clock3 className="h-3 w-3 text-[#8CFF00]" /> {flow.duration}
                    </span>
                  </div>

                  <p className="meta mt-5 text-[0.46rem] text-white/45">{flow.label}</p>
                  <h2 className="display mt-1 text-2xl font-bold text-white">{flow.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{flow.description}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {flow.tags.map((tag) => (
                      <span
                        key={tag}
                        className="meta border border-[#8CFF00]/35 bg-[#8CFF00]/[0.07] px-2 py-1 text-[0.42rem] font-bold text-[#8CFF00]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenRoutine(expanded ? null : flow.id)}
                  aria-expanded={expanded}
                  aria-controls={`${flow.id}-routine`}
                  className="flex w-full items-center justify-between border-t border-[#1a1a1a] px-5 py-3.5 text-left transition-colors hover:bg-[#8CFF00]/[0.06]"
                >
                  <span className="meta text-[0.5rem] font-bold text-[#8CFF00]">
                    {expanded ? "Hide Routine" : "View Routine"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#8CFF00] transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>

                {expanded && (
                  <div id={`${flow.id}-routine`} className="border-t border-[#1a1a1a] bg-black/30 p-5">
                    <ol className="space-y-4">
                      {flow.routine.map((step, stepIndex) => (
                        <li key={step.movement} className="grid grid-cols-[1.5rem_1fr] gap-3">
                          <span className="meta flex h-6 w-6 items-center justify-center border border-[#8CFF00]/45 text-[0.45rem] text-[#8CFF00]">
                            {stepIndex + 1}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                              <h3 className="text-sm font-semibold text-white">{step.movement}</h3>
                              <span className="meta text-[0.45rem] text-[#8CFF00]">{step.target}</span>
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-white/55">{step.cue}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <section className="mt-8 border border-[#8CFF00]/30 bg-[#8CFF00]/[0.04] p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#8CFF00]" />
            <div>
              <h2 className="display text-xl font-bold text-white">The heavy-training complement</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/70">
                Use mobility to prepare the ranges your lifts demand, not to chase flexibility for its own sake. A few focused minutes before training can improve setup quality; low-intensity flows on off-days can reduce stiffness without adding meaningful fatigue.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
