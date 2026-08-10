/**
 * PlateLightbox — full-screen blueprint viewer.
 *
 * STYLE CONTRACT (ideas.md):
 *  - Backdrop fades 160ms; image scales 0.97 -> 1 over 200ms. Never from scale(0).
 *  - Keyboard: ArrowLeft / ArrowRight / Escape.
 *  - Chrome stays quiet — the poster is the hero.
 *  - QR lives in a lime-framed panel; the code itself stays black-on-white
 *    because scannability beats styling.
 */

import { useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Link2,
  QrCode,
  X,
} from "lucide-react";
import type { IndexedExercise } from "@/lib/exercises";
import { PlateQr } from "@/components/PlateQr";
import { plateUrl, plateUrlLabel } from "@/lib/plateUrl";

interface Props {
  exercise: IndexedExercise | null;
  total: number;
  position: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PlateLightbox({
  exercise,
  total,
  position,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!exercise) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [exercise, onClose, onPrev, onNext]);

  // Reset the transient copy confirmation whenever the plate changes.
  useEffect(() => {
    setCopied(false);
  }, [exercise?.slug]);

  if (!exercise) return null;

  const url = plateUrl(exercise.slug);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/96 fade-in-quick backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${exercise.name} blueprint`}
    >
      {/* top chrome */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="meta shrink-0 text-[0.6rem] font-bold text-lime">
            {exercise.plate}
          </span>
          <h2 className="display truncate text-lg font-semibold text-white sm:text-2xl">
            {exercise.name}
          </h2>
          <span className="meta hidden shrink-0 text-[0.55rem] text-white/45 sm:inline">
            {exercise.equipment}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setShowQr((v) => !v)}
            className={`flex items-center gap-1.5 border px-3 py-1.5 transition-colors duration-200 ${
              showQr
                ? "border-lime bg-lime/10 text-lime"
                : "border-white/15 hover:border-lime hover:text-lime"
            }`}
            aria-pressed={showQr}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span className="meta hidden text-[0.55rem] sm:inline">QR</span>
          </button>

          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 border border-white/15 px-3 py-1.5 transition-colors duration-200 hover:border-lime hover:text-lime"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-lime" />
            ) : (
              <Link2 className="h-3.5 w-3.5" />
            )}
            <span className="meta hidden text-[0.55rem] sm:inline">
              {copied ? "Copied" : "Link"}
            </span>
          </button>

          <a
            href={exercise.image}
            download={`btb-${exercise.slug}.png`}
            className="flex items-center gap-1.5 border border-white/15 px-3 py-1.5 transition-colors duration-200 hover:border-lime hover:text-lime"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="meta hidden text-[0.55rem] sm:inline">Save</span>
          </a>

          <button
            onClick={onClose}
            className="border border-white/15 p-1.5 transition-colors duration-200 hover:border-lime hover:text-lime"
            aria-label="Close viewer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* poster stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto p-3 sm:p-6">
        <button
          onClick={onPrev}
          className="fixed left-2 top-1/2 z-10 -translate-y-1/2 border border-white/15 bg-black/70 p-2.5 backdrop-blur transition-colors duration-200 hover:border-lime hover:text-lime sm:left-4 sm:p-3"
          aria-label="Previous blueprint"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <img
          key={exercise.slug}
          src={exercise.image}
          alt={`${exercise.name} full exercise guide`}
          className="pop-in max-h-full w-auto border border-white/12"
          style={{ maxWidth: "min(100%, 960px)" }}
        />

        <button
          onClick={onNext}
          className="fixed right-2 top-1/2 z-10 -translate-y-1/2 border border-white/15 bg-black/70 p-2.5 backdrop-blur transition-colors duration-200 hover:border-lime hover:text-lime sm:right-4 sm:p-3"
          aria-label="Next blueprint"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* ── QR panel: lime frame, black-on-white code ─────────────── */}
        {showQr && (
          <div className="pop-in fixed bottom-16 left-1/2 z-20 -translate-x-1/2 border border-lime bg-black/95 p-4 backdrop-blur sm:bottom-auto sm:left-auto sm:right-6 sm:top-24 sm:translate-x-0">
            <div className="flex items-start gap-4">
              <div className="border-2 border-lime bg-white p-2">
                <PlateQr value={url} size={124} />
              </div>
              <div className="max-w-[190px]">
                <p className="meta text-[0.5rem] font-bold text-lime">
                  Scan to open
                </p>
                <p className="display mt-1.5 text-sm font-semibold leading-tight text-white">
                  {exercise.name}
                </p>
                <p className="meta mt-2.5 break-all text-[0.42rem] leading-relaxed text-white/45">
                  {plateUrlLabel(exercise.slug)}
                </p>
                <p className="meta mt-3 text-[0.42rem] leading-relaxed text-white/35">
                  Print it. Stick it on the machine.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* bottom chrome */}
      <div className="flex shrink-0 items-center justify-center gap-4 border-t border-white/10 px-4 py-2.5">
        <span className="meta text-[0.55rem] text-white/45">
          {position} / {total}
        </span>
        <span className="hidden h-3 w-px bg-white/15 sm:block" />
        <span className="meta hidden text-[0.5rem] text-white/30 sm:block">
          ← → to browse · Esc to close
        </span>
      </div>
    </div>
  );
}
