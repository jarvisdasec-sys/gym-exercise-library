/**
 * Cardio exercise data.
 *
 * EVERY MET VALUE HERE COMES FROM the 2024 Adult Compendium of Physical
 * Activities (pacompendium.com), the standard reference for the energy cost of
 * human activity. Values were read off the published tables — see
 * cardio_met_notes.md for the extraction record. Nothing is invented.
 *
 * CALORIE MATH: kcal = MET × bodyweight_kg × hours. That is the Compendium's own
 * method. It is a population-average ESTIMATE and ignores individual fitness,
 * efficiency, terrain and body composition, so the UI must always label it as an
 * estimate — members will compare it against a watch and the two will differ.
 *
 * COMPLIANCE: general reference information, not individualised exercise
 * prescription. We never tell a member how much cardio they personally should do.
 */

export type CardioCategory =
  | "run"
  | "ride"
  | "row"
  | "climb"
  | "water"
  | "rope"
  | "impact"
  | "walk";

export interface CardioIntensity {
  /** easy / moderate / hard — the tier label shown to members */
  label: string;
  /** plain description of what this effort feels like */
  effort: string;
  /** MET value from the Compendium */
  met: number;
  /** the exact Compendium row this MET came from, for transparency */
  source: string;
}

export interface CardioExercise {
  slug: string;
  name: string;
  category: CardioCategory;
  /** equipment or setting needed */
  equipment: string;
  /** one-line positioning */
  summary: string;
  /** the three effort tiers with their MET values */
  intensities: CardioIntensity[];
  /** how to do it well — ordered coaching points */
  technique: string[];
  /** what goes wrong */
  mistakes: string[];
  /** who it suits and what it spares or stresses */
  impact: string;
  /** a concrete session to run today */
  starter: string;
}

export const CARDIO_CATEGORY_META: Record<
  CardioCategory,
  { label: string; blurb: string }
> = {
  run: {
    label: "Running",
    blurb: "Outdoors, treadmill and hills. The highest calorie cost per minute.",
  },
  ride: {
    label: "Cycling",
    blurb: "Road, stationary and spin. Hard work, easy on the joints.",
  },
  row: {
    label: "Rowing & Ski",
    blurb: "Full-body ergometers. Legs drive, back and arms finish.",
  },
  climb: {
    label: "Climbing",
    blurb: "Stairs and elliptical. Steady, low-impact, relentless.",
  },
  water: {
    label: "Swimming",
    blurb: "Laps and water work. Zero impact, whole-body demand.",
  },
  rope: {
    label: "Jump Rope",
    blurb: "Cheap, portable and brutally efficient for conditioning.",
  },
  impact: {
    label: "Intervals & Sport",
    blurb: "HIIT, bag work and shuttles. Short, sharp, high output.",
  },
  walk: {
    label: "Walking",
    blurb: "Incline, brisk and rucking. The base everyone can sustain.",
  },
};

