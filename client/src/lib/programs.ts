import { getWorkout, type Workout, type WorkoutBlockItem } from "@/lib/workouts";

export interface ProgramWorkout {
  id: string;
  day: number;
  name: string;
  warmup: string[];
  workout: Workout;
  cooldown: string[];
}

export interface ProgramWeek {
  week: number;
  title: string;
  focus: string;
  workouts: ProgramWorkout[];
}

export interface TrainingProgram {
  id: string;
  name: string;
  goal: string;
  description: string;
  durationWeeks: number;
  daysPerWeek: number;
  weeks: ProgramWeek[];
}

type ProgramPlan = Omit<TrainingProgram, "weeks"> & {
  templates: string[];
  progression: "foundation" | "density" | "hypertrophy" | "strength" | "conditioning";
};

const plans: ProgramPlan[] = [
  {
    id: "beginner-fitness",
    name: "Beginner Fitness",
    goal: "Build movement skill, full-body strength, and a consistent training habit.",
    description: "Three full-body days with a rest day between sessions. Start conservatively, learn each movement, then add reps and working sets across six weeks.",
    durationWeeks: 6,
    daysPerWeek: 3,
    templates: ["full-body-starter", "machine-circuit", "full-body-starter"],
    progression: "foundation",
  },
  {
    id: "fat-loss",
    name: "Fat Loss",
    goal: "Preserve strength while increasing weekly training density and energy expenditure.",
    description: "Two resistance days, one full-body circuit, and one trunk-conditioning day. Keep at least one easier day after the circuit.",
    durationWeeks: 6,
    daysPerWeek: 4,
    templates: ["upper-body", "lower-body", "machine-circuit", "core-and-abs"],
    progression: "density",
  },
  {
    id: "muscle-gain",
    name: "Muscle Gain",
    goal: "Accumulate progressive hypertrophy volume across an upper/lower split.",
    description: "Four weekly sessions train each major muscle group twice. Rep targets rise within each block before an additional set is introduced.",
    durationWeeks: 8,
    daysPerWeek: 4,
    templates: ["upper-body", "lower-body", "push-day", "legs-and-glutes"],
    progression: "hypertrophy",
  },
  {
    id: "strength",
    name: "Strength",
    goal: "Improve force production in the major squat, hinge, press, and pull patterns.",
    description: "Four days pair low-rep compound work with controlled accessories. Loads should rise only after every prescribed rep is clean.",
    durationWeeks: 8,
    daysPerWeek: 4,
    templates: ["strength-push-pull", "legs-and-glutes", "upper-body", "lower-body"],
    progression: "strength",
  },
  {
    id: "conditioning",
    name: "Conditioning",
    goal: "Build repeatable work capacity without sacrificing recovery.",
    description: "Alternate full-body circuits, resistance conditioning, trunk work, and a lighter dumbbell day. Density increases gradually while exercise quality stays fixed.",
    durationWeeks: 6,
    daysPerWeek: 4,
    templates: ["machine-circuit", "full-body-starter", "core-and-abs", "dumbbell-only"],
    progression: "conditioning",
  },
];

const parseRange = (value: string) => {
  const match = value.match(/^(\d+)(?:[–-](\d+))?(.*)$/);
  if (!match) return null;
  return {
    low: Number(match[1]),
    high: Number(match[2] ?? match[1]),
    suffix: match[3],
  };
};

const progressItem = (
  item: WorkoutBlockItem,
  week: number,
  progression: ProgramPlan["progression"],
): WorkoutBlockItem => {
  const range = parseRange(item.reps);
  const baseSets = Number.parseInt(item.sets, 10) || 3;
  const wave = (week - 1) % 3;
  const setIncrease = week >= 4 ? 1 : 0;
  let sets = baseSets + setIncrease;
  let reps = item.reps;
  let rest = item.rest;

  if (range) {
    if (progression === "strength") {
      const reduction = Math.min(2, Math.floor((week - 1) / 3));
      reps = `${Math.max(3, range.low - reduction)}–${Math.max(5, range.high - reduction)}${range.suffix}`;
      sets = baseSets + Math.floor((week - 1) / 2);
    } else {
      reps = `${range.low + wave}–${range.high + wave}${range.suffix}`;
    }
  }

  if (["density", "conditioning"].includes(progression)) {
    rest = item.rest.replace(/(\d+) s/, (_, seconds: string) =>
      `${Math.max(30, Number(seconds) - (week - 1) * 5)} s`,
    );
  }

  return {
    ...item,
    sets: String(sets),
    reps,
    rest,
    cue: `${item.cue} Week ${week}: ${
      progression === "strength"
        ? "add load only when every rep is crisp."
        : progression === "conditioning" || progression === "density"
          ? "finish each set with enough control to repeat the pace."
          : "use the top of the rep range before increasing load."
    }`,
  };
};

const buildWorkout = (
  plan: ProgramPlan,
  templateSlug: string,
  week: number,
  day: number,
): ProgramWorkout => {
  const template = getWorkout(templateSlug);
  if (!template) throw new Error(`Unknown program workout template: ${templateSlug}`);
  const workout: Workout = {
    ...template,
    slug: `${plan.id}-w${week}-d${day}`,
    name: `${template.name} · Week ${week}, Day ${day}`,
    summary: `${template.summary} Week ${week} progression.`,
    blocks: template.blocks.map(block => ({
      ...block,
      items: block.items.map(item => progressItem(item, week, plan.progression)),
    })),
    rules: [
      `Week ${week}: complete the written prescription before adding load or pace.`,
      ...template.rules,
    ],
  };

  return {
    id: workout.slug,
    day,
    name: template.name,
    warmup: [
      "3–5 minutes of easy movement to raise body temperature.",
      `Complete one controlled mobility round for ${template.focus.toLowerCase()}.`,
      "Perform two lighter rehearsal sets before the first working movement.",
    ],
    workout,
    cooldown: [
      "2–3 minutes of easy movement until breathing settles.",
      `Use comfortable stretches for ${template.focus.toLowerCase()}.`,
      "Record loads, reps, and any substitutions before leaving the session.",
    ],
  };
};

const buildProgram = (plan: ProgramPlan): TrainingProgram => ({
  id: plan.id,
  name: plan.name,
  goal: plan.goal,
  description: plan.description,
  durationWeeks: plan.durationWeeks,
  daysPerWeek: plan.daysPerWeek,
  weeks: Array.from({ length: plan.durationWeeks }, (_, weekIndex) => {
    const week = weekIndex + 1;
    return {
      week,
      title: `Week ${week}`,
      focus:
        week === 1
          ? "Establish technique and baseline loads"
          : week === plan.durationWeeks
            ? "Complete the strongest controlled week"
            : "Progress the written reps, sets, or training density",
      workouts: plan.templates.map((template, dayIndex) =>
        buildWorkout(plan, template, week, dayIndex + 1),
      ),
    };
  }),
});

export const TRAINING_PROGRAMS: TrainingProgram[] = plans.map(buildProgram);

export const getTrainingProgram = (id: string) =>
  TRAINING_PROGRAMS.find(program => program.id === id) ?? null;

export const getProgramWorkout = (programId: string, week: number, day: number) =>
  getTrainingProgram(programId)?.weeks.find(item => item.week === week)?.workouts.find(
    workout => workout.day === day,
  ) ?? null;