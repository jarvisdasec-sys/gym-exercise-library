export const CYCLE_START = "2026-10-08";
export const GROUP_SIZES = [4, 6, 8, 10];
const DAY_MS = 86400000;

export const movements = {
  squat: [
    "Bodyweight squat",
    "Stand feet hip-width apart. Sit hips back, bend knees in line with toes, then stand. Keep your chest lifted and use a comfortable depth.",
    "Use a shallow squat, moving slowly.",
  ],
  pushup: [
    "Push-up",
    "Place hands under shoulders. Keep a straight line from head to knees or heels; bend elbows, lower with control, then press up.",
    "Use kneeling push-ups or standing wall push-ups if a stable wall is available.",
  ],
  bridge: [
    "Glute bridge",
    "Lie on your back, knees bent and feet flat. Squeeze glutes to lift hips without arching your back; lower slowly.",
    "Lift a smaller distance, or do standing glute squeezes if floor work is not suitable.",
  ],
  birdDog: [
    "Bird dog",
    "On hands and knees, brace gently and extend opposite arm and leg. Return, then change sides. Keep hips level.",
    "Move just one arm or leg at a time, or stand and reach opposite arm and leg.",
  ],
  march: [
    "Power march",
    "March in place with active arm swings. Lift knees only as high as comfortable and keep a steady breathing rhythm.",
    "Use smaller, slower steps with relaxed arm swings.",
  ],
  jack: [
    "Jumping jacks",
    "Land softly as feet move out and in while arms lift and lower. Keep knees softly bent.",
    "Step one foot out at a time; skip the jump and keep arms below shoulder height if needed.",
  ],
  skater: [
    "Skater steps",
    "Step side to side, taking your trailing foot behind lightly. Hinge slightly at the hips; stay in your own space.",
    "Use small side steps without crossing the feet or hopping.",
  ],
  boxer: [
    "Shadow boxing",
    "Stand with soft knees and alternate controlled forward punches. Rotate gently through the torso, keeping wrists straight; do not lock elbows.",
    "Keep feet planted and use light, slow punches.",
  ],
  reverseLunge: [
    "Alternating reverse lunge",
    "Step back, bend both knees within a comfortable range, then push through the front foot to return. Alternate sides.",
    "Tap a toe behind without lowering, or use a shallow squat instead.",
  ],
  calf: [
    "Standing calf raise",
    "Stand tall and lift both heels slowly, pause, then lower with control. Use a stable wall for balance only if available.",
    "Use a small heel lift, or keep heels grounded and gently shift weight.",
  ],
  deadBug: [
    "Dead bug",
    "Lie on your back with knees bent. Keep ribs down and alternate lowering an opposite arm and heel, without arching your back.",
    "Keep arms still and slide one heel along the floor, or use standing knee lifts.",
  ],
  plank: [
    "Forearm plank",
    "Place elbows under shoulders. Keep hips level and breathe steadily; stop the hold before form breaks.",
    "Keep knees on the floor, use short holds with breaks, or stand and gently brace your core.",
  ],
  kneeDrive: [
    "Standing knee drive",
    "Alternate lifting a knee toward your hands. Stand tall, exhale as the knee rises and avoid pulling on your neck.",
    "Lift knees lower, slowing down and reducing the arm reach.",
  ],
  sideReach: [
    "Standing side reach",
    "Stand comfortably and reach one arm upward while gently bending sideways. Alternate sides; avoid twisting or forcing the stretch.",
    "Use a small reach at shoulder height.",
  ],
  salsa: [
    "Salsa basic",
    "Step forward, shift weight, return; step back, shift weight, return. Alternate feet to a comfortable beat. No partner contact needed.",
    "Use small forward/back toe taps without turning.",
  ],
  merengue: [
    "Merengue march",
    "March to your own music, add gentle hip movement and relaxed arm swings. Stay tall and keep steps soft.",
    "March slowly with hips neutral and hands relaxed.",
  ],
  grapevine: [
    "Grapevine / side steps",
    "Step right, cross left behind, step right, tap; reverse left. Look ahead and leave space around you.",
    "Skip crossing and take two side steps each way.",
  ],
  cumbia: [
    "Cumbia back step",
    "Tap one foot back diagonally, return to center, then alternate. Add relaxed arm movement without twisting your knee.",
    "Tap straight back with small steps and no rotation.",
  ],
  hinge: [
    "Bodyweight hip hinge",
    "Keep knees soft, push hips back with a long spine, then squeeze glutes to stand. Hands may rest on hips.",
    "Use a small hinge and a slow tempo.",
  ],
  wallFreeRow: [
    "Standing W squeeze",
    "Hold arms in a W shape with elbows bent. Draw shoulder blades gently together, then release. Avoid shrugging or arching your back.",
    "Keep elbows lower and make a gentle shoulder-blade squeeze.",
  ],
  shoulderTap: [
    "Plank shoulder tap",
    "From a high plank with a comfortable foot width, tap the opposite shoulder slowly, alternating hands while keeping hips still.",
    "Use hands-and-knees taps or standing alternating shoulder taps.",
  ],
  swimmer: [
    "Prone alternating reach",
    "Lie face down, forehead facing the floor. Lift one arm and the opposite leg only a little, then switch. Avoid lifting your head or arching.",
    "Use bird dog or standing opposite-arm/leg reaches.",
  ],
  stepTouch: [
    "Step-touch",
    "Step sideways and bring the other foot in to tap. Alternate directions with light arm swings and soft knees.",
    "Use small steps and keep arms relaxed.",
  ],
  hamstring: [
    "Hamstring sweep",
    "Set one heel forward, soften the other knee and gently hinge at the hips. Sweep hands toward the shin and return; alternate.",
    "Keep torso more upright and use a small heel tap.",
  ],
  mobility: [
    "Gentle shoulder circles",
    "Circle shoulders slowly forward and backward. Keep neck relaxed and breathe; use pain-free movement.",
    "Make smaller circles or gently roll one shoulder at a time.",
  ],
  catCow: [
    "Cat-cow mobility",
    "On hands and knees, gently round and extend your upper back with your breath. Do not force the movement or neck position.",
    "Stand with hands on thighs and gently round then lengthen your upper back.",
  ],
  sideLunge: [
    "Side lunge",
    "Step wide and sit hips back over one leg while the other stays long. Return to center and alternate; keep the bent knee in line with toes.",
    "Use small side steps with a shallow knee bend.",
  ],
  mountain: [
    "Mountain climber",
    "From hands under shoulders, bring one knee forward at a time. Keep hips steady and move with control rather than racing.",
    "Do standing alternating knee drives.",
  ],
  heelCurl: [
    "Standing heel curl",
    "Alternate curling a heel toward your glutes. Keep knees close and torso upright; swing arms gently.",
    "Use a smaller bend and slower pace.",
  ],
};

