import { useEffect, useState } from "react";
const presets = {
  Rest: 60,
  Countdown: 300,
  Stopwatch: 0,
  Interval: 45,
  Tabata: 20,
  EMOM: 60,
  AMRAP: 1200,
  Circuit: 300,
};
type Mode = keyof typeof presets;
const clock = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
export default function WorkoutTimer() {
  const [mode, setMode] = useState<Mode>("Rest"),
    [seconds, setSeconds] = useState(60),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setSeconds(v => (mode === "Stopwatch" ? v + 1 : Math.max(0, v - 1))),
      1000
    );
    return () => clearInterval(id);
  }, [running, mode]);
  const change = (next: Mode) => {
    setMode(next);
    setSeconds(presets[next]);
    setRunning(false);
  };
  return (
    <section className="border border-white/12 bg-plate p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="meta text-[0.45rem] text-lime">Stay in the workout</p>
          <h2 className="display mt-2 text-2xl font-bold text-white">
            Workout timer
          </h2>
        </div>
        <select
          aria-label="Timer mode"
          className="border border-white/20 bg-black px-3 py-2 text-sm text-white"
          value={mode}
          onChange={e => change(e.target.value as Mode)}
        >
          {Object.keys(presets).map(x => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <output className="display block py-10 text-center text-7xl font-bold text-lime sm:text-9xl">
        {clock(seconds)}
      </output>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          className="bg-lime px-5 py-3 text-black"
          onClick={() => setRunning(v => !v)}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="border border-white/20 px-5 py-3 text-white"
          onClick={() => {
            setRunning(false);
            setSeconds(presets[mode]);
          }}
        >
          Reset
        </button>
        <label className="meta flex items-center gap-2 border border-white/20 px-3 text-[0.45rem] text-white/60">
          Seconds
          <input
            className="w-20 bg-black p-2 text-white"
            type="number"
            min="0"
            value={seconds}
            onChange={e => {
              setSeconds(Math.max(0, Number(e.target.value)));
              setRunning(false);
            }}
          />
        </label>
      </div>
    </section>
  );
}
