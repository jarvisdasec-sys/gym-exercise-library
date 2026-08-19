export type WodExercise = {
  name: string;
  prescription: string;
  rest?: string;
  modification?: string;
};

export type DailyWod = {
  title: string;
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
