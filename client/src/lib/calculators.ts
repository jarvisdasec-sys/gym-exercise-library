/**
 * Fitness calculator formulas.
 *
 * EVERY formula here is traced to a source in /home/ubuntu/calculator_formula_notes.md
 * and the source is surfaced in the UI. Rules this module exists to enforce:
 *
 *  1. Nothing is PRESCRIBED. BMR/TDEE and macro splits return starting points,
 *     never "your target". The tracker already requires the member to enter
 *     their own targets and this must stay consistent with that.
 *  2. Every output is an ESTIMATE and carries its known error. A gym audience is
 *     precisely the group BMI misclassifies, so BMI ships with that caveat
 *     attached rather than as a standalone verdict.
 *  3. Person-first language, per CDC guidance: "adults with obesity", never
 *     "obese". No shaming copy anywhere in this file.
 */

export const LB_PER_KG = 2.20462;
export const CM_PER_IN = 2.54;

export type Sex = "male" | "female";

/* ══ BMI ═══════════════════════════════════════════════════════════ */

export function bmi(kg: number, cm: number): number {
  const m = cm / 100;
  return kg / (m * m);
}

export interface BmiBand {
  label: string;
  range: string;
  /** true when the value falls in this band */
  active: boolean;
}

/**
 * CDC adult categories (20+). Returned as bands so the UI can show the scale.
 * Pass null before the member has entered anything — otherwise a sentinel like
 * -1 would light up "Underweight", which reads as a real result.
 */
export function bmiBands(value: number | null): BmiBand[] {
  if (value === null || !isFinite(value) || value <= 0) {
    return [
      { label: "Underweight", range: "Below 18.5", active: false },
      { label: "Healthy weight", range: "18.5 – 24.9", active: false },
      { label: "Overweight", range: "25.0 – 29.9", active: false },
      { label: "Obesity", range: "30.0 and above", active: false },
    ];
  }
  return [
    { label: "Underweight", range: "Below 18.5", active: value < 18.5 },
    {
      label: "Healthy weight",
      range: "18.5 – 24.9",
      active: value >= 18.5 && value < 25,
    },
    {
      label: "Overweight",
      range: "25.0 – 29.9",
      active: value >= 25 && value < 30,
    },
    { label: "Obesity", range: "30.0 and above", active: value >= 30 },
  ];
}

export function bmiCategory(value: number): string {
  return bmiBands(value).find((b) => b.active)?.label ?? "—";
}

/* ══ BODY FAT — US Navy circumference method ═══════════════════════ */

/**
 * All circumferences and height in INCHES, per the published formula.
 * Returns null when inputs are impossible (log of a non-positive number),
 * which happens with mistyped or mismatched measurements.
 */
export function navyBodyFat(args: {
  sex: Sex;
  heightIn: number;
  neckIn: number;
  waistIn: number;
  hipIn?: number;
}): number | null {
  const { sex, heightIn, neckIn, waistIn, hipIn } = args;
  if (heightIn <= 0 || neckIn <= 0 || waistIn <= 0) return null;

  if (sex === "male") {
    const inner = waistIn - neckIn;
    if (inner <= 0) return null;
    const bf =
      86.01 * Math.log10(inner) - 70.041 * Math.log10(heightIn) + 36.76;
    return bf > 0 && bf < 75 ? bf : null;
  }

  if (!hipIn || hipIn <= 0) return null;
  const inner = waistIn + hipIn - neckIn;
  if (inner <= 0) return null;
  const bf =
    163.205 * Math.log10(inner) - 97.684 * Math.log10(heightIn) - 78.387;
  return bf > 0 && bf < 75 ? bf : null;
}

/**
 * ACE descriptive ranges. Deliberately NOT framed as good/bad — they describe
 * populations, and "essential fat" is a floor rather than an aspiration.
 */
export function bodyFatBands(sex: Sex): { label: string; range: string; lo: number; hi: number }[] {
  return sex === "male"
    ? [
        { label: "Essential fat", range: "2–5%", lo: 0, hi: 5 },
        { label: "Athletic", range: "6–13%", lo: 5, hi: 13 },
        { label: "Fitness", range: "14–17%", lo: 13, hi: 17 },
        { label: "Average", range: "18–24%", lo: 17, hi: 24 },
        { label: "Above average", range: "25%+", lo: 24, hi: 100 },
      ]
    : [
        { label: "Essential fat", range: "10–13%", lo: 0, hi: 13 },
        { label: "Athletic", range: "14–20%", lo: 13, hi: 20 },
        { label: "Fitness", range: "21–24%", lo: 20, hi: 24 },
        { label: "Average", range: "25–31%", lo: 24, hi: 31 },
        { label: "Above average", range: "32%+", lo: 31, hi: 100 },
      ];
}

export function leanMass(kg: number, bodyFatPct: number) {
  const fat = kg * (bodyFatPct / 100);
  return { leanKg: kg - fat, fatKg: fat };
}

/* ══ ONE-REP MAX ═══════════════════════════════════════════════════ */

export const ORM_FORMULAS = [
  {
    key: "epley",
    name: "Epley",
    expr: "w × (1 + r/30)",
    fn: (w: number, r: number) => w * (1 + r / 30),
  },
  {
    key: "brzycki",
    name: "Brzycki",
    expr: "w × 36 / (37 − r)",
    fn: (w: number, r: number) => (r >= 37 ? NaN : (w * 36) / (37 - r)),
  },
  {
    key: "lombardi",
    name: "Lombardi",
    expr: "w × r^0.10",
    fn: (w: number, r: number) => w * Math.pow(r, 0.1),
  },
  {
    key: "oconner",
    name: "O'Conner",
    expr: "w × (1 + 0.025r)",
    fn: (w: number, r: number) => w * (1 + 0.025 * r),
  },
] as const;

