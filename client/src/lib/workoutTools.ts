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
  time?: string;
  rest: string;
  libraryEntry?: boolean;
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
const STORAGE_KEY = "btb-workout-tools-v2";
const empty: WorkoutState = { saved: [], history: [], challenges: {} };

export const workoutStorageKey = (userId?: string | null) =>
  `${STORAGE_KEY}:${userId ?? "guest"}`;

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
  durations: [15, 20, 30, 45, 60, 90],
  focus: [
    "Full Body",
    "Upper Body",
    "Lower Body",
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
  ],
  energy: ["Low", "Normal", "High"],
  soreness: ["None", "Mild", "Lower Body", "Upper Body", "High"],
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

type MovementPattern =
  | "squat"
  | "hinge"
  | "push"
  | "pull"
  | "core"
  | "unilateral"
  | "conditioning";

type Candidate = Pick<
  Exercise,
  "slug" | "name" | "category" | "equipment" | "difficulty" | "primary"
> & {
  movement: MovementPattern;
  libraryEntry: boolean;
};

const BODYWEIGHT_FALLBACKS: Candidate[] = [
  { slug: "bodyweight-squat", name: "Bodyweight Squat", category: "legs", equipment: "Bodyweight", difficulty: "Beginner", primary: "Quads + Glutes", movement: "squat", libraryEntry: false },
  { slug: "reverse-lunge", name: "Reverse Lunge", category: "legs", equipment: "Bodyweight", difficulty: "Beginner", primary: "Quads + Glutes", movement: "unilateral", libraryEntry: false },
  { slug: "glute-bridge", name: "Glute Bridge", category: "legs", equipment: "Bodyweight", difficulty: "Beginner", primary: "Glutes + Hamstrings", movement: "hinge", libraryEntry: false },
  { slug: "single-leg-hip-hinge", name: "Single-Leg Hip Hinge", category: "legs", equipment: "Bodyweight", difficulty: "Intermediate", primary: "Hamstrings + Glutes", movement: "hinge", libraryEntry: false },
  { slug: "incline-push-up", name: "Incline Push-Up", category: "chest", equipment: "Bodyweight", difficulty: "Beginner", primary: "Pectoralis Major", movement: "push", libraryEntry: false },
  { slug: "push-up", name: "Push-Up", category: "chest", equipment: "Bodyweight", difficulty: "Intermediate", primary: "Chest + Triceps", movement: "push", libraryEntry: false },
  { slug: "prone-y-raise", name: "Prone Y Raise", category: "back", equipment: "Bodyweight", difficulty: "Beginner", primary: "Upper Back", movement: "pull", libraryEntry: false },
  { slug: "reverse-snow-angel", name: "Reverse Snow Angel", category: "back", equipment: "Bodyweight", difficulty: "Intermediate", primary: "Upper Back + Rear Delts", movement: "pull", libraryEntry: false },
  { slug: "dead-bug", name: "Dead Bug", category: "core", equipment: "Bodyweight", difficulty: "Beginner", primary: "Full Core", movement: "core", libraryEntry: false },
  { slug: "bird-dog", name: "Bird Dog", category: "core", equipment: "Bodyweight", difficulty: "Beginner", primary: "Core + Glutes", movement: "core", libraryEntry: false },
  { slug: "mountain-climber", name: "Mountain Climber", category: "core", equipment: "Bodyweight", difficulty: "Intermediate", primary: "Full Core", movement: "conditioning", libraryEntry: false },
];

const levelRank = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;

const movementPattern = (exercise: Exercise): MovementPattern => {
  const value = `${exercise.name} ${exercise.primary}`.toLowerCase();
  if (exercise.category === "core") return "core";
  if (/lunge|split|single-arm|single-leg/.test(value)) return "unilateral";
  if (/deadlift|hip thrust|hyperextension|leg curl|hamstring|glute/.test(value)) return "hinge";
  if (exercise.category === "legs") return "squat";
  if (exercise.category === "back" || /curl/.test(value)) return "pull";
  return "push";
};

const candidateLibrary = (library: Exercise[]): Candidate[] => [
  ...library.map(x => ({ ...x, movement: movementPattern(x), libraryEntry: true })),
  ...BODYWEIGHT_FALLBACKS,
];