export const CARDIO: CardioExercise[] = [
  /* ── RUNNING ─────────────────────────────────────────────────────── */
  {
    slug: "outdoor-running",
    name: "Outdoor Running",
    category: "run",
    equipment: "Road or trail, running shoes",
    summary:
      "The most calorie-dense cardio per minute, and the most honest about your fitness.",
    intensities: [
      {
        label: "Easy",
        effort: "Conversational. You could hold a full sentence.",
        met: 7.5,
        source: "Jogging, general, self-selected pace",
      },
      {
        label: "Moderate",
        effort: "Around 10 min/mile. Talking is possible but clipped.",
        met: 9.3,
        source: "Running, 6–6.3 mph (10 min/mile)",
      },
      {
        label: "Hard",
        effort: "8 min/mile or faster. A few words at a time.",
        met: 11.8,
        source: "Running, 7.5 mph (8 min/mile)",
      },
    ],
    technique: [
      "Land under your hips, not out in front of you.",
      "Keep cadence quick — around 170–180 steps a minute stops overstriding.",
      "Run tall, ribs stacked over hips, shoulders loose.",
      "Drive the elbows back rather than swinging arms across the body.",
      "Breathe rhythmically; fix your breathing before you fix your pace.",
    ],
    mistakes: [
      "Starting every run at the same middling hard pace.",
      "Heel striking well ahead of the body, which brakes each step.",
      "Adding distance and speed in the same week.",
      "Ignoring shoe mileage until something hurts.",
    ],
    impact:
      "High impact. Builds bone density but loads knees, shins and Achilles. Increase weekly volume gradually and keep most runs easy.",
    starter:
      "20 minutes easy. If you cannot hold a conversation, slow down — that is the session, not a failure.",
  },
  {
    slug: "treadmill-running",
    name: "Treadmill Running",
    category: "run",
    equipment: "Treadmill",
    summary:
      "Controlled pace and incline, so intervals land exactly as prescribed.",
    intensities: [
      {
        label: "Easy",
        effort: "Light jog, no incline.",
        met: 7.5,
        source: "Jogging, general, self-selected pace",
      },
      {
        label: "Moderate",
        effort: "Steady 10 min/mile equivalent.",
        met: 9.3,
        source: "Running, 6–6.3 mph (10 min/mile)",
      },
      {
        label: "Hard",
        effort: "Fast pace or 5% incline work.",
        met: 13.3,
        source: "Running uphill, 6.0 mph, 5% incline",
      },
    ],
    technique: [
      "Set 1% incline as your baseline to mimic outdoor air resistance.",
      "Run in the middle of the belt — drifting back means the pace is too fast.",
      "Let go of the handrails; holding on changes the mechanics and the cost.",
      "Use the incline rather than top speed to raise effort with less joint load.",
    ],
    mistakes: [
      "Gripping the rails and leaning, which flatters the calorie readout.",
      "Looking down at the console and collapsing the chest.",
      "Jumping straight to sprint speed without a rolling start.",
    ],
    impact:
      "High impact but slightly cushioned. Incline walking or running is the easiest way to raise intensity without raising speed.",
    starter:
      "5 min walk, then 6 × (2 min at moderate / 90 s walk), then 5 min walk down.",
  },
  {
    slug: "hill-sprints",
    name: "Hill Sprints",
    category: "run",
    equipment: "A hill, or treadmill at steep incline",
    summary:
      "Maximum output with less braking force than flat sprinting, so it is kinder to hamstrings.",
    intensities: [
      {
        label: "Moderate",
        effort: "Strong uphill running, not flat out.",
        met: 10.3,
        source: "Running uphill, 4.5 mph, 5% incline",
      },
      {
        label: "Hard",
        effort: "Near-maximum uphill effort.",
        met: 15.5,
        source: "Running uphill, 7.0 mph, 5% incline",
      },
      {
        label: "Stairs",
        effort: "Running stairs continuously.",
        met: 15.0,
        source: "Running, stairs, up",
      },
    ],
    technique: [
      "Lean slightly from the ankles, not the waist.",
      "Shorten your stride and drive the knees.",
      "Pump the arms — on a hill they carry more of the work.",
      "Walk all the way down. The descent is recovery, not part of the effort.",
    ],
    mistakes: [
      "Bending at the hips so the chest drops toward the ground.",
      "Sprinting back down and inviting a hamstring or knee problem.",
      "Doing them cold, with no warm-up.",
    ],
    impact:
      "Very demanding on the cardiovascular system but lower impact than flat sprints, since you land on a rising surface.",
    starter:
      "Warm up 10 minutes, then 6 × 15-second hill efforts with a full walk down between each.",
  },

  /* ── CYCLING ─────────────────────────────────────────────────────── */
  {
    slug: "stationary-bike",
    name: "Stationary Bike",
    category: "ride",
    equipment: "Upright or recumbent bike",
    summary:
      "The default low-impact option. Easy to hold a target for a long time.",
    intensities: [
      {
        label: "Easy",
        effort: "Light pedalling, around 50–60 W.",
        met: 5.0,
        source: "Bicycling, stationary, 60 watts, light to moderate effort",
      },
      {
        label: "Moderate",
        effort: "Working steadily, roughly 126–150 W.",
        met: 8.0,
        source: "Bicycling, stationary, 126–150 watts",
      },
      {
        label: "Hard",
        effort: "Hard sustained effort, 200 W and up.",
        met: 10.8,
        source: "Bicycling, stationary, 200–229 watts, vigorous",
      },
    ],
    technique: [
      "Set saddle height so the knee keeps a slight bend at the bottom.",
      "Push through the whole pedal circle rather than stamping down.",
      "Keep cadence around 80–90 rpm before adding resistance.",
      "Sit tall; rounding forward shuts down the breathing.",
    ],
    mistakes: [
      "Saddle far too low, which grinds the knees.",
      "Cranking resistance so high that cadence collapses.",
      "Resting all the bodyweight on the handlebars.",
    ],
    impact:
      "Very low impact. A sound choice when running aggravates knees, shins or the lower back.",
    starter: "30 minutes steady at a pace you could hold for 45.",
  },
  {
    slug: "spin-class",
    name: "Spin / Indoor Cycling",
    category: "ride",
    equipment: "Spin bike",
    summary:
      "Group-paced intervals on a heavy flywheel. High output, low joint cost.",
    intensities: [
      {
        label: "Moderate",
        effort: "Steady class pace with occasional climbs.",
        met: 8.8,
        source: "Bicycling, interactive virtual cycling, indoor cycle ergometer",
      },
      {
        label: "Hard",
        effort: "Full class effort, standing climbs and sprints.",
        met: 9.0,
        source: "Bicycling, stationary, RPM/Spin bike class",
      },
      {
        label: "Intervals",
        effort: "Structured hard intervals with recoveries.",
        met: 8.8,
        source: "Bicycling, high intensity interval training",
      },
    ],
    technique: [
      "Set resistance so you are always pushing something — spinning free wastes the class.",
      "Keep the hips still when standing; do not rock side to side.",
      "Brace the core so the legs work against a stable trunk.",
      "Wipe the bike down and check the fit before the lights drop.",
    ],
    mistakes: [
      "Zero resistance at high cadence, which teaches nothing and risks the knees.",
      "Death-gripping the bars and hunching the shoulders.",
      "Chasing the instructor's numbers rather than your own effort.",
    ],
    impact:
      "Low impact, high cardiovascular demand. Watch total weekly load if you also lift heavy for legs.",
    starter:
      "10 min build, then 8 × (40 s hard seated / 80 s easy), then 5 min spin down.",
  },
  {
    slug: "road-cycling",
    name: "Road Cycling",
    category: "ride",
    equipment: "Bicycle, helmet",
    summary:
      "Long aerobic work outdoors, where terrain does the interval programming for you.",
    intensities: [
      {
        label: "Easy",
        effort: "Leisure pace, under 10 mph.",
        met: 4.0,
        source: "Bicycling, <10 mph, leisure",
      },
      {
        label: "Moderate",
        effort: "12–14 mph, working but sustainable.",
        met: 8.0,
        source: "Bicycling, 12–13.9 mph, leisure, moderate effort",
      },
      {
        label: "Hard",
        effort: "16–19 mph, fast group riding.",
        met: 12.0,
        source: "Bicycling, 16–19 mph, racing/not drafting, very fast",
      },
    ],
    technique: [
      "Keep elbows soft so the arms absorb road buzz.",
      "Change gear early on approach to a climb, not halfway up it.",
      "Hold a smooth cadence rather than mashing a big gear.",
      "Scan well ahead; braking late costs all your momentum.",
    ],
    mistakes: [
      "Saddle too low, robbing power and stressing the knees.",
      "Riding every session at the same moderate pace.",
      "No lights or helmet on shared roads.",
    ],
    impact:
      "Low impact, high volume tolerated well. Long rides do accumulate real fatigue, so plan them around leg training.",
    starter: "45 minutes at a pace where you could still talk on the flats.",
  },

  /* ── ROWING & SKI ────────────────────────────────────────────────── */
  {
    slug: "rowing-machine",
    name: "Rowing Machine",
    category: "row",
    equipment: "Rowing ergometer",
    summary:
      "The most complete machine in the room — legs, back and arms in one stroke.",
    intensities: [
      {
        label: "Easy",
        effort: "Under 100 W, steady technique work.",
        met: 5.0,
        source: "Rowing, stationary ergometer, <100 watts, moderate effort",
      },
      {
        label: "Moderate",
        effort: "100–149 W, working breathing.",
        met: 7.5,
        source: "Rowing, stationary, 100 to 149 watts, vigorous effort",
      },
      {
        label: "Hard",
        effort: "150–199 W, genuinely uncomfortable.",
        met: 11.0,
        source: "Rowing, stationary, 150 to 199 watts, vigorous effort",
      },
    ],
    technique: [
      "Sequence the drive: legs, then back, then arms.",
      "Reverse it on the recovery: arms, then back, then legs.",
      "Keep the chain moving in a flat horizontal line.",
      "Aim for a long, strong stroke — power comes from the legs, not the biceps.",
    ],
    mistakes: [
      "Yanking with the arms before the legs have driven.",
      "Rounding the lower back at the catch.",
      "Racing the stroke rate while producing less power.",
      "Setting the damper to 10 and calling it strength work.",
    ],
    impact:
      "Low impact but demanding on the lower back if technique degrades. Stop the set when the sequence breaks down.",
    starter:
      "5 min easy, then 4 × (3 min moderate / 90 s easy), focusing on stroke sequence.",
  },
  {
    slug: "ski-erg",
    name: "Ski Erg",
    category: "row",
    equipment: "Ski ergometer",
    summary:
      "Upper-body-led conditioning that spares the knees almost entirely.",
    intensities: [
      {
        label: "Moderate",
        effort: "Steady double poling.",
        met: 6.8,
        source: "Ski machine, general",
      },
      {
        label: "Hard",
        effort: "Slow-to-moderate speed double poling, committed.",
        met: 10.5,
        source: "Ski ergometer, cross country, double poling, slow to moderate",
      },
      {
        label: "Maximal",
        effort: "Fast to maximum double poling.",
        met: 18.0,
        source: "Ski ergometer, cross country, double poling, fast to maximum",
      },
    ],
    technique: [
      "Start tall with hands high, then drive down through the handles.",
      "Hinge at the hips and finish with hands past the thighs.",
      "Use the legs to assist the hinge rather than standing rigid.",
      "Return to full height each rep so the range stays honest.",
    ],
    mistakes: [
      "Pulling with arms only and leaving the trunk out of it.",
      "Half-height starts that shorten every stroke.",
      "Letting the lower back round under fatigue.",
    ],
    impact:
      "Minimal lower-body impact. A strong option when legs are sore from squats or deadlifts.",
    starter: "10 × (30 s hard / 30 s rest). Short, and plenty.",
  },

  /* ── CLIMBING ────────────────────────────────────────────────────── */
  {
    slug: "stair-climber",
    name: "Stair Climber",
    category: "climb",
    equipment: "StairMaster or stepmill",
    summary:
      "Relentless steady-state work that loads glutes and quads without impact.",
    intensities: [
      {
        label: "Moderate",
        effort: "Steady climbing, breathing raised.",
        met: 6.8,
        source: "Stair climbing, general",
      },
      {
        label: "Hard",
        effort: "Fast pace, one step at a time.",
        met: 9.3,
        source: "Stair climbing, fast pace, one step at a time",
      },
      {
        label: "Machine",
        effort: "Stair treadmill ergometer at working pace.",
        met: 9.3,
        source: "Stair treadmill ergometer, general",
      },
    ],
    technique: [
      "Stand tall and take full steps rather than shuffling on the toes.",
      "Rest hands lightly on the rails for balance only.",
      "Drive through the whole foot to bring the glutes in.",
      "Keep the same cadence rather than surging and coasting.",
    ],
    mistakes: [
      "Leaning hard on the handles, which removes most of the work.",
      "Tiny half-steps at a high speed setting.",
      "Hunching over the console.",
    ],
    impact:
      "Low impact, high perceived effort. Excellent when you want glute and quad work without pounding.",
    starter: "20 minutes at a pace you can hold without gripping the rails.",
  },
  {
    slug: "elliptical",
    name: "Elliptical Trainer",
    category: "climb",
    equipment: "Elliptical / cross trainer",
    summary:
      "The gentlest full-body option — useful for building volume without joint cost.",
    intensities: [
      {
        label: "Moderate",
        effort: "Working steadily, able to talk.",
        met: 5.0,
        source: "Elliptical trainer, moderate effort",
      },
      {
        label: "Hard",
        effort: "High resistance, breathing hard.",
        met: 9.0,
        source: "Elliptical trainer, vigorous effort",
      },
      {
        label: "Intervals",
        effort: "Alternating hard pushes with easy recoveries.",
        met: 9.0,
        source: "Elliptical trainer, vigorous effort",
      },
    ],
    technique: [
      "Push and pull the handles so the upper body contributes.",
      "Keep the whole foot down instead of rising onto the toes.",
      "Add resistance before adding speed.",
      "Stay upright rather than hanging off the console.",
    ],
    mistakes: [
      "Coasting on momentum with no resistance.",
      "Ignoring the handles entirely and halving the work.",
      "Locking the knees at the end of each stride.",
    ],
    impact:
      "Very low impact. The usual recommendation when running is off the table for joint reasons.",
    starter: "25 minutes moderate, adding resistance every 5 minutes.",
  },

  /* ── SWIMMING ────────────────────────────────────────────────────── */
  {
    slug: "freestyle-swimming",
    name: "Freestyle Swimming",
    category: "water",
    equipment: "Pool",
    summary:
      "Whole-body conditioning with no impact whatsoever, and no hiding from your technique.",
    intensities: [
      {
        label: "Easy",
        effort: "Recreational laps, relaxed.",
        met: 5.8,
        source: "Swimming laps, freestyle, slow, recreational",
      },
      {
        label: "Moderate",
        effort: "Around 50 yards a minute.",
        met: 8.0,
        source: "Swimming, crawl, medium speed, ~50 yards/minute",
      },
      {
        label: "Hard",
        effort: "Fast laps, roughly 75 yards a minute.",
        met: 10.5,
        source: "Swimming, crawl, fast speed, ~75 yards/minute, vigorous",
      },
    ],
    technique: [
      "Rotate from the hips so the stroke lengthens.",
      "Keep the head in line with the spine; looking forward sinks the legs.",
      "Exhale steadily underwater, then take a quick breath to the side.",
      "Reach and glide — fewer, longer strokes beat frantic ones.",
    ],
    mistakes: [
      "Lifting the head to breathe instead of rotating.",
      "Kicking from the knees rather than the hips.",
      "Holding the breath and building up carbon dioxide.",
      "Swimming continuous laps with no structure and no rest.",
    ],
    impact:
      "Zero impact and fully supported. The strongest option if joints, shins or the back rule out running.",
    starter:
      "8 × 50 m with 30 seconds rest. Count strokes per length and try to reduce it.",
  },
  {
    slug: "water-running",
    name: "Water Running & Aqua Work",
    category: "water",
    equipment: "Pool, optional flotation belt",
    summary:
      "Running mechanics with the impact removed — the standard bridge back from injury.",
    intensities: [
      {
        label: "Moderate",
        effort: "Water aerobics or steady aqua jogging.",
        met: 5.5,
        source: "Water aerobics, water calisthenics, general",
      },
      {
        label: "Hard",
        effort: "High intensity aqua work.",
        met: 7.5,
        source: "Water aerobics, high intensity",
      },
      {
        label: "Vigorous",
        effort: "Vigorous water jogging in deep water.",
        met: 9.8,
        source: "Water jogging, vigorous effort",
      },
    ],
    technique: [
      "Hold a tall posture; do not let the trunk pitch forward.",
      "Drive the knees and push the water back with the whole foot.",
      "Use the arms as you would on land, with a full range.",
      "Work in chest-deep or deeper water so the load stays off the joints.",
    ],
    mistakes: [
      "Drifting into a shallow bounce that reintroduces impact.",
      "Letting the cadence drop because the water feels easy.",
      "Skipping structure — intervals work here too.",
    ],
    impact:
      "Effectively zero impact. Commonly used to hold fitness while a running injury settles.",
    starter: "6 × (2 min hard / 1 min easy) in deep water.",
  },

  /* ── JUMP ROPE ───────────────────────────────────────────────────── */
  {
    slug: "jump-rope",
    name: "Jump Rope",
    category: "rope",
    equipment: "Skipping rope",
    summary:
      "Cheapest high-output conditioning there is, and it sharpens footwork as a bonus.",
    intensities: [
      {
        label: "Easy",
        effort: "Under 100 skips a minute, rhythm bounce.",
        met: 8.3,
        source: "Rope jumping, slow pace, <100 skips/min",
      },
      {
        label: "Moderate",
        effort: "100–120 skips a minute, two-foot bounce.",
        met: 11.8,
        source: "Rope jumping, moderate pace, 100 to 120 skips/min",
      },
      {
        label: "Hard",
        effort: "120–160 skips a minute.",
        met: 12.3,
        source: "Rope jumping, fast pace, 120-160 skips/min",
      },
    ],
    technique: [
      "Turn the rope from the wrists, not the shoulders.",
      "Jump barely an inch — just enough to clear the rope.",
      "Land softly through the balls of the feet with soft knees.",
      "Keep elbows close to the ribs and eyes forward.",
    ],
    mistakes: [
      "Jumping far too high and burning out in a minute.",
      "Swinging from the shoulders, which tires the arms first.",
      "A rope at the wrong length — it should reach the armpits when stood on.",
      "Going straight to double unders before the basic bounce is steady.",
    ],
    impact:
      "Repetitive impact through the calves and Achilles. Build up gradually and stay off concrete where possible.",
    starter:
      "10 rounds of 30 seconds on, 30 seconds off. Stop a round early rather than flailing.",
  },

  /* ── INTERVALS & SPORT ───────────────────────────────────────────── */
  {
    slug: "hiit-circuit",
    name: "HIIT Circuit",
    category: "impact",
    equipment: "Open floor, bodyweight",
    summary:
      "Burpees, mountain climbers and squat jumps — maximum output in minimum time.",
    intensities: [
      {
        label: "Moderate",
        effort: "Interval work at controlled effort.",
        met: 7.0,
        source: "High intensity interval exercise, moderate effort",
      },
      {
        label: "Hard",
        effort: "Burpees, mountain climbers, squat jumps, Tabata.",
        met: 11.0,
        source: "High intensity interval exercise, vigorous effort",
      },
      {
        label: "Circuit",
        effort: "Kettlebell circuit with minimal rest.",
        met: 7.5,
        source: "Circuit training, including kettlebells, vigorous intensity",
      },
    ],
    technique: [
      "Pick movements you can still perform cleanly when tired.",
      "Work to a clock, not to a rep count, so form holds.",
      "Take the full prescribed rest — the rest is what makes the work possible.",
      "Finish every session feeling you could have done one more round.",
    ],
    mistakes: [
      "Chasing rep counts as technique falls apart.",
      "Doing HIIT five days a week and recovering from none of it.",
      "No warm-up before explosive movement.",
      "Treating it as a substitute for all steady cardio.",
    ],
    impact:
      "High impact and high systemic fatigue. Two or three sessions a week is plenty alongside lifting.",
    starter:
      "8 rounds of 20 seconds work / 40 seconds rest, alternating squat jumps and mountain climbers.",
  },
  {
    slug: "heavy-bag",
    name: "Heavy Bag Work",
    category: "impact",
    equipment: "Punch bag, wraps and gloves",
    summary:
      "Conditioning that improves coordination and is genuinely absorbing to do.",
    intensities: [
      {
        label: "Easy",
        effort: "Steady bag work, around 60 punches a minute.",
        met: 7.0,
        source: "Boxing, punching bag, 60 b/min",
      },
      {
        label: "Moderate",
        effort: "Around 120 punches a minute.",
        met: 8.5,
        source: "Boxing, punching bag, 120 b/min",
      },
      {
        label: "Hard",
        effort: "180 punches a minute, full rounds.",
        met: 10.8,
        source: "Boxing, punching bag, 180 b/min",
      },
    ],
    technique: [
      "Wrap the hands properly before you touch the bag.",
      "Rotate the hips and pivot the rear foot — power comes from the ground.",
      "Return the hand to guard immediately after every punch.",
      "Breathe out sharply on each strike.",
    ],
    mistakes: [
      "Punching with a bent or loose wrist.",
      "Standing square with no guard.",
      "Arm punching with no rotation behind it.",
      "Hitting flat-footed and static for the whole round.",
    ],
    impact:
      "Low lower-body impact but demanding on wrists and shoulders. Wrap up and build volume slowly.",
    starter: "6 rounds of 2 minutes with 1 minute rest, staying light and fast.",
  },
  {
    slug: "shuttle-runs",
    name: "Shuttle Runs",
    category: "impact",
    equipment: "Open space, markers",
    summary:
      "Accelerate, decelerate, change direction. Conditioning plus athleticism.",
    intensities: [
      {
        label: "Hard",
        effort: "Forward, backward and lateral shuttles.",
        met: 11.0,
        source: "Shuttle running, forward/backward/lateral",
      },
      {
        label: "Moderate",
        effort: "Longer shuttles at controlled pace.",
        met: 7.0,
        source: "High intensity interval exercise, moderate effort",
      },
      {
        label: "Sport",
        effort: "Court sport style repeated efforts.",
        met: 8.0,
        source: "Basketball, game",
      },
    ],
    technique: [
      "Drop the hips to decelerate rather than stopping stiff-legged.",
      "Plant the outside foot and push, do not pivot on a straight knee.",
      "Stay low through the turn and accelerate out of it.",
      "Touch the line — cutting it short changes the whole session.",
    ],
    mistakes: [
      "Turning on a locked knee, which is how knees get hurt.",
      "Skipping the warm-up before change-of-direction work.",
      "Running them on a slippery surface.",
    ],
    impact:
      "High impact with heavy braking forces. Not the place to start if you are new to cardio.",
    starter:
      "Warm up thoroughly, then 8 × 20 m shuttles with 45 seconds rest between.",
  },

  /* ── WALKING ─────────────────────────────────────────────────────── */
  {
    slug: "incline-walking",
    name: "Incline Walking",
    category: "walk",
    equipment: "Treadmill or hill",
    summary:
      "Most of the calorie cost of jogging with a fraction of the joint load.",
    intensities: [
      {
        label: "Easy",
        effort: "Moderate pace on the flat.",
        met: 3.8,
        source: "Walking, 2.8 to 3.4 mph, level, moderate pace",
      },
      {
        label: "Moderate",
        effort: "Brisk walking for exercise.",
        met: 4.8,
        source: "Walking, 3.5 to 3.9 mph, level, brisk, firm surface",
      },
      {
        label: "Hard",
        effort: "Hills at 6–10% grade, brisk.",
        met: 7.0,
        source: "Climbing hills, no load, 6 to 10% grade, moderate-to-brisk",
      },
    ],
    technique: [
      "Let the arms swing naturally instead of holding the rails.",
      "Take full strides and roll heel to toe.",
      "Raise the incline rather than the speed to increase effort.",
      "Keep the trunk upright; leaning into the belt cheats the gradient.",
    ],
    mistakes: [
      "Holding the handrails on a steep incline, which removes most of the work.",
      "Setting an incline so steep it forces you onto your toes.",
      "Treating it as too easy to count — it is the most sustainable option here.",
    ],
    impact:
      "Low impact and easy to recover from. The best default for anyone starting cardio or carrying extra weight.",
    starter:
      "30 minutes at 10–12% incline, holding a pace where you could just about talk.",
  },
  {
    slug: "rucking",
    name: "Rucking",
    category: "walk",
    equipment: "Backpack with weight",
    summary:
      "Loaded walking — builds work capacity and posture with almost no impact.",
    intensities: [
      {
        label: "Easy",
        effort: "Walking with a light day pack.",
        met: 3.5,
        source: "Walking with a day pack, level ground",
      },
      {
        label: "Moderate",
        effort: "Hiking with a daypack, organised pace.",
        met: 7.8,
        source: "Backpacking, hiking with a daypack",
      },
      {
        label: "Hard",
        effort: "Hills with a 21–40 lb load, brisk.",
        met: 7.5,
        source: "Climbing hills, 21 to 40 lb load, 3 to 10% grade",
      },
    ],
    technique: [
      "Pack the weight high and close to the upper back.",
      "Tighten the straps so the load does not swing.",
      "Walk tall — the temptation is to lean forward under load.",
      "Start with about 10% of bodyweight and add gradually.",
    ],
    mistakes: [
      "Loading far too heavy on the first outing.",
      "A loose pack that shifts and pulls the shoulders down.",
      "Rounding forward and loading the lower back.",
    ],
    impact:
      "Low impact but genuine spinal and shoulder loading. Progress the weight slowly.",
    starter: "45 minutes with 10% of your bodyweight, on flat ground.",
  },
];

