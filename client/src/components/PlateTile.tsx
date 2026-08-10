/**
 * PlateTile — a single exercise blueprint bolted to the inventory board.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall" + Brief Amendments):
 *  - Native 4:5 aspect ratio. NEVER crop a plate square.
 *  - Hairline border lights to full lime on hover; tile rises 2px. <=220ms.
 *  - Blueprint motifs are mandatory system language: oversized mono index
 *    numeral, corner registration ticks, lime hairline geometry.
 *  - Caption strip is a tight mechanical data row, not a marketing card.
 */

import type { IndexedExercise } from "@/lib/exercises";

interface Props {
  exercise: IndexedExercise;
  index: number;
  onOpen: (slug: string) => void;
}

const DIFF_TICKS: Record<string, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export function PlateTile({ exercise, index, onOpen }: Props) {
  const ticks = DIFF_TICKS[exercise.difficulty] ?? 1;

  return (
    <button
      onClick={() => onOpen(exercise.slug)}
      className="group relative block w-full text-left rise-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      aria-label={`Open ${exercise.name} blueprint`}
    >
      <div
        className="relative border border-white/12 bg-plate transition-[transform,border-color] duration-200 group-hover:-translate-y-0.5 group-hover:border-lime"
        style={{ transitionTimingFunction: "var(--ease-out-snap)" }}
      >
        {/* registration / crop ticks — print marks */}
        <span className="tick top-1 left-1 border-t-2 border-l-2" />
        <span className="tick top-1 right-1 border-t-2 border-r-2" />
        <span className="tick bottom-1 left-1 border-b-2 border-l-2" />
        <span className="tick bottom-1 right-1 border-b-2 border-r-2" />

        {/* ── poster ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
          <img
            src={exercise.image}
            alt={`${exercise.name} exercise guide`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* plate index — top-left slug tab */}
          <div className="absolute left-0 top-0 flex items-center border-b border-r border-lime/40 bg-black/85 px-2 py-1 backdrop-blur-sm">
            <span className="meta text-[0.55rem] font-bold text-lime">
              {exercise.plate}
            </span>
          </div>

          {/* difficulty load ticks — top-right */}
          <div className="absolute right-0 top-0 flex items-end gap-[3px] border-b border-l border-white/15 bg-black/85 px-2 py-1.5 backdrop-blur-sm">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={i < ticks ? "bg-lime" : "bg-white/22"}
                style={{ width: "3px", height: `${5 + i * 3}px` }}
              />
            ))}
          </div>

          <div
            className="absolute bottom-2 right-2 border border-lime bg-lime px-2 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ transitionTimingFunction: "var(--ease-out-snap)" }}
          >
            <span className="meta text-[0.5rem] font-bold text-black">
              Open
            </span>
          </div>
        </div>

        {/* ── caption strip: mechanical data row ─────────────────── */}
        <div className="relative border-t border-white/12 bg-black/70 px-3 py-2.5">
          {/* oversized mono index numeral, sunk into the strip */}
          <span
            className="meta pointer-events-none absolute -bottom-1 right-1.5 font-bold text-white/6"
            style={{ fontSize: "2.75rem", lineHeight: 1 }}
            aria-hidden="true"
          >
            {exercise.plate}
          </span>

          <h3 className="display relative truncate text-[1rem] font-semibold leading-tight text-white transition-colors duration-200 group-hover:text-lime">
            {exercise.name}
          </h3>

          <div className="relative mt-1.5 flex items-center gap-2">
            <span className="meta truncate text-[0.48rem] text-lime/75">
              {exercise.primary}
            </span>
            <span className="h-2 w-px shrink-0 bg-white/18" />
            <span className="meta truncate text-[0.48rem] text-white/45">
              {exercise.equipment}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
