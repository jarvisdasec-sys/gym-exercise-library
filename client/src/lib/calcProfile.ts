/**
 * Calculator inputs, remembered on the member's own device.
 *
 * Follows the same contract as tracker.ts / cardioLog.ts / corrections.ts:
 * localStorage only, never transmitted, and every read is defensive because
 * private-browsing modes and storage-blocked browsers throw on access.
 *
 * ONE DELIBERATE LINK: bodyweight already lives in `btb.cardio.weight.v1`
 * because the MET formula needs it. Rather than keep a second, silently
 * diverging copy, saving here also updates that store — a member who enters
 * 82 kg on the calculators page should not then be asked for their weight
 * again on the cardio page. Height, age and sex are calculator-only.
 */
import { loadWeightKg, saveWeightKg } from "./cardioLog";

export interface CalcProfile {
  /** "male" | "female" — selects the formula variant, not an identity claim */
  sex: string;
  age: string;
  /** true = lb/ft, false = kg/cm */
  imperial: boolean;
  /** entered in whichever unit was active */
  weight: string;
  heightFt: string;
  heightIn: string;
  heightCm: string;
  /** circumference measurements for the body fat estimate */
  neck: string;
  waist: string;
  hip: string;
  /** resting heart rate for the Karvonen zones */
  restingHr: string;
  /** activity level key for TDEE */
  activity: string;
  /** last used bar weight in the plate loader */
  barWeight: string;
}

const KEY = "btb.calc.profile.v1";

export const EMPTY_PROFILE: CalcProfile = {
  sex: "male",
  age: "",
  imperial: true,
  weight: "",
  heightFt: "",
  heightIn: "",
  heightCm: "",
  neck: "",
  waist: "",
  hip: "",
  restingHr: "",
  activity: "moderate",
  barWeight: "45",
};

export function loadCalcProfile(): CalcProfile {
  if (typeof window === "undefined") return EMPTY_PROFILE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return withSharedWeight(EMPTY_PROFILE);
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return EMPTY_PROFILE;
    // merge over defaults so a stored profile from an older shape still loads
    return withSharedWeight({ ...EMPTY_PROFILE, ...parsed });
  } catch {
    return EMPTY_PROFILE;
  }
}

/**
 * If the member set a bodyweight on the cardio page but has never used the
 * calculators, seed the weight field from it so they do not retype it.
 */
function withSharedWeight(p: CalcProfile): CalcProfile {
  if (p.weight) return p;
  const kg = loadWeightKg();
  if (!kg) return p;
  return {
    ...p,
    weight: p.imperial ? (kg * 2.20462).toFixed(1) : String(kg),
  };
}

export function saveCalcProfile(p: CalcProfile): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
    // keep the cardio bodyweight in step — see note at top of file
    const w = Number(p.weight);
    if (w > 0) saveWeightKg(p.imperial ? w / 2.20462 : w);
  } catch {
    /* storage blocked — the page still works, it just will not persist */
  }
}

export function clearCalcProfile(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}

/** True when the member has actually entered something worth remembering. */
export function profileHasData(p: CalcProfile): boolean {
  return Boolean(
    p.age ||
      p.weight ||
      p.heightFt ||
      p.heightIn ||
      p.heightCm ||
      p.neck ||
      p.waist ||
      p.hip ||
      p.restingHr,
  );
}
