/**
 * StickerSheet — printable QR labels for gym equipment. `/stickers`
 *
 * Purpose: the gym owner prints this, cuts along the crop marks, and mounts one
 * label per machine. Each label carries the BTB mark, the movement name, the
 * plate index, and the QR that opens that exact blueprint.
 *
 * STYLE CONTRACT (ideas.md):
 *  - On SCREEN the sheet stays in the BTB dark system.
 *  - On PAPER it inverts to black-on-white: printing large black fields wastes
 *    toner and QR codes must stay black-on-white to scan reliably anyway.
 *  - Corner registration ticks double as literal cut marks here.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Printer } from "lucide-react";
import { BtbLogo } from "@/components/BtbLogo";
import { PlateQr } from "@/components/PlateQr";
import { plateUrl, plateUrlLabel } from "@/lib/plateUrl";
import {
  CATEGORIES,
  INDEXED_EXERCISES,
  type CategoryId,
} from "@/lib/exercises";

export default function StickerSheet() {
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const items = useMemo(
    () =>
      category === "all"
        ? INDEXED_EXERCISES
        : INDEXED_EXERCISES.filter((e) => e.category === category),
    [category],
  );

  return (
    <div className="min-h-screen">
      {/* print rules: invert to paper, drop all chrome */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          html, body { background: #fff !important; }
          body { background-image: none !important; }
          .no-print { display: none !important; }
          .sticker-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6mm !important;
          }
          .sticker {
            break-inside: avoid;
            background: #fff !important;
            border: 1px dashed #999 !important;
            color: #000 !important;
          }
          .sticker .s-name,
          .sticker .s-meta,
          .sticker .s-plate,
          .sticker .s-url,
          .sticker .s-brand { color: #000 !important; }
          .sticker .s-tick { border-color: #000 !important; }
          .sticker .s-qr-frame { border-color: #000 !important; }
        }
      `}</style>

      {/* ══ CHROME (screen only) ═════════════════════════════════════ */}
      <header className="no-print sticky top-0 z-40 border-b border-white/10 bg-background/94 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <BtbLogo compact />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="meta text-[0.5rem]">The Wall</span>
            </Link>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-lime px-4 py-2 transition-colors duration-200 hover:bg-lime-dim"
            >
              <Printer className="h-3.5 w-3.5 text-black" />
              <span className="meta text-[0.5rem] font-bold text-black">
                Print sheet
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="no-print border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-6">
          <h1 className="display text-[1.85rem] font-bold leading-none text-white sm:text-[2.5rem]">
            Machine stickers
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            One scannable label per movement. Print, cut on the dashed lines, and
            mount each label on its equipment. Members scan and land straight on
            the blueprint.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-1.5">
            <SheetChip
              label={`All · ${INDEXED_EXERCISES.length}`}
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {CATEGORIES.map((c) => (
              <SheetChip
                key={c.id}
                label={`${c.label} · ${
                  INDEXED_EXERCISES.filter((e) => e.category === c.id).length
                }`}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>

          <p className="meta mt-4 text-[0.45rem] text-muted-foreground">
            {items.length} labels queued · A4 portrait · 3 per row
          </p>
        </div>
      </div>

      {/* ══ SHEET ════════════════════════════════════════════════════ */}
      <div className="container py-8">
        <div className="sticker-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((ex) => (
            <div
              key={ex.slug}
              className="sticker relative border border-white/15 bg-plate p-4"
            >
              {/* cut marks */}
              <span className="s-tick absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-lime" />
              <span className="s-tick absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-lime" />
              <span className="s-tick absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-lime" />
              <span className="s-tick absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-lime" />

              <div className="flex items-start justify-between gap-2">
                <span className="s-brand display text-base font-bold text-lime">
                  BTB
                </span>
                <span className="s-plate meta text-[0.5rem] font-bold text-lime/70">
                  {ex.plate}
                </span>
              </div>

              <h2 className="s-name display mt-2.5 text-[1.05rem] font-semibold leading-tight text-white">
                {ex.name}
              </h2>

              <p className="s-meta meta mt-1.5 text-[0.42rem] text-white/50">
                {ex.equipment}
              </p>

              <div className="mt-3.5 flex items-end justify-between gap-3">
                <div className="s-qr-frame border-2 border-lime bg-white p-1.5">
                  <PlateQr value={plateUrl(ex.slug)} size={92} />
                </div>
                <div className="min-w-0 pb-0.5">
                  <p className="s-meta meta text-[0.4rem] font-bold text-lime">
                    Scan for
                  </p>
                  <p className="s-meta meta text-[0.4rem] leading-relaxed text-white/50">
                    Form
                    <br />
                    Muscles
                    <br />
                    Mistakes
                  </p>
                </div>
              </div>

              <p className="s-url meta mt-3 break-all text-[0.38rem] leading-relaxed text-white/30">
                {plateUrlLabel(ex.slug)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <footer className="no-print border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7">
          <p className="meta text-[0.42rem] text-muted-foreground">
            © 2024 Build The Body (BTB) · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

function SheetChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-2.5 py-1.5 transition-colors duration-200 ${
        active
          ? "border-lime bg-lime/10 text-lime"
          : "border-white/12 text-white/55 hover:border-white/40 hover:text-white"
      }`}
    >
      <span className="meta text-[0.45rem]">{label}</span>
    </button>
  );
}
