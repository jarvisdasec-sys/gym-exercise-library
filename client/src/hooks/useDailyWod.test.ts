// @vitest-environment happy-dom
import { act, createElement, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDailyWod } from "./useDailyWod";
import { getWodForDate } from "../lib/wod";
import { createWodClock, localDateKey } from "../lib/wodClock";

function Display() {
  const { dateKey, workout } = useDailyWod();
  return createElement("p", null, `${dateKey}: ${workout.title}`);
}
let root: Root;
let container: HTMLDivElement;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 20, 23, 59, 59));
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const mount = () => act(() => root.render(createElement(StrictMode, null, createElement(Display), createElement(Display))));
const expectDate = (date: Date) => {
  expect(container.querySelectorAll("p")).toHaveLength(2);
  for (const element of container.querySelectorAll("p")) {
    expect(element.textContent).toBe(`${localDateKey(date)}: ${getWodForDate(date).title}`);
  }
};

describe("open WOD displays", () => {
  it("updates both mounted displays at midnight without a refresh and schedules the following night", () => {
    mount();
    expectDate(new Date(2026, 8, 20));
    act(() => vi.advanceTimersByTime(1000));
    expectDate(new Date(2026, 8, 21));
    act(() => vi.advanceTimersByTime(86_400_000));
    expectDate(new Date(2026, 8, 22));
    expect(vi.getTimerCount()).toBe(2);
  });

  it.each(["focus", "visibilitychange", "pageshow"])("catches up immediately on %s after sleeping multiple days", event => {
    mount();
    vi.setSystemTime(new Date(2026, 8, 24, 9));
    act(() => (event === "visibilitychange" ? document : window).dispatchEvent(new Event(event)));
    expectDate(new Date(2026, 8, 24));
    expect(vi.getTimerCount()).toBe(2);
  });

  it("detects a local clock/date change while the page stays active", () => {
    vi.setSystemTime(new Date(2026, 8, 20, 10));
    mount();
    vi.setSystemTime(new Date(2026, 8, 19, 10));
    act(() => vi.advanceTimersByTime(60_000));
    expectDate(new Date(2026, 8, 19));
  });

  it("reschedules midnight after a same-day clock adjustment", () => {
    vi.setSystemTime(new Date(2026, 8, 20, 12));
    mount();
    vi.setSystemTime(new Date(2026, 8, 20, 20));
    const timeout = vi.spyOn(globalThis, "setTimeout");
    act(() => window.dispatchEvent(new Event("focus")));
    expect(timeout).toHaveBeenLastCalledWith(expect.any(Function), 4 * 3_600_000);
    expectDate(new Date(2026, 8, 20));
  });

  it("shares timers across subscribers and cleans up every listener through unmount/remount", () => {
    const addWindow = vi.spyOn(window, "addEventListener");
    const removeWindow = vi.spyOn(window, "removeEventListener");
    const addDocument = vi.spyOn(document, "addEventListener");
    const removeDocument = vi.spyOn(document, "removeEventListener");
    mount();
    expect(vi.getTimerCount()).toBe(2);
    for (let i = 0; i < 3; i++) act(() => window.dispatchEvent(new Event("focus")));
    expect(vi.getTimerCount()).toBe(2);
    act(() => root.render(null));
    expect(vi.getTimerCount()).toBe(0);
    for (const event of ["focus", "pageshow"]) {
      expect(removeWindow.mock.calls.filter(([name]) => name === event)).toEqual(addWindow.mock.calls.filter(([name]) => name === event));
    }
    expect(removeDocument.mock.calls.filter(([name]) => name === "visibilitychange")).toEqual(addDocument.mock.calls.filter(([name]) => name === "visibilitychange"));
    mount();
    expect(vi.getTimerCount()).toBe(2);
  });

  it("does not notify subscribers when the local date stays the same", () => {
    const clock = createWodClock();
    const listener = vi.fn();
    const unsubscribe = clock.subscribe(listener);
    window.dispatchEvent(new Event("focus"));
    document.dispatchEvent(new Event("visibilitychange"));
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
    expect(vi.getTimerCount()).toBe(0);
  });
});
