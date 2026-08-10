/**
 * PackagedFoodPicker — scan a barcode or search a brand, confirm, then log.
 *
 * WHY THE CONFIRM STEP EXISTS: Open Food Facts is crowd-sourced, and probing the
 * live API showed real mismatches (a nominally Kellogg's barcode resolving to
 * Pringles) plus test records. So the member ALWAYS sees the resolved product
 * name, brand and macros, and sets the gram amount, before anything lands in
 * their log. Never auto-log a scan.
 *
 * CORRECTIONS: when the database entry is simply wrong, the member can edit the
 * name and the per-100g macros themselves. The fix is stored per barcode on
 * their own device (lib/corrections.ts) and re-applied on every future scan, so
 * nobody has to correct the same product twice. Nothing is uploaded, and the
 * public Open Food Facts record is never modified.
  *
  * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
  *  - Reads as instrumentation: hairline frames, mono labels, lime = protein and
  *    one primary action. Corner registration ticks on the confirm card.
  *  - Coach-direct, imperative copy.
  */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Loader2,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  ScanLine,
  Search,
  X,
} from "lucide-react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { MacroBar, MacroReadout } from "@/components/MacroBar";
import {
  defaultGrams,
  displayName,
  lookupBarcode,
  scaleProduct,
  searchProducts,
  type OffProduct,
} from "@/lib/offProducts";
import {
  applyCorrection,
  buildCorrection,
  clearCorrection,
  macroSanityWarning,
  saveCorrection,
} from "@/lib/corrections";

