/**
 * BTB wordmark — heavy condensed BTB caps flanked by barbell-plate "wing" glyphs,
 * with BUILD THE BODY microtext beneath.
 *
 * STYLE CONTRACT (ideas.md + Style Decisions):
 *  - Always lime-on-near-black. Never lime text on a lime fill.
 *  - The mark must anchor the interface with confidence — never a tiny nav label.
 */

export function BtbLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="flex flex-col leading-none">
        {/* wing glyphs flank the wordmark, echoing loaded plates on a bar */}
        <span className="flex items-center gap-1.5">
          <Wing />
          <span
            className="display font-bold text-lime"
            style={{
              fontSize: compact ? "1.4rem" : "1.85rem",
              letterSpacing: "0.01em",
            }}
          >
            BTB
          </span>
          <Wing flip />
        </span>
        <span
          className="meta mt-1 font-bold text-lime/60"
          style={{
            fontSize: compact ? "0.4rem" : "0.46rem",
            letterSpacing: "0.34em",
          }}
        >
          Build The Body
        </span>
      </div>
    </div>
  );
}

/** Barbell-plate wing: three tapered bars, tallest nearest the wordmark. */
function Wing({ flip = false }: { flip?: boolean }) {
  const bars = [10, 14, 18];
  return (
    <span
      className="flex items-center gap-[2px]"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      {bars.map((h) => (
        <span
          key={h}
          className="block w-[2.5px] bg-lime"
          style={{ height: `${h}px` }}
        />
      ))}
    </span>
  );
}
