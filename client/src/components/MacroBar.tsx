/**
 * MacroBar — the calorie-share breakdown bar used on every food, meal and day.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Instrumentation, not decoration: flat segments, hairline frame, mono labels.
 *  - Lime is reserved for PROTEIN so the eye reads the training-relevant macro
 *    first. Carbs and fat use desaturated greys so lime stays wayfinding paint.
 *  - No rounded pills, no gradients, no drop shadows.
 */
import { macroSplit } from "@/lib/foods";

export interface MacroValues {
  protein: number;
  carbs: number;
  fat: number;
}

/** Segment fills — lime for protein, then two greys stepping down. */
const FILL = {
  protein: "var(--btb-lime)",
  carbs: "oklch(0.62 0 0)",
  fat: "oklch(0.38 0 0)",
} as const;

export function MacroBar({
  macros,
  height = 6,
  showLegend = false,
  className = "",
}: {
  macros: MacroValues;
  height?: number;
  showLegend?: boolean;
  className?: string;
}) {
  const split = macroSplit(macros);
  const empty = split.protein + split.carbs + split.fat === 0;

  return (
    <div className={className}>
      <div
        className="flex w-full overflow-hidden border border-white/12"
        style={{ height }}
        role="img"
        aria-label={
          empty
            ? "No macros"
            : `Protein ${Math.round(split.protein)}%, carbohydrate ${Math.round(
                split.carbs,
              )}%, fat ${Math.round(split.fat)}% of calories`
        }
      >
        {empty ? (
          <div className="h-full w-full bg-white/5" />
        ) : (
          <>
            <span
              style={{ width: `${split.protein}%`, background: FILL.protein }}
            />
            <span style={{ width: `${split.carbs}%`, background: FILL.carbs }} />
            <span style={{ width: `${split.fat}%`, background: FILL.fat }} />
          </>
        )}
      </div>

      {showLegend && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {(
            [
              ["protein", "Protein", split.protein],
              ["carbs", "Carbs", split.carbs],
              ["fat", "Fat", split.fat],
            ] as const
          ).map(([key, label, pct]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0"
                style={{ background: FILL[key] }}
              />
              <span className="meta text-[0.45rem] text-white/55">
                {label} {Math.round(pct)}%
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Four-cell numeric readout: kcal / P / C / F. Used under headers and rows. */
export function MacroReadout({
  kcal,
  protein,
  carbs,
  fat,
  size = "md",
}: {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  size?: "sm" | "md" | "lg";
}) {
  const cells = [
    { label: "kcal", value: Math.round(kcal), lime: true },
    { label: "protein", value: `${Math.round(protein)}g` },
    { label: "carbs", value: `${Math.round(carbs)}g` },
    { label: "fat", value: `${Math.round(fat)}g` },
  ];
  const numCls =
    size === "lg"
      ? "text-2xl sm:text-3xl"
      : size === "sm"
        ? "text-sm"
        : "text-lg";

  return (
    <div className="grid grid-cols-4 divide-x divide-white/12 border border-white/12">
      {cells.map((c) => (
        <div key={c.label} className="px-2 py-2 text-center sm:px-3">
          <div
            className={`display font-bold leading-none ${numCls} ${
              c.lime ? "text-lime" : "text-white"
            }`}
          >
            {c.value}
          </div>
          <div className="meta mt-1 text-[0.4rem] text-white/45">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
