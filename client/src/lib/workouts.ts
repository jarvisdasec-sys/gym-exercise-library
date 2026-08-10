/**
 * BTB Workout Programming — session templates built from the 54 plates.
 *
 * STYLE REMINDER (ideas.md — "Blueprint Wall"):
 *  - Coach-direct, imperative copy. No hype, no filler sentences.
 *  - Every entry references a real exercise slug from lib/exercises.ts so the
 *    session always deep-links to a blueprint that exists.
 *
 * PROGRAMMING RULES APPLIED
 *  - Compound movements first while the nervous system is fresh, isolation last.
 *  - Heavy compounds: lower reps (5-8), longer rest (2-3 min).
 *  - Isolation work: higher reps (10-15), shorter rest (45-75 s).
 *  - 14-20 hard sets per session for the primary muscle groups — enough volume
 *    to drive adaptation without running past the point of useful fatigue.
 *  - Antagonist pairings (chest/triceps, back/biceps) so the small muscle is
 *    pre-fatigued by the compounds it already assisted, then finished directly.
 *  - Every session carries at least one horizontal and one vertical vector
 *    where the muscle group allows it.
 */

import { EXERCISES } from "@/lib/exercises";

export type SplitTag =
  | "Push"
  | "Pull"
  | "Shoulders"
  | "Legs"
  | "Arms"
  | "Full Body"
  | "Core";

export interface WorkoutBlockItem {
  /** must match a slug in EXERCISES */
  slug: string;
  sets: string;
  reps: string;
  rest: string;
  /** one short coaching cue — the thing most people get wrong */
  cue: string;
}

export interface WorkoutBlock {
  /** e.g. "Primary Compounds" */
  title: string;
  /** short instruction on how to run the block */
  note: string;
  items: WorkoutBlockItem[];
}

export interface Workout {
  slug: string;
  /** e.g. "Push Day" */
  name: string;
  /** e.g. "Chest · Triceps · Front Delts" */
  focus: string;
  tag: SplitTag;
  level: "Beginner" | "Intermediate" | "Advanced";
  /** estimated session length */
  duration: string;
  /** one-line coach summary */
  summary: string;
  /** what this session is actually for */
  intent: string;
  blocks: WorkoutBlock[];
  /** 2-4 execution rules specific to this day */
  rules: string[];
}

