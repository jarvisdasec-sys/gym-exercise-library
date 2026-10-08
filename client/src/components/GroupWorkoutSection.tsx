import React, { useEffect, useMemo, useState } from "react";
import {
  GROUP_SIZES,
  sessions,
  movements,
  cycleInfo,
  pairAssignments,
  timeline,
  phaseAt,
  durationSeconds,
  warmup,
  cooldown,
} from "@/lib/groupWorkouts";
import { coaching } from "@/lib/groupExerciseCoaching";

const iso = (date: Date) => date.toISOString().slice(0, 10);
const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
const clock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
const storageKey = (name: string) => `btb-group-v1:${name}`;
function readSetting(name: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(storageKey(name)) || "null");
  } catch {
    return null;
  }
}
function saveSetting(name: string, value: unknown) {
  try {
    localStorage.setItem(storageKey(name), JSON.stringify(value));
  } catch {
    /* Storage is optional; the workout keeps working. */
  }
}
function initialSize() {
  const value = readSetting("size");
  return typeof value === "number" && GROUP_SIZES.includes(value) ? value : 4;
}
function initialCompletions(): Record<string, boolean> {
  const value = readSetting("completions");
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, done]) => done === true)
  );
}
function requestedDay(fallback: number) {
  if (typeof window === "undefined") return fallback;
  const day = Number(new URLSearchParams(window.location.search).get("day"));
  return Number.isInteger(day) && day >= 1 && day <= 15 ? day : fallback;
}

