import { describe, expect, it } from "vitest";
import { EXERCISES } from "@/lib/exercises";
import {
  TRAINING_PROGRAMS,
  getProgramWorkout,
  type ProgramWorkout,
} from "@/lib/programs";

const expected = {
  "beginner-fitness": { weeks: 6, days: 3 },
  "fat-loss": { weeks: 6, days: 4 },
  "muscle-gain": { weeks: 8, days: 4 },
  strength: { weeks: 8, days: 4 },
  conditioning: { weeks: 6, days: 4 },
};

const phases = (workout: ProgramWorkout) => [
  workout.warmup,
  workout.workout.blocks.flatMap(block => block.items),
  workout.cooldown,
];

describe("training programs", () => {
  it("provides workout data for every visible program", () => {
    expect(TRAINING_PROGRAMS.map(program => program.name)).toEqual([
      "Beginner Fitness",
      "Fat Loss",
      "Muscle Gain",
      "Strength",
      "Conditioning",
    ]);
    expect(TRAINING_PROGRAMS.every(program => program.weeks.length > 0)).toBe(true);
  });

  it.each(TRAINING_PROGRAMS)("$name has the expected weeks and training days", program => {
    const shape = expected[program.id as keyof typeof expected];
    expect(program.durationWeeks).toBe(shape.weeks);
    expect(program.daysPerWeek).toBe(shape.days);
    expect(program.weeks).toHaveLength(shape.weeks);
    expect(program.weeks.every(week => week.workouts.length === shape.days)).toBe(true);
  });

  it("gives every scheduled workout real working exercises", () => {
    const known = new Set(EXERCISES.map(exercise => exercise.slug));
    for (const program of TRAINING_PROGRAMS) {
      for (const week of program.weeks) {
        for (const scheduled of week.workouts) {
          const exercises = scheduled.workout.blocks.flatMap(block => block.items);
          expect(exercises.length).toBeGreaterThan(0);
          expect(exercises.every(exercise => known.has(exercise.slug))).toBe(true);
        }
      }
    }
  });

  it("preserves warm-up, working exercise, cooldown ordering", () => {
    for (const program of TRAINING_PROGRAMS) {
      for (const week of program.weeks) {
        for (const scheduled of week.workouts) {
          const [warmup, working, cooldown] = phases(scheduled);
          expect(warmup.length).toBeGreaterThan(0);
          expect(working.length).toBeGreaterThan(0);
          expect(cooldown.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("changes programming prescriptions between weeks", () => {
    for (const program of TRAINING_PROGRAMS) {
      const prescriptions = program.weeks.map(week =>
        week.workouts
          .flatMap(workout => workout.workout.blocks.flatMap(block => block.items))
          .map(item => `${item.sets}:${item.reps}:${item.rest}`)
          .join("|"),
      );
      expect(new Set(prescriptions).size).toBeGreaterThan(1);
    }
  });

  it("returns the exact selected week and day for Start Workout", () => {
    const selected = getProgramWorkout("muscle-gain", 5, 3);
    expect(selected?.id).toBe("muscle-gain-w5-d3");
    expect(selected?.day).toBe(3);
    expect(selected?.workout.name).toContain("Week 5, Day 3");
    expect(getProgramWorkout("muscle-gain", 9, 3)).toBeNull();
  });
});