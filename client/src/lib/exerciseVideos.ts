export type ExerciseVideo = {
  id: string;
  title: string;
  sourceLabel: string;
  focus: string;
  safety: string;
};

/** Curated demonstrations are kept separate from exercise data so links can be reviewed without changing the movement catalog. */
export const EXERCISE_VIDEOS: Record<string, ExerciseVideo> = {
  "barbell-bent-over-row": {
    id: "vT2GjY_Umpw",
    title: "Bent Over Barbell Row",
    sourceLabel: "YouTube demonstration",
    focus: "Hinge first, keep the trunk stable, and pull the bar toward the lower ribs.",
    safety: "Use a load you can control without rounding or jerking. Stop if you feel sharp pain.",
  },
  "barbell-back-squat": {
    id: "gcNh17Ckjgg",
    title: "How to Properly Squat for Growth",
    sourceLabel: "YouTube demonstration",
    focus: "Build a repeatable stance, brace before the descent, and keep the knees tracking with the feet.",
    safety: "Depth and load should match your controlled range; do not force a painful position.",
  },
  "barbell-bench-press": {
    id: "4Y2ZdHCOXok",
    title: "How to Properly Bench Press",
    sourceLabel: "YouTube demonstration",
    focus: "Set the shoulders, create a stable base, and lower the bar with a consistent touch point.",
    safety: "Use safeties or a competent spotter for challenging loads. Never sacrifice control for weight.",
  },
};

export function getExerciseVideo(slug: string) {
  return EXERCISE_VIDEOS[slug];
}
