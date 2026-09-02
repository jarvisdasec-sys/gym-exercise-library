import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSavedAccountGuard } from "@/lib/savedAccount";
import { readState, saveWorkout, workoutStorageKey, type ToolWorkout } from "@/lib/workoutTools";

const workout: ToolWorkout = {
  id: "saved-workout",
  title: "User workout",
  duration: 30,
  format: "Standard",
  exercises: [],
  warmup: [],
  cooldown: [],
};

const storage = new Map<string, string>();

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    clear: () => storage.clear(),
  });
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("saved workout account isolation", () => {
  it("saves a signed-in user's workout in that user's storage", () => {
    saveWorkout(workout, "user-a");

    expect(readState("user-a").saved).toEqual([workout]);
    expect(localStorage.getItem(workoutStorageKey("user-a"))).not.toBeNull();
  });

  it("hides User A data immediately after logout and after a logged-out refresh", () => {
    saveWorkout(workout, "user-a");

    expect(readState().saved).toEqual([]);
    expect(readState().saved).toEqual([]);
  });

  it("does not expose User A workouts to User B and restores User A's own workouts", () => {
    saveWorkout(workout, "user-a");

    expect(readState("user-b").saved).toEqual([]);
    expect(readState("user-a").saved).toEqual([workout]);
  });

  it("rejects a stale User A profile request after logout or an account switch", () => {
    const guard = createSavedAccountGuard();
    guard.select("user-a");
    expect(guard.allows("user-a")).toBe(true);

    guard.select(null);
    expect(guard.allows("user-a")).toBe(false);

    guard.select("user-b");
    expect(guard.allows("user-a")).toBe(false);
    expect(guard.allows("user-b")).toBe(true);
  });
});