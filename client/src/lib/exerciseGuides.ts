import type { CategoryId, Exercise } from "@/lib/exercises";

export type ExerciseGuide = {
  setup: string[];
  execution: string[];
  cues: string[];
  mistakes: string[];
  breathing: string;
  tempo: string;
  easier: string;
  harder: string;
  safety: string;
};

const categoryDefaults: Record<CategoryId, Omit<ExerciseGuide, "setup" | "execution" | "cues" | "mistakes" | "easier" | "harder">> = {
  chest: { breathing: "Inhale before the lowering phase; exhale as you press or bring the hands together.", tempo: "Use a controlled 2–3 second lowering phase and keep the working range honest.", safety: "Stop if shoulder position or control changes. Use a load that allows a repeatable range." },
  back: { breathing: "Brace before each repetition, inhale on the return, and exhale as you pull.", tempo: "Pause briefly at the contracted position; do not turn the return into a drop.", safety: "Keep the spine and ribcage controlled. Reduce load when the lower back starts doing the work." },
  legs: { breathing: "Brace before the effort, inhale on the controlled descent, and exhale through the hardest part.", tempo: "Own the descent and keep the bottom position stable before driving up.", safety: "Keep knees and feet tracking consistently. Stop if pain—not effort—changes the movement." },
  shoulders: { breathing: "Keep the ribs stacked, inhale on the return, and exhale through the press or raise.", tempo: "Move smoothly with no swinging or bounce from the lower body.", safety: "Use a pain-free range and avoid forcing overhead positions that change your posture." },
  arms: { breathing: "Keep the trunk quiet, inhale on the lowering phase, and exhale as the elbow extends or flexes.", tempo: "Use a full controlled range; the last few inches should not require momentum.", safety: "Keep the elbow position consistent and stop short of painful joint compression." },
  core: { breathing: "Brace without holding your breath indefinitely; exhale during the hardest part while keeping the trunk organized.", tempo: "Slow down until you can keep the pelvis and ribcage in the intended position.", safety: "Choose the version that lets you control the spine. Quality beats duration or load." },
};

const overrides: Record<string, ExerciseGuide> = {
  "barbell-bent-over-row": {
    setup: [
      "Stand with feet about hip-width apart and the bar over the middle of the foot.",
      "Hinge at the hips with soft knees until the torso is roughly 30–45 degrees to the floor.",
      "Brace the trunk, keep the neck long, and grip the bar just outside the legs.",
    ],
    execution: [
      "Pull the bar toward the lower ribs while keeping the elbows close to the body.",
      "Pause when the bar reaches the torso without shrugging or opening the ribs.",
      "Lower the bar under control until the elbows straighten without losing the hinge.",
    ],
    cues: ["Push the hips back.", "Keep the bar close.", "Drive elbows toward the back pockets.", "Own the return."],
    mistakes: ["Rounding the lower back to reach the floor.", "Jerking the bar with the hips.", "Pulling toward the chest and shrugging.", "Letting the bar drift away from the legs."],
    breathing: "Brace before each pull; exhale as the bar reaches the ribs and inhale on the controlled return.",
    tempo: "1 second up, 1 second pause, 2 seconds down.",
    easier: "Use a chest-supported row or reduce the load until the hinge stays fixed.",
    harder: "Add a strict pause at the ribs or use a Pendlay-row variation only when the setup is repeatable.",
    safety: "Keep the load light enough to maintain a neutral spine and fixed hip hinge. Stop if back position changes or pain appears.",
  },
};

export function getExerciseGuide(exercise: Exercise): ExerciseGuide {
  const override = overrides[exercise.slug];
  if (override) return override;

  const base = categoryDefaults[exercise.category];
  return {
    ...base,
    setup: [
      `Set up the ${exercise.equipment.toLowerCase()} so you can move without reaching or shifting to find position.`,
      `Stack the joints around the ${exercise.primary.toLowerCase()} target and brace before the first repetition.`,
      "Start with a load and range that you can repeat without compensating.",
    ],
    execution: [
      `Move through a controlled range while keeping the ${exercise.primary.toLowerCase()} as the main target.`,
      "Pause briefly at the strongest position instead of bouncing through it.",
      "Return to the start with the same control you used to begin.",
    ],
    cues: ["Stay stacked.", "Move with intent.", "Control the return.", "Stop one clean rep before form breaks."],
    mistakes: ["Adding load before owning the range.", "Using momentum to finish a repetition.", "Letting posture change as fatigue rises.", "Rushing the eccentric phase."],
    easier: "Reduce load, shorten the range slightly, or choose a supported variation.",
    harder: "Add a pause, a slower eccentric, or a small amount of load only after every repetition is consistent.",
  };
}