export type MovementId = keyof typeof movements;
export interface GroupSession {
  day: number;
  name: string;
  type: string;
  description: string;
  ids: MovementId[];
  rounds: number;
  work: number;
  rest: number;
}
export interface WorkoutPhase {
  kind: string;
  name: string;
  seconds: number;
  cue?: string;
  round?: number;
  intervalIndex?: number;
}

function session(
  day: number,
  name: string,
  type: string,
  description: string,
  ids: MovementId[],
  rounds = 4,
  work = 40,
  rest = 20
): GroupSession {
  return { day, name, type, description, ids, rounds, work, rest };
}

export const sessions = [
  session(
    1,
    "Build your base",
    "Strength",
    "A full-body foundation. Learn the movements together and put form before speed.",
    ["squat", "pushup", "bridge", "birdDog"]
  ),
  session(
    2,
    "Living-room cardio",
    "Cardio",
    "Raise your heart rate without leaving your space. You should still be able to speak in short sentences.",
    ["march", "jack", "skater", "boxer"]
  ),
  session(
    3,
    "Core & control",
    "Core",
    "A steadier pace for balance and core control. Breathe throughout every hold.",
    ["deadBug", "birdDog", "plank", "kneeDrive"]
  ),
  session(
    4,
    "Zumba day",
    "Dance",
    "A self-guided, Zumba-inspired dance-fitness day. Play your own music and follow these simple steps; this is not an instructor-led Zumba class.",
    ["salsa", "merengue", "grapevine", "cumbia"],
    4,
    60,
    15
  ),
  session(
    5,
    "Reset & restore",
    "Recovery",
    "An easy recovery session. Stay at a conversational pace; rest completely instead if your body needs it.",
    ["march", "hamstring", "mobility", "catCow"],
    2,
    45,
    15
  ),
  session(
    6,
    "Lower-body crew",
    "Strength",
    "Controlled leg and glute work. Alternate legs evenly and keep every range comfortable.",
    ["squat", "reverseLunge", "bridge", "calf"]
  ),
  session(
    7,
    "Box & move",
    "Cardio",
    "Non-contact boxing and simple footwork. No partner sparring, no equipment, no jumping required.",
    ["boxer", "stepTouch", "kneeDrive", "heelCurl"]
  ),
  session(
    8,
    "Upper-body & posture",
    "Strength",
    "Press, brace and squeeze with control. Take brief breaks before your technique changes.",
    ["pushup", "wallFreeRow", "shoulderTap", "swimmer"]
  ),
  session(
    9,
    "Quiet cardio",
    "Low impact",
    "Apartment-friendly movement with no jumps. Make it smooth and choose a pace that feels sustainable.",
    ["march", "stepTouch", "heelCurl", "boxer"]
  ),
  session(
    10,
    "Move & breathe",
    "Recovery",
    "Release tension with gentle movement. Never bounce or force a stretch; an extra rest day is always an option.",
    ["catCow", "sideReach", "hamstring", "mobility"],
    2,
    45,
    15
  ),
  session(
    11,
    "Full-body flow",
    "Strength",
    "Connect strength and balance. Move deliberately rather than counting the most repetitions.",
    ["sideLunge", "pushup", "hinge", "birdDog"]
  ),
  session(
    12,
    "Cardio circuit",
    "Cardio",
    "Four familiar moves with a little more variety. Choose standing options whenever floor work is not right for you.",
    ["jack", "skater", "mountain", "boxer"]
  ),
  session(
    13,
    "Strong center",
    "Core",
    "Build a stable base with steady breathing and controlled movements. Rest whenever your form needs it.",
    ["deadBug", "plank", "bridge", "shoulderTap"]
  ),
  session(
    14,
    "Dance together",
    "Dance",
    "Bring back your favorite beat. Each pair can lead one movement while everyone dances in their own space.",
    ["merengue", "salsa", "stepTouch", "cumbia"],
    4,
    60,
    15
  ),
  session(
    15,
    "Crew celebration",
    "Full body",
    "Finish with a friendly, non-competitive circuit. Celebrate consistency, then repeat the cycle at your own pace.",
    ["squat", "boxer", "bridge", "stepTouch"]
  ),
];