/** Total number of cardio exercises, for the index counters. */
export const CARDIO_COUNT = CARDIO.length;

export function getCardio(slug: string): CardioExercise | undefined {
  return CARDIO.find((c) => c.slug === slug);
}

export function cardioByCategory(category: CardioCategory): CardioExercise[] {
  return CARDIO.filter((c) => c.category === category);
}

/**
 * Estimated energy cost. kcal = MET × kg × hours (the Compendium's own method).
 * Returns null without a bodyweight, because inventing one would produce a
 * number that looks authoritative and is not.
 */
export function estimateKcal(
  met: number,
  minutes: number,
  bodyweightKg: number | null,
): number | null {
  if (!bodyweightKg || bodyweightKg <= 0 || minutes <= 0) return null;
  return met * bodyweightKg * (minutes / 60);
}

/** Interval protocols worth knowing, described without prescribing to anyone. */
export interface Protocol {
  slug: string;
  name: string;
  structure: string;
  duration: string;
  origin: string;
  detail: string;
  suits: string;
}

export const PROTOCOLS: Protocol[] = [
  {
    slug: "tabata",
    name: "Tabata",
    structure: "20 s maximum effort / 10 s rest × 8",
    duration: "4 minutes",
    origin:
      "From Izumi Tabata's research on Japanese speed skaters, originally performed on a cycle ergometer.",
    detail:
      "Eight rounds only, but each work interval is genuinely maximal. It is far shorter and far harder than most things labelled Tabata in gyms.",
    suits:
      "Bikes and rowers, where you can go all-out without technique collapsing.",
  },
  {
    slug: "thirty-thirty",
    name: "30 / 30s",
    structure: "30 s hard / 30 s easy × 10–20",
    duration: "10–20 minutes",
    origin:
      "A staple of endurance training for accumulating time at high intensity.",
    detail:
      "The equal rest makes it repeatable, so you can hold a genuinely hard pace across every rep rather than fading after three.",
    suits: "Running, rowing, jump rope, ski erg.",
  },
  {
    slug: "four-by-four",
    name: "4 × 4",
    structure: "4 min hard / 3 min easy × 4",
    duration: "About 30 minutes",
    origin:
      "The Norwegian protocol used widely in cardiovascular research for raising aerobic capacity.",
    detail:
      "Long intervals at a hard but controlled effort. You should finish the fourth rep at the same pace as the first.",
    suits: "Treadmill, bike, stair climber, uphill running.",
  },
  {
    slug: "pyramid",
    name: "Pyramid",
    structure: "1-2-3-4-3-2-1 min hard, equal rest",
    duration: "About 32 minutes",
    origin: "A classic way to vary interval length within a single session.",
    detail:
      "Effort climbs then descends. The reps on the way down feel much harder than the same reps on the way up — that is the point.",
    suits: "Rowing, cycling, running.",
  },
  {
    slug: "zone-two",
    name: "Steady Zone 2",
    structure: "Continuous easy effort",
    duration: "30–90 minutes",
    origin:
      "The aerobic base work that makes up the bulk of most endurance programmes.",
    detail:
      "Easy enough to hold a conversation throughout. Unglamorous, and the foundation everything harder is built on.",
    suits: "Walking, cycling, easy running, elliptical.",
  },
  {
    slug: "fartlek",
    name: "Fartlek",
    structure: "Unstructured surges within a steady run",
    duration: "20–45 minutes",
    origin:
      "Swedish for 'speed play'. Developed as a less rigid alternative to track intervals.",
    detail:
      "Pick a landmark, push to it, settle back down, repeat when you feel ready. No watch required.",
    suits: "Outdoor running and cycling.",
  },
];
