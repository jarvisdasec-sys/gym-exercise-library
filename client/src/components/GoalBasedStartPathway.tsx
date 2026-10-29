import { useEffect, useState } from "react";

type GoalId = "learn" | "train" | "nutrition";

type PathStep = {
  id: string;
  title: string;
  description: string;
  href: string;
  action: string;
  time: string;
};

type GoalPath = {
  title: string;
  summary: string;
  steps: PathStep[];
};

type ProgressByGoal = Record<GoalId, string[]>;

const STORAGE_KEY = "btb:start-goal-progress:v1";
const GOAL_IDS: GoalId[] = ["learn", "train", "nutrition"];

const GOALS: { id: GoalId; label: string; eyebrow: string; description: string }[] = [
  {
    id: "learn",
    label: "Understand the basics",
    eyebrow: "LEARN",
    description: "Learn what to do, why it works, and how to start without the guesswork.",
  },
  {
    id: "train",
    label: "Build a fitness routine",
    eyebrow: "MOVE",
    description: "Get familiar with the movements, choose a manageable session, and build consistency at your pace.",
  },
  {
    id: "nutrition",
    label: "Eat with more intention",
    eyebrow: "NOURISH",
    description: "Practice one useful food habit at a time—without chasing perfection or needing to track everything.",
  },
];

function buildPaths(recipePlannerUrl: string): Record<GoalId, GoalPath> {
  return {
    learn: {
      title: "Understand the basics",
      summary: "Short reads and practical steps connect the learning to real choices. Spread these across any seven days.",
      steps: [
        { id: "day-1", title: "Read your first-week guide", description: "See what to expect, how to keep the first steps manageable, and when to ask a professional for help.", href: "/learn/your-first-week", action: "Read the 5-minute guide", time: "5 min" },
        { id: "day-2", title: "Explore one movement", description: "Choose a movement you recognize or want to learn. Focus on the setup and the key form cues.", href: "/exercises", action: "Browse exercise guides", time: "5–10 min" },
        { id: "day-3", title: "Learn how training progress works", description: "Understand the simple principle behind gradual improvement—no advanced program required.", href: "/learn/progressive-overload", action: "Read the training lesson", time: "5 min" },
        { id: "day-4", title: "Preview a beginner session", description: "Read the session before trying it. Adapt the activity to your ability and circumstances.", href: "/workouts/full-body-starter", action: "Preview Full Body Starter", time: "5 min to preview" },
        { id: "day-5", title: "Make sense of everyday food basics", description: "Start with a general explanation of energy balance; skip tracking if it is not useful for you.", href: "/learn/calories-and-energy-balance", action: "Read the nutrition lesson", time: "5 min" },
        { id: "day-6", title: "Give recovery a place in the plan", description: "Learn why rest, sleep, and a repeatable schedule matter alongside exercise.", href: "/learn/sleep-and-training", action: "Read the recovery lesson", time: "5 min" },
        { id: "day-7", title: "Choose one next step", description: "Use a simple starter plan to decide what you want to repeat next week.", href: "/7-day-starter", action: "Open the free starter plan", time: "10 min" },
      ],
    },
    train: {
      title: "Build a fitness routine",
      summary: "Start by learning and planning, then try movement at a level that feels appropriate for you. You can spread these steps across any seven days.",
      steps: [
        { id: "day-1", title: "See what a manageable first week looks like", description: "Get a beginner-friendly overview before deciding how much to do.", href: "/learn/your-first-week", action: "Read the first-week guide", time: "5 min" },
        { id: "day-2", title: "Choose one movement to understand", description: "Look through the movement guides and save or note one exercise to practice.", href: "/exercises", action: "Explore exercise guides", time: "5–10 min" },
        { id: "day-3", title: "Preview a beginner workout", description: "The Full Body Starter uses machines and dumbbells. Review the plan first; shorten, pause, or choose easier options as appropriate.", href: "/workouts/full-body-starter", action: "Preview the beginner workout", time: "5 min to preview" },
        { id: "day-4", title: "Recover and notice how you feel", description: "A rest day is a useful part of a routine. If something hurts, stop and seek appropriate professional guidance.", href: "/learn/sleep-and-training", action: "Learn about recovery", time: "5 min" },
        { id: "day-5", title: "Try a session only if it feels right", description: "Use the beginner plan as a guide, move at your own pace, and leave room to rest. It is fine to choose a shorter or easier activity.", href: "/workouts/full-body-starter", action: "Open the workout plan", time: "Choose your pace" },
        { id: "day-6", title: "Find movement you enjoy", description: "A walk, gentle mobility, or another comfortable activity can count. There is no need to make every day a hard workout.", href: "/cardio", action: "Explore conditioning options", time: "Choose your pace" },
        { id: "day-7", title: "Plan a repeatable next week", description: "Choose a schedule that fits your real life; consistency matters more than an ambitious plan you cannot sustain.", href: "/learn/first-month-plan", action: "Read the first-month guide", time: "6 min" },
      ],
    },
    nutrition: {
      title: "Eat with more intention",
      summary: "Build practical food skills one meal at a time. Calorie tools and tracking are optional—not requirements for progress.",
      steps: [
        { id: "day-1", title: "Start with the basics, not perfection", description: "Learn what energy balance means, and why estimates are only a starting point—not a verdict about you.", href: "/learn/calories-and-energy-balance", action: "Read the 5-minute lesson", time: "5 min" },
        { id: "day-2", title: "Understand protein in plain language", description: "See what protein does and find out why ordinary foods can work just as well as supplements.", href: "/learn/protein-explained", action: "Read the protein lesson", time: "5 min" },
        { id: "day-3", title: "Plan one recipe week", description: "Try the recipe planner to build a simple week with meals, ingredients, prep instructions, and a grocery list.", href: recipePlannerUrl, action: "Open the recipe-week planner", time: "10–20 min" },
        { id: "day-4", title: "Practice reading one food label", description: "Learn how to find serving sizes and key nutrition information without turning food into a test.", href: "/learn/reading-a-label", action: "Read the label guide", time: "4 min" },
        { id: "day-5", title: "Prep one meal you will actually eat", description: "Choose a familiar recipe and make the next meal easier—not a whole week of complicated cooking.", href: "/nutrition/meal-prep", action: "Explore meal-prep tools", time: "Choose your pace" },
        { id: "day-6", title: "Use tracking only if it helps you", description: "The tracker is optional and uses estimates. If tracking makes you anxious or preoccupied, skip it and seek qualified support if needed.", href: "/nutrition/tracker", action: "View the optional tracker", time: "Optional" },
        { id: "day-7", title: "Write down a simple plan for next week", description: "Note one meal, one prep time, and a realistic next step. Small plans are easier to repeat.", href: "/downloads/btb-weekly-starter.html", action: "Open the printable worksheet", time: "5–10 min" },
      ],
    },
  };
}

