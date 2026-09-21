export type WodExercise = {
  name: string;
  prescription: string;
  rest?: string;
  modification?: string;
};

export type DailyWod = {
  title: string;
  instructions?: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  equipment: string[];
  warmUp: string[];
  exercises: WodExercise[];
  coolDown: string[];
  hydration: string;
  preWorkout: string;
  postWorkout: string;
  safety: string;
};

export const DAILY_WODS: DailyWod[] = [
  {
    title: "Engine Room",
    category: "Conditioning · Full Body",
    difficulty: "Intermediate",
    duration: "28–35 min",
    equipment: ["Pull-up bar", "Running route or treadmill"],
    warmUp: ["3 min easy jog", "10 air squats", "8 reverse lunges per side", "5 walkout push-ups"],
    exercises: [
      { name: "Run", prescription: "4 × 400 m", rest: "Move directly to burpees" },
      { name: "Burpees", prescription: "4 × 10 reps", rest: "30 sec" },
      { name: "Pull-ups", prescription: "4 × 5–8 reps", rest: "Scale before form breaks", modification: "Use band-assisted pull-ups or body rows" },
      { name: "Air squats", prescription: "4 × 20 reps", rest: "60 sec after each round" },
    ],
    coolDown: ["3–5 min walk", "Calf stretch · 30 sec per side", "Hip-flexor stretch · 30 sec per side"],
    hydration: "Drink water before starting and sip between rounds. Add electrolytes when training in heat or after heavy sweating.",
    preWorkout: "1–3 hours before: pair easy-to-digest carbohydrate with protein, such as oatmeal with yogurt or a banana with nut butter.",
    postWorkout: "Within your next meal: combine protein, carbohydrate, and fluids—such as chicken with rice and vegetables.",
    safety: "Keep the run controlled enough to preserve movement quality. Stop for chest pain, dizziness, or unusual shortness of breath.",
  },
  {
    title: "Ruck Standard",
    category: "Ruck · Strength Endurance",
    difficulty: "Intermediate",
    duration: "35–45 min",
    equipment: ["Ruck or weighted backpack", "Outdoor route or treadmill"],
    warmUp: ["5 min brisk unweighted walk", "10 glute bridges", "10 step-back lunges per side", "10 calf raises"],
    exercises: [
      { name: "Ruck walk / run", prescription: "4 × 800 m", rest: "90 sec", modification: "Walk every interval and reduce load" },
      { name: "Ruck front squat", prescription: "4 × 12 reps", rest: "30 sec" },
      { name: "Walking lunges", prescription: "4 × 10 per side", rest: "60 sec after each round" },
    ],
    coolDown: ["5 min easy walk without load", "Quad stretch · 30 sec per side", "Slow nasal breathing · 2 min"],
    hydration: "Carry water and drink steadily. Electrolytes may help during longer sessions, hot conditions, or heavy sweating.",
    preWorkout: "Eat a carbohydrate-forward meal 2–3 hours before training and avoid testing unfamiliar foods immediately before the ruck.",
    postWorkout: "Replace fluids, then eat a meal with protein and carbohydrate to support recovery and replenish energy.",
    safety: "Use a load you can carry with upright posture. Walk instead of run if impact or load changes your gait.",
  },
  {
    title: "Stair Pressure",
    category: "Intervals · Lower Body",
    difficulty: "Advanced",
    duration: "24–30 min",
    equipment: ["StairMaster or safe staircase"],
    warmUp: ["4 min easy stair pace", "10 bodyweight good mornings", "10 lateral lunges per side", "20 sec high-knee march"],
    exercises: [
      { name: "Stair climb", prescription: "6 × 90 sec hard", rest: "60 sec easy pace" },
      { name: "Reverse lunges", prescription: "6 × 8 per side", rest: "Move directly to squats", modification: "Hold a rail lightly or reduce range" },
      { name: "Squat jumps", prescription: "6 × 8 reps", rest: "60 sec before the next round", modification: "Use fast air squats without jumping" },
    ],
    coolDown: ["4 min easy walk", "Standing quad stretch · 30 sec per side", "Box breathing · 4 cycles"],
    hydration: "Begin hydrated and keep water nearby. Replace sodium with an electrolyte drink if the session produces heavy sweat.",
    preWorkout: "Choose a light carbohydrate snack 30–60 minutes before if needed, such as fruit or toast.",
    postWorkout: "Pair 20–40 g of protein with a carbohydrate source at your next meal, adjusted for your needs and appetite.",
    safety: "Do not lean bodyweight onto the StairMaster rails. Step down from jump squats when landing quality declines.",
  },
  {
    title: "Tenacious Ten",
    category: "Bodyweight · Conditioning",
    difficulty: "Beginner",
    duration: "20–28 min",
    equipment: ["Open floor", "Running route or treadmill"],
    warmUp: ["3 min brisk walk", "10 arm circles each direction", "10 alternating lunges", "10 slow air squats"],
    exercises: [
      { name: "Run / brisk walk", prescription: "10 × 100 m", rest: "Move directly to squats" },
      { name: "Air squats", prescription: "10 × 10 reps", rest: "Move directly to incline push-ups" },
      { name: "Incline push-ups", prescription: "10 × 5 reps", rest: "30–45 sec after each round", modification: "Use a higher, stable surface" },
    ],
    coolDown: ["3 min easy walk", "Chest stretch · 30 sec per side", "Hamstring stretch · 30 sec per side"],
    hydration: "Drink to thirst before and during the session. Water is generally sufficient for this shorter workout in moderate conditions.",
    preWorkout: "A normal balanced meal 2–3 hours beforehand is usually enough; use a small fruit snack closer to training if hungry.",
    postWorkout: "Resume normal balanced eating with protein, carbohydrate, produce, and water.",
    safety: "Keep every round repeatable. Slow to a walk and elevate the push-up surface instead of sacrificing form.",
  },
  {
    title: "Pull & Pursue",
    category: "Hybrid · Pull",
    difficulty: "Advanced",
    duration: "30–38 min",
    equipment: ["Pull-up bar", "Kettlebell or dumbbell", "Running route"],
    warmUp: ["400 m easy jog", "8 scapular pull-ups", "10 light deadlifts", "8 alternating lunges per side"],
    exercises: [
      { name: "Run", prescription: "5 × 300 m", rest: "Move directly to pull-ups" },
      { name: "Pull-ups", prescription: "5 × 6 reps", rest: "30 sec", modification: "Use band assistance or body rows" },
      { name: "Kettlebell swings", prescription: "5 × 15 reps", rest: "30 sec" },
      { name: "Burpees", prescription: "5 × 8 reps", rest: "75 sec after each round", modification: "Step back and remove the jump" },
    ],
    coolDown: ["4 min walk", "Lat stretch · 30 sec per side", "Hip-hinge stretch · 30 sec"],
    hydration: "Sip water between rounds rather than taking large amounts at once. Consider electrolytes for heat or high sweat loss.",
    preWorkout: "Use a familiar meal with carbohydrate and moderate protein 1–3 hours before this higher-intensity session.",
    postWorkout: "Rehydrate and include protein plus carbohydrate in the next meal to support muscle repair and glycogen replacement.",
    safety: "Use a swing load you can control without rounding the back. End pull-up sets before reps become uncontrolled.",
  },
  {
    title: "Foundation Forge",
    category: "Strength · Full Body",
    difficulty: "Beginner",
    duration: "25–35 min",
    equipment: ["Dumbbells or securely packed backpack", "Open floor"],
    instructions: "After warming up, complete all 3 sets of each exercise before moving to the next. Use a load that leaves 2–3 comfortable reps in reserve. Finish with the cool-down.",
    warmUp: ["3 min easy marching", "8 bodyweight squats", "8 unloaded hip hinges"],
    exercises: [
      { name: "Goblet squat", prescription: "3 × 8–10 reps", rest: "60–90 sec", modification: "Use bodyweight and a comfortable depth" },
      { name: "Bent-over row", prescription: "3 × 10 reps", rest: "60–90 sec", modification: "Reduce load and keep the torso steady" },
      { name: "Floor press", prescription: "3 × 8–10 reps", rest: "60–90 sec", modification: "Use wall push-ups if using a backpack" },
      { name: "Dead bug", prescription: "3 × 6 per side", rest: "45 sec", modification: "Move just the legs, one at a time" },
    ],
    coolDown: ["2 min easy walking", "Chest stretch · 20 sec per side", "Gentle hip stretch · 20 sec per side"],
    hydration: "Keep water available and sip during rest periods.",
    preWorkout: "Choose a familiar light snack if hungry before training.",
    postWorkout: "Include protein and carbohydrate in your next regular meal.",
    safety: "Keep each repetition controlled. Reduce the load if you cannot maintain a steady posture.",
  },
  {
    title: "Reset & Rebuild",
    category: "Recovery · Mobility",
    difficulty: "Beginner",
    duration: "15–20 min",
    equipment: ["Open floor", "Optional mat"],
    instructions: "Move through the list twice at an easy pace, resting as needed between movements and 30 seconds between rounds. Finish feeling refreshed, not exhausted, then cool down.",
    warmUp: ["3 min relaxed walking", "5 gentle shoulder circles each way"],
    exercises: [
      { name: "Cat-cow", prescription: "2 × 6 slow reps", rest: "15 sec", modification: "Perform gentle seated pelvic tilts" },
      { name: "Open-book rotation", prescription: "2 × 5 per side", rest: "15 sec", modification: "Use a smaller comfortable range" },
      { name: "Half-kneeling hip-flexor stretch", prescription: "2 × 20 sec per side", rest: "15 sec", modification: "Use a standing split stance" },
      { name: "Ankle rocks", prescription: "2 × 8 per side", rest: "30 sec after each round", modification: "Hold a wall for balance" },
    ],
    coolDown: ["2 min relaxed breathing", "2 min easy walking"],
    hydration: "Drink water to thirst throughout the day.",
    preWorkout: "No special fueling is needed for this gentle session; follow your normal meal routine.",
    postWorkout: "Continue your usual balanced meals and fluids.",
    safety: "Never force a stretch or push into joint pain. Keep breathing naturally.",
  },
  {
    title: "Upper Deck",
    category: "Strength Endurance · Upper Body",
    difficulty: "Beginner",
    duration: "22–30 min",
    equipment: ["Wall or sturdy counter", "Light dumbbell or securely packed backpack"],
    instructions: "Complete 3 rounds in the listed order after the warm-up. Rest 30 seconds between exercises and 60 seconds between rounds. Use 2 rounds if starting out, then cool down.",
    warmUp: ["3 min easy march", "10 shoulder circles each way", "8 wall push-ups"],
    exercises: [
      { name: "Incline push-ups", prescription: "3 × 8–12 reps", rest: "30 sec", modification: "Use a wall to reduce resistance" },
      { name: "Supported one-arm row", prescription: "3 × 10 per side", rest: "30 sec", modification: "Use a lighter load and brace on a sturdy counter" },
      { name: "Wall slides", prescription: "3 × 8 slow reps", rest: "30 sec", modification: "Raise arms only as far as comfortable" },
      { name: "Standing curls", prescription: "3 × 10–12 reps", rest: "60 sec after each round", modification: "Hold a light backpack with both hands" },
    ],
    coolDown: ["2 min relaxed walking", "Gentle chest stretch · 20 sec per side", "Shoulder rolls · 30 sec"],
    hydration: "Keep water close and sip between rounds.",
    preWorkout: "Eat a familiar meal beforehand, allowing time to feel comfortable.",
    postWorkout: "Include a protein source in your next balanced meal.",
    safety: "Use a stable support surface. Stop a set before your shoulders shrug or your back arches excessively.",
  },
  {
    title: "Steady Stride",
    category: "Cardio · Aerobic Endurance",
    difficulty: "Beginner",
    duration: "25–30 min",
    equipment: ["Safe walking route or open indoor space"],
    instructions: "After warming up, alternate 3 minutes of brisk walking with 1 minute easy for 5 rounds. Complete 20 minutes total, then cool down. A comfortable indoor march also works.",
    warmUp: ["3–5 min easy walking", "10 gentle ankle circles per side"],
    exercises: [
      { name: "Brisk walk", prescription: "5 × 3 min", rest: "Follow with the easy walk", modification: "Slow down while keeping a steady rhythm" },
      { name: "Easy walk", prescription: "5 × 1 min", rest: "Continue into the next round", modification: "Pause if needed before continuing" },
    ],
    coolDown: ["3–5 min slow walking", "Calf stretch · 20 sec per side"],
    hydration: "Bring water when conditions or the route call for it.",
    preWorkout: "Your normal meal routine is usually enough; use a small familiar snack if hungry.",
    postWorkout: "Resume normal balanced meals and drink to thirst.",
    safety: "Choose a safe surface and a pace that allows conversation. Slow down in heat or on uneven ground.",
  },
  {
    title: "Core Command",
    category: "Core · Stability",
    difficulty: "Beginner",
    duration: "18–25 min",
    equipment: ["Open floor", "Optional mat"],
    instructions: "Complete 3 controlled rounds after warming up. Rest 20–30 seconds between exercises and 60 seconds after each round. Start with 2 rounds if needed, then cool down.",
    warmUp: ["3 min easy march", "6 gentle cat-cow reps", "8 standing hip hinges"],
    exercises: [
      { name: "Dead bug", prescription: "3 × 6 per side", rest: "20–30 sec", modification: "Keep arms down and tap one heel at a time" },
      { name: "Bird dog", prescription: "3 × 6 per side with 2-sec hold", rest: "20–30 sec", modification: "Move one arm or leg at a time" },
      { name: "Side plank", prescription: "3 × 15–20 sec per side", rest: "20–30 sec", modification: "Keep knees bent on the floor" },
      { name: "Glute bridge", prescription: "3 × 10 reps", rest: "60 sec after each round", modification: "Lift through a smaller comfortable range" },
    ],
    coolDown: ["2 min relaxed breathing", "Gentle seated rotation · 20 sec per side"],
    hydration: "Sip water during breaks as needed.",
    preWorkout: "Avoid a large meal immediately before floor work if it causes discomfort.",
    postWorkout: "Return to your usual balanced meal routine.",
    safety: "Breathe throughout each hold. Shorten the hold or range if your back starts to arch or hurt.",
  },
  {
    title: "Ground Force",
    category: "Strength Endurance · Lower Body",
    difficulty: "Beginner",
    duration: "25–32 min",
    equipment: ["Sturdy chair placed against a wall", "Open floor"],
    instructions: "Complete all 3 sets of each movement before the next, resting as listed. Work at a controlled pace after warming up and finish with the cool-down.",
    warmUp: ["4 min easy walking", "8 shallow squats", "10 ankle rocks per side"],
    exercises: [
      { name: "Chair sit-to-stand", prescription: "3 × 10–12 reps", rest: "60 sec", modification: "Use a higher stable seat or light hand assistance" },
      { name: "Reverse lunges", prescription: "3 × 6–8 per side", rest: "60–90 sec", modification: "Hold a wall and use a shallow split squat" },
      { name: "Glute bridge", prescription: "3 × 12 reps", rest: "60 sec", modification: "Reduce the lift height" },
      { name: "Standing calf raises", prescription: "3 × 12–15 reps", rest: "45 sec", modification: "Hold a wall for balance" },
    ],
    coolDown: ["3 min easy walking", "Calf stretch · 20 sec per side", "Gentle quad stretch · 20 sec per side"],
    hydration: "Keep water nearby and sip between sets.",
    preWorkout: "Choose familiar foods and allow your meal to settle before training.",
    postWorkout: "Include carbohydrate, protein, and produce in your next meal.",
    safety: "Keep the chair secured and knees moving comfortably in line with your feet. Use a pain-free range.",
  },
  {
    title: "Bodyweight Battalion",
    category: "Bodyweight · Full Body",
    difficulty: "Beginner",
    duration: "20–28 min",
    equipment: ["Wall or sturdy counter", "Open floor"],
    instructions: "Complete 3 rounds in order. Rest 30 seconds between exercises and 60 seconds between rounds. Begin with 2 rounds if needed; finish with the cool-down.",
    warmUp: ["3 min easy march", "8 arm circles each way", "8 shallow squats"],
    exercises: [
      { name: "Bodyweight squat", prescription: "3 × 10 reps", rest: "30 sec", modification: "Reduce depth or use a chair for support" },
      { name: "Incline push-ups", prescription: "3 × 8 reps", rest: "30 sec", modification: "Use wall push-ups" },
      { name: "Standing alternating knee drive", prescription: "3 × 30 sec", rest: "30 sec", modification: "March slowly with wall support" },
      { name: "Bird dog", prescription: "3 × 6 per side", rest: "60 sec after each round", modification: "Move only one limb at a time" },
    ],
    coolDown: ["3 min easy walking", "Gentle chest stretch · 20 sec per side"],
    hydration: "Sip water during the longer breaks.",
    preWorkout: "A light familiar snack is an option if hungry before starting.",
    postWorkout: "Eat your next regular balanced meal and replace fluids to thirst.",
    safety: "Use controlled repetitions and stable surfaces. Slow down whenever technique becomes difficult to maintain.",
  },
  {
    title: "Pulse Patrol",
    category: "Conditioning · Low Impact",
    difficulty: "Beginner",
    duration: "20–25 min",
    equipment: ["Open floor", "Timer"],
    instructions: "After warming up, complete 4 rounds of the 3 movements. Work 40 seconds and recover 20 seconds at each station; rest an extra 60 seconds after rounds 1–3. Finish with the cool-down.",
    warmUp: ["3 min easy march", "10 shoulder circles", "10 gentle side steps"],
    exercises: [
      { name: "Step jacks", prescription: "4 × 40 sec", rest: "20 sec", modification: "Keep arms below shoulder height and step slowly" },
      { name: "Shadow boxing", prescription: "4 × 40 sec", rest: "20 sec", modification: "Use gentle punches from a stable stance" },
      { name: "Brisk march", prescription: "4 × 40 sec", rest: "20 sec, plus 60 sec between rounds", modification: "Lower knee height or use a seated march" },
    ],
    coolDown: ["3 min slow walking", "Relaxed breathing · 1 min"],
    hydration: "Keep water available and sip between rounds.",
    preWorkout: "Use familiar foods and avoid starting uncomfortably full.",
    postWorkout: "Follow your usual balanced meal routine and drink to thirst.",
    safety: "Keep feet under control and punches relaxed; do not lock the elbows. Slow down if you cannot speak a short sentence.",
  },
  {
    title: "Restore the Frame",
    category: "Recovery · Full Body Mobility",
    difficulty: "Beginner",
    duration: "18–25 min",
    equipment: ["Wall", "Sturdy chair"],
    instructions: "After an easy warm-up, perform the sequence twice without rushing. Rest as needed and 30 seconds between rounds. Keep every movement gentle, then finish with an easy walk.",
    warmUp: ["4 min relaxed walking", "5 gentle shoulder rolls each way"],
    exercises: [
      { name: "Supported hip hinge", prescription: "2 × 8 slow reps", rest: "20 sec", modification: "Use a smaller range with hands on a sturdy chair" },
      { name: "Seated thoracic rotation", prescription: "2 × 5 per side", rest: "20 sec", modification: "Turn only as far as comfortable without pulling" },
      { name: "Wall calf stretch", prescription: "2 × 20 sec per side", rest: "20 sec", modification: "Shorten the stance" },
      { name: "Wall chest stretch", prescription: "2 × 20 sec per side", rest: "30 sec after each round", modification: "Lower the arm and reduce the turn" },
    ],
    coolDown: ["3–5 min easy walking", "1 min relaxed breathing"],
    hydration: "Drink water to thirst; keep your normal hydration routine.",
    preWorkout: "No special snack is required for this easy session.",
    postWorkout: "Continue regular balanced meals and fluids.",
    safety: "Aim for gentle tension, never pain. Avoid bouncing or forcing the range of a stretch.",
  },
];

export function getWodForDate(date: Date = new Date()): DailyWod {
  const localDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayIndex = Math.floor(localDay / 86_400_000);
  return DAILY_WODS[dayIndex % DAILY_WODS.length];
}

export function formatWodDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