export interface PackagedSelection {
  product: OffProduct;
  grams: number;
  macros: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

type View = "search" | "confirm" | "edit";

/** Editable draft of the per-100g panel. Kept as strings so inputs stay usable. */
interface Draft {
  name: string;
  brand: string;
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  servingGrams: string;
}

export function PackagedFoodPicker({
  onConfirm,
  onClose,
  confirmLabel = "Log it",
}: {
  onConfirm: (selection: PackagedSelection) => void;
  onClose: () => void;
  confirmLabel?: string;
}) {
  const [view, setView] = useState<View>("search");
  const [scanning, setScanning] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OffProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [looking, setLooking] = useState(false);

  const [chosen, setChosen] = useState<OffProduct | null>(null);
  const [grams, setGrams] = useState(100);
  /** true when the shown product has a locally saved correction applied */
  const [corrected, setCorrected] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  /* debounced brand/product search */
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const list = await searchProducts(q, controller.signal);
      if (controller.signal.aborted) return;
      setResults(list);
      setSearching(false);
      setSearched(true);
    }, 420);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /** Show a product for confirmation, with any saved correction already applied. */
  const choose = useCallback((product: OffProduct) => {
    const { product: resolved, corrected: wasCorrected } =
      applyCorrection(product);
    setChosen(resolved);
    setCorrected(wasCorrected);
    setGrams(defaultGrams(resolved));
    setNotice(null);
    setView("confirm");
  }, []);

  /** Open the editor pre-filled with whatever is currently shown. */
  function startEdit() {
    if (!chosen) return;
    setDraft({
      name: chosen.name,
      brand: chosen.brand,
      kcal: String(chosen.kcal),
      protein: String(chosen.protein),
      carbs: String(chosen.carbs),
      fat: String(chosen.fat),
      fiber: String(chosen.fiber),
      servingGrams: chosen.servingGrams ? String(chosen.servingGrams) : "",
    });
    setView("edit");
  }

  /** Persist the correction for this barcode and return to the confirm step. */
  function saveEdit() {
    if (!chosen || !draft) return;
    const servingRaw = Number(draft.servingGrams);
    const correction = buildCorrection({
      code: chosen.code,
      name: draft.name,
      brand: draft.brand,
      kcal: Number(draft.kcal),
      protein: Number(draft.protein),
      carbs: Number(draft.carbs),
      fat: Number(draft.fat),
      fiber: Number(draft.fiber),
      servingGrams:
        draft.servingGrams.trim() && servingRaw > 0 ? servingRaw : null,
    });
    saveCorrection(correction);
    setChosen({
      ...chosen,
      name: correction.name,
      brand: correction.brand,
      kcal: correction.kcal,
      protein: correction.protein,
      carbs: correction.carbs,
      fat: correction.fat,
      fiber: correction.fiber,
      servingGrams: correction.servingGrams,
      incomplete: false,
    });
    setCorrected(true);
    setDraft(null);
    setView("confirm");
  }

  /** Discard the saved correction and refetch the original database values. */
  async function revertCorrection() {
    if (!chosen) return;
    const code = chosen.code;
    clearCorrection(code);
    setCorrected(false);
    const res = await lookupBarcode(code);
    if (res.ok) {
      // lookupBarcode caches the ORIGINAL record, so this is the pristine entry.
      setChosen(res.product);
      setGrams(defaultGrams(res.product));
    }
  }

  async function handleBarcode(code: string) {
    setScanning(false);
    setLooking(true);
    setNotice(null);
    const res = await lookupBarcode(code);
    setLooking(false);
    if (res.ok) {
      choose(res.product);
      return;
    }
    if (res.reason === "not-found") {
      setNotice(
        `Barcode ${code} is not in the Open Food Facts database yet. Search for it by name, or add it at openfoodfacts.org to help the next person.`,
      );
    } else if (res.reason === "no-nutrition") {
      setNotice(
        `Barcode ${code} was found but has no nutrition panel recorded. Search by name for a different entry.`,
      );
    } else {
      setNotice(
        "Could not reach the product database. Check your connection and try again.",
      );
    }
  }

  const macros = useMemo(
    () => (chosen ? scaleProduct(chosen, grams) : null),
    [chosen, grams],
  );

  /* ── confirm view ──────────────────────────────────────────────── */
  if (view === "confirm" && chosen && macros) {
    const per = scaleProduct(chosen, 100);
    return (
      <div className="border border-white/15">
        <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2.5">
          <button
            onClick={() => {
              setView("search");
              setChosen(null);
            }}
            className="flex items-center gap-2 text-white/55 transition-colors hover:text-lime"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="meta text-[0.42rem]">Back</span>
          </button>
          <span className="meta text-[0.42rem] text-lime">
            Check this is right
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/40 transition-colors hover:text-lime"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="group relative p-4">
          <span className="tick left-0 top-0 border-l border-t opacity-100" />
          <span className="tick right-0 top-0 border-r border-t opacity-100" />

          <div className="flex gap-3.5">
            {chosen.imageUrl ? (
              <img
                src={chosen.imageUrl}
                alt=""
                className="h-16 w-16 shrink-0 border border-white/12 object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/12">
                <span className="meta text-[0.36rem] text-white/30">
                  no image
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-[0.95rem] font-semibold leading-snug text-white">
                {chosen.name}
              </h3>
              {chosen.brand && (
                <p className="meta mt-1 text-[0.42rem] text-lime">
                  {chosen.brand}
                </p>
              )}
              <p className="meta mt-1.5 text-[0.38rem] text-white/35">
                Barcode {chosen.code}
                {chosen.quantity ? ` · Pack ${chosen.quantity}` : ""}
              </p>
              {corrected && (
                <p className="meta mt-1.5 inline-flex items-center gap-1.5 border border-lime/40 px-1.5 py-0.5 text-[0.36rem] text-lime">
                  <Pencil className="h-2 w-2" />
                  Your corrected values
                </p>
              )}
            </div>
          </div>

          {/* wrong product? fix it here */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3.5">
            <button
              onClick={startEdit}
              className="flex items-center gap-2 border border-white/20 px-2.5 py-1.5 text-white/65 transition-colors hover:border-lime hover:text-lime"
            >
              <Pencil className="h-3 w-3" />
              <span className="meta text-[0.4rem]">
                {corrected ? "Edit again" : "Wrong? Fix it"}
              </span>
            </button>
            {corrected && (
              <button
                onClick={() => void revertCorrection()}
                className="flex items-center gap-2 px-1 py-1.5 text-white/40 transition-colors hover:text-lime"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="meta text-[0.4rem]">Use database values</span>
              </button>
            )}
          </div>

          {/* amount */}
          <div className="mt-4">
            <div className="meta mb-2 text-[0.4rem] text-white/45">
              How much did you eat?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGrams((g) => Math.max(1, g - 10))}
                aria-label="Less"
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-lime hover:text-lime active:scale-[0.97]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <div className="relative flex-1">
                <input
                  type="number"
                  min={1}
                  value={grams}
                  onChange={(e) =>
                    setGrams(
                      Math.max(
                        1,
                        Math.min(3000, Math.round(Number(e.target.value) || 0)),
                      ),
                    )
                  }
                  className="h-9 w-full border border-white/15 bg-white/[0.03] px-3 pr-8 text-sm text-white focus:border-lime focus:outline-none"
                />
                <span className="meta pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.4rem] text-white/35">
                  g
                </span>
              </div>
              <button
                onClick={() => setGrams((g) => Math.min(3000, g + 10))}
                aria-label="More"
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-lime hover:text-lime active:scale-[0.97]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {chosen.servingGrams && (
                <button
                  onClick={() => setGrams(chosen.servingGrams!)}
                  className="meta border border-white/15 px-2 py-1.5 text-[0.38rem] text-white/55 transition-colors hover:border-lime hover:text-lime"
                >
                  1 serving ({chosen.servingGrams} g)
                </button>
              )}
              <button
                onClick={() => setGrams(100)}
                className="meta border border-white/15 px-2 py-1.5 text-[0.38rem] text-white/55 transition-colors hover:border-lime hover:text-lime"
              >
                100 g
              </button>
            </div>

            {chosen.servingLabel && (
              <p className="meta mt-2 text-[0.38rem] text-white/30">
                Label serving: {chosen.servingLabel}
              </p>
            )}
            {!chosen.servingGrams && (
              <p className="mt-2 text-[0.72rem] leading-relaxed text-white/45">
                This entry has no serving weight recorded, so it defaults to
                100 g. Weigh it or read the pack for an accurate figure.
              </p>
            )}
          </div>

          {/* macros */}
          <div className="mt-4 border border-lime/30 bg-lime/[0.04] p-3">
            <div className="meta mb-2.5 text-[0.4rem] text-lime">
              For {grams} g
            </div>
            <MacroReadout
              kcal={macros.kcal}
              protein={macros.protein}
              carbs={macros.carbs}
              fat={macros.fat}
            />
            <MacroBar
              macros={macros}
              height={7}
              showLegend
              className="mt-3"
            />
            <p className="meta mt-2.5 border-t border-white/10 pt-2 text-[0.38rem] text-white/40">
              Per 100 g · {Math.round(per.kcal)} kcal · P
              {per.protein.toFixed(1)} C{per.carbs.toFixed(1)} F
              {per.fat.toFixed(1)}
            </p>
          </div>

          <button
            onClick={() =>
              onConfirm({ product: chosen, grams, macros })
            }
            className="mt-4 flex w-full items-center justify-center gap-2 bg-lime px-4 py-3 text-background transition-transform duration-150 active:scale-[0.97]"
          >
            <Check className="h-4 w-4" />
            <span className="display text-sm font-bold">{confirmLabel}</span>
          </button>

          <p className="mt-2.5 text-[0.68rem] leading-relaxed text-white/40">
            Product data from Open Food Facts, contributed by the public. Check
            it against the pack — entries can be wrong or out of date.
          </p>
        </div>
      </div>
    );
  }

  /* ── edit view — correct a wrong database entry ─────────────────── */
  if (view === "edit" && chosen && draft) {
    const warning = macroSanityWarning({
      kcal: Number(draft.kcal) || 0,
      protein: Number(draft.protein) || 0,
      carbs: Number(draft.carbs) || 0,
      fat: Number(draft.fat) || 0,
    });

    const field = (
      label: string,
      key: keyof Draft,
      suffix: string,
      step = "0.1",
    ) => (
      <label className="block">
        <span className="meta mb-1.5 block text-[0.38rem] text-white/45">
          {label}
        </span>
        <span className="relative block">
          <input
            type="number"
            inputMode="decimal"
            step={step}
            min={0}
            value={draft[key]}
            onChange={(e) =>
              setDraft((d) => (d ? { ...d, [key]: e.target.value } : d))
            }
            className="h-9 w-full border border-white/15 bg-white/[0.03] px-2.5 pr-7 text-sm text-white focus:border-lime focus:outline-none"
          />
          <span className="meta pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[0.38rem] text-white/35">
            {suffix}
          </span>
        </span>
      </label>
    );

    return (
      <div className="border border-white/15">
        <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2.5">
          <button
            onClick={() => {
              setDraft(null);
              setView("confirm");
            }}
            className="flex items-center gap-2 text-white/55 transition-colors hover:text-lime"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="meta text-[0.42rem]">Cancel</span>
          </button>
          <span className="meta text-[0.42rem] text-lime">
            Correct this entry
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/40 transition-colors hover:text-lime"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="relative p-4">
          <span className="tick left-0 top-0 border-l border-t opacity-100" />
          <span className="tick right-0 top-0 border-r border-t opacity-100" />

          <p className="text-[0.8rem] leading-relaxed text-white/60">
            Copy the figures straight off the nutrition panel. Enter them{" "}
            <span className="text-lime">per 100 g</span> — that is the basis the
            rest of the site works in, and most labels print it.
          </p>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="meta mb-1.5 block text-[0.38rem] text-white/45">
                Product name
              </span>
              <input
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, name: e.target.value } : d))
                }
                placeholder="What it says on the pack"
                className="h-9 w-full border border-white/15 bg-white/[0.03] px-2.5 text-sm text-white placeholder:text-white/30 focus:border-lime focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="meta mb-1.5 block text-[0.38rem] text-white/45">
                Brand <span className="text-white/25">(optional)</span>
              </span>
              <input
                value={draft.brand}
                onChange={(e) =>
                  setDraft((d) => (d ? { ...d, brand: e.target.value } : d))
                }
                className="h-9 w-full border border-white/15 bg-white/[0.03] px-2.5 text-sm text-white focus:border-lime focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-5">
            <div className="meta mb-2.5 flex items-center gap-2.5 text-[0.4rem] text-lime">
              <span className="h-px w-5 bg-lime" />
              Per 100 g
            </div>
            <div className="grid grid-cols-2 gap-3">
              {field("Calories", "kcal", "kcal", "1")}
              {field("Protein", "protein", "g")}
              {field("Carbs", "carbs", "g")}
              {field("Fat", "fat", "g")}
              {field("Fibre", "fiber", "g")}
              <label className="block">
                <span className="meta mb-1.5 block text-[0.38rem] text-white/45">
                  Serving weight
                </span>
                <span className="relative block">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="1"
                    min={0}
                    value={draft.servingGrams}
                    onChange={(e) =>
                      setDraft((d) =>
                        d ? { ...d, servingGrams: e.target.value } : d,
                      )
                    }
                    placeholder="optional"
                    className="h-9 w-full border border-white/15 bg-white/[0.03] px-2.5 pr-7 text-sm text-white placeholder:text-white/30 focus:border-lime focus:outline-none"
                  />
                  <span className="meta pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[0.38rem] text-white/35">
                    g
                  </span>
                </span>
              </label>
            </div>
          </div>

          {warning && (
            <div className="mt-4 flex gap-2.5 border border-white/20 bg-white/[0.02] p-3">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
              <p className="text-[0.76rem] leading-relaxed text-white/65">
                {warning}
              </p>
            </div>
          )}

          <button
            onClick={saveEdit}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-lime px-4 py-3 text-background transition-transform duration-150 active:scale-[0.97]"
          >
            <Check className="h-4 w-4" />
            <span className="display text-sm font-bold">Save correction</span>
          </button>

          <p className="mt-2.5 text-[0.68rem] leading-relaxed text-white/40">
            Saved on this device for barcode {chosen.code} and reused every time
            you scan it. Nothing is uploaded, and the public Open Food Facts
            record is left unchanged.
          </p>
        </div>
      </div>
    );
  }

  /* ── search view ───────────────────────────────────────────────── */
  return (
    <>
      {scanning && (
        <BarcodeScanner
          onDetected={handleBarcode}
          onClose={() => setScanning(false)}
        />
      )}

      <div className="border border-white/15">
        <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2.5">
          <span className="meta text-[0.42rem] text-lime">Packaged food</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/40 transition-colors hover:text-lime"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-3.5">
          {/* scan */}
          <button
            onClick={() => {
              setNotice(null);
              setScanning(true);
            }}
            className="flex w-full items-center justify-center gap-2.5 bg-lime px-4 py-3 text-background transition-transform duration-150 active:scale-[0.97]"
          >
            <ScanLine className="h-4 w-4" />
            <span className="display text-sm font-bold">Scan a barcode</span>
          </button>

          {looking && (
            <div className="mt-3 flex items-center justify-center gap-2 border border-white/12 py-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-lime" />
              <span className="meta text-[0.42rem] text-white/55">
                Looking up the barcode…
              </span>
            </div>
          )}

          {notice && (
            <div className="mt-3 flex gap-2.5 border border-white/15 bg-white/[0.02] p-3">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
              <p className="text-[0.78rem] leading-relaxed text-white/65">
                {notice}
              </p>
            </div>
          )}

          {/* divider */}
          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="meta text-[0.38rem] text-white/30">or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {/* search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a brand or product..."
              className="h-10 w-full border border-white/15 bg-white/[0.03] pl-9 pr-9 text-sm text-white placeholder:text-white/35 focus:border-lime focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-lime"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {searching && (
            <div className="mt-3 flex items-center justify-center gap-2 py-4">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-lime" />
              <span className="meta text-[0.42rem] text-white/55">
                Searching…
              </span>
            </div>
          )}

          {!searching && searched && results.length === 0 && (
            <p className="mt-3 px-1 py-4 text-center text-[0.8rem] leading-relaxed text-white/45">
              Nothing found for that. Try the brand name on its own, or scan the
              barcode instead.
            </p>
          )}

          {!searching && results.length > 0 && (
            <>
              <div className="meta mb-2 mt-3.5 text-[0.4rem] text-white/40">
                {results.length} products
              </div>
              <div className="max-h-[300px] overflow-y-auto border border-white/12">
                {results.map((p, i) => {
                  // Show the member's own corrected figures in the list too, so
                  // a fixed product looks fixed everywhere it appears.
                  const { product: shown, corrected: isFixed } =
                    applyCorrection(p);
                  const serve = scaleProduct(shown, defaultGrams(shown));
                  return (
                    <button
                      key={p.code}
                      onClick={() => choose(p)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04] ${
                        i === results.length - 1
                          ? ""
                          : "border-b border-white/[0.08]"
                      }`}
                    >
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt=""
                          className="h-9 w-9 shrink-0 border border-white/10 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="h-9 w-9 shrink-0 border border-white/10" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.82rem] text-white">
                          {displayName(shown)}
                        </span>
                        <span className="meta text-[0.38rem] text-white/35">
                          {isFixed ? "Corrected · " : ""}
                          {shown.servingGrams
                            ? `${shown.servingGrams} g serving`
                            : "per 100 g"}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="display block text-[0.85rem] font-bold leading-none text-lime">
                          {Math.round(serve.kcal)}
                        </span>
                        <span className="meta text-[0.36rem] text-white/35">
                          P{Math.round(serve.protein)} C
                          {Math.round(serve.carbs)} F{Math.round(serve.fat)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <p className="mt-3.5 text-[0.68rem] leading-relaxed text-white/35">
            Packaged product data from{" "}
            <a
              href="https://world.openfoodfacts.org/"
              target="_blank"
              rel="noreferrer"
              className="text-lime/80 underline decoration-lime/30 underline-offset-2"
            >
              Open Food Facts
            </a>
            , a public database under the Open Database License. Entries are
            contributed by volunteers, so check them against the pack.
          </p>
        </div>
      </div>
    </>
  );
}