export const warmup = [
  [
    "Easy march",
    "Stand tall with shoulders relaxed. Lift one foot a little, lower it softly and alternate feet in place. Keep steps small and breathe naturally for the full minute.",
  ],
  [
    "Shoulder circles",
    "Stand comfortably with arms by your sides. Roll shoulders slowly up, back and down through a small pain-free circle; reverse direction halfway. Keep your head still and breathe gently.",
  ],
  [
    "Side steps",
    "Stand with soft knees and feet under your hips. Step right and tap the left foot beside it, then step left and tap the right. Keep both feet close to the ground and stay in your own space.",
  ],
  [
    "Hip hinges",
    "Stand with feet hip-width apart and knees soft. Push hips back as your torso tips forward with a long spine, then squeeze glutes gently to stand. Use a small range and avoid rounding your back.",
  ],
  [
    "Easy movement practice",
    "Read today’s numbered exercise instructions before the timer starts. During this minute, rehearse a few slow repetitions of the first movements, choosing standard or easier versions. Pause the timer if you need more practice time.",
  ],
];
export const cooldown = [
  [
    "Slow march & breathe",
    "Stand upright and alternate small, quiet steps in place. Gradually reduce your pace while breathing slowly and naturally. Let your shoulders relax; stop and rest if you feel dizzy.",
  ],
  [
    "Gentle calf & leg stretch",
    "Stand in a short staggered stance, one foot back with its heel grounded and toes facing forward. Bend the front knee slightly until you feel a mild stretch in the back calf, without bouncing. Hold comfortably and breathe; switch sides around halfway through the minute. Skip the stretch if balance or comfort is uncertain.",
  ],
  [
    "Chest & shoulder release",
    "Stand tall with knees soft and shoulders relaxed. Open your arms gently to the sides, keeping hands below shoulder height and palms forward; keep ribs relaxed rather than arching your back. Return arms to your sides between easy holds and finish with slow breaths.",
  ],
];

