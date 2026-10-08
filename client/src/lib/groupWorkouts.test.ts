import { describe, expect, it } from "vitest";
import {
  GROUP_SIZES,
  cycleInfo,
  sessions,
  movements,
  pairAssignments,
  timeline,
  phaseAt,
  durationSeconds,
} from "./groupWorkouts";
import { coaching } from "./groupExerciseCoaching";

describe("BTB 15-day group program", () => {
  it("uses UTC and repeats exactly after day 15", () => {
    expect(cycleInfo(new Date("2026-10-08T00:00:00Z")).day).toBe(1);
    expect(cycleInfo(new Date("2026-10-22T23:59:59Z")).day).toBe(15);
    const next = cycleInfo(new Date("2026-10-23T00:00:00Z"));
    expect(next.day).toBe(1);
    expect(next.cycleStart.toISOString()).toBe("2026-10-23T00:00:00.000Z");
    expect(cycleInfo(new Date("2026-10-08T23:00:00-06:00")).day).toBe(2);
  });
  it("organizes every permitted group with no idle or missing participants", () => {
    expect(GROUP_SIZES).toEqual([4, 6, 8, 10]);
    for (const size of GROUP_SIZES) {
      const pairs = pairAssignments(size);
      expect(pairs).toHaveLength(size / 2);
      expect(pairs.flatMap(pair => pair.people)).toEqual(
        Array.from({ length: size }, (_, i) => i + 1)
      );
      for (const pair of pairs) {
        expect(
          [0, 1, 2, 3]
            .map(index => pairAssignments(size, index)[pair.pair - 1].station)
            .sort()
        ).toEqual([1, 2, 3, 4]);
      }
    }
    expect(pairAssignments(10)[4].station).toBe(1);
    expect(() => pairAssignments(5)).toThrow();
  });
  it("includes the requested workout mix and complete guides for all 29 movements", () => {
    expect(sessions.map(item => item.day)).toEqual(
      Array.from({ length: 15 }, (_, i) => i + 1)
    );
    expect(sessions.some(item => item.name === "Zumba day")).toBe(true);
    for (const type of [
      "Strength",
      "Cardio",
      "Dance",
      "Core",
      "Recovery",
      "Low impact",
    ])
      expect(sessions.some(item => item.type === type)).toBe(true);
    expect(Object.keys(coaching).sort()).toEqual(Object.keys(movements).sort());
    expect(Object.keys(coaching)).toHaveLength(29);
    for (const item of sessions) expect(item.ids).toHaveLength(4);
    for (const guide of Object.values(coaching)) {
      for (const steps of [guide.steps, guide.easySteps]) {
        expect(steps).toHaveLength(3);
        expect(steps.every(step => step.length >= 25)).toBe(true);
      }
      expect(guide.breathe.length).toBeGreaterThan(25);
      expect(guide.avoid.length).toBeGreaterThan(25);
    }
  });
  it("accounts for all warm-up, work, rest and cooldown phases", () => {
    for (const item of sessions) {
      const phases = timeline(item);
      expect(phases.filter(phase => phase.kind === "Warm-up")).toHaveLength(5);
      expect(phases.filter(phase => phase.kind === "Work")).toHaveLength(
        item.rounds * 4
      );
      expect(
        phases.filter(phase => phase.kind === "Rest / rotate")
      ).toHaveLength(item.rounds * 4);
      expect(phases.filter(phase => phase.kind === "Cooldown")).toHaveLength(3);
      expect(durationSeconds(item)).toBe(
        480 + item.rounds * 4 * (item.work + item.rest)
      );
      let offset = 0;
      phases.forEach((phase, index) => {
        expect(phaseAt(phases, offset).index).toBe(index);
        expect(phaseAt(phases, offset).remaining).toBe(phase.seconds);
        offset += phase.seconds;
      });
      expect(phaseAt(phases, offset).kind).toBe("Finished");
    }
  });
});
