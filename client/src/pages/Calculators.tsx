/**
 * Calculators — the bench. `/calculators`
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Each tool is an instrument panel: hairline frame, corner ticks, mono
 *    uppercase labels, one big lime readout. No cards with soft shadows.
 *  - Lime marks the RESULT and the active state only.
 *  - Coach-direct copy; the formula is always visible under the number.
 *
 * COMPLIANCE: no calculator prescribes anything. BMR/TDEE and macro splits are
 * labelled starting points, BMI ships with its own limitations attached, and
 * every readout states that it is an estimate.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import {
  ArrowRight,
  Calculator,
  Check,
  Dumbbell,
  Flame,
  HeartPulse,
  Info,
  PieChart,
  Repeat,
  Ruler,
  Scale,
  Trash2,
  Weight,
} from "lucide-react";
import {
  clearCalcProfile,
  loadCalcProfile,
  profileHasData,
  saveCalcProfile,
} from "@/lib/calcProfile";
import {
  ACTIVITY_LEVELS,
  CM_PER_IN,
  HR_ZONES,
  LB_PER_KG,
  MACRO_SPLITS,
  ORM_FORMULAS,
  ORM_PERCENTAGES,
  bmi,
  bmiBands,
  bodyFatBands,
  hrMax,
  inchesToFtIn,
  karvonen,
  leanMass,
  loadPlates,
  macroGrams,
  mifflinBmr,
  navyBodyFat,
  type Sex,
} from "@/lib/calculators";

/* ── shared bits ─────────────────────────────────────────────────── */

/** One instrument panel. */
function Panel({
  n,
  title,
  icon: Icon,
  blurb,
  children,
  id,
}: {
  n: number;
  title: string;
  icon: typeof Scale;
  blurb: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="hazard-rule mb-4" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="meta text-[0.55rem] text-white/25">
            {String(n).padStart(2, "0")}
          </span>
          <div>
            <h2 className="display flex items-center gap-2.5 text-[1.5rem] font-bold uppercase leading-none text-white sm:text-[1.85rem]">
              <Icon className="h-4 w-4 text-lime" />
              {title}
            </h2>
            <p className="mt-1.5 max-w-xl text-[0.82rem] leading-relaxed text-white/55">
              {blurb}
            </p>
          </div>
        </div>
      </div>
      <div className="relative border border-white/12 p-4 sm:p-5">
        <span className="tick left-0 top-0 border-l border-t" />
        <span className="tick right-0 top-0 border-r border-t" />
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  placeholder,
  step,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="meta mb-1.5 block text-[0.4rem] text-white/45">
        {label}
        {unit ? ` (${unit})` : ""}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        placeholder={placeholder ?? "—"}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full border border-white/15 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/25 focus:border-lime focus:outline-none"
      />
    </label>
  );
}

function SexToggle({
  value,
  onChange,
}: {
  value: Sex;
  onChange: (s: Sex) => void;
}) {
  return (
    <div>
      <span className="meta mb-1.5 block text-[0.4rem] text-white/45">
        Formula variant
      </span>
      <div className="flex border border-white/15">
        {(["male", "female"] as const).map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`meta flex-1 py-2.5 text-[0.42rem] transition-colors ${
              value === s
                ? "bg-lime text-black"
                : "text-white/50 hover:text-white"
            }`}
          >
            {s === "male" ? "Male" : "Female"}
          </button>
        ))}
      </div>
    </div>
  );
}

/** The single big lime number every panel resolves to. */
function Readout({
  value,
  unit,
  caption,
  sub,
}: {
  value: string;
  unit?: string;
  caption: string;
  sub?: string;
}) {
  return (
    <div className="border border-lime/35 bg-lime/[0.05] p-4">
      <div className="meta mb-2 text-[0.4rem] text-lime">{caption}</div>
      <div className="flex items-baseline gap-2">
        <span className="display text-[2.6rem] font-bold leading-none text-lime">
          {value}
        </span>
        {unit && (
          <span className="meta text-[0.5rem] text-white/50">{unit}</span>
        )}
      </div>
      {sub && (
        <p className="meta mt-2 text-[0.38rem] leading-relaxed text-white/40">
          {sub}
        </p>
      )}
    </div>
  );
}

const TOOLS = [
  { id: "bmi", label: "BMI" },
  { id: "bodyfat", label: "Body Fat" },
  { id: "onerm", label: "1RM" },
  { id: "energy", label: "BMR / TDEE" },
  { id: "macros", label: "Macro Split" },
  { id: "hr", label: "HR Zones" },
  { id: "plates", label: "Plate Loader" },
  { id: "convert", label: "Converter" },
];

