/**
 * BTB Gym Exercise Library — data module
 *
 * STYLE REMINDER (see ideas.md — "Blueprint Wall"):
 *  - Ground truth is the 54 infographics: near-black bg, acid lime #a6ff00 accent.
 *  - Poster tiles keep native 4:5 aspect ratio. Never crop a plate square.
 *  - Category order below drives both the left rail and the wall section order.
 */

export type CategoryId =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Exercise {
  /** stable slug, used for lightbox deep-links */
  slug: string;
  name: string;
  category: CategoryId;
  equipment: string;
  difficulty: Difficulty;
  /** primary muscle emphasis, short form */
  primary: string;
  /** Public path for the full-resolution infographic */
  image: string;
  /** Optional local or hosted motion demonstration (MP4, WebM, or GIF). */
  video?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  /** short coach-voice line used in the section header */
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { id: "chest", label: "Chest", blurb: "Press, fly, dip. Build the shelf." },
  { id: "back", label: "Back", blurb: "Pull wide, pull thick, pull often." },
  { id: "legs", label: "Legs", blurb: "Squat, hinge, extend, drive." },
  { id: "shoulders", label: "Shoulders", blurb: "Press overhead. Own every angle." },
  { id: "arms", label: "Arms", blurb: "Curl and extend with intent." },
  { id: "core", label: "Core", blurb: "Brace hard. Resist, then rotate." },
];