export function cycleInfo(now = new Date()) {
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const anchor = Date.parse(`${CYCLE_START}T00:00:00Z`);
  const elapsedDays = Math.floor((today - anchor) / DAY_MS);
  const index = ((elapsedDays % 15) + 15) % 15;
  const cycleStart = new Date(today - index * DAY_MS);
  return {
    day: index + 1,
    cycleStart,
    nextCycle: new Date(cycleStart.getTime() + 15 * DAY_MS),
    today: new Date(today),
  };
}

export function pairAssignments(size: number, intervalIndex = 0) {
  if (!GROUP_SIZES.includes(size))
    throw new RangeError("Group size must be 4, 6, 8, or 10.");
  return Array.from({ length: size / 2 }, (_, i) => ({
    pair: i + 1,
    people: [i * 2 + 1, i * 2 + 2],
    station: ((i + intervalIndex) % 4) + 1,
  }));
}

export function timeline(sessionData: GroupSession) {
  const phases: WorkoutPhase[] = [];
  warmup.forEach(([name, cue]) =>
    phases.push({ kind: "Warm-up", name, cue, seconds: 60 })
  );
  for (let round = 1; round <= sessionData.rounds; round += 1) {
    for (let station = 0; station < 4; station += 1) {
      const intervalIndex = (round - 1) * 4 + station;
      phases.push({
        kind: "Work",
        name: "Move together",
        seconds: sessionData.work,
        round,
        intervalIndex,
      });
      phases.push({
        kind: "Rest / rotate",
        name: "Breathe, then move to your next exercise",
        seconds: sessionData.rest,
        round,
        intervalIndex,
      });
    }
  }
  cooldown.forEach(([name, cue]) =>
    phases.push({ kind: "Cooldown", name, cue, seconds: 60 })
  );
  return phases;
}

export function phaseAt(phases: WorkoutPhase[], elapsedSeconds: number) {
  let cursor = 0;
  for (let index = 0; index < phases.length; index += 1) {
    const phase = phases[index];
    if (elapsedSeconds < cursor + phase.seconds)
      return {
        ...phase,
        index,
        remaining: Math.ceil(cursor + phase.seconds - elapsedSeconds),
        startsAt: cursor,
      };
    cursor += phase.seconds;
  }
  return {
    kind: "Finished",
    name: "Session complete",
    seconds: 0,
    cue: "",
    round: undefined,
    intervalIndex: undefined,
    index: phases.length,
    remaining: 0,
    startsAt: cursor,
  };
}

export function durationSeconds(sessionData: GroupSession) {
  return timeline(sessionData).reduce(
    (total, phase) => total + phase.seconds,
    0
  );
}