export const WORKOUTS: Workout[] = [
  /* ═══════════════════════════════════════════════════════════════════
     PUSH — chest, triceps, front delts
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "push-day",
    name: "Push Day",
    focus: "Chest · Triceps · Front Delts",
    tag: "Push",
    level: "Intermediate",
    duration: "60–70 min",
    summary: "Press heavy, then chase the stretch. Finish the triceps.",
    intent:
      "Every movement here pushes weight away from the torso, so the chest, triceps and front delts all work together instead of being trained on separate days. Load the flat press while you are fresh, hit the upper chest second, then move to cables and machines where you can push closer to failure without a spotter.",
    blocks: [
      {
        title: "Primary Compounds",
        note: "Heaviest work of the session. Full rest between sets — you are training strength here, not conditioning.",
        items: [
          {
            slug: "barbell-bench-press",
            sets: "4",
            reps: "6–8",
            rest: "2–3 min",
            cue: "Shoulder blades pinned back and down before you unrack.",
          },
          {
            slug: "incline-dumbbell-press",
            sets: "3",
            reps: "8–10",
            rest: "2 min",
            cue: "Bench at 30°. Higher than that and it becomes a shoulder press.",
          },
        ],
      },
      {
        title: "Secondary Press",
        note: "Machine work lets you push hard with a fixed path once fatigue sets in.",
        items: [
          {
            slug: "machine-chest-press",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Set the seat so the handles line up with mid-chest.",
          },
        ],
      },
      {
        title: "Chest Isolation",
        note: "Chase the stretch and the squeeze. Leave the ego weight alone.",
        items: [
          {
            slug: "cable-crossover",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Slight forward lean. Cross the hands past each other at the front.",
          },
        ],
      },
      {
        title: "Triceps Finish",
        note: "The triceps already assisted every press above, so they need less volume than you think.",
        items: [
          {
            slug: "skull-crushers",
            sets: "3",
            reps: "10–12",
            rest: "75 s",
            cue: "Elbows stay pointed at the ceiling. Only the forearms move.",
          },
          {
            slug: "tricep-cable-pushdown",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Pin the elbows to your ribs and lock out fully.",
          },
        ],
      },
    ],
    rules: [
      "Warm up with two light sets of the bench press before your first working set.",
      "If you cannot hit the bottom of the rep range with clean form, drop the weight.",
      "Stop pressing if you feel a pinch in the front of the shoulder — switch to machine or cable work.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     PULL — back, biceps, rear delts
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "pull-day",
    name: "Pull Day",
    focus: "Back · Biceps · Rear Delts",
    tag: "Pull",
    level: "Intermediate",
    duration: "60–70 min",
    summary: "Pull wide for width, pull thick for density. Curl last.",
    intent:
      "Width comes from vertical pulling, thickness comes from horizontal rowing, so this session runs both. The biceps flex on every rep of every row and pulldown, which is why direct curl work sits at the end rather than the start.",
    blocks: [
      {
        title: "Vertical Pull",
        note: "Start with the movement that builds width across the lats.",
        items: [
          {
            slug: "pull-ups",
            sets: "4",
            reps: "6–10",
            rest: "2–3 min",
            cue: "Drive the elbows down toward your ribs, not back behind you.",
          },
          {
            slug: "lat-pulldown",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Pull to the collarbone. Never behind the neck.",
          },
        ],
      },
      {
        title: "Horizontal Row",
        note: "This is where mid-back thickness is built. Keep the torso still.",
        items: [
          {
            slug: "barbell-bent-over-row",
            sets: "4",
            reps: "8–10",
            rest: "2 min",
            cue: "Hinge to roughly 45°, brace hard, and stop the torso from rising.",
          },
          {
            slug: "seated-cable-row",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Squeeze the shoulder blades together and hold for a beat.",
          },
        ],
      },
      {
        title: "Rear Delts",
        note: "The most neglected muscle on the body. Light weight, high reps.",
        items: [
          {
            slug: "cable-face-pulls",
            sets: "3",
            reps: "15–20",
            rest: "60 s",
            cue: "Pull to the forehead and rotate the knuckles toward the ceiling.",
          },
        ],
      },
      {
        title: "Biceps Finish",
        note: "Two angles: one with the elbows at the sides, one with a neutral grip.",
        items: [
          {
            slug: "barbell-bicep-curl",
            sets: "3",
            reps: "8–10",
            rest: "75 s",
            cue: "Elbows stay in front of nothing — no swinging at the hips.",
          },
          {
            slug: "dumbbell-hammer-curl",
            sets: "3",
            reps: "10–12",
            rest: "60 s",
            cue: "Thumbs up the whole way. This hits the brachialis.",
          },
        ],
      },
    ],
    rules: [
      "Initiate every pull by depressing the shoulder blades before the arms bend.",
      "If you cannot do six clean pull-ups, use the lat pulldown for both vertical slots.",
      "Keep the lower back neutral on rows — round it and the session ends early.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     SHOULDERS
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "shoulder-day",
    name: "Shoulder Day",
    focus: "Front · Side · Rear Delts · Traps",
    tag: "Shoulders",
    level: "Intermediate",
    duration: "50–60 min",
    summary: "Press overhead first. Then hit all three heads directly.",
    intent:
      "The shoulder has three separate heads and pressing alone only trains the front one hard. Open with an overhead press for strength, then give the side and rear delts dedicated volume — that is what actually builds width and makes the waist look smaller.",
    blocks: [
      {
        title: "Overhead Press",
        note: "Heavy, controlled, full range. Brace the core like you are about to be punched.",
        items: [
          {
            slug: "barbell-military-press",
            sets: "4",
            reps: "6–8",
            rest: "2–3 min",
            cue: "Squeeze the glutes to stop the lower back from arching.",
          },
          {
            slug: "arnold-press",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Rotate the palms from facing you to facing forward as you press.",
          },
        ],
      },
      {
        title: "Side Delts",
        note: "This is the head that builds width. High reps, strict form, no swinging.",
        items: [
          {
            slug: "dumbbell-lateral-raise",
            sets: "4",
            reps: "12–15",
            rest: "60 s",
            cue: "Lead with the elbows, stop at shoulder height.",
          },
        ],
      },
      {
        title: "Rear Delts",
        note: "Balances the front-heavy pressing and keeps the shoulders healthy.",
        items: [
          {
            slug: "reverse-pec-deck",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Keep a slight elbow bend and think about spreading the arms apart.",
          },
          {
            slug: "cable-face-pulls",
            sets: "3",
            reps: "15–20",
            rest: "60 s",
            cue: "External rotation at the end of every rep.",
          },
        ],
      },
      {
        title: "Traps",
        note: "Straight up, straight down. Rolling the shoulders does nothing.",
        items: [
          {
            slug: "dumbbell-shrugs",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Hold the top for one full second on every rep.",
          },
        ],
      },
    ],
    rules: [
      "Warm up the rotator cuff with light face pulls before pressing overhead.",
      "Side delt raises should feel light in the hands and hard in the shoulder — if not, lower the weight.",
      "Any sharp pain overhead means stop pressing and move to lateral and rear work only.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     LEGS & GLUTES
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "legs-and-glutes",
    name: "Legs & Glutes",
    focus: "Quads · Hamstrings · Glutes · Calves",
    tag: "Legs",
    level: "Advanced",
    duration: "70–80 min",
    summary: "Squat, hinge, then isolate. The hardest session of the week.",
    intent:
      "The lower body needs both a squat pattern for the quads and a hip hinge for the hamstrings and glutes — training only one leaves half the leg undeveloped. Direct glute work goes in the middle while you can still generate force, and calves close it out.",
    blocks: [
      {
        title: "Squat Pattern",
        note: "The most demanding movement of your week. Do not rush the rest periods.",
        items: [
          {
            slug: "barbell-back-squat",
            sets: "4",
            reps: "6–8",
            rest: "3 min",
            cue: "Knees track over the toes. Chest stays up out of the hole.",
          },
          {
            slug: "leg-press",
            sets: "3",
            reps: "10–12",
            rest: "2 min",
            cue: "Never let the lower back round off the pad at the bottom.",
          },
        ],
      },
      {
        title: "Hip Hinge",
        note: "Hamstrings and glutes. Push the hips back, do not bend at the waist.",
        items: [
          {
            slug: "romanian-deadlift",
            sets: "4",
            reps: "8–10",
            rest: "2 min",
            cue: "Soft knees, bar close to the legs, stop when the hamstrings run out.",
          },
        ],
      },
      {
        title: "Glute Focus",
        note: "Direct glute loading. Full lockout, hard squeeze at the top.",
        items: [
          {
            slug: "barbell-hip-thrust",
            sets: "4",
            reps: "10–12",
            rest: "90 s",
            cue: "Tuck the ribs down and finish with the hips level, not hyperextended.",
          },
          {
            slug: "bulgarian-split-squat",
            sets: "3",
            reps: "10–12 each leg",
            rest: "90 s",
            cue: "Front shin roughly vertical. Lean forward slightly for more glute.",
          },
        ],
      },
      {
        title: "Isolation & Calves",
        note: "Finish the quads and hamstrings, then hit the calves through a full stretch.",
        items: [
          {
            slug: "lying-leg-curl",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Control the way down — that is where the growth is.",
          },
          {
            slug: "standing-calf-raise",
            sets: "4",
            reps: "15–20",
            rest: "45 s",
            cue: "All the way down for the stretch, all the way up onto the toes.",
          },
        ],
      },
    ],
    rules: [
      "Warm up with bodyweight squats and light sets before loading the bar.",
      "Use safety pins or a rack when squatting heavy without a spotter.",
      "Depth beats weight. A partial squat with more plates builds less than a full one.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     ARMS
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "arm-day",
    name: "Arm Day",
    focus: "Biceps · Triceps",
    tag: "Arms",
    level: "Beginner",
    duration: "45–55 min",
    summary: "Alternate curls and extensions. Short rest, high quality reps.",
    intent:
      "Arms respond well to volume and frequency because the muscles are small and recover fast. Alternating a biceps set with a triceps set lets one recover while the other works, so the session stays dense without dropping quality.",
    blocks: [
      {
        title: "Heavy Pairing",
        note: "Alternate the two movements back to back with 60 seconds between.",
        items: [
          {
            slug: "ez-bar-bicep-curl",
            sets: "4",
            reps: "8–10",
            rest: "60 s",
            cue: "Elbows stay pinned at your sides. No hip drive.",
          },
          {
            slug: "skull-crushers",
            sets: "4",
            reps: "10–12",
            rest: "60 s",
            cue: "Lower behind the forehead, not to the nose.",
          },
        ],
      },
      {
        title: "Stretch Position",
        note: "Both of these load the muscle in its lengthened position, where most growth happens.",
        items: [
          {
            slug: "preacher-curl",
            sets: "3",
            reps: "10–12",
            rest: "60 s",
            cue: "Do not come all the way up — keep tension on the biceps.",
          },
          {
            slug: "overhead-cable-tricep-extension",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Upper arms stay locked beside the ears.",
          },
        ],
      },
      {
        title: "Peak & Pump",
        note: "Highest reps of the session. Chase the contraction, not the load.",
        items: [
          {
            slug: "dumbbell-hammer-curl",
            sets: "3",
            reps: "12–15",
            rest: "45 s",
            cue: "Neutral grip throughout. Squeeze at the top.",
          },
          {
            slug: "tricep-cable-pushdown",
            sets: "3",
            reps: "15–20",
            rest: "45 s",
            cue: "Full lockout, slow return, elbows glued to the ribs.",
          },
        ],
      },
    ],
    rules: [
      "If the weight forces you to swing, it is too heavy for arm work.",
      "Two seconds down on every rep. The lowering phase drives most of the growth.",
      "Run this on a day when you are not also pressing or rowing heavy.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     UPPER BODY
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "upper-body",
    name: "Upper Body",
    focus: "Chest · Back · Shoulders · Arms",
    tag: "Full Body",
    level: "Intermediate",
    duration: "60–70 min",
    summary: "One push, one pull, repeat. Everything above the waist in one hit.",
    intent:
      "Built for a four-day upper/lower split. Pushing and pulling movements alternate so opposing muscles recover while their counterpart works, which keeps the session moving and balances the shoulder joint front to back.",
    blocks: [
      {
        title: "Heavy Push / Pull",
        note: "Alternate these two. Rest two minutes after each pair.",
        items: [
          {
            slug: "barbell-bench-press",
            sets: "4",
            reps: "6–8",
            rest: "2 min",
            cue: "Feet planted, blades retracted, bar to mid-chest.",
          },
          {
            slug: "barbell-bent-over-row",
            sets: "4",
            reps: "8–10",
            rest: "2 min",
            cue: "Torso angle does not change between the first and last rep.",
          },
        ],
      },
      {
        title: "Secondary Push / Pull",
        note: "Different angles to cover what the barbell work missed.",
        items: [
          {
            slug: "incline-dumbbell-press",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "30° bench. Control the stretch at the bottom.",
          },
          {
            slug: "lat-pulldown",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Lead with the elbows, finish at the collarbone.",
          },
        ],
      },
      {
        title: "Delts",
        note: "Width work the presses do not cover.",
        items: [
          {
            slug: "dumbbell-lateral-raise",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Stop at shoulder height. No higher.",
          },
        ],
      },
      {
        title: "Arms",
        note: "One curl, one extension. That is all the arms need on an upper day.",
        items: [
          {
            slug: "cable-bicep-curl",
            sets: "3",
            reps: "10–12",
            rest: "60 s",
            cue: "Constant tension — cables never unload at the bottom.",
          },
          {
            slug: "tricep-cable-pushdown",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Elbows locked at your sides the entire set.",
          },
        ],
      },
    ],
    rules: [
      "Pair the push and pull movements to cut the session length without cutting volume.",
      "Match your pulling volume to your pressing volume. Most people press too much and pull too little.",
      "Run this twice a week alongside the Lower Body session.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     LOWER BODY
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "lower-body",
    name: "Lower Body",
    focus: "Quads · Hamstrings · Glutes · Core",
    tag: "Legs",
    level: "Intermediate",
    duration: "55–65 min",
    summary: "Machine-friendly leg work. Heavy where it counts, joint-friendly throughout.",
    intent:
      "The partner to the Upper Body session. Slightly less demanding than the full Legs & Glutes day so it can be run twice a week, and it leans on machines for the heavy loading, which makes it workable without a spotter.",
    blocks: [
      {
        title: "Squat Pattern",
        note: "Load the quads with a fixed path so you can push hard alone.",
        items: [
          {
            slug: "hack-squat",
            sets: "4",
            reps: "8–10",
            rest: "2 min",
            cue: "Keep the whole back flat against the pad.",
          },
          {
            slug: "dumbbell-lunges",
            sets: "3",
            reps: "10–12 each leg",
            rest: "90 s",
            cue: "Step long enough that the front knee stays over the ankle.",
          },
        ],
      },
      {
        title: "Hinge & Glutes",
        note: "The posterior chain. Hips move, spine does not.",
        items: [
          {
            slug: "romanian-deadlift",
            sets: "3",
            reps: "10–12",
            rest: "2 min",
            cue: "Feel it in the hamstrings, never in the lower back.",
          },
          {
            slug: "barbell-hip-thrust",
            sets: "3",
            reps: "12–15",
            rest: "90 s",
            cue: "Chin tucked, ribs down, glutes locked at the top.",
          },
        ],
      },
      {
        title: "Isolation",
        note: "Finish each muscle off with a machine.",
        items: [
          {
            slug: "leg-extension",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Pause for a second at full extension.",
          },
          {
            slug: "lying-leg-curl",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Hips stay down on the pad the whole set.",
          },
          {
            slug: "seated-calf-raise",
            sets: "4",
            reps: "15–20",
            rest: "45 s",
            cue: "Full stretch at the bottom. This one hits the soleus.",
          },
        ],
      },
      {
        title: "Core",
        note: "Two minutes of bracing to close the session.",
        items: [
          {
            slug: "plank",
            sets: "3",
            reps: "30–60 s hold",
            rest: "45 s",
            cue: "Straight line from head to heels. Squeeze the glutes.",
          },
        ],
      },
    ],
    rules: [
      "Warm up the hips and ankles before the first working set.",
      "Control the lowering phase on every machine — that is where the stimulus lives.",
      "Stop any hinge movement the moment the lower back rounds.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     FULL BODY — beginner entry point
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "full-body-starter",
    name: "Full Body Starter",
    focus: "Every major muscle group",
    tag: "Full Body",
    level: "Beginner",
    duration: "45–55 min",
    summary: "New to the floor? Start here. Three days a week, every muscle each time.",
    intent:
      "Built for someone in their first few months of training. Machines and dumbbells only, so there is no technical barrier and no spotter needed. Hitting every muscle group three times a week beats splitting the body up when you are still learning the movements.",
    blocks: [
      {
        title: "Lower Body",
        note: "Start with the legs while you have the most energy.",
        items: [
          {
            slug: "leg-press",
            sets: "3",
            reps: "10–12",
            rest: "2 min",
            cue: "Feet shoulder-width. Do not lock the knees out hard at the top.",
          },
          {
            slug: "lying-leg-curl",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Slow on the way back down.",
          },
        ],
      },
      {
        title: "Upper Push",
        note: "A fixed-path press is the safest way to learn to push.",
        items: [
          {
            slug: "machine-chest-press",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Handles level with mid-chest before you start.",
          },
        ],
      },
      {
        title: "Upper Pull",
        note: "Two pulling angles for a balanced back.",
        items: [
          {
            slug: "lat-pulldown",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Pull to the collarbone, elbows driving down.",
          },
          {
            slug: "seated-cable-row",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Sit tall. Do not rock back and forth.",
          },
        ],
      },
      {
        title: "Shoulders & Arms",
        note: "One set each. Enough to start, not enough to wreck recovery.",
        items: [
          {
            slug: "dumbbell-lateral-raise",
            sets: "2",
            reps: "12–15",
            rest: "60 s",
            cue: "Light dumbbells. Lead with the elbows.",
          },
          {
            slug: "dumbbell-hammer-curl",
            sets: "2",
            reps: "10–12",
            rest: "60 s",
            cue: "Thumbs up, elbows still.",
          },
          {
            slug: "tricep-cable-pushdown",
            sets: "2",
            reps: "12–15",
            rest: "60 s",
            cue: "Elbows against your ribs.",
          },
        ],
      },
      {
        title: "Core",
        note: "Learn to brace before you learn to crunch.",
        items: [
          {
            slug: "plank",
            sets: "3",
            reps: "20–45 s hold",
            rest: "45 s",
            cue: "Do not let the hips sag.",
          },
        ],
      },
    ],
    rules: [
      "Run this three times a week with a rest day between sessions.",
      "Add a small amount of weight only once you hit the top of the rep range with clean form.",
      "Learn the movement before you load it. Read the blueprint on every exercise first.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     CORE & ABS
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "core-and-abs",
    name: "Core & Abs",
    focus: "Abs · Obliques · Lower Back",
    tag: "Core",
    level: "Beginner",
    duration: "25–30 min",
    summary: "Brace, flex, rotate, extend. Bolt this onto any session.",
    intent:
      "A short standalone block that trains all four functions of the midsection rather than just crunching. Add it to the end of any training day or run it on its own between sessions.",
    blocks: [
      {
        title: "Anti-Extension",
        note: "Resisting the spine from arching. The foundation of a strong core.",
        items: [
          {
            slug: "plank",
            sets: "3",
            reps: "30–60 s hold",
            rest: "45 s",
            cue: "Squeeze the glutes and tuck the ribs down.",
          },
          {
            slug: "ab-wheel-rollout",
            sets: "3",
            reps: "8–12",
            rest: "60 s",
            cue: "Only roll out as far as you can go without the hips dropping.",
          },
        ],
      },
      {
        title: "Flexion",
        note: "Direct abdominal work under load.",
        items: [
          {
            slug: "kneeling-cable-crunch",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Curl the ribs toward the hips. The hips do not move.",
          },
          {
            slug: "hanging-leg-raise",
            sets: "3",
            reps: "10–15",
            rest: "60 s",
            cue: "Roll the pelvis up. Do not just swing the legs.",
          },
        ],
      },
      {
        title: "Rotation & Extension",
        note: "Finish with the obliques and the lower back.",
        items: [
          {
            slug: "russian-twist",
            sets: "3",
            reps: "15–20 each side",
            rest: "45 s",
            cue: "Rotate from the ribs, not the arms.",
          },
          {
            slug: "back-hyperextensions",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Stop at a straight line. Do not arch past it.",
          },
        ],
      },
    ],
    rules: [
      "Breathe out hard at the hardest point of every rep.",
      "Quality over reps — a shaking plank at 30 seconds beats a sagging one at 90.",
      "Train the core two to three times a week, not every day.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     DUMBBELL ONLY — busy floor / free weight area only
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "dumbbell-only",
    name: "Dumbbell Only",
    focus: "Full Body · Free Weights",
    tag: "Full Body",
    level: "Intermediate",
    duration: "50–60 min",
    summary: "Every machine taken? One pair of dumbbells and a bench is enough.",
    intent:
      "Built for a packed gym floor or a free-weight-only corner. Nothing here needs a machine, a cable stack or a spotter — just dumbbells and an adjustable bench. Unilateral work throughout also exposes and fixes left-to-right strength differences.",
    blocks: [
      {
        title: "Push",
        note: "Two angles of pressing plus a stretch movement.",
        items: [
          {
            slug: "incline-dumbbell-press",
            sets: "4",
            reps: "8–10",
            rest: "2 min",
            cue: "Bench at 30°. Dumbbells travel in an arc, not straight up.",
          },
          {
            slug: "dumbbell-chest-flyes",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Slight elbow bend held constant. Stop at chest level.",
          },
        ],
      },
      {
        title: "Pull",
        note: "One arm at a time so you can brace against the bench and row heavy.",
        items: [
          {
            slug: "single-arm-dumbbell-row",
            sets: "4",
            reps: "10–12 each side",
            rest: "90 s",
            cue: "Pull the elbow past the ribs. Do not twist the torso.",
          },
        ],
      },
      {
        title: "Shoulders",
        note: "Press, then raise. Front and side heads covered.",
        items: [
          {
            slug: "dumbbell-overhead-press",
            sets: "3",
            reps: "8–10",
            rest: "90 s",
            cue: "Back flat against the bench, core braced.",
          },
          {
            slug: "dumbbell-lateral-raise",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Lead with the elbows, stop at shoulder height.",
          },
          {
            slug: "dumbbell-front-raise",
            sets: "2",
            reps: "12–15",
            rest: "60 s",
            cue: "Raise to eye level. No momentum from the hips.",
          },
        ],
      },
      {
        title: "Legs",
        note: "Loaded squat pattern plus a unilateral movement.",
        items: [
          {
            slug: "goblet-squat",
            sets: "3",
            reps: "12–15",
            rest: "90 s",
            cue: "Elbows inside the knees at the bottom. Chest tall.",
          },
          {
            slug: "bulgarian-split-squat",
            sets: "3",
            reps: "10–12 each leg",
            rest: "90 s",
            cue: "Most of the weight stays on the front leg.",
          },
        ],
      },
      {
        title: "Arms",
        note: "One curl, one extension. Strict form, no swinging.",
        items: [
          {
            slug: "concentration-curl",
            sets: "3",
            reps: "10–12 each arm",
            rest: "45 s",
            cue: "Elbow braced against the inner thigh the whole set.",
          },
          {
            slug: "overhead-tricep-extension",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Upper arms stay vertical beside the ears.",
          },
        ],
      },
    ],
    rules: [
      "Set the bench up once and work through the pressing block before moving it.",
      "Match the reps on your weaker side first, then repeat that number on the strong side.",
      "If the dumbbells you need are taken, drop the weight and add reps rather than skipping the movement.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MACHINE CIRCUIT — beginner / joint-friendly
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "machine-circuit",
    name: "Machine Circuit",
    focus: "Full Body · Fixed Path",
    tag: "Full Body",
    level: "Beginner",
    duration: "40–50 min",
    summary: "Fixed paths, no spotter, no technique barrier. Walk the floor in order.",
    intent:
      "Every movement here runs on a machine or cable stack, which means the path is guided and you can train close to failure safely on your own. Ideal for a first month on the floor, a return from a layoff, or anyone who wants to train hard without loading a barbell.",
    blocks: [
      {
        title: "Chest",
        note: "Press first, then squeeze.",
        items: [
          {
            slug: "machine-chest-press",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Seat height so the handles sit level with mid-chest.",
          },
          {
            slug: "pec-deck",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Pads meet in front of the chest. Hold for a beat.",
          },
        ],
      },
      {
        title: "Back",
        note: "One vertical, one horizontal, one isolation.",
        items: [
          {
            slug: "lat-pulldown",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Elbows drive down toward the ribs.",
          },
          {
            slug: "seated-cable-row",
            sets: "3",
            reps: "10–12",
            rest: "90 s",
            cue: "Sit tall, squeeze the blades together.",
          },
          {
            slug: "straight-arm-pulldown",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Arms stay straight. Only the shoulders move.",
          },
        ],
      },
      {
        title: "Legs",
        note: "Push, extend, curl.",
        items: [
          {
            slug: "leg-press",
            sets: "3",
            reps: "12–15",
            rest: "2 min",
            cue: "Lower back stays flat on the pad throughout.",
          },
          {
            slug: "leg-extension",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Pause at the top of every rep.",
          },
          {
            slug: "lying-leg-curl",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Slow and controlled on the way down.",
          },
        ],
      },
      {
        title: "Shoulders & Arms",
        note: "Cables give constant tension with zero balance demand.",
        items: [
          {
            slug: "reverse-pec-deck",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Slight elbow bend, spread the arms apart.",
          },
          {
            slug: "cable-bicep-curl",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Elbows pinned at your sides.",
          },
          {
            slug: "tricep-cable-pushdown",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Full lockout, controlled return.",
          },
        ],
      },
    ],
    rules: [
      "Write down your seat and pad settings on the first session so setup is instant next time.",
      "Take every set to within two reps of failure — the fixed path makes this safe to do alone.",
      "Read the blueprint before your first attempt on any machine you have not used.",
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     BODYWEIGHT & BARBELL — advanced push/pull strength
     ═══════════════════════════════════════════════════════════════════ */
  {
    slug: "strength-push-pull",
    name: "Strength Push / Pull",
    focus: "Chest · Back · Triceps · Traps",
    tag: "Push",
    level: "Advanced",
    duration: "65–75 min",
    summary: "Barbells and bodyweight. Heavy loads, low reps, long rest.",
    intent:
      "A strength-biased upper body day for lifters who already own the basics. Reps stay low, rest stays long, and dips carry your bodyweight plus load. Run this in place of a standard Push or Pull day when the goal is moving heavier weight rather than chasing a pump.",
    blocks: [
      {
        title: "Heavy Press",
        note: "Two barbell angles. This is the strength work — rest fully.",
        items: [
          {
            slug: "barbell-bench-press",
            sets: "5",
            reps: "5",
            rest: "3 min",
            cue: "Same bar path every rep. Blades locked, feet driving.",
          },
          {
            slug: "decline-bench-press",
            sets: "3",
            reps: "6–8",
            rest: "2 min",
            cue: "Bar to the lower chest. Use a spotter for the unrack.",
          },
        ],
      },
      {
        title: "Heavy Row",
        note: "Thickness through the mid-back with a supported torso.",
        items: [
          {
            slug: "t-bar-row",
            sets: "4",
            reps: "8–10",
            rest: "2 min",
            cue: "Chest against the pad if the machine has one. No jerking.",
          },
        ],
      },
      {
        title: "Loaded Bodyweight",
        note: "Add a belt once bodyweight reps get easy.",
        items: [
          {
            slug: "chest-dips",
            sets: "4",
            reps: "8–12",
            rest: "2 min",
            cue: "Lean the torso forward to bias the chest. Do not go past a comfortable depth.",
          },
        ],
      },
      {
        title: "Traps & Triceps",
        note: "Close out with a vertical pull and two triceps angles.",
        items: [
          {
            slug: "barbell-upright-row",
            sets: "3",
            reps: "10–12",
            rest: "75 s",
            cue: "Pull to the lower chest only. Stop if the shoulders pinch.",
          },
          {
            slug: "bench-dips",
            sets: "3",
            reps: "12–15",
            rest: "60 s",
            cue: "Keep the hips close to the bench and the elbows tracking back.",
          },
          {
            slug: "dumbbell-tricep-kickback",
            sets: "3",
            reps: "12–15",
            rest: "45 s",
            cue: "Upper arm parallel to the floor and completely still.",
          },
        ],
      },
    ],
    rules: [
      "Only run this if you already press and row with confident technique.",
      "Use a spotter or safety pins on every heavy bench set.",
      "Skip the upright row entirely if it causes any shoulder pinching — it is optional.",
    ],
  },
];

/* ── derived helpers ─────────────────────────────────────────────── */

/** Total working sets in a session — used for the session readout. */
export function totalSets(workout: Workout): number {
  return workout.blocks.reduce(
    (sum, b) =>
      sum + b.items.reduce((s, i) => s + (parseInt(i.sets, 10) || 0), 0),
    0,
  );
}

/** Total distinct exercises in a session. */
export function totalExercises(workout: Workout): number {
  return workout.blocks.reduce((sum, b) => sum + b.items.length, 0);
}

export function getWorkout(slug: string): Workout | null {
  return WORKOUTS.find((w) => w.slug === slug) ?? null;
}

/**
 * Dev-time integrity guard: every programmed slug must exist in EXERCISES,
 * otherwise a session would deep-link to a blueprint that is not there.
 */
export function orphanedSlugs(): string[] {
  const known = new Set(EXERCISES.map((e) => e.slug));
  const missing: string[] = [];
  for (const w of WORKOUTS) {
    for (const b of w.blocks) {
      for (const i of b.items) {
        if (!known.has(i.slug)) missing.push(`${w.slug} → ${i.slug}`);
      }
    }
  }
  return missing;
}
