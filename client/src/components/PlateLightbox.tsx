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
  PlayCircle,
  QrCode,
  ShieldCheck,
  TriangleAlert,
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
  const [view, setView] = useState<"blueprint" | "motion" | "form">(
    "blueprint",
  );
  const [videoState, setVideoState] = useState<"loading" | "ready" | "error">("loading");

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
    setView("blueprint");
    setVideoState("loading");
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

      <div className="flex shrink-0 justify-center gap-1 border-b border-white/10 px-3 py-2">
        {[
          { id: "blueprint", label: "Blueprint", icon: QrCode },
          { id: "motion", label: "Motion", icon: PlayCircle },
          { id: "form", label: "Form Execution", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id as typeof view)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 border px-2.5 py-1.5 transition-colors sm:px-3.5 ${
                active
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="meta text-[0.48rem] font-bold">{tab.label}</span>
            </button>
          );
        })}
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

        {view === "blueprint" && (
          <img
            key={exercise.slug}
            src={exercise.image}
            alt={`${exercise.name} full exercise guide`}
            className="pop-in max-h-full w-auto border border-white/12"
            style={{ maxWidth: "min(100%, 960px)" }}
          />
        )}

        {view === "motion" && (
          <div className="pop-in w-full max-w-4xl space-y-4 py-3">
            {exercise.video && videoState !== "error" ? (
              <div className="relative overflow-hidden border border-lime/45 bg-black" style={{ aspectRatio: "16 / 9" }}>
                {videoState === "loading" && <div className="absolute inset-0 z-10 flex items-center justify-center bg-black text-sm text-white/60">Loading demonstration...</div>}
                <video key={exercise.video} controls playsInline poster={exercise.image} onCanPlay={() => setVideoState("ready")} onError={() => setVideoState("error")} className="h-full w-full bg-black object-contain">
                  <source src={exercise.video} />
                  Your browser does not support embedded exercise video.
                </video>
              </div>
            ) : (
              <div className="border border-white/15 bg-[#0b0b0b] p-6 text-center sm:p-8">
                <PlayCircle className="mx-auto h-9 w-9 text-lime" />
                <h3 className="display mt-4 text-xl font-bold text-white">Video demonstration coming soon.</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">Use the complete form guide below with this exercise blueprint.</p>
              </div>
            )}
            <FormExecution exercise={exercise} compact />
          </div>
        )}

        {view === "form" && (
          <FormExecution exercise={exercise} />
        )}

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

function FormExecution({ exercise, compact = false }: { exercise: IndexedExercise; compact?: boolean }) {
  const categoryGuidance = {
    chest: { setup: "Set the bench, handles, or bars so the shoulders stay packed and feet are planted.", movement: "Control the weight through a comfortable stretch, then press or bring the hands together without losing shoulder position.", breathing: "Inhale during the controlled return; brace and exhale through the press.", secondary: "Triceps and front delts" },
    back: { setup: "Brace the torso and set the shoulders away from the ears before the first pull.", movement: "Drive the elbows toward the intended path, pause at the contracted position, then control the return to a full reach.", breathing: "Inhale on the reach; exhale as the elbows pull.", secondary: "Biceps, rear delts, and forearms" },
    legs: { setup: "Set the feet and brace the trunk before lowering into the working range.", movement: "Keep pressure balanced through the foot, control the descent, then drive the floor away while knees track with the toes.", breathing: "Inhale and brace before lowering; exhale through the hardest part of the rise.", secondary: "Core and stabilizers around the hips" },
    shoulders: { setup: "Stand or sit tall with ribs stacked over the pelvis and shoulders set down.", movement: "Move the load smoothly through the intended arc without swinging the torso or shrugging into the ears.", breathing: "Inhale on the lower; exhale as you raise or press.", secondary: "Upper back, triceps, and core" },
    arms: { setup: "Set the upper arm position first and keep the torso quiet.", movement: "Bend or extend at the elbow with control, pause at the squeeze, then return without momentum.", breathing: "Exhale through the contraction; inhale on the controlled return.", secondary: "Forearms and shoulder stabilizers" },
    core: { setup: "Find a stacked ribcage and pelvis, then gently brace before moving.", movement: "Keep the trunk controlled while the limbs or torso move through the planned range without holding your breath.", breathing: "Use a long exhale during the challenging phase while keeping the abdomen braced.", secondary: "Hip and shoulder stabilizers" },
  }[exercise.category];
  const cues = ["Set up stable before the first working rep.", `Control the range that loads ${exercise.primary}.`, "Keep the neck long and shoulders away from the ears.", "Stop the set when position changes, not only when the weight stalls."];
  const mistakes = ["Rushing the eccentric or bouncing through the weak point.", "Trading usable range of motion for heavier loading.", "Letting momentum, joint shift, or posture replace the target muscle."];
  return <section className={`w-full ${compact ? "border border-white/15 bg-[#0b0b0b] p-5" : "pop-in max-w-4xl"}`}>
    <div className="flex items-center gap-2 text-lime"><ShieldCheck className="h-5 w-5" /><span className="meta text-[0.55rem] font-bold">FORM EXECUTION</span></div>
    <div className="mt-4 grid gap-4 md:grid-cols-2"><div className="border border-lime/35 bg-lime/[0.05] p-4"><h3 className="display text-lg font-bold text-white">How to perform</h3><div className="mt-3 space-y-3 text-sm leading-relaxed text-white/75"><p><span className="font-semibold text-lime">Setup:</span> {categoryGuidance.setup}</p><p><span className="font-semibold text-lime">Movement:</span> {categoryGuidance.movement}</p><p><span className="font-semibold text-lime">Breathing:</span> {categoryGuidance.breathing}</p></div></div><div className="border border-white/15 p-4"><h3 className="display text-lg font-bold text-white">Muscles</h3><p className="mt-3 text-sm text-white/75"><span className="font-semibold text-lime">Primary:</span> {exercise.primary}</p><p className="mt-2 text-sm text-white/75"><span className="font-semibold text-lime">Secondary:</span> {categoryGuidance.secondary}</p><h3 className="display mt-5 text-lg font-bold text-white">Key cues</h3><ul className="mt-3 space-y-2 text-sm text-white/75">{cues.map((cue) => <li key={cue}>• {cue}</li>)}</ul></div></div>
    <div className="mt-4 border border-red-400/35 bg-red-400/[0.04] p-4"><div className="flex items-center gap-2 text-red-300"><TriangleAlert className="h-4 w-4" /><span className="meta text-[0.5rem] font-bold">COMMON MISTAKES</span></div><ul className="mt-3 space-y-2 text-sm text-white/75">{mistakes.map((mistake) => <li key={mistake}>• {mistake}</li>)}</ul></div>
  </section>;
}