const focusMatches = (exercise: Candidate, focus: string, compatible = false) => {
  const normalized = focus.toLowerCase();
  if (normalized === "full body") return true;
  if (normalized === "upper body") {
    return ["chest", "back", "shoulders", "arms", ...(compatible ? ["core"] : [])].includes(exercise.category);
  }
  if (normalized === "lower body") {
    return exercise.category === "legs" || (compatible && exercise.category === "core");
  }
  return exercise.category === normalized || (compatible && exercise.category === "core");
};

const equipmentMatches = (exercise: Candidate, requested: string, exact = false) => {
  const normalized = requested.toLowerCase();
  if (normalized === "all equipment" || normalized.includes("all equipment")) return true;
  if (exact) return exercise.equipment.toLowerCase() === normalized;
  if (normalized === "bodyweight") return exercise.equipment === "Bodyweight";
  if (normalized.includes("dumbbell")) return exercise.equipment.toLowerCase().includes("dumbbell");
  if (normalized.includes("barbell")) return exercise.equipment.toLowerCase().includes("barbell");
  if (normalized.includes("cable")) return exercise.equipment.toLowerCase().includes("cable");
  return exercise.equipment.toLowerCase() === normalized;
};

const sorenessMatches = (exercise: Candidate, soreness: string) => {
  const normalized = soreness.toLowerCase();
  if (normalized === "none" || normalized === "mild") return true;
  const lowerBody = normalized.includes("leg") || normalized.includes("lower");
  const upperBody = normalized.includes("upper");
  if (lowerBody && exercise.category === "legs") {
    return exercise.equipment === "Bodyweight" && exercise.difficulty === "Beginner";
  }
  if (upperBody && ["chest", "back", "shoulders", "arms"].includes(exercise.category)) {
    return exercise.equipment === "Bodyweight" && exercise.difficulty === "Beginner";
  }
  return normalized !== "high" || exercise.difficulty === "Beginner";
};

const workingExerciseTarget = (duration: number) => {
  if (duration <= 15) return 3;
  if (duration <= 20) return 4;
  if (duration <= 30) return 6;
  if (duration <= 45) return 7;
  if (duration <= 60) return 9;
  return 10;
};