export const EXERCISES: Exercise[] = [
  // ── CHEST ──────────────────────────────────────────────────────────────
  {
    slug: "barbell-bench-press",
    name: "Barbell Bench Press",
    category: "chest",
    equipment: "Barbell + Flat Bench",
    difficulty: "Intermediate",
    primary: "Pectoralis Major",
    image: "/images/exercises/bench_press_guide.png",
  },
  {
    slug: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: "chest",
    equipment: "Dumbbells + Incline Bench",
    difficulty: "Intermediate",
    primary: "Upper Pectoralis",
    image: "/images/exercises/incline_db_press.png",
  },
  {
    slug: "decline-bench-press",
    name: "Decline Bench Press",
    category: "chest",
    equipment: "Barbell + Decline Bench",
    difficulty: "Intermediate",
    primary: "Lower Pectoralis",
    image: "/images/exercises/decline_bench_press.png",
  },
  {
    slug: "machine-chest-press",
    name: "Machine Chest Press",
    category: "chest",
    equipment: "Chest Press Machine",
    difficulty: "Beginner",
    primary: "Pectoralis Major",
    image: "/images/exercises/machine_chest_press.png",
  },
  {
    slug: "cable-crossover",
    name: "Cable Crossover",
    category: "chest",
    equipment: "Cable Machine",
    difficulty: "Intermediate",
    primary: "Inner Pectoralis",
    image: "/images/exercises/cable_crossover.png",
  },
  {
    slug: "pec-deck",
    name: "Pec Deck Machine",
    category: "chest",
    equipment: "Pec Deck",
    difficulty: "Beginner",
    primary: "Pectoralis Major",
    image: "/images/exercises/pec_deck.png",
  },
  {
    slug: "dumbbell-chest-flyes",
    name: "Dumbbell Chest Flyes",
    category: "chest",
    equipment: "Dumbbells + Flat Bench",
    difficulty: "Intermediate",
    primary: "Pectoralis Major",
    image: "/images/exercises/db_flyes.png",
  },
  {
    slug: "chest-dips",
    name: "Chest Dips",
    category: "chest",
    equipment: "Dip Bars",
    difficulty: "Advanced",
    primary: "Lower Pectoralis",
    image: "/images/exercises/chest_dips.png",
  },

  // ── BACK ───────────────────────────────────────────────────────────────
  {
    slug: "lat-pulldown",
    name: "Lat Pulldown",
    category: "back",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    primary: "Latissimus Dorsi",
    image: "/images/exercises/lat_pulldown_guide.png",
  },
  {
    slug: "seated-cable-row",
    name: "Seated Cable Row",
    category: "back",
    equipment: "Cable Row Machine",
    difficulty: "Beginner",
    primary: "Lats + Rhomboids",
    image: "/images/exercises/seated_cable_row.png",
  },
  {
    slug: "barbell-bent-over-row",
    name: "Barbell Bent-Over Row",
    category: "back",
    equipment: "Barbell",
    difficulty: "Advanced",
    primary: "Lats + Mid Back",
    image: "/images/exercises/barbell_row.png",
  },
  {
    slug: "t-bar-row",
    name: "T-Bar Row",
    category: "back",
    equipment: "T-Bar / Landmine",
    difficulty: "Intermediate",
    primary: "Lats + Rhomboids",
    image: "/images/exercises/t_bar_row.png",
  },
  {
    slug: "single-arm-dumbbell-row",
    name: "Single-Arm Dumbbell Row",
    category: "back",
    equipment: "Dumbbell + Bench",
    difficulty: "Beginner",
    primary: "Latissimus Dorsi",
    image: "/images/exercises/db_row.png",
  },
  {
    slug: "pull-ups",
    name: "Pull-Ups",
    category: "back",
    equipment: "Pull-Up Bar",
    difficulty: "Advanced",
    primary: "Latissimus Dorsi",
    image: "/images/exercises/pull_ups.png",
  },
  {
    slug: "straight-arm-pulldown",
    name: "Straight-Arm Pulldown",
    category: "back",
    equipment: "Cable Machine",
    difficulty: "Intermediate",
    primary: "Latissimus Dorsi",
    image: "/images/exercises/straight_arm_pulldown.png",
  },
  {
    slug: "back-hyperextensions",
    name: "Back Hyperextensions",
    category: "back",
    equipment: "Roman Chair",
    difficulty: "Beginner",
    primary: "Erector Spinae",
    image: "/images/exercises/hyperextensions.png",
  },

  // ── LEGS ───────────────────────────────────────────────────────────────
  {
    slug: "barbell-back-squat",
    name: "Barbell Back Squat",
    category: "legs",
    equipment: "Barbell + Rack",
    difficulty: "Advanced",
    primary: "Quads + Glutes",
    image: "/images/exercises/squat_guide.png",
  },
  {
    slug: "leg-press",
    name: "Leg Press",
    category: "legs",
    equipment: "Leg Press Machine",
    difficulty: "Beginner",
    primary: "Quadriceps",
    image: "/images/exercises/leg_press.png",
  },
  {
    slug: "hack-squat",
    name: "Hack Squat",
    category: "legs",
    equipment: "Hack Squat Machine",
    difficulty: "Intermediate",
    primary: "Quadriceps",
    image: "/images/exercises/hack_squat.png",
  },
  {
    slug: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    primary: "Hamstrings + Glutes",
    image: "/images/exercises/rdl.png",
  },
  {
    slug: "leg-extension",
    name: "Leg Extension",
    category: "legs",
    equipment: "Leg Extension Machine",
    difficulty: "Beginner",
    primary: "Quadriceps",
    image: "/images/exercises/leg_extension.png",
  },
  {
    slug: "lying-leg-curl",
    name: "Lying Leg Curl",
    category: "legs",
    equipment: "Leg Curl Machine",
    difficulty: "Beginner",
    primary: "Hamstrings",
    image: "/images/exercises/leg_curl.png",
  },
  {
    slug: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    category: "legs",
    equipment: "Dumbbells + Bench",
    difficulty: "Advanced",
    primary: "Quads + Glutes",
    image: "/images/exercises/bulgarian_split_squat.png",
  },
  {
    slug: "dumbbell-lunges",
    name: "Dumbbell Lunges",
    category: "legs",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primary: "Quads + Glutes",
    image: "/images/exercises/db_lunges.png",
  },
  {
    slug: "goblet-squat",
    name: "Goblet Squat",
    category: "legs",
    equipment: "Dumbbell / Kettlebell",
    difficulty: "Beginner",
    primary: "Quads + Glutes",
    image: "/images/exercises/goblet_squat.png",
  },
  {
    slug: "barbell-hip-thrust",
    name: "Barbell Hip Thrust",
    category: "legs",
    equipment: "Barbell + Bench",
    difficulty: "Intermediate",
    primary: "Gluteus Maximus",
    image: "/images/exercises/hip_thrust.png",
  },
  {
    slug: "standing-calf-raise",
    name: "Standing Calf Raise",
    category: "legs",
    equipment: "Calf Raise Machine",
    difficulty: "Beginner",
    primary: "Gastrocnemius",
    image: "/images/exercises/calf_raise.png",
  },
  {
    slug: "seated-calf-raise",
    name: "Seated Calf Raise",
    category: "legs",
    equipment: "Seated Calf Machine",
    difficulty: "Beginner",
    primary: "Soleus",
    image: "/images/exercises/seated_calf_raise.png",
  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────
  {
    slug: "dumbbell-overhead-press",
    name: "Dumbbell Overhead Press",
    category: "shoulders",
    equipment: "Dumbbells + Bench",
    difficulty: "Intermediate",
    primary: "Front + Side Delts",
    image: "/images/exercises/overhead_press.png",
  },
  {
    slug: "barbell-military-press",
    name: "Barbell Military Press",
    category: "shoulders",
    equipment: "Barbell",
    difficulty: "Advanced",
    primary: "Front + Side Delts",
    image: "/images/exercises/military_press.png",
  },
  {
    slug: "arnold-press",
    name: "Arnold Press",
    category: "shoulders",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    primary: "All Three Delts",
    image: "/images/exercises/arnold_press.png",
  },
  {
    slug: "dumbbell-lateral-raise",
    name: "Dumbbell Lateral Raise",
    category: "shoulders",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primary: "Lateral Deltoids",
    image: "/images/exercises/lateral_raise.png",
  },
  {
    slug: "dumbbell-front-raise",
    name: "Dumbbell Front Raise",
    category: "shoulders",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primary: "Anterior Deltoids",
    image: "/images/exercises/front_raise.png",
  },
  {
    slug: "reverse-pec-deck",
    name: "Reverse Pec Deck",
    category: "shoulders",
    equipment: "Pec Deck Machine",
    difficulty: "Beginner",
    primary: "Rear Deltoids",
    image: "/images/exercises/rear_delt_fly.png",
  },
  {
    slug: "cable-face-pulls",
    name: "Cable Face Pulls",
    category: "shoulders",
    equipment: "Cable + Rope",
    difficulty: "Beginner",
    primary: "Rear Delts + Traps",
    image: "/images/exercises/face_pulls.png",
  },
  {
    slug: "barbell-upright-row",
    name: "Barbell Upright Row",
    category: "shoulders",
    equipment: "Barbell",
    difficulty: "Intermediate",
    primary: "Side Delts + Traps",
    image: "/images/exercises/upright_row.png",
  },
  {
    slug: "dumbbell-shrugs",
    name: "Dumbbell Shrugs",
    category: "shoulders",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primary: "Upper Trapezius",
    image: "/images/exercises/db_shrugs.png",
  },

  // ── ARMS ───────────────────────────────────────────────────────────────
  {
    slug: "barbell-bicep-curl",
    name: "Barbell Bicep Curl",
    category: "arms",
    equipment: "Barbell",
    difficulty: "Beginner",
    primary: "Biceps Brachii",
    image: "/images/exercises/barbell_curl.png",
  },
  {
    slug: "ez-bar-bicep-curl",
    name: "EZ-Bar Bicep Curl",
    category: "arms",
    equipment: "EZ-Bar",
    difficulty: "Beginner",
    primary: "Biceps Brachii",
    image: "/images/exercises/ez_bar_curl.png",
  },
  {
    slug: "dumbbell-hammer-curl",
    name: "Dumbbell Hammer Curl",
    category: "arms",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    primary: "Brachialis",
    image: "/images/exercises/hammer_curl.png",
  },
  {
    slug: "preacher-curl",
    name: "Preacher Curl",
    category: "arms",
    equipment: "Preacher Bench + EZ-Bar",
    difficulty: "Intermediate",
    primary: "Biceps Short Head",
    image: "/images/exercises/preacher_curl.png",
  },
  {
    slug: "concentration-curl",
    name: "Concentration Curl",
    category: "arms",
    equipment: "Dumbbell + Bench",
    difficulty: "Beginner",
    primary: "Biceps Brachii",
    image: "/images/exercises/concentration_curl.png",
  },
  {
    slug: "cable-bicep-curl",
    name: "Cable Bicep Curl",
    category: "arms",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    primary: "Biceps Brachii",
    image: "/images/exercises/cable_curl.png",
  },
  {
    slug: "tricep-cable-pushdown",
    name: "Tricep Cable Pushdown",
    category: "arms",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    primary: "Triceps Brachii",
    image: "/images/exercises/tricep_pushdown.png",
  },
  {
    slug: "skull-crushers",
    name: "Skull Crushers",
    category: "arms",
    equipment: "EZ-Bar + Bench",
    difficulty: "Intermediate",
    primary: "Triceps Brachii",
    image: "/images/exercises/skull_crushers.png",
  },
  {
    slug: "overhead-tricep-extension",
    name: "Overhead Tricep Extension",
    category: "arms",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    primary: "Triceps Long Head",
    image: "/images/exercises/overhead_tricep_ext.png",
  },
  {
    slug: "overhead-cable-tricep-extension",
    name: "Overhead Cable Extension",
    category: "arms",
    equipment: "Cable + Rope",
    difficulty: "Intermediate",
    primary: "Triceps Long Head",
    image: "/images/exercises/cable_overhead_tricep.png",
  },
  {
    slug: "dumbbell-tricep-kickback",
    name: "Dumbbell Tricep Kickback",
    category: "arms",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    primary: "Triceps Brachii",
    image: "/images/exercises/db_kickback.png",
  },
  {
    slug: "bench-dips",
    name: "Bench Dips",
    category: "arms",
    equipment: "Flat Bench",
    difficulty: "Beginner",
    primary: "Triceps Brachii",
    image: "/images/exercises/bench_dips.png",
  },

  // ── CORE ───────────────────────────────────────────────────────────────
  {
    slug: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: "core",
    equipment: "Pull-Up Bar",
    difficulty: "Advanced",
    primary: "Rectus Abdominis",
    image: "/images/exercises/hanging_leg_raise.png",
  },
  {
    slug: "kneeling-cable-crunch",
    name: "Kneeling Cable Crunch",
    category: "core",
    equipment: "Cable + Rope",
    difficulty: "Intermediate",
    primary: "Rectus Abdominis",
    image: "/images/exercises/cable_crunch.png",
  },
  {
    slug: "ab-wheel-rollout",
    name: "Ab Wheel Rollout",
    category: "core",
    equipment: "Ab Wheel",
    difficulty: "Intermediate",
    primary: "Rectus Abdominis",
    image: "/images/exercises/ab_wheel.png",
  },
  {
    slug: "plank",
    name: "Plank",
    category: "core",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    primary: "Full Core",
    image: "/images/exercises/plank.png",
  },
  {
    slug: "russian-twist",
    name: "Russian Twist",
    category: "core",
    equipment: "Dumbbell / Medicine Ball",
    difficulty: "Beginner",
    primary: "Obliques",
    image: "/images/exercises/russian_twist.png",
  },
];

/** Global plate index — `01` .. `54` in wall order. */
export const INDEXED_EXERCISES = EXERCISES.map((ex, i) => ({
  ...ex,
  plate: String(i + 1).padStart(2, "0"),
}));

export type IndexedExercise = (typeof INDEXED_EXERCISES)[number];

export const countByCategory = (id: CategoryId) =>
  EXERCISES.filter((e) => e.category === id).length;

export const DIFFICULTIES: Difficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];