export function GroupWorkoutSection() {
  const [info, setInfo] = useState(() => cycleInfo());
  const [selection, setSelection] = useState(() => {
    const current = cycleInfo();
    const day = requestedDay(current.day);
    return {
      day,
      cycleStart: iso(current.cycleStart),
      followToday: day === current.day,
    };
  });
  const [size, setSize] = useState(initialSize);
  const [easier, setEasier] = useState(() => readSetting("easier") === true);
  const [completions, setCompletions] = useState(initialCompletions);
  const [timer, setTimer] = useState<{
    elapsed: number;
    startedAt: number | null;
  }>({ elapsed: 0, startedAt: null });
  const [now, setNow] = useState(() => Date.now());
  const item = sessions[selection.day - 1];
  const phases = useMemo(() => timeline(item), [item]);
  const total = durationSeconds(item);
  const elapsed = Math.max(
    0,
    timer.elapsed +
      (timer.startedAt === null ? 0 : (now - timer.startedAt) / 1000)
  );
  const current = phaseAt(phases, elapsed);
  const finished = current.kind === "Finished";
  const completionKey = `${selection.cycleStart}:${selection.day}`;
  const currentCycle = selection.cycleStart === iso(info.cycleStart);
  const isToday = currentCycle && selection.day === info.day;
  const completed = completions[completionKey] === true;
  const completedCount = sessions.filter(
    s => completions[`${iso(info.cycleStart)}:${s.day}`]
  ).length;
  const intervalIndex = current.intervalIndex ?? 0;
  const showPairs = current.kind === "Work" || current.kind === "Rest / rotate";
  const livePairs = pairAssignments(
    size,
    intervalIndex + (current.kind === "Rest / rotate" ? 1 : 0)
  );

  useEffect(() => {
    const refresh = () => {
      setNow(Date.now());
      const next = cycleInfo();
      setInfo(previous =>
        previous.today.getTime() === next.today.getTime() ? previous : next
      );
    };
    const interval = window.setInterval(refresh, 250);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  useEffect(() => {
    if (finished && timer.startedAt !== null)
      setTimer({ elapsed: total, startedAt: null });
  }, [finished, timer.startedAt, total]);

  useEffect(() => {
    if (
      selection.followToday &&
      timer.startedAt === null &&
      timer.elapsed === 0 &&
      (selection.day !== info.day ||
        selection.cycleStart !== iso(info.cycleStart))
    ) {
      setSelection({
        day: info.day,
        cycleStart: iso(info.cycleStart),
        followToday: true,
      });
    }
  }, [info, selection, timer]);

  function selectDay(day: number) {
    if (day === selection.day && currentCycle) return;
    setSelection({
      day,
      cycleStart: iso(info.cycleStart),
      followToday: day === info.day,
    });
    setTimer({ elapsed: 0, startedAt: null });
    setNow(Date.now());
  }
  function changeSize(value: number) {
    setSize(value);
    saveSetting("size", value);
  }
  function changeEasier(value: boolean) {
    setEasier(value);
    saveSetting("easier", value);
  }
  function toggleTimer() {
    const timestamp = Date.now();
    const actual =
      timer.elapsed +
      (timer.startedAt === null ? 0 : (timestamp - timer.startedAt) / 1000);
    if (phaseAt(phases, actual).kind === "Finished")
      setTimer({ elapsed: 0, startedAt: timestamp });
    else if (timer.startedAt === null)
      setTimer({ ...timer, startedAt: timestamp });
    else setTimer({ elapsed: Math.max(0, actual), startedAt: null });
    setNow(timestamp);
  }
  function nextPhase() {
    const timestamp = Date.now();
    const actual =
      timer.elapsed +
      (timer.startedAt === null ? 0 : (timestamp - timer.startedAt) / 1000);
    const phase = phaseAt(phases, actual);
    if (phase.kind === "Finished") return;
    setTimer({
      elapsed: phase.startsAt + phases[phase.index].seconds,
      startedAt: timer.startedAt === null ? null : timestamp,
    });
    setNow(timestamp);
  }
  function markComplete() {
    const next = { ...completions, [completionKey]: !completed };
    setCompletions(next);
    saveSetting("completions", next);
  }

  return (
    <section
      className="btb-workouts"
      id="group-workouts"
      aria-labelledby="crew-title"
    >
      <p className="eyebrow">Build The Body / Together, anywhere</p>
      <h2 id="crew-title">
        YOUR CREW.
        <br />
        YOUR NEXT 15 DAYS.
      </h2>
      <p className="intro">
        No gym. No equipment. Your bodyweight, your people and your own safe
        space. Rotate through strength, at-home cardio, dance, core and
        recovery. Move together; work at your own pace.
      </p>
      <div className="schedule-status">
        <p>
          <strong>
            Today: Day {info.day} · {sessions[info.day - 1].name}
          </strong>
          <br />
          {dateLabel(info.cycleStart)} –{" "}
          {dateLabel(new Date(info.nextCycle.getTime() - 86400000))} · Restarts{" "}
          {dateLabel(info.nextCycle)} · UTC
        </p>
        <button
          className="text-button"
          type="button"
          onClick={() => selectDay(info.day)}
        >
          View today
        </button>
      </div>
      <div className="setup">
        <fieldset>
          <legend>How many in your crew?</legend>
          <div className="group-options">
            {GROUP_SIZES.map(value => (
              <button
                key={value}
                type="button"
                aria-label={`${value} people`}
                aria-pressed={value === size}
                onClick={() => changeSize(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="option-label">
          <input
            type="checkbox"
            checked={easier}
            onChange={event => changeEasier(event.target.checked)}
          />
          Use easier / low-impact options
        </label>
      </div>
      <nav className="day-rail" aria-label="Browse the 15 workout days">
        {sessions.map(s => (
          <button
            key={s.day}
            type="button"
            className={`day-button${s.day === info.day ? " is-today" : ""}${completions[`${iso(info.cycleStart)}:${s.day}`] ? " is-complete" : ""}`}
            aria-pressed={currentCycle && s.day === selection.day}
            aria-label={`Day ${s.day}: ${s.name}${s.day === info.day ? ", today" : ""}`}
            onClick={() => selectDay(s.day)}
          >
            <span>{s.day === info.day ? "TODAY" : "DAY"}</span>
            <strong>{String(s.day).padStart(2, "0")}</strong>
            <span>{s.type}</span>
          </button>
        ))}
      </nav>
      <p className="progress-note">
        {completedCount} of 15 sessions marked complete this cycle · saved on
        this device when browser storage is available.
      </p>
      <div className="workout-layout">
        <article className="session-card" aria-labelledby="group-session-title">
          <div className="session-topline">
            <span className="session-day">
              DAY {String(item.day).padStart(2, "0")} / 15
              {isToday
                ? " · TODAY"
                : !currentCycle
                  ? ` · CYCLE ${selection.cycleStart}`
                  : ""}
            </span>
            <span className="session-type">{item.type}</span>
          </div>
          <h3 id="group-session-title">{item.name}</h3>
          <p className="session-description">{item.description}</p>
          <div className="metrics">
            <span>
              <strong>{total / 60} min</strong>Including warm-up & cooldown
            </span>
            <span>
              <strong>
                {item.work}s / {item.rest}s
              </strong>
              Work / rest & rotate
            </span>
            <span>
              <strong>{item.rounds} rounds</strong>4 intervals each
            </span>
          </div>
          <details>
            <summary>Warm-up · 5 minutes</summary>
            <ol>
              {warmup.map(([name, cue]) => (
                <li key={name}>
                  <strong>{name} · 60 seconds.</strong> {cue}
                </li>
              ))}
            </ol>
          </details>
          <h4>Four exercises. Everyone stays moving.</h4>
          <ol className="exercise-list">
            {item.ids.map((id, index) => {
              const guide = coaching[id];
              const steps = easier ? guide.easySteps : guide.steps;
              const other = easier ? guide.steps : guide.easySteps;
              return (
                <li className="exercise" key={id} data-exercise={id}>
                  <div className="exercise-heading">
                    <span className="station-number">{index + 1}</span>
                    <strong>
                      {movements[id][0]}
                      {easier ? " · easier option" : ""}
                    </strong>
                  </div>
                  <p className="exercise-timing">
                    {item.work} seconds of controlled movement · {item.rest}{" "}
                    seconds rest / rotate
                  </p>
                  <p className="instruction-label">
                    {easier
                      ? "Easier version: step by step"
                      : "How to do it: step by step"}
                  </p>
                  <ol className="movement-steps">
                    {steps.map(step => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p className="coaching-note">
                    <b>Breathe:</b> {guide.breathe}
                  </p>
                  <p className="coaching-note">
                    <b>Form check:</b> {guide.avoid}
                  </p>
                  <details>
                    <summary>
                      {easier
                        ? "View standard-version instructions"
                        : "View easier / low-impact instructions"}
                    </summary>
                    <ol className="movement-steps">
                      {other.map(step => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </details>
                </li>
              );
            })}
          </ol>
          <details>
            <summary>Cooldown · 3 minutes</summary>
            <ol>
              {cooldown.map(([name, cue]) => (
                <li key={name}>
                  <strong>{name} · 60 seconds.</strong> {cue}
                </li>
              ))}
            </ol>
          </details>
          <h4>
            {size} people. {size / 2} pairs. One crew.
          </h4>
          <div className="pairs">
            {pairAssignments(size).map(pair => (
              <div className="pair" key={pair.pair}>
                <b>Pair {pair.pair}</b> · People {pair.people.join(" & ")}
                <br />
                Start at exercise {pair.station}
              </div>
            ))}
          </div>
          <p className="crew-note">
            Number yourselves 1–{size}, then pair up. Both partners work at the
            same time in their own space. After each work interval, advance 1 →
            2 → 3 → 4 → 1. Four intervals make one round.{" "}
            {size === 10
              ? "Pairs 1 and 5 start on the same movement in separate spaces; nobody waits or shares equipment. "
              : ""}
            Stay in place and switch movements rather than moving physically. On
            dance days, rotate between the dance steps.
          </p>
          <button
            className="complete-button"
            type="button"
            aria-pressed={completed}
            onClick={markComplete}
          >
            {completed ? "Completed · undo" : "Mark this session complete"}
          </button>
        </article>
        <aside className="timer" aria-labelledby="group-timer-heading">
          <h4 id="group-timer-heading">Your crew’s timer</h4>
          <span className="timer-phase">{current.kind}</span>
          <output
            className="timer-clock"
            aria-label="Seconds remaining"
            aria-live="off"
          >
            {clock(current.remaining)}
          </output>
          <p className="timer-name">{current.name}</p>
          <p className="timer-detail">
            {current.cue ||
              (current.round
                ? `Round ${current.round} of ${item.rounds} · interval ${(intervalIndex % 4) + 1} of 4${current.kind === "Rest / rotate" ? " · switch after resting" : ""}`
                : "Great work. Hydrate and mark your session complete.")}
          </p>
          <p className="progress-note">
            {clock(Math.min(total, Math.floor(elapsed)))} / {clock(total)}
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={toggleTimer}
          >
            {finished
              ? "Restart session"
              : timer.startedAt !== null
                ? "Pause"
                : timer.elapsed > 0
                  ? "Resume"
                  : "Start workout"}
          </button>
          <div className="timer-secondary">
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setTimer({ elapsed: 0, startedAt: null });
                setNow(Date.now());
              }}
            >
              Reset
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={finished}
              onClick={nextPhase}
            >
              Next phase
            </button>
          </div>
          {showPairs && (
            <div className="timer-pairs">
              {livePairs.map(pair => (
                <div className="timer-pair" key={pair.pair}>
                  <b>
                    Pair {pair.pair}
                    {current.kind === "Rest / rotate" ? " · up next" : ""}
                  </b>
                  <br />
                  {pair.station}. {movements[item.ids[pair.station - 1]][0]}
                  {easier ? " (easier option)" : ""}
                </div>
              ))}
            </div>
          )}
          <p className="timer-footnote">
            One screen, one shared timer. Changing the day resets it; changing
            group size does not. Read the form instructions first, work at your
            own pace and take additional breaks as needed.
          </p>
          <p className="sr-only" aria-live="polite">
            {current.kind}: {current.name}
            {current.round
              ? `, round ${current.round}, interval ${(intervalIndex % 4) + 1}`
              : ""}
          </p>
        </aside>
      </div>
      <div className="safety-note">
        <strong>Form first. People first.</strong> Clear enough room for every
        person, use a non-slip surface and keep water nearby. A mat is optional;
        standing alternatives are included. Use comfortable effort and
        substitute a full rest day whenever needed. Stop for pain, dizziness or
        unusual shortness of breath. Seek qualified guidance for injuries,
        health conditions or returning to exercise. Dance days use your own
        music and self-guided Zumba-inspired steps—not an instructor-led class.
        The 15-day cycle repeats; it does not generate a new program each cycle.
      </div>
    </section>
  );
}
