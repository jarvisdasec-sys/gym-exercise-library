export const ROUTES = {
  home: "/",
  exercises: "/",
  workouts: "/workouts",
  wod: "/wod",
  cardio: "/cardio",
  mobility: "/mobility",
  nutrition: "/nutrition",
  calculators: "/calculators",
  education: "/learn",
  saved: "/saved",
  account: "/account",
  stickers: "/stickers",
  workoutTools: "/workouts/tools",
  workoutBuilder: "/workouts/builder",
  mealBuilder: "/nutrition/builder",
  mealPrep: "/nutrition/meal-prep",
  tracker: "/nutrition/tracker",
} as const;

export const LEGACY_ROUTE_REDIRECTS = {
  "/exercises": ROUTES.exercises,
  "/physical-fitness/running": ROUTES.cardio,
  "/fitness/warm-up-and-cooldown": ROUTES.mobility,
  "/fitness-calculators/bmi": "/calculators#bmi",
  "/fitness-calculators": ROUTES.calculators,
  "/fitness": ROUTES.education,
  "/workouts/today": ROUTES.wod,
  "/resources": ROUTES.education,
  "/app": ROUTES.home,
  "/downloads": ROUTES.stickers,
  "/nutrition/foods": ROUTES.nutrition,
  "/nutrition/education": ROUTES.education,
  "/nutrition/grocery-planner": ROUTES.mealPrep,
  "/nutrition/search": ROUTES.nutrition,
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