/** Percentage-of-1RM table used for programming loads. */
export const ORM_PERCENTAGES = [
  { pct: 100, reps: "1" },
  { pct: 95, reps: "2" },
  { pct: 93, reps: "3" },
  { pct: 90, reps: "4" },
  { pct: 87, reps: "5" },
  { pct: 85, reps: "6" },
  { pct: 83, reps: "7" },
  { pct: 80, reps: "8" },
  { pct: 77, reps: "9" },
  { pct: 75, reps: "10" },
  { pct: 70, reps: "12" },
  { pct: 65, reps: "15" },
];

/* ══ BMR / TDEE — Mifflin-St Jeor ══════════════════════════════════ */

export function mifflinBmr(args: {
  sex: Sex;
  kg: number;
  cm: number;
  age: number;
}): number {
  const { sex, kg, cm, age } = args;
  const base = 10 * kg + 6.25 * cm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export const ACTIVITY_LEVELS = [
  {
    key: "sedentary",
    label: "Sedentary",
    detail: "Desk job, little deliberate exercise",
    factor: 1.2,
  },
  {
    key: "light",
    label: "Lightly active",
    detail: "Light training 1–2 days a week",
    factor: 1.375,
  },
  {
    key: "moderate",
    label: "Moderately active",
    detail: "Training 3–5 days a week",
    factor: 1.55,
  },
  {
    key: "active",
    label: "Active",
    detail: "Hard training 6–7 days a week",
    factor: 1.725,
  },
  {
    key: "veryActive",
    label: "Very active",
    detail: "Physical job plus daily training",
    factor: 1.9,
  },
] as const;

/* ══ MACRO SPLIT ═══════════════════════════════════════════════════ */

export const MACRO_SPLITS = [
  { key: "balanced", label: "Balanced", p: 30, c: 40, f: 30 },
  { key: "highProtein", label: "Higher protein", p: 40, c: 35, f: 25 },
  { key: "lowerCarb", label: "Lower carb", p: 35, c: 25, f: 40 },
  { key: "endurance", label: "Endurance", p: 25, c: 55, f: 20 },
] as const;

/** kcal per gram — protein 4, carbs 4, fat 9. */
export function macroGrams(kcal: number, p: number, c: number, f: number) {
  return {
    protein: (kcal * (p / 100)) / 4,
    carbs: (kcal * (c / 100)) / 4,
    fat: (kcal * (f / 100)) / 9,
  };
}

/* ══ HEART RATE — Karvonen ═════════════════════════════════════════ */

export function hrMax(age: number): number {
  return 220 - age;
}

/** Karvonen: HRrest + intensity × (HRmax − HRrest) */
export function karvonen(
  restingHr: number,
  max: number,
  intensity: number,
): number {
  return restingHr + intensity * (max - restingHr);
}

export const HR_ZONES = [
  {
    zone: "Zone 1",
    name: "Recovery",
    lo: 0.5,
    hi: 0.6,
    use: "Warm-ups, cool-downs, easy movement between hard days",
  },
  {
    zone: "Zone 2",
    name: "Aerobic base",
    lo: 0.6,
    hi: 0.7,
    use: "Conversational pace. The bulk of useful cardio volume",
  },
  {
    zone: "Zone 3",
    name: "Tempo",
    lo: 0.7,
    hi: 0.8,
    use: "Comfortably hard. Talking becomes short sentences",
  },
  {
    zone: "Zone 4",
    name: "Threshold",
    lo: 0.8,
    hi: 0.9,
    use: "Hard intervals. Sustainable for minutes, not hours",
  },
  {
    zone: "Zone 5",
    name: "Maximal",
    lo: 0.9,
    hi: 1.0,
    use: "Short sprints only. Full recovery between efforts",
  },
];

/* ══ PLATE LOADER ══════════════════════════════════════════════════ */

export const PLATE_SETS = {
  kg: [25, 20, 15, 10, 5, 2.5, 1.25],
  lb: [45, 35, 25, 10, 5, 2.5],
};

export interface PlateResult {
  /** plates for ONE side, heaviest first */
  perSide: number[];
  /** weight that could not be made with the available plates */
  leftover: number;
  achievable: number;
}

export function loadPlates(
  target: number,
  bar: number,
  unit: "kg" | "lb",
): PlateResult | null {
  if (target < bar) return null;
  const plates = PLATE_SETS[unit];
  let perSideWeight = (target - bar) / 2;
  const perSide: number[] = [];

  for (const p of plates) {
    // pairs only — a barbell must stay balanced
    while (perSideWeight >= p - 1e-9) {
      perSide.push(p);
      perSideWeight -= p;
    }
  }

  const loaded = perSide.reduce((a, b) => a + b, 0);
  return {
    perSide,
    leftover: Math.round(perSideWeight * 2 * 100) / 100,
    achievable: bar + loaded * 2,
  };
}

/* ══ CONVERSIONS ═══════════════════════════════════════════════════ */

export function kgToLb(kg: number) {
  return kg * LB_PER_KG;
}
export function lbToKg(lb: number) {
  return lb / LB_PER_KG;
}
export function cmToIn(cm: number) {
  return cm / CM_PER_IN;
}
export function inToCm(inches: number) {
  return inches * CM_PER_IN;
}
/** Height helper: total inches → feet + inches */
export function inchesToFtIn(total: number) {
  const ft = Math.floor(total / 12);
  return { ft, inches: Math.round((total - ft * 12) * 10) / 10 };
}
