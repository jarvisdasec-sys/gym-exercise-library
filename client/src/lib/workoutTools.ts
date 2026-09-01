import type { Exercise } from "@/lib/exercises";

export type Readiness = {
  goal: string;
  level: string;
  duration: number;
  focus: string;
  equipment: string;
  energy: string;
  soreness: string;
  intensity: string;
};
export type ToolExercise = {
  id: string;
  slug: string;
  name: string;
  primary: string;
  equipment: string;
  difficulty: string;
  sets: number;
  reps: string;
  rest: number;
};
export type ToolWorkout = {
  id: string;
  title: string;
  duration: number;
  format: string;
  readiness?: Readiness;
  exercises: ToolExercise[];
  warmup: string[];
  cooldown: string[];
};
export type WorkoutState = {
  saved: ToolWorkout[];
  history: Array<
    ToolWorkout & { completedAt: string; performance?: Record<string, string> }
  >;
  challenges: Record<string, number>;
};
const STORAGE_KEY = "btb-workout-tools-v1";
const empty: WorkoutState = { saved: [], history: [], challenges: {} };

export const options = {
  goals: [
    "General Fitness",
    "Fat Loss",
    "Muscle Gain",
    "Strength",
    "Endurance",
    "Conditioning",
  ],
  levels: ["Beginner", "Intermediate", "Advanced"],
  durations: [15, 30, 45, 60, 90],
  focus: ["Full Body", "Chest", "Back", "Legs", "Shoulders", "Arms", "Core"],
  energy: ["Low", "Normal", "High"],
  soreness: ["None", "Mild", "High"],
  intensity: ["Light", "Moderate", "Hard"],
};
export const initialReadiness: Readiness = {
  goal: "General Fitness",
  level: "Beginner",
  duration: 30,
  focus: "Full Body",
  equipment: "All Equipment",
  energy: "Normal",
  soreness: "None",
  intensity: "Moderate",
};
const categoryLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
const warmup = (muscles: string[]) => [
  "3–5 minutes of easy movement",
  `Controlled mobility for ${muscles.slice(0, 3).join(", ")}`,
  "One light rehearsal set of the first movement",
];
const cooldown = (muscles: string[]) => [
  "2–3 minutes of easy movement",
  `Comfortable stretches for ${muscles.slice(0, 3).join(", ")}`,
  "Slow breathing and record your results",
];
export function generateWorkout(
  library: Exercise[],
  input: Readiness
): ToolWorkout | null {
  const focus = input.focus.toLowerCase();
  let pool = library.filter(
    x =>
      (focus === "full body" ||
        x.category === focus ||
        x.primary.toLowerCase().includes(focus)) &&
      (input.equipment === "All Equipment" ||
        x.equipment === input.equipment) &&
      (input.level !== "Beginner" || x.difficulty !== "Advanced")
  );
  if (!pool.length) return null;
  const count = Math.max(3, Math.min(9, Math.round(input.duration / 7)));
  pool = [...pool].sort((a, b) => a.slug.localeCompare(b.slug));
  const chosen: Exercise[] = [];
  for (const x of pool) {
    if (chosen.length >= count) break;
    if (!chosen.some(y => y.category === x.category)) chosen.push(x);
  }
  for (const x of pool) {
    if (chosen.length >= count) break;
    if (!chosen.includes(x)) chosen.push(x);
  }
  const sets =
    input.energy === "Low" || input.soreness === "High"
      ? 2
      : input.duration >= 60
        ? 4
        : 3;
  const reps =
    input.goal === "Strength"
      ? "4–6"
      : input.goal === "Endurance"
        ? "12–15"
        : "8–12";
  const exercises = chosen.map((x, i) => ({
    id: `${x.slug}-${i}`,
    slug: x.slug,
    name: x.name,
    primary: x.primary,
    equipment: x.equipment,
    difficulty: x.difficulty,
    sets,
    reps,
    rest: input.goal === "Strength" ? 120 : 60,
  }));
  const muscles = Array.from(new Set(exercises.map(x => x.primary)));
  return {
    id: `generated-${Date.now()}`,
    title: `${input.duration}-Minute ${input.focus} ${input.goal}`,
    duration: input.duration,
    format: "Standard",
    readiness: { ...input },
    exercises,
    warmup: warmup(muscles),
    cooldown: cooldown(muscles),
  };
}
export function swapExercise(
  workout: ToolWorkout,
  index: number,
  library: Exercise[]
) {
  const current = workout.exercises[index];
  const next =
    library.find(
      x =>
        x.slug !== current.slug &&
        x.category === library.find(y => y.slug === current.slug)?.category &&
        x.difficulty === current.difficulty
    ) ||
    library.find(x => x.slug !== current.slug && x.primary === current.primary);
  if (!next) return workout;
  const exercises = [...workout.exercises];
  exercises[index] = {
    ...current,
    slug: next.slug,
    name: next.name,
    primary: next.primary,
    equipment: next.equipment,
    difficulty: next.difficulty,
  };
  return { ...workout, exercises };
}
export function readState(): WorkoutState {
  if (typeof localStorage === "undefined") return structuredClone(empty);
  try {
    return {
      ...structuredClone(empty),
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    };
  } catch {
    return structuredClone(empty);
  }
}
const write = (state: WorkoutState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
};
export const saveWorkout = (workout: ToolWorkout) => {
  const s = readState();
  return write({
    ...s,
    saved: [workout, ...s.saved.filter(x => x.id !== workout.id)],
  });
};
export const completeWorkout = (
  workout: ToolWorkout,
  performance: Record<string, string> = {}
) => {
  const s = readState();
  return write({
    ...s,
    history: [
      { ...workout, completedAt: new Date().toISOString(), performance },
      ...s.history,
    ],
  });
};
export const removeSaved = (id: string) => {
  const s = readState();
  return write({ ...s, saved: s.saved.filter(x => x.id !== id) });
};
export const updateChallenge = (id: string, value: number) => {
  const s = readState();
  return write({
    ...s,
    challenges: { ...s.challenges, [id]: Math.max(0, value || 0) },
  });
};
export const createCustomWorkout = (
  title: string,
  format: string,
  duration: number,
  selected: Exercise[]
): ToolWorkout => {
  const exercises = selected.map((x, i) => ({
    id: `${x.slug}-${i}`,
    slug: x.slug,
    name: x.name,
    primary: x.primary,
    equipment: x.equipment,
    difficulty: x.difficulty,
    sets: 3,
    reps: "8–12",
    rest: 60,
  }));
  const muscles = Array.from(new Set(exercises.map(x => x.primary)));
  return {
    id: `custom-${Date.now()}`,
    title,
    duration,
    format,
    exercises,
    warmup: warmup(muscles),
    cooldown: cooldown(muscles),
  };
};
export const formatCategory = categoryLabel;