function emptyProgress(): ProgressByGoal {
  return { learn: [], train: [], nutrition: [] };
}

function readSavedProgress(paths: Record<GoalId, GoalPath>): ProgressByGoal {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyProgress();
    const saved = parsed as Partial<Record<GoalId, unknown>>;
    const result = emptyProgress();
    for (const goalId of GOAL_IDS) {
      const value = saved[goalId];
      if (!Array.isArray(value)) continue;
      const allowed = new Set(paths[goalId].steps.map((step) => step.id));
      result[goalId] = value.filter((stepId): stepId is string => typeof stepId === "string" && allowed.has(stepId));
    }
    return result;
  } catch {
    return emptyProgress();
  }
}

export function GoalBasedStartPathway({
  recipePlannerUrl,
}: {
  recipePlannerUrl: string;
}) {
  const paths = buildPaths(recipePlannerUrl);
  const [selectedGoal, setSelectedGoal] = useState<GoalId>("train");
  const [completedByGoal, setCompletedByGoal] = useState<ProgressByGoal>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);
  const activePath = paths[selectedGoal];
  const completed = completedByGoal[selectedGoal];
  const completedCount = completed.length;

  useEffect(() => {
    setCompletedByGoal(readSavedProgress(paths));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedByGoal));
    } catch {
      // The checklist still works for this visit if browser storage is unavailable.
    }
  }, [completedByGoal, hydrated]);

  const toggleStep = (stepId: string, checked: boolean) => {
    setCompletedByGoal((previous) => {
      const current = previous[selectedGoal];
      const next = checked
        ? current.includes(stepId) ? current : [...current, stepId]
        : current.filter((id) => id !== stepId);
      return { ...previous, [selectedGoal]: next };
    });
  };

  const resetProgress = () => {
    setCompletedByGoal((previous) => ({ ...previous, [selectedGoal]: [] }));
  };

  return (
    <section id="goal-pathway" className="growth-section border-y border-white/10 bg-white/[0.015]">
      <div className="growth-wrap">
        <p className="growth-kicker">YOUR GOAL / YOUR FIRST WEEK</p>
        <div className="max-w-3xl">
          <h2>
            Choose one goal.
            <br />
            <em>Take one small step at a time.</em>
          </h2>
          <p className="growth-lead mt-4">
            Pick the outcome that matters most right now. You will get seven practical steps, but you can spread them out, skip what does not fit, and come back when you are ready.
          </p>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3" role="group" aria-label="Choose your main goal">
          {GOALS.map((goal) => {
            const selected = selectedGoal === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                data-goal={goal.id}
                aria-pressed={selected}
                aria-controls="start-week-plan"
                onClick={() => setSelectedGoal(goal.id)}
                className={`min-h-36 border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${selected ? "border-lime bg-lime/[0.06]" : "border-white/15 bg-black/20 hover:border-white/35"}`}
              >
                <span className={`meta text-[0.42rem] font-bold tracking-[0.16em] ${selected ? "text-lime" : "text-white/45"}`}>{goal.eyebrow}</span>
                <span className="display mt-3 block text-xl font-semibold leading-tight text-white">{goal.label}</span>
                <span className="mt-2 block text-sm leading-relaxed text-white/55">{goal.description}</span>
              </button>
            );
          })}
        </div>

        <div id="start-week-plan" className="mt-8 border border-white/15 bg-[#090909]" aria-live="polite">
          <div className="grid gap-5 border-b border-white/10 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="growth-kicker">A PLAN THAT FITS REAL LIFE</p>
              <h3 className="display mt-2 text-2xl font-bold text-white">{activePath.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{activePath.summary}</p>
              <p className="mt-3 text-xs text-white/45">{completedCount} of 7 steps checked · saved only in this browser on this device</p>
              <div className="mt-3 h-1.5 w-full max-w-sm overflow-hidden bg-white/10" role="progressbar" aria-label="First-week pathway progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={completedCount}>
                <div className="h-full bg-lime transition-[width] duration-300" style={{ width: `${(completedCount / 7) * 100}%` }} />
              </div>
            </div>
            <button type="button" onClick={resetProgress} disabled={completedCount === 0} className="justify-self-start border border-white/15 px-3 py-2 text-xs text-white/55 transition-colors hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 lg:justify-self-end">
              Reset this goal
            </button>
          </div>

          <ol className="divide-y divide-white/10">
            {activePath.steps.map((step, index) => {
              const isComplete = completed.includes(step.id);
              return (
                <li key={step.id} className="grid grid-cols-[auto_1fr] gap-4 p-5 transition-colors hover:bg-white/[0.02] sm:p-6">
                  <label className="mt-1 flex cursor-pointer items-start">
                    <input
                      type="checkbox"
                      checked={isComplete}
                      onChange={(event) => toggleStep(step.id, event.currentTarget.checked)}
                      aria-label={`Mark day ${index + 1} complete: ${step.title}`}
                      className="h-5 w-5 accent-lime"
                    />
                  </label>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="meta text-[0.42rem] font-bold tracking-[0.13em] text-lime">DAY {String(index + 1).padStart(2, "0")}</span>
                      <span className="text-xs text-white/35">{step.time}</span>
                      {isComplete ? <span className="meta text-[0.4rem] tracking-[0.12em] text-lime">DONE</span> : null}
                    </div>
                    <h4 className={`display mt-1 text-lg font-semibold ${isComplete ? "text-white/55 line-through decoration-white/30" : "text-white"}`}>{step.title}</h4>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/55">{step.description}</p>
                    <a href={step.href} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-lime underline decoration-lime/40 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime">
                      {step.action} →
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="border-t border-white/10 px-5 py-4 sm:px-7">
            <p className="max-w-4xl text-xs leading-relaxed text-white/45">
              These are general education and activity ideas, not individual medical, nutrition, or training advice. Adapt them to your circumstances. Stop if something hurts, and consult a qualified professional about personal health questions. You do not need to complete all seven steps to make progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