export default function Calculators() {
  /**
   * Everything the member types is restored from their device on mount, so a
   * returning member never re-enters height, weight, age or measurements.
   * `useState(initialiser)` runs once — reading storage in render would
   * re-read on every keystroke.
   */
  const [saved] = useState(() => loadCalcProfile());

  /* ── units ───────────────────────────────────────────────────── */
  const [imperial, setImperial] = useState(saved.imperial);

  /* ── shared body inputs, reused by BMI / body fat / energy ──── */
  const [sex, setSex] = useState<Sex>(
    saved.sex === "female" ? "female" : "male",
  );
  const [age, setAge] = useState(saved.age);
  const [weight, setWeight] = useState(saved.weight);
  const [heightFt, setHeightFt] = useState(saved.heightFt);
  const [heightIn2, setHeightIn2] = useState(saved.heightIn);
  const [heightCm, setHeightCm] = useState(saved.heightCm);

  const kg = useMemo(() => {
    const w = Number(weight);
    if (!w) return 0;
    return imperial ? w / LB_PER_KG : w;
  }, [weight, imperial]);

  const cm = useMemo(() => {
    if (imperial) {
      const ft = Number(heightFt) || 0;
      const inch = Number(heightIn2) || 0;
      const total = ft * 12 + inch;
      return total > 0 ? total * CM_PER_IN : 0;
    }
    return Number(heightCm) || 0;
  }, [imperial, heightFt, heightIn2, heightCm]);

  const heightInches = cm / CM_PER_IN;

  /* ── BMI ─────────────────────────────────────────────────────── */
  const bmiValue = kg > 0 && cm > 0 ? bmi(kg, cm) : null;

  /* ── body fat ────────────────────────────────────────────────── */
  const [neck, setNeck] = useState(saved.neck);
  const [waist, setWaist] = useState(saved.waist);
  const [hip, setHip] = useState(saved.hip);

  const bfValue = useMemo(() => {
    const toIn = (v: string) => {
      const n = Number(v);
      if (!n) return 0;
      return imperial ? n : n / CM_PER_IN;
    };
    if (!heightInches) return null;
    return navyBodyFat({
      sex,
      heightIn: heightInches,
      neckIn: toIn(neck),
      waistIn: toIn(waist),
      hipIn: toIn(hip),
    });
  }, [sex, heightInches, neck, waist, hip, imperial]);

  const composition =
    bfValue !== null && kg > 0 ? leanMass(kg, bfValue) : null;

  /* ── 1RM ─────────────────────────────────────────────────────── */
  const [liftWeight, setLiftWeight] = useState("");
  const [liftReps, setLiftReps] = useState("5");
  const [ormFormula, setOrmFormula] = useState<string>("epley");

  const ormResults = useMemo(() => {
    const w = Number(liftWeight);
    const r = Number(liftReps);
    if (!w || !r || r < 1) return null;
    return ORM_FORMULAS.map((f) => ({
      ...f,
      value: f.fn(w, r),
    }));
  }, [liftWeight, liftReps]);

  const chosenOrm =
    ormResults?.find((r) => r.key === ormFormula)?.value ?? null;

  /* ── BMR / TDEE ──────────────────────────────────────────────── */
  const [activity, setActivity] = useState<string>(saved.activity);
  const bmrValue =
    kg > 0 && cm > 0 && Number(age) > 0
      ? mifflinBmr({ sex, kg, cm, age: Number(age) })
      : null;
  const activityFactor =
    ACTIVITY_LEVELS.find((a) => a.key === activity)?.factor ?? 1.55;
  const tdeeValue = bmrValue !== null ? bmrValue * activityFactor : null;

  /* ── macro split ─────────────────────────────────────────────── */
  const [macroKcal, setMacroKcal] = useState("");
  const [splitKey, setSplitKey] = useState<string>("highProtein");
  const split = MACRO_SPLITS.find((s) => s.key === splitKey) ?? MACRO_SPLITS[0];
  const macroResult = useMemo(() => {
    const k = Number(macroKcal);
    if (!k) return null;
    return macroGrams(k, split.p, split.c, split.f);
  }, [macroKcal, split]);

  /* ── heart rate ──────────────────────────────────────────────── */
  const [restingHr, setRestingHr] = useState(saved.restingHr);
  const hrMaxValue = Number(age) > 0 ? hrMax(Number(age)) : null;
  const hrZones = useMemo(() => {
    const rest = Number(restingHr);
    if (!hrMaxValue || !rest) return null;
    return HR_ZONES.map((z) => ({
      ...z,
      loBpm: Math.round(karvonen(rest, hrMaxValue, z.lo)),
      hiBpm: Math.round(karvonen(rest, hrMaxValue, z.hi)),
    }));
  }, [restingHr, hrMaxValue]);

  /* ── plate loader ────────────────────────────────────────────── */
  const plateUnit: "kg" | "lb" = imperial ? "lb" : "kg";
  const [plateTarget, setPlateTarget] = useState("");
  const [barWeight, setBarWeight] = useState(saved.barWeight);
  const plateResult = useMemo(() => {
    const t = Number(plateTarget);
    const b = Number(barWeight);
    if (!t || !b) return null;
    return loadPlates(t, b, plateUnit);
  }, [plateTarget, barWeight, plateUnit]);

  /* ── converter ───────────────────────────────────────────────── */
  const [convKg, setConvKg] = useState("");
  const [convLb, setConvLb] = useState("");
  const [convCm, setConvCm] = useState("");
  const [convIn, setConvIn] = useState("");

  /* ── persistence ─────────────────────────────────────────────── */
  /**
   * Debounced so a member typing "185" writes once rather than three times.
   * The converter and the 1RM inputs are deliberately NOT persisted — they are
   * throwaway scratch values, unlike body measurements.
   */
  const [savedFlash, setSavedFlash] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    const profile = {
      sex,
      age,
      imperial,
      weight,
      heightFt,
      heightIn: heightIn2,
      heightCm,
      neck,
      waist,
      hip,
      restingHr,
      activity,
      barWeight,
    };
    const hasData = profileHasData(profile);

    const t = window.setTimeout(() => {
      saveCalcProfile(profile);
      // no "saved" badge on the very first mount, only on real edits
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      if (hasData) {
        setSavedFlash(true);
        window.setTimeout(() => setSavedFlash(false), 1600);
      }
    }, 600);

    return () => window.clearTimeout(t);
  }, [
    sex,
    age,
    imperial,
    weight,
    heightFt,
    heightIn2,
    heightCm,
    neck,
    waist,
    hip,
    restingHr,
    activity,
    barWeight,
  ]);

  const hasStoredData = profileHasData({
    sex,
    age,
    imperial,
    weight,
    heightFt,
    heightIn: heightIn2,
    heightCm,
    neck,
    waist,
    hip,
    restingHr,
    activity,
    barWeight,
  });

  function handleClear() {
    clearCalcProfile();
    setAge("");
    setWeight("");
    setHeightFt("");
    setHeightIn2("");
    setHeightCm("");
    setNeck("");
    setWaist("");
    setHip("");
    setRestingHr("");
    setSavedFlash(false);
  }

  /**
   * Switching units converts what the member already typed rather than leaving
   * a stale number behind. Without this, "180" entered as cm would silently be
   * reinterpreted as 180 inches — a 15-foot member and a nonsense BMI.
   */
  function switchUnits(toImperial: boolean) {
    if (toImperial === imperial) return;

    const conv = (v: string, fn: (n: number) => number) => {
      const n = Number(v);
      return v && n > 0 ? fn(n).toFixed(1) : v;
    };

    if (toImperial) {
      // kg → lb, cm → ft+in
      setWeight(conv(weight, (n) => n * LB_PER_KG));
      const cmVal = Number(heightCm);
      if (cmVal > 0) {
        const totalIn = cmVal / CM_PER_IN;
        const { ft, inches } = inchesToFtIn(totalIn);
        setHeightFt(String(ft));
        setHeightIn2(String(inches));
      }
      setNeck(conv(neck, (n) => n / CM_PER_IN));
      setWaist(conv(waist, (n) => n / CM_PER_IN));
      setHip(conv(hip, (n) => n / CM_PER_IN));
      setBarWeight("45");
    } else {
      // lb → kg, ft+in → cm
      setWeight(conv(weight, (n) => n / LB_PER_KG));
      const totalIn = (Number(heightFt) || 0) * 12 + (Number(heightIn2) || 0);
      if (totalIn > 0) setHeightCm((totalIn * CM_PER_IN).toFixed(1));
      setNeck(conv(neck, (n) => n * CM_PER_IN));
      setWaist(conv(waist, (n) => n * CM_PER_IN));
      setHip(conv(hip, (n) => n * CM_PER_IN));
      setBarWeight("20");
    }

    setImperial(toImperial);
  }

  return (
    <div className="min-h-screen">
      <SiteNav active="calculators">
        <div className="flex shrink-0 border border-white/15">
          {[
            { v: true, l: "LB / FT" },
            { v: false, l: "KG / CM" },
          ].map((u) => (
            <button
              key={u.l}
              onClick={() => switchUnits(u.v)}
              className={`meta px-2.5 py-2.5 text-[0.42rem] transition-colors ${
                imperial === u.v
                  ? "bg-lime text-black"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {u.l}
            </button>
          ))}
        </div>
      </SiteNav>

      {/* ══ MASTHEAD ═════════════════════════════════════════════════ */}
      <section className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8 sm:py-10">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="h-px w-8 bg-lime" />
            <span className="meta text-[0.45rem] text-lime">
              The Bench · Rev. 01
            </span>
          </div>
          <h1 className="display text-[2.5rem] font-bold leading-[0.88] text-white sm:text-[3.5rem]">
            Run the numbers.
            <br />
            <span className="text-lime">Then go train.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
            Eight tools, every formula shown and sourced. Enter your details once
            at the top and the body calculators fill themselves in. Your details
            stay on this device for next time and are never sent anywhere.
          </p>

          {/* quick jump rail */}
          <div className="mt-7 flex flex-wrap gap-1.5">
            {TOOLS.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="meta border border-white/12 px-3 py-2 text-[0.42rem] text-white/55 transition-colors duration-200 hover:border-lime hover:text-lime"
              >
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SHARED INPUTS ════════════════════════════════════════════ */}
      <section className="sticky top-16 z-30 border-b border-white/10 bg-background/95 backdrop-blur-xl sm:top-[4.5rem]">
        <div className="container py-4">
          <div className="mb-2.5 flex items-center gap-2">
            <Ruler className="h-3.5 w-3.5 text-lime" />
            <span className="meta text-[0.42rem] text-lime">
              Your details — used by BMI, body fat and energy
            </span>
            {savedFlash && (
              <span className="meta flex items-center gap-1 text-[0.38rem] text-lime/70">
                <Check className="h-2.5 w-2.5" />
                Saved
              </span>
            )}
            {hasStoredData && (
              <button
                onClick={handleClear}
                className="meta ml-auto flex shrink-0 items-center gap-1.5 border border-white/15 px-2.5 py-1.5 text-[0.38rem] text-white/45 transition-colors duration-200 hover:border-lime hover:text-lime"
              >
                <Trash2 className="h-2.5 w-2.5" />
                Clear saved details
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
            <SexToggle value={sex} onChange={setSex} />
            <Field label="Age" unit="yrs" value={age} onChange={setAge} />
            <Field
              label="Weight"
              unit={imperial ? "lb" : "kg"}
              value={weight}
              onChange={setWeight}
            />
            {imperial ? (
              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="Height"
                  unit="ft"
                  value={heightFt}
                  onChange={setHeightFt}
                />
                <Field
                  label="&nbsp;"
                  unit="in"
                  value={heightIn2}
                  onChange={setHeightIn2}
                />
              </div>
            ) : (
              <Field
                label="Height"
                unit="cm"
                value={heightCm}
                onChange={setHeightCm}
              />
            )}
            <div className="col-span-2 flex items-end sm:col-span-1">
              <p className="meta text-[0.38rem] leading-relaxed text-white/35">
                Kept on this device so you do not retype it next visit. Never
                sent anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-12 py-9">
        {/* ══ 01 BMI ═════════════════════════════════════════════════ */}
        <Panel
          id="bmi"
          n={1}
          title="Body Mass Index"
          icon={Scale}
          blurb="Weight relative to height. A population screening measure — read the caveat below before you read the number."
        >
          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <Readout
              value={bmiValue ? bmiValue.toFixed(1) : "—"}
              unit="kg/m²"
              caption="Your BMI"
              sub={
                bmiValue
                  ? "BMI = weight (kg) ÷ height (m)²"
                  : "Enter weight and height above"
              }
            />
            <div>
              <div className="divide-y divide-white/10 border border-white/12">
                {bmiBands(bmiValue).map((b) => (
                  <div
                    key={b.label}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 ${
                      b.active ? "bg-lime/[0.07]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-6 w-[3px] shrink-0 ${
                          b.active ? "bg-lime" : "bg-white/12"
                        }`}
                      />
                      <span
                        className={`text-[0.85rem] ${
                          b.active
                            ? "font-semibold text-lime"
                            : "text-white/60"
                        }`}
                      >
                        {b.label}
                      </span>
                    </div>
                    <span className="meta text-[0.4rem] text-white/40">
                      {b.range}
                    </span>
                  </div>
                ))}
              </div>
              <p className="meta mt-2.5 text-[0.38rem] text-white/35">
                CDC adult categories, ages 20 and over
              </p>
            </div>
          </div>

          {/* the caveat that matters most to a gym audience */}
          <div className="mt-4 flex gap-3 border border-lime/25 bg-lime/[0.03] p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
            <div>
              <p className="text-[0.82rem] leading-relaxed text-white/70">
                <strong className="text-white">
                  BMI cannot tell muscle from fat.
                </strong>{" "}
                If you train seriously, it will often place you in the overweight
                band while your body composition is fine — this is a documented
                limitation, not a judgement on you. The CDC is explicit that BMI
                is a screening measure to be read alongside other information.
              </p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-white/45">
                For a lifter, the body fat estimate below, waist measurement, and
                how your training and bloodwork are going all tell you more. If
                you want your own numbers interpreted, that is a conversation for
                your doctor.
              </p>
            </div>
          </div>
        </Panel>

        {/* ══ 02 BODY FAT ════════════════════════════════════════════ */}
        <Panel
          id="bodyfat"
          n={2}
          title="Body Fat Estimate"
          icon={Ruler}
          blurb="US Navy circumference method. More useful than BMI for a trained body, but still an estimate with roughly 3–4 percentage points of error."
        >
          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <div className="space-y-2.5">
              <Field
                label="Neck"
                unit={imperial ? "in" : "cm"}
                value={neck}
                onChange={setNeck}
              />
              <Field
                label="Waist"
                unit={imperial ? "in" : "cm"}
                value={waist}
                onChange={setWaist}
              />
              {sex === "female" && (
                <Field
                  label="Hips"
                  unit={imperial ? "in" : "cm"}
                  value={hip}
                  onChange={setHip}
                />
              )}
            </div>

            <div className="space-y-3">
              <Readout
                value={bfValue !== null ? bfValue.toFixed(1) : "—"}
                unit="% body fat"
                caption="Estimated body fat"
                sub={
                  bfValue !== null
                    ? "US Navy circumference formula · ±3–4 percentage points"
                    : "Enter height above, plus neck and waist"
                }
              />

              {composition && (
                <div className="grid grid-cols-2 divide-x divide-white/12 border border-white/12">
                  <div className="px-3.5 py-3">
                    <div className="meta text-[0.38rem] text-white/45">
                      Lean mass
                    </div>
                    <div className="display mt-1 text-lg font-bold text-white">
                      {imperial
                        ? `${(composition.leanKg * LB_PER_KG).toFixed(1)} lb`
                        : `${composition.leanKg.toFixed(1)} kg`}
                    </div>
                  </div>
                  <div className="px-3.5 py-3">
                    <div className="meta text-[0.38rem] text-white/45">
                      Fat mass
                    </div>
                    <div className="display mt-1 text-lg font-bold text-white">
                      {imperial
                        ? `${(composition.fatKg * LB_PER_KG).toFixed(1)} lb`
                        : `${composition.fatKg.toFixed(1)} kg`}
                    </div>
                  </div>
                </div>
              )}

              <div className="divide-y divide-white/10 border border-white/12">
                {bodyFatBands(sex).map((b) => {
                  const active =
                    bfValue !== null && bfValue > b.lo && bfValue <= b.hi;
                  return (
                    <div
                      key={b.label}
                      className={`flex items-center justify-between gap-3 px-3.5 py-2 ${
                        active ? "bg-lime/[0.07]" : ""
                      }`}
                    >
                      <span
                        className={`text-[0.82rem] ${
                          active
                            ? "font-semibold text-lime"
                            : "text-white/60"
                        }`}
                      >
                        {b.label}
                      </span>
                      <span className="meta text-[0.4rem] text-white/40">
                        {b.range}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="meta text-[0.38rem] text-white/35">
                Descriptive population ranges (ACE). Lower is not automatically
                better — essential fat is a floor, not a goal.
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-3.5">
            <div className="meta mb-2 text-[0.4rem] text-lime">
              How to measure
            </div>
            <div className="grid gap-2.5 text-[0.8rem] leading-relaxed text-white/60 sm:grid-cols-3">
              <p>
                <strong className="text-white/85">Neck.</strong> Just below the
                larynx, above the trapezius. Tape level.
              </p>
              <p>
                <strong className="text-white/85">Waist.</strong> Narrowest point
                above the hip bone — for most men at the navel, exhaled normally.
              </p>
              <p>
                <strong className="text-white/85">Hips.</strong> Feet together,
                widest point of the glutes. Women only.
              </p>
            </div>
          </div>
        </Panel>

        {/* ══ 03 ONE-REP MAX ═════════════════════════════════════════ */}
        <Panel
          id="onerm"
          n={3}
          title="One-Rep Max"
          icon={Dumbbell}
          blurb="Estimate your max from a set you have actually done, then read off training loads. Most reliable at five reps or fewer."
        >
          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <div className="space-y-2.5">
              <Field
                label="Weight lifted"
                unit={imperial ? "lb" : "kg"}
                value={liftWeight}
                onChange={setLiftWeight}
              />
              <Field
                label="Reps completed"
                value={liftReps}
                onChange={setLiftReps}
              />
              <div>
                <span className="meta mb-1.5 block text-[0.4rem] text-white/45">
                  Formula
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {ORM_FORMULAS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setOrmFormula(f.key)}
                      className={`meta border px-2 py-2 text-[0.4rem] transition-colors ${
                        ormFormula === f.key
                          ? "border-lime bg-lime/10 text-lime"
                          : "border-white/12 text-white/50 hover:border-white/30"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Readout
                value={
                  chosenOrm && isFinite(chosenOrm)
                    ? Math.round(chosenOrm).toString()
                    : "—"
                }
                unit={imperial ? "lb" : "kg"}
                caption="Estimated one-rep max"
                sub={
                  ORM_FORMULAS.find((f) => f.key === ormFormula)?.expr
                }
              />

              {Number(liftReps) > 10 && (
                <div className="flex gap-2.5 border border-lime/30 bg-lime/[0.04] px-3.5 py-2.5">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
                  <p className="text-[0.78rem] leading-relaxed text-white/65">
                    Past ten reps these formulas diverge sharply and the estimate
                    gets unreliable. Test with a heavier set of five or fewer for
                    a figure worth programming from.
                  </p>
                </div>
              )}

              {ormResults && (
                <div>
                  <div className="meta mb-2 text-[0.4rem] text-white/45">
                    All four formulas, for comparison
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                    {ormResults.map((r) => (
                      <div
                        key={r.key}
                        className={`border px-2.5 py-2 ${
                          r.key === ormFormula
                            ? "border-lime/40 bg-lime/[0.06]"
                            : "border-white/12"
                        }`}
                      >
                        <div className="meta text-[0.38rem] text-white/40">
                          {r.name}
                        </div>
                        <div className="display mt-0.5 text-base font-bold text-white">
                          {isFinite(r.value) ? Math.round(r.value) : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="meta mt-2 text-[0.38rem] leading-relaxed text-white/35">
                    Estimates can differ from a tested max by 10% or more, and
                    they assume training experience. Treat the number as a
                    starting point for a real test, not a max you should attempt
                    cold.
                  </p>
                </div>
              )}

              {chosenOrm && isFinite(chosenOrm) && (
                <div>
                  <div className="meta mb-2 text-[0.4rem] text-lime">
                    Training loads
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                    {ORM_PERCENTAGES.map((p) => (
                      <div
                        key={p.pct}
                        className="border border-white/12 px-2.5 py-2"
                      >
                        <div className="meta text-[0.38rem] text-white/40">
                          {p.pct}% · ~{p.reps} reps
                        </div>
                        <div className="display mt-0.5 text-sm font-bold text-lime">
                          {Math.round((chosenOrm * p.pct) / 100)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>

        {/* ══ 04 BMR / TDEE ══════════════════════════════════════════ */}
        <Panel
          id="energy"
          n={4}
          title="BMR & Daily Energy"
          icon={Flame}
          blurb="Mifflin-St Jeor, the most widely used estimate of resting metabolism, scaled by how active you actually are."
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
            <div>
              <span className="meta mb-2 block text-[0.4rem] text-white/45">
                Activity level
              </span>
              <div className="divide-y divide-white/10 border border-white/12">
                {ACTIVITY_LEVELS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => setActivity(a.key)}
                    className={`flex w-full items-center gap-3.5 px-3.5 py-2.5 text-left transition-colors ${
                      activity === a.key
                        ? "bg-lime/[0.07]"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`h-7 w-[3px] shrink-0 ${
                        activity === a.key ? "bg-lime" : "bg-white/12"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[0.88rem] ${
                          activity === a.key
                            ? "font-semibold text-lime"
                            : "text-white"
                        }`}
                      >
                        {a.label}
                      </span>
                      <span className="meta text-[0.38rem] text-white/40">
                        {a.detail}
                      </span>
                    </span>
                    <span className="meta shrink-0 text-[0.4rem] text-white/35">
                      ×{a.factor}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Readout
                value={bmrValue ? Math.round(bmrValue).toString() : "—"}
                unit="kcal / day"
                caption="Resting metabolism (BMR)"
                sub="Mifflin-St Jeor: 10×kg + 6.25×cm − 5×age ± sex constant"
              />
              <Readout
                value={tdeeValue ? Math.round(tdeeValue).toString() : "—"}
                unit="kcal / day"
                caption="Daily energy estimate (TDEE)"
                sub={`BMR × ${activityFactor}`}
              />
              {tdeeValue && (
                <button
                  onClick={() => setMacroKcal(String(Math.round(tdeeValue)))}
                  className="meta flex w-full items-center justify-center gap-2 border border-white/15 px-3 py-2.5 text-[0.42rem] text-white/60 transition-colors hover:border-lime hover:text-lime"
                >
                  Send to macro split
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3 border border-white/12 bg-white/[0.02] p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
            <div>
              <p className="text-[0.82rem] leading-relaxed text-white/70">
                <strong className="text-white">
                  This is a starting point, not a target.
                </strong>{" "}
                Prediction equations carry meaningful error, and activity
                multipliers are broad brackets. The honest use is to eat around
                this figure for two or three weeks, track the trend in your
                weight, and adjust from what actually happens.
              </p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-white/45">
                We deliberately do not turn this into a calorie prescription. For
                intake specific to your health, training and goals, speak to a
                registered dietitian or your doctor.
              </p>
            </div>
          </div>
        </Panel>

        {/* ══ 05 MACRO SPLIT ═════════════════════════════════════════ */}
        <Panel
          id="macros"
          n={5}
          title="Macro Split"
          icon={PieChart}
          blurb="Turn a calorie figure into grams of protein, carbs and fat. Protein at 4 kcal/g, carbs 4, fat 9."
        >
          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <div className="space-y-2.5">
              <Field
                label="Daily calories"
                unit="kcal"
                value={macroKcal}
                onChange={setMacroKcal}
              />
              <div>
                <span className="meta mb-1.5 block text-[0.4rem] text-white/45">
                  Split
                </span>
                <div className="space-y-1.5">
                  {MACRO_SPLITS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSplitKey(s.key)}
                      className={`meta flex w-full items-center justify-between border px-2.5 py-2 text-[0.4rem] transition-colors ${
                        splitKey === s.key
                          ? "border-lime bg-lime/10 text-lime"
                          : "border-white/12 text-white/50 hover:border-white/30"
                      }`}
                    >
                      <span>{s.label}</span>
                      <span className="opacity-60">
                        {s.p}/{s.c}/{s.f}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {[
                  {
                    label: "Protein",
                    grams: macroResult?.protein,
                    pct: split.p,
                  },
                  { label: "Carbs", grams: macroResult?.carbs, pct: split.c },
                  { label: "Fat", grams: macroResult?.fat, pct: split.f },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="border border-lime/30 bg-lime/[0.04] p-3.5"
                  >
                    <div className="meta text-[0.4rem] text-lime">
                      {m.label} · {m.pct}%
                    </div>
                    <div className="display mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-[1.9rem] font-bold leading-none text-lime">
                        {m.grams ? Math.round(m.grams) : "—"}
                      </span>
                      <span className="meta text-[0.45rem] text-white/50">
                        g
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {macroResult && (
                <Link
                  href="/nutrition/tracker"
                  className="meta mt-3 flex items-center justify-center gap-2 border border-white/15 px-3 py-2.5 text-[0.42rem] text-white/60 transition-colors hover:border-lime hover:text-lime"
                >
                  Enter these as your targets in the tracker
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}

              <p className="meta mt-3 text-[0.38rem] leading-relaxed text-white/35">
                These splits are common conventions, not rules. Total calories
                and adequate protein matter far more than the exact ratio.
              </p>
            </div>
          </div>
        </Panel>

        {/* ══ 06 HEART RATE ══════════════════════════════════════════ */}
        <Panel
          id="hr"
          n={6}
          title="Heart Rate Zones"
          icon={HeartPulse}
          blurb="Karvonen method, which uses your heart rate reserve rather than a flat percentage of max — more individual, given your resting rate."
        >
          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <div className="space-y-2.5">
              <Field
                label="Resting heart rate"
                unit="bpm"
                value={restingHr}
                onChange={setRestingHr}
              />
              <Readout
                value={hrMaxValue ? String(hrMaxValue) : "—"}
                unit="bpm"
                caption="Estimated max heart rate"
                sub="220 − age · roughly ±10–12 bpm between individuals"
              />
              <p className="meta text-[0.38rem] leading-relaxed text-white/35">
                Measure resting rate on waking, before getting up.
              </p>
            </div>

            <div>
              <div className="divide-y divide-white/10 border border-white/12">
                {(hrZones ?? HR_ZONES.map((z) => ({ ...z, loBpm: 0, hiBpm: 0 }))).map(
                  (z) => (
                    <div key={z.zone} className="flex gap-3.5 px-3.5 py-2.5">
                      <span className="meta w-12 shrink-0 pt-0.5 text-[0.4rem] text-lime">
                        {z.zone}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-[0.88rem] font-semibold text-white">
                            {z.name}
                          </span>
                          <span className="display text-[0.9rem] font-bold text-lime">
                            {hrZones ? `${z.loBpm}–${z.hiBpm} bpm` : "—"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[0.78rem] leading-relaxed text-white/50">
                          {z.use}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
              <p className="meta mt-2.5 text-[0.38rem] leading-relaxed text-white/35">
                Karvonen: resting + intensity × (max − resting). If you take
                medication affecting heart rate, or have a cardiac condition,
                these brackets may not apply to you — ask your doctor.
              </p>
            </div>
          </div>
        </Panel>

        {/* ══ 07 PLATE LOADER ════════════════════════════════════════ */}
        <Panel
          id="plates"
          n={7}
          title="Plate Loader"
          icon={Weight}
          blurb="What to hang on each side of the bar, heaviest first. Saves the mental arithmetic under a loaded rack."
        >
          <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
            <div className="space-y-2.5">
              <Field
                label="Target total"
                unit={plateUnit}
                value={plateTarget}
                onChange={setPlateTarget}
              />
              <Field
                label="Bar weight"
                unit={plateUnit}
                value={barWeight}
                onChange={setBarWeight}
              />
              <p className="meta text-[0.38rem] leading-relaxed text-white/35">
                Standard bar: 45 lb / 20 kg. Women's bar: 35 lb / 15 kg.
              </p>
            </div>

            <div>
              {plateResult ? (
                <>
                  <div className="border border-lime/35 bg-lime/[0.05] p-4">
                    <div className="meta mb-3 text-[0.4rem] text-lime">
                      Per side, load heaviest first
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {plateResult.perSide.length === 0 ? (
                        <span className="text-[0.85rem] text-white/50">
                          Bar only
                        </span>
                      ) : (
                        plateResult.perSide.map((p, i) => (
                          <span
                            key={i}
                            className="display flex h-12 min-w-12 items-center justify-center border-2 border-lime bg-lime/10 px-2.5 text-base font-bold text-lime"
                          >
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                    <div className="mt-3.5 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-lime/20 pt-3">
                      <span className="meta text-[0.4rem] text-white/45">
                        Total on bar
                      </span>
                      <span className="display text-lg font-bold text-white">
                        {plateResult.achievable} {plateUnit}
                      </span>
                    </div>
                  </div>
                  {plateResult.leftover > 0 && (
                    <div className="mt-2.5 flex gap-2.5 border border-white/15 px-3.5 py-2.5">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
                      <p className="text-[0.78rem] leading-relaxed text-white/60">
                        {plateResult.leftover} {plateUnit} short of your target —
                        standard plates cannot make it exactly. Closest load is{" "}
                        {plateResult.achievable} {plateUnit}.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="border border-dashed border-white/15 px-4 py-10 text-center">
                  <p className="text-[0.85rem] text-white/40">
                    Enter a target above the bar weight.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Panel>

        {/* ══ 08 CONVERTER ═══════════════════════════════════════════ */}
        <Panel
          id="convert"
          n={8}
          title="Unit Converter"
          icon={Repeat}
          blurb="Weight and height between metric and imperial, for reading programmes written the other way round."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="meta mb-2.5 text-[0.4rem] text-lime">Weight</div>
              <div className="space-y-2.5">
                <Field
                  label="Kilograms"
                  unit="kg"
                  value={convKg}
                  onChange={(v) => {
                    setConvKg(v);
                    setConvLb(
                      v ? (Number(v) * LB_PER_KG).toFixed(1) : "",
                    );
                  }}
                />
                <Field
                  label="Pounds"
                  unit="lb"
                  value={convLb}
                  onChange={(v) => {
                    setConvLb(v);
                    setConvKg(
                      v ? (Number(v) / LB_PER_KG).toFixed(1) : "",
                    );
                  }}
                />
              </div>
            </div>

            <div>
              <div className="meta mb-2.5 text-[0.4rem] text-lime">Height</div>
              <div className="space-y-2.5">
                <Field
                  label="Centimetres"
                  unit="cm"
                  value={convCm}
                  onChange={(v) => {
                    setConvCm(v);
                    setConvIn(v ? (Number(v) / CM_PER_IN).toFixed(1) : "");
                  }}
                />
                <Field
                  label="Inches"
                  unit="in"
                  value={convIn}
                  onChange={(v) => {
                    setConvIn(v);
                    setConvCm(v ? (Number(v) * CM_PER_IN).toFixed(1) : "");
                  }}
                />
                {convIn && Number(convIn) > 0 && (
                  <p className="meta text-[0.4rem] text-white/45">
                    ={" "}
                    {inchesToFtIn(Number(convIn)).ft} ft{" "}
                    {inchesToFtIn(Number(convIn)).inches} in
                  </p>
                )}
              </div>
            </div>
          </div>
        </Panel>

        {/* ══ SOURCES ════════════════════════════════════════════════ */}
        <div className="flex gap-3 border border-white/12 bg-white/[0.02] p-4">
          <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
          <div>
            <div className="meta mb-2 text-[0.4rem] text-lime">
              Where these formulas come from
            </div>
            <ul className="space-y-1 text-[0.78rem] leading-relaxed text-white/55">
              <li>
                <strong className="text-white/80">BMI categories</strong> —{" "}
                <a
                  href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lime/85 underline decoration-lime/30 underline-offset-2"
                >
                  CDC adult BMI categories
                </a>
              </li>
              <li>
                <strong className="text-white/80">Body fat</strong> — US Navy
                circumference method
              </li>
              <li>
                <strong className="text-white/80">One-rep max</strong> — Epley
                (1985), Brzycki (1998), Lombardi, O'Conner
              </li>
              <li>
                <strong className="text-white/80">BMR</strong> — Mifflin-St Jeor
                equation
              </li>
              <li>
                <strong className="text-white/80">Heart rate zones</strong> —
                Karvonen &amp; Vuorimaa (1988), heart rate reserve method
              </li>
            </ul>
            <p className="mt-3 text-[0.78rem] leading-relaxed text-white/40">
              Every output on this page is an estimate produced by a population
              formula. None of it is medical advice or a substitute for
              assessment by a qualified professional.
            </p>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
      <footer className="mt-6 border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container py-8">
          <p className="display text-sm font-semibold text-lime">
            Stay consistent. Stay disciplined. Build the body.
          </p>
          <p className="meta mt-2 text-[0.42rem] text-white/35">
            © 2024 Build The Body · General reference information, not medical or
            individual health advice
          </p>
        </div>
      </footer>
    </div>
  );
}
