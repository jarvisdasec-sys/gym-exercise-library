import { describe, expect, it } from "vitest";
import { EXERCISES } from "@/lib/exercises";
import { generateWorkout, swapExercise, type Readiness } from "@/lib/workoutTools";

const base: Readiness = {
  goal: "General Fitness",
  level: "Intermediate",
  duration: 30,
  focus: "Full Body",
  equipment: "Bodyweight",
  energy: "Normal",
  soreness: "None",
  intensity: "Moderate",
};

const cases: Array<[string, Partial<Readiness>, number, number]> = [
  ["Test A", {}, 5, 6],
  [
    "Test B",
    { goal: "Fat Loss", level: "Beginner", duration: 20 },
    4,
    4,
  ],
  [
    "Test C",
    {
      goal: "Muscle Gain",
      duration: 45,
      focus: "Upper Body",
      equipment: "Dumbbells",
    },
    6,
    8,
  ],
  [
    "Test D",
    {
      goal: "Strength",
      level: "Advanced",
      duration: 60,
      equipment: "Gym / All Equipment",
      energy: "High",
      intensity: "Hard",
    },
    8,
    10,
  ],
  [
    "Test E",
    {
      level: "Beginner",
      focus: "Lower Body",
      energy: "Low",
      soreness: "Lower Body",
      intensity: "Light",
    },
    5,
    6,
  ],
];

describe("generateWorkout", () => {
  it.each(cases)("%s produces a complete workout", (_, overrides, minimum, maximum) => {
    const workout = generateWorkout(EXERCISES, { ...base, ...overrides });

    expect(workout).not.toBeNull();
    expect(workout!.warmup.length).toBeGreaterThan(0);
    expect(workout!.exercises.length).toBeGreaterThanOrEqual(minimum);
    expect(workout!.exercises.length).toBeLessThanOrEqual(maximum);
    expect(workout!.cooldown.length).toBeGreaterThan(0);
    expect(new Set(workout!.exercises.map(exercise => exercise.slug)).size).toBe(
      workout!.exercises.length
    );
  });

  it("keeps swaps compatible with bodyweight workouts", () => {
    const workout = generateWorkout(EXERCISES, base)!;
    const swapped = swapExercise(workout, 0, EXERCISES);

    expect(swapped.exercises[0].slug).not.toBe(workout.exercises[0].slug);
    expect(swapped.exercises[0].equipment).toBe("Bodyweight");
  });

  it("prioritizes the requested focus before adjacent fallback categories", () => {
    const lower = generateWorkout(EXERCISES, {
      ...base,
      level: "Beginner",
      focus: "Lower Body",
      energy: "Low",
      soreness: "Lower Body",
      intensity: "Light",
    })!;

    expect(lower.exercises.slice(0, 3).every(exercise =>
      ["Quads + Glutes", "Glutes + Hamstrings"].includes(exercise.primary)
    )).toBe(true);
  });
});