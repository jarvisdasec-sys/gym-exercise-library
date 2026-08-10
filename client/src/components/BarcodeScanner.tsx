/**
 * BarcodeScanner — live camera barcode capture for packaged foods.
 *
 * STRATEGY: try the native `BarcodeDetector` API first (fast, no JS decoding),
 * fall back to @zxing/browser where it is unavailable — notably Safari/iOS,
 * which is exactly where gym members will be scanning.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - The viewfinder uses lime corner REGISTRATION TICKS, the same crop-mark
 *    motif as the plate tiles. No rounded overlay, no glow.
 *  - Mono instrumentation copy. Coach-direct, imperative.
 *
 * PRACTICALITIES handled:
 *  - Camera needs HTTPS and an explicit user gesture (the parent only mounts
 *    this after a tap).
 *  - Rear camera requested via facingMode "environment".
 *  - Tracks are always stopped on unmount, or the camera light stays on.
 *  - Permission denial and missing-camera are reported distinctly, because the
 *    fix differs for each.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { CameraOff, Loader2, X } from "lucide-react";

/** Formats used on food packaging. Narrowing these speeds up decoding. */
const FOOD_FORMATS = [
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.CODE_128,
];

const NATIVE_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"];

type Phase = "starting" | "scanning" | "error";

interface NativeDetector {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
}

export function BarcodeScanner({
  onDetected,
  onClose,
}: {
  /** Called once with the decoded barcode. The parent closes the scanner. */
  onDetected: (barcode: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("starting");
  const [message, setMessage] = useState("");
  const [engine, setEngine] = useState<"native" | "zxing" | null>(null);

  /** Stop everything. Safe to call repeatedly. */
  const teardown = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try {
      // decodeFromVideoElement resolves to IScannerControls; stop() ends the loop.
      controlsRef.current?.stop();
    } catch {
      /* controls already stopped */
    }
    controlsRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const succeed = useCallback(
    (raw: string) => {
      if (doneRef.current) return;
      const code = raw.replace(/\D/g, "");
      if (code.length < 6) return; // ignore obvious misreads
      doneRef.current = true;
      teardown();
      onDetected(code);
    },
    [onDetected, teardown],
  );

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPhase("error");
        setMessage(
          "This browser cannot open the camera. Use the product search instead.",
        );
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err) {
        if (cancelled) return;
        const name = (err as DOMException)?.name;
        setPhase("error");
        if (name === "NotAllowedError" || name === "SecurityError") {
          setMessage(
            "Camera access was blocked. Allow camera for this site in your browser settings, then try again.",
          );
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setMessage(
            "No camera found on this device. Use the product search instead.",
          );
        } else {
          setMessage(
            "The camera could not be started. Use the product search instead.",
          );
        }
        return;
      }

      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        /* iOS occasionally rejects; the muted+playsInline attrs cover it */
      }

      if (cancelled) return;
      setPhase("scanning");

      // ── fast path: native BarcodeDetector ────────────────────────
      const Native = (
        window as unknown as {
          BarcodeDetector?: new (o: { formats: string[] }) => NativeDetector;
        }
      ).BarcodeDetector;

      if (Native) {
        try {
          const detector = new Native({ formats: NATIVE_FORMATS });
          setEngine("native");
          const tick = async () => {
            if (cancelled || doneRef.current || !videoRef.current) return;
            try {
              const hits = await detector.detect(videoRef.current);
              if (hits.length > 0 && hits[0].rawValue) {
                succeed(hits[0].rawValue);
                return;
              }
            } catch {
              /* transient decode failure — keep going */
            }
            rafRef.current = requestAnimationFrame(() => void tick());
          };
          void tick();
          return;
        } catch {
          /* constructor threw (unsupported formats) — fall through to ZXing */
        }
      }

      // ── fallback: ZXing ──────────────────────────────────────────
      try {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, FOOD_FORMATS);
        hints.set(DecodeHintType.TRY_HARDER, true);
        const reader = new BrowserMultiFormatReader(hints, {
          delayBetweenScanAttempts: 180,
        });
        setEngine("zxing");
        const controls = await reader.decodeFromVideoElement(video, (result) => {
          if (result) succeed(result.getText());
        });
        if (cancelled || doneRef.current) {
          controls.stop();
        } else {
          controlsRef.current = controls;
        }
      } catch {
        if (cancelled) return;
        setPhase("error");
        setMessage(
          "Barcode decoding could not start. Use the product search instead.",
        );
      }
    }

    void start();

    return () => {
      cancelled = true;
      teardown();
    };
  }, [succeed, teardown]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm">
      {/* header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="h-px w-6 bg-lime" />
          <span className="meta text-[0.45rem] text-lime">
            Scan the barcode
          </span>
        </div>
        <button
          onClick={() => {
            teardown();
            onClose();
          }}
          aria-label="Close scanner"
          className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-lime hover:text-lime active:scale-[0.97]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* viewfinder */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`h-full w-full object-cover ${
            phase === "scanning" ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* registration-tick frame — the blueprint crop-mark motif */}
        {phase === "scanning" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[38%] max-h-[220px] w-[82%] max-w-[420px]">
              <span className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-lime" />
              <span className="absolute right-0 top-0 h-7 w-7 border-r-2 border-t-2 border-lime" />
              <span className="absolute bottom-0 left-0 h-7 w-7 border-b-2 border-l-2 border-lime" />
              <span className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-lime" />
              {/* scan line */}
              <span className="absolute left-0 top-1/2 h-px w-full bg-lime/60" />
            </div>
          </div>
        )}

        {phase === "starting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-lime" />
            <span className="meta text-[0.45rem] text-white/55">
              Opening the camera…
            </span>
          </div>
        )}

        {phase === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <CameraOff className="h-8 w-8 text-white/40" />
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {message}
            </p>
            <button
              onClick={() => {
                teardown();
                onClose();
              }}
              className="border border-white/25 px-4 py-2.5 transition-colors hover:border-lime hover:text-lime"
            >
              <span className="display text-sm font-bold">Close</span>
            </button>
          </div>
        )}
      </div>

      {/* footer guidance */}
      {phase === "scanning" && (
        <div className="shrink-0 border-t border-white/10 px-4 py-4 text-center">
          <p className="text-[0.82rem] leading-relaxed text-white/70">
            Hold the barcode inside the frame. Steady, well lit, about a hand's
            width away.
          </p>
          <p className="meta mt-2 text-[0.4rem] text-white/30">
            {engine === "native" ? "Native decoder" : "ZXing decoder"} · EAN ·
            UPC
          </p>
        </div>
      )}
    </div>
  );
}
