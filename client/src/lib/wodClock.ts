/** Shared local-calendar clock: one timer/listener set for all WOD displays. */
export function localDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function millisecondsUntilMidnight(now = new Date()): number {
  // Construct the next local midnight rather than adding 24 hours (DST).
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
}

export function createWodClock() {
  let day = localDateKey();
  const listeners = new Set<() => void>();
  let midnight: ReturnType<typeof setTimeout> | undefined;
  let watchdog: ReturnType<typeof setInterval> | undefined;

  const check = () => {
    if (listeners.size === 0) return;
    const now = new Date();
    const nextDay = localDateKey(now);
    clearTimeout(midnight);
    midnight = setTimeout(check, millisecondsUntilMidnight(now));
    if (nextDay !== day) {
      day = nextDay;
      listeners.forEach(listener => listener());
    }
  };

  return {
    getSnapshot: () => day,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        window.addEventListener("focus", check);
        window.addEventListener("pageshow", check);
        document.addEventListener("visibilitychange", check);
        // Browsers have no timezone-change event. Recheck clock/zone changes
        // at most a minute later while active, without re-rendering every minute.
        watchdog = setInterval(check, 60_000);
        check();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          clearTimeout(midnight);
          clearInterval(watchdog);
          window.removeEventListener("focus", check);
          window.removeEventListener("pageshow", check);
          document.removeEventListener("visibilitychange", check);
        }
      };
    },
  };
}
