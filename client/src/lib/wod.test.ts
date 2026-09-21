import { describe, expect, it } from "vitest";
import { DAILY_WODS, getWodForDate } from "./wod";
import { millisecondsUntilMidnight } from "./wodClock";

describe("daily workout rotation", () => {
  it("contains 14 unique complete workouts", () => {
    expect(DAILY_WODS).toHaveLength(14);
    expect(new Set(DAILY_WODS.map(wod => wod.title)).size).toBe(14);
    for (const wod of DAILY_WODS) {
      for (const value of Object.values(wod)) expect(value.length).toBeGreaterThan(0);
      for (const exercise of wod.exercises) {
        expect(exercise.name).toBeTruthy();
        expect(exercise.prescription).toBeTruthy();
        expect(exercise.rest).toBeTruthy();
      }
    }
    for (const wod of DAILY_WODS.slice(5)) expect(wod.instructions).toBeTruthy();
  });

  it("returns the same workout throughout the same local calendar day", () => {
    expect(getWodForDate(new Date(2026, 8, 20, 0))).toBe(getWodForDate(new Date(2026, 8, 20, 23, 59, 59)));
    expect(getWodForDate(new Date(2026, 8, 20, 12))).toBe(getWodForDate(new Date(2026, 8, 20, 12)));
  });

  it("advances on consecutive dates, reaches all 14, and wraps 14 to 1", () => {
    const reached = new Set();
    let wrapped = false;
    for (let day = 1; day <= 28; day++) {
      const current = getWodForDate(new Date(2026, 0, day));
      const next = getWodForDate(new Date(2026, 0, day + 1));
      const index = DAILY_WODS.indexOf(current);
      expect(next).toBe(DAILY_WODS[(index + 1) % 14]);
      expect(getWodForDate(new Date(2026, 0, day + 14))).toBe(current);
      reached.add(current);
      if (index === 13) { expect(next).toBe(DAILY_WODS[0]); wrapped = true; }
    }
    expect(reached.size).toBe(14);
    expect(wrapped).toBe(true);
  });

  it.each([[2026, 0, 31], [2026, 11, 31], [2028, 1, 29]])("advances across calendar boundaries %s-%s-%s", (year, month, day) => {
    const before = getWodForDate(new Date(year, month, day, 23, 59, 59));
    expect(getWodForDate(new Date(year, month, day + 1))).toBe(DAILY_WODS[(DAILY_WODS.indexOf(before) + 1) % 14]);
  });

  it("schedules the next local midnight, including short/long DST days", () => {
    for (const date of [new Date(2026, 2, 8), new Date(2026, 10, 1), new Date(2026, 8, 20, 23, 59, 59)]) {
      const midnight = new Date(date.getTime() + millisecondsUntilMidnight(date));
      expect(midnight.getHours()).toBe(0);
      expect(midnight.getMinutes()).toBe(0);
      expect(midnight.getDate()).toBe(date.getDate() + 1);
    }
    expect(millisecondsUntilMidnight(new Date(2026, 8, 20, 23, 59, 59))).toBe(1000);
  });
});
