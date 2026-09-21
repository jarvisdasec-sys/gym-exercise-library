import { useSyncExternalStore } from "react";
import { getWodForDate } from "@/lib/wod";
import { createWodClock } from "@/lib/wodClock";

const clock = createWodClock();

export function useDailyWod() {
  const dateKey = useSyncExternalStore(clock.subscribe, clock.getSnapshot, clock.getSnapshot);
  const [year, month, day] = dateKey.split("-").map(Number);
  const today = new Date(year, month - 1, day);
  return { today, dateKey, workout: getWodForDate(today) };
}