export function generateWorkout(
  library: Exercise[],
  input: Readiness
): ToolWorkout | null {
  const candidates = candidateLibrary(library);
  const allowedLevel = levelRank[input.level as keyof typeof levelRank] ?? 0;
  const appropriateLevel = (exercise: Candidate) => levelRank[exercise.difficulty] <= allowedLevel;
  const pool: Candidate[] = [];
  const addTier = (tier: Candidate[]) => {
    for (const exercise of tier) {
      if (!pool.some(existing => existing.slug === exercise.slug)) pool.push(exercise);
    }
  };
  const eligible = candidates.filter(x => appropriateLevel(x) && sorenessMatches(x, input.soreness));
  addTier(eligible.filter(x => equipmentMatches(x, input.equipment, true) && focusMatches(x, input.focus)));
  addTier(eligible.filter(x => equipmentMatches(x, input.equipment) && focusMatches(x, input.focus, true)));
  addTier(eligible.filter(x => equipmentMatches(x, input.equipment)));
  addTier(eligible.filter(x => x.equipment === "Bodyweight" && focusMatches(x, input.focus, true)));
  if (!pool.length) return null;
  const count = workingExerciseTarget(input.duration);
  const chosen: Candidate[] = [];
  const patternOrder: MovementPattern[] =
    input.focus === "Full Body"
      ? ["squat", "hinge", "push", "pull", "core", "unilateral", "conditioning"]
      : input.focus === "Lower Body" || input.focus === "Legs"
        ? ["squat", "hinge", "unilateral", "core", "conditioning", "push", "pull"]
        : ["push", "pull", "unilateral", "core", "conditioning", "squat", "hinge"];
  const preferredPool = pool.filter(x => focusMatches(x, input.focus));
  for (const pattern of patternOrder) {
    if (chosen.length >= count) break;
    const exercise = preferredPool.find(
      x => x.movement === pattern && !chosen.some(y => y.slug === x.slug)
    );
    if (exercise) chosen.push(exercise);
  }
  for (const exercise of preferredPool) {
    if (chosen.length >= count) break;
    if (!chosen.some(existing => existing.slug === exercise.slug)) chosen.push(exercise);
  }
  for (const pattern of patternOrder) {
    if (chosen.length >= count) break;
    const exercise = pool.find(
      x => x.movement === pattern && !chosen.some(y => y.slug === x.slug)
    );
    if (exercise) chosen.push(exercise);
  }
  for (const x of pool) {
    if (chosen.length >= count) break;
    if (!chosen.some(y => y.slug === x.slug)) chosen.push(x);
  }
  const sets =
    input.energy === "Low" || input.soreness !== "None" || input.intensity === "Light"
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
    rest: input.goal === "Strength" ? "120 sec" : "60 sec",
    libraryEntry: x.libraryEntry,
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
  const readiness = workout.readiness ?? initialReadiness;
  const candidates = candidateLibrary(library);
  const source = candidates.find(x => x.slug === current.slug);
  const allowedLevel = levelRank[readiness.level as keyof typeof levelRank] ?? 0;
  const compatible = candidates.filter(
    x =>
      x.slug !== current.slug &&
      equipmentMatches(x, readiness.equipment) &&
      focusMatches(x, readiness.focus, true) &&
      levelRank[x.difficulty] <= allowedLevel &&
      sorenessMatches(x, readiness.soreness)
  );
  const next =
    compatible.find(x => source && x.movement === source.movement) ??
    compatible.find(x => x.primary === current.primary) ??
    compatible[0];
  if (!next) return workout;
  const exercises = [...workout.exercises];
  exercises[index] = {
    ...current,
    slug: next.slug,
    name: next.name,
    primary: next.primary,
    equipment: next.equipment,
    difficulty: next.difficulty,
    libraryEntry: next.libraryEntry,
  };
  return { ...workout, exercises };
}
export function readState(userId?: string | null): WorkoutState {
  if (typeof localStorage === "undefined") return structuredClone(empty);
  try {
    return {
      ...structuredClone(empty),
      ...JSON.parse(localStorage.getItem(workoutStorageKey(userId)) || "{}"),
    };
  } catch {
    return structuredClone(empty);
  }
}
const write = (state: WorkoutState, userId?: string | null) => {
  if (typeof localStorage === "undefined") {
    throw new Error("Local storage is unavailable in this browser.");
  }
  try {
    localStorage.setItem(workoutStorageKey(userId), JSON.stringify(state));
  } catch {
    throw new Error(
      "Could not save to this device. Local storage may be full or disabled."
    );
  }
  return state;
};
export const saveWorkout = (workout: ToolWorkout, userId?: string | null) => {
  const s = readState(userId);
  return write({
    ...s,
    saved: [workout, ...s.saved.filter(x => x.id !== workout.id)],
  }, userId);
};
export const completeWorkout = (
  workout: ToolWorkout,
  performance: Record<string, string> = {},
  userId?: string | null
) => {
  const s = readState(userId);
  return write({
    ...s,
    history: [
      { ...workout, completedAt: new Date().toISOString(), performance },
      ...s.history,
    ],
  }, userId);
};
export const removeSaved = (id: string, userId?: string | null) => {
  const s = readState(userId);
  return write({ ...s, saved: s.saved.filter(x => x.id !== id) }, userId);
};
export const updateChallenge = (id: string, value: number, userId?: string | null) => {
  const s = readState(userId);
  return write({
    ...s,
    challenges: { ...s.challenges, [id]: Math.max(0, value || 0) },
  }, userId);
};
export type CustomExerciseInput = Pick<
  Exercise,
  "slug" | "name" | "primary" | "equipment" | "difficulty"
> & {
  sets: number;
  reps: string;
  time?: string;
  rest: string;
};

export const createCustomWorkout = (
  title: string,
  format: string,
  duration: number,
  selected: CustomExerciseInput[]
): ToolWorkout => {
  const exercises = selected.map((x, i) => ({
    id: `${x.slug}-${i}`,
    slug: x.slug,
    name: x.name,
    primary: x.primary,
    equipment: x.equipment,
    difficulty: x.difficulty,
    sets: x.sets,
    reps: x.reps,
    time: x.time,
    rest: x.rest,
    libraryEntry: true,
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
