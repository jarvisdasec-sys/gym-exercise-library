/**
 * BTB Nutrition — assembled meals and meal prep plans.
 *
 * Every ingredient references a real slug in lib/foods.ts, so macro totals are
 * COMPUTED from the USDA-sourced database rather than typed in by hand. That
 * means the numbers on screen can never drift from the food data.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"): coach-direct, imperative copy.
 */

import { FOODS, scale, type Food } from "@/lib/foods";

export type MealSlot =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snack"
  | "Post-Workout";

export interface MealItem {
  /** must match a slug in FOODS */
  slug: string;
  /** grams of this food in the meal */
  grams: number;
}

export interface Meal {
  slug: string;
  name: string;
  slot: MealSlot;
  /** one-line description of what it is */
  summary: string;
  /** minutes of active work */
  prepTime: string;
  items: MealItem[];
  /** numbered method steps */
  steps: string[];
  /** goal this meal suits, e.g. "High protein, low fat" */
  tags: string[];
}

export const MEALS: Meal[] = [
  /* ── BREAKFAST ────────────────────────────────────────────────── */
  {
    slug: "overnight-oats",
    name: "Overnight Oats",
    slot: "Breakfast",
    summary: "Assembled the night before. Zero effort in the morning.",
    prepTime: "5 min",
    tags: ["Make ahead", "High fibre"],
    items: [
      { slug: "rolled-oats", grams: 60 },
      { slug: "greek-yogurt", grams: 170 },
      { slug: "blueberries", grams: 100 },
      { slug: "chia-seeds", grams: 12 },
      { slug: "honey", grams: 10 },
    ],
    steps: [
      "Stir the oats, yogurt and chia together in a jar.",
      "Add milk or water until everything is just covered.",
      "Fold in the berries and honey.",
      "Lid on, fridge overnight. Eat cold straight from the jar.",
    ],
  },
  {
    slug: "egg-scramble",
    name: "Big Egg Scramble",
    slot: "Breakfast",
    summary: "Whole eggs plus whites for protein without the fat load.",
    prepTime: "10 min",
    tags: ["High protein", "Quick"],
    items: [
      { slug: "whole-egg", grams: 100 },
      { slug: "egg-white", grams: 132 },
      { slug: "spinach", grams: 60 },
      { slug: "mushrooms", grams: 70 },
      { slug: "whole-wheat-bread", grams: 56 },
      { slug: "olive-oil", grams: 7 },
    ],
    steps: [
      "Dry-fry the mushrooms first until the water cooks off.",
      "Add oil, then the spinach, and wilt for 30 seconds.",
      "Pour in the beaten eggs and whites on a low heat.",
      "Pull the pan off while they still look slightly underdone.",
      "Serve on toast.",
    ],
  },
  {
    slug: "protein-oats",
    name: "Protein Oats",
    slot: "Breakfast",
    summary: "Hot oats with a scoop stirred in after cooking.",
    prepTime: "6 min",
    tags: ["Pre-workout", "Quick"],
    items: [
      { slug: "rolled-oats", grams: 60 },
      { slug: "whey-protein-isolate", grams: 30 },
      { slug: "banana", grams: 118 },
      { slug: "peanut-butter", grams: 16 },
    ],
    steps: [
      "Cook the oats with water or milk until thick.",
      "Take the pan off the heat before adding the protein or it will clump.",
      "Stir the scoop through, then top with sliced banana and peanut butter.",
    ],
  },

  /* ── LUNCH ────────────────────────────────────────────────────── */
  {
    slug: "chicken-rice-bowl",
    name: "Chicken & Rice Bowl",
    slot: "Lunch",
    summary: "The default bodybuilding meal. Scales up for the whole week.",
    prepTime: "25 min",
    tags: ["Meal prep", "High protein"],
    items: [
      { slug: "chicken-breast", grams: 200 },
      { slug: "white-rice", grams: 200 },
      { slug: "broccoli", grams: 150 },
      { slug: "bell-pepper", grams: 100 },
      { slug: "olive-oil", grams: 7 },
      { slug: "sriracha-hot-sauce", grams: 10 },
    ],
    steps: [
      "Get the rice on first — everything else is faster.",
      "Season the chicken hard and sear 5–6 minutes per side.",
      "Roast or steam the broccoli and pepper until just tender.",
      "Rest the chicken 5 minutes before slicing, then build the bowl.",
      "Finish with hot sauce, not mayo.",
    ],
  },
  {
    slug: "tuna-wrap",
    name: "Tuna Wraps",
    slot: "Lunch",
    summary: "No cooking at all. Built from a tin and a bag of salad.",
    prepTime: "5 min",
    tags: ["No cook", "Budget"],
    items: [
      { slug: "canned-tuna-in-water", grams: 142 },
      { slug: "corn-tortilla", grams: 104 },
      { slug: "greek-yogurt", grams: 60 },
      { slug: "yellow-mustard", grams: 10 },
      { slug: "spinach", grams: 40 },
      { slug: "tomato", grams: 60 },
    ],
    steps: [
      "Drain the tuna properly — press it against the lid.",
      "Mix with Greek yogurt and mustard instead of mayo.",
      "Warm the tortillas for 20 seconds so they do not crack.",
      "Fill, fold, eat.",
    ],
  },
  {
    slug: "beef-burrito-bowl",
    name: "Beef Burrito Bowl",
    slot: "Lunch",
    summary: "Lean beef, beans and rice. Reheats without going rubbery.",
    prepTime: "20 min",
    tags: ["Meal prep", "High protein"],
    items: [
      { slug: "lean-ground-beef-93-7", grams: 150 },
      { slug: "black-beans", grams: 130 },
      { slug: "brown-rice", grams: 180 },
      { slug: "salsa", grams: 60 },
      { slug: "avocado", grams: 50 },
      { slug: "onion", grams: 55 },
    ],
    steps: [
      "Brown the onion, then the beef, breaking it up as it cooks.",
      "Drain off the rendered fat if you are watching calories.",
      "Stir in the rinsed beans and half the salsa to keep it moist.",
      "Layer over rice. Add the avocado only when you eat it, not before.",
    ],
  },
  {
    slug: "lentil-power-bowl",
    name: "Lentil Power Bowl",
    slot: "Lunch",
    summary: "Plant-based, high fibre, and costs almost nothing.",
    prepTime: "20 min",
    tags: ["Plant based", "Budget", "High fibre"],
    items: [
      { slug: "lentils", grams: 200 },
      { slug: "quinoa", grams: 150 },
      { slug: "kale", grams: 67 },
      { slug: "carrots", grams: 60 },
      { slug: "olive-oil", grams: 10 },
      { slug: "balsamic-vinegar", grams: 16 },
    ],
    steps: [
      "Cook the quinoa and lentils together if the timings allow.",
      "Massage the raw kale with the oil and a pinch of salt to soften it.",
      "Grate the carrot in raw for crunch.",
      "Dress with balsamic while the grains are still warm.",
    ],
  },

  /* ── DINNER ───────────────────────────────────────────────────── */
  {
    slug: "salmon-sweet-potato",
    name: "Salmon & Sweet Potato",
    slot: "Dinner",
    summary: "One tray, one oven, 25 minutes. Omega-3s included.",
    prepTime: "30 min",
    tags: ["One tray", "Omega-3"],
    items: [
      { slug: "salmon", grams: 170 },
      { slug: "sweet-potato", grams: 250 },
      { slug: "asparagus", grams: 120 },
      { slug: "olive-oil", grams: 10 },
    ],
    steps: [
      "Cube the sweet potato and give it a 15-minute head start at 200°C.",
      "Add the salmon and asparagus to the same tray.",
      "Back in for 12–14 minutes. The salmon should just flake.",
      "Do not overcook the fish — pull it while the centre is barely opaque.",
    ],
  },
  {
    slug: "steak-and-potatoes",
    name: "Steak & Potatoes",
    slot: "Dinner",
    summary: "Iron, creatine and carbs. The classic for a reason.",
    prepTime: "35 min",
    tags: ["High protein", "Iron"],
    items: [
      { slug: "sirloin-steak", grams: 200 },
      { slug: "white-potato", grams: 300 },
      { slug: "green-beans", grams: 150 },
      { slug: "butter", grams: 7 },
      { slug: "olive-oil", grams: 7 },
    ],
    steps: [
      "Roast the potatoes for 30 minutes at 210°C so they crisp.",
      "Get the pan properly hot before the steak goes near it.",
      "3–4 minutes per side for medium, then rest it 5 minutes.",
      "Toss the beans in the steak pan to pick up the fond.",
    ],
  },
  {
    slug: "turkey-pasta",
    name: "Turkey Bolognese",
    slot: "Dinner",
    summary: "Big volume, high protein, and it freezes well.",
    prepTime: "30 min",
    tags: ["Freezer friendly", "Family size"],
    items: [
      { slug: "ground-turkey", grams: 200 },
      { slug: "whole-wheat-pasta", grams: 200 },
      { slug: "tomato", grams: 250 },
      { slug: "mushrooms", grams: 100 },
      { slug: "onion", grams: 55 },
      { slug: "olive-oil", grams: 10 },
    ],
    steps: [
      "Soften the onion and mushrooms before the turkey goes in.",
      "Brown the turkey hard — ground poultry needs colour for flavour.",
      "Add chopped tomato and simmer at least 15 minutes.",
      "Save a splash of pasta water to loosen the sauce at the end.",
    ],
  },
  {
    slug: "tofu-stir-fry",
    name: "Tofu Stir Fry",
    slot: "Dinner",
    summary: "Fast, plant-based, and endlessly adaptable to what is in the fridge.",
    prepTime: "20 min",
    tags: ["Plant based", "Quick"],
    items: [
      { slug: "firm-tofu", grams: 200 },
      { slug: "white-rice", grams: 180 },
      { slug: "broccoli", grams: 120 },
      { slug: "bell-pepper", grams: 100 },
      { slug: "soy-sauce", grams: 16 },
      { slug: "coconut-oil", grams: 10 },
    ],
    steps: [
      "Press the tofu between paper towels for 10 minutes first. Do not skip this.",
      "Cube it and fry undisturbed until each side is golden.",
      "Remove the tofu, cook the vegetables hot and fast, then return it.",
      "Soy sauce goes in at the very end, off the heat.",
    ],
  },
  {
    slug: "shrimp-couscous",
    name: "Shrimp & Couscous",
    slot: "Dinner",
    summary: "On the table in 12 minutes. The fastest real meal here.",
    prepTime: "12 min",
    tags: ["Quick", "Lean"],
    items: [
      { slug: "shrimp", grams: 200 },
      { slug: "couscous", grams: 160 },
      { slug: "zucchini", grams: 150 },
      { slug: "tomato", grams: 100 },
      { slug: "olive-oil", grams: 10 },
    ],
    steps: [
      "Pour boiling water over the couscous, cover, and leave it alone.",
      "Shrimp need 90 seconds a side. They are done the moment they curl.",
      "Char the zucchini in the same pan.",
      "Fluff the couscous with a fork and combine.",
    ],
  },

  /* ── SNACK / POST-WORKOUT ─────────────────────────────────────── */
  {
    slug: "post-workout-shake",
    name: "Post-Workout Shake",
    slot: "Post-Workout",
    summary: "Protein and fast carbs when you cannot face a meal yet.",
    prepTime: "2 min",
    tags: ["Post-workout", "Quick"],
    items: [
      { slug: "whey-protein-isolate", grams: 30 },
      { slug: "banana", grams: 118 },
      { slug: "skim-milk", grams: 245 },
      { slug: "rolled-oats", grams: 30 },
    ],
    steps: [
      "Liquid into the blender first, powder last, or it cakes on the bottom.",
      "Blend 30 seconds.",
      "Drink it within an hour of finishing. Then eat a real meal.",
    ],
  },
  {
    slug: "greek-yogurt-bowl",
    name: "Yogurt & Berry Bowl",
    slot: "Snack",
    summary: "High protein snack that takes 60 seconds to build.",
    prepTime: "2 min",
    tags: ["High protein", "No cook"],
    items: [
      { slug: "greek-yogurt", grams: 200 },
      { slug: "raspberries", grams: 100 },
      { slug: "almonds", grams: 20 },
      { slug: "honey", grams: 10 },
    ],
    steps: [
      "Buy plain yogurt and sweeten it yourself — flavoured tubs hide sugar.",
      "Berries and nuts on top, honey last.",
    ],
  },
  {
    slug: "cottage-cheese-plate",
    name: "Cottage Cheese Plate",
    slot: "Snack",
    summary: "Slow-digesting casein. The best option before bed.",
    prepTime: "3 min",
    tags: ["Before bed", "High protein"],
    items: [
      { slug: "cottage-cheese", grams: 226 },
      { slug: "pineapple", grams: 100 },
      { slug: "walnuts", grams: 15 },
    ],
    steps: [
      "Cottage cheese in the bowl, fruit and nuts on top.",
      "Black pepper on it if you prefer savoury. Works either way.",
    ],
  },
  {
    slug: "hummus-veg-plate",
    name: "Hummus & Veg Plate",
    slot: "Snack",
    summary: "Fibre and volume for very few calories.",
    prepTime: "5 min",
    tags: ["No cook", "High fibre", "Plant based"],
    items: [
      { slug: "hummus", grams: 60 },
      { slug: "carrots", grams: 120 },
      { slug: "cucumber", grams: 150 },
      { slug: "bell-pepper", grams: 119 },
    ],
    steps: [
      "Cut everything at the start of the week and keep it in water in the fridge.",
      "Portion the hummus into a small bowl rather than dipping from the tub.",
    ],
  },
];

/* ── meal prep plans ─────────────────────────────────────────────── */

export interface PrepPlan {
  slug: string;
  name: string;
  /** e.g. "Sunday, 90 minutes" */
  session: string;
  summary: string;
  /** what you end up with */
  yieldNote: string;
  /** meals this plan produces, referencing MEALS slugs */
  meals: string[];
  /** ordered cook-along steps */
  timeline: { time: string; action: string }[];
  /** storage and reheating rules */
  storage: string[];
}

export const PREP_PLANS: PrepPlan[] = [
  {
    slug: "sunday-reset",
    name: "The Sunday Reset",
    session: "Sunday · 90 minutes",
    summary:
      "One session, five lunches and three breakfasts. The single highest-leverage habit for anyone who keeps falling off their diet mid-week.",
    yieldNote: "5 × lunch, 3 × breakfast",
    meals: ["chicken-rice-bowl", "beef-burrito-bowl", "overnight-oats"],
    timeline: [
      { time: "0:00", action: "Oven to 200°C. Rice cooker or big pot of rice on." },
      { time: "0:05", action: "Season all the chicken and get it on a tray in the oven." },
      { time: "0:15", action: "Chop every vegetable for the week while the oven works." },
      { time: "0:30", action: "Brown the beef and onion in a large pan. Add beans and salsa." },
      { time: "0:45", action: "Roast the broccoli and peppers on a second tray." },
      { time: "0:55", action: "Assemble the three jars of overnight oats. Straight to the fridge." },
      { time: "1:10", action: "Cool everything to room temperature before it goes in containers." },
      { time: "1:25", action: "Portion into containers on a scale. Label with the day." },
    ],
    storage: [
      "Cool food to room temperature before sealing, or condensation makes it soggy.",
      "Fridge holds cooked chicken and beef safely for 3–4 days. Freeze days 4 and 5.",
      "Keep avocado, dressings and anything crunchy separate until you eat.",
      "Reheat rice bowls with a splash of water and a lid to steam rather than dry out.",
    ],
  },
  {
    slug: "two-day-rotation",
    name: "Two-Day Rotation",
    session: "Sunday & Wednesday · 45 min each",
    summary:
      "Two shorter sessions instead of one long one. Nothing sits in the fridge more than three days, so the food actually tastes good on day three.",
    yieldNote: "3 days of lunch and dinner, twice a week",
    meals: ["turkey-pasta", "salmon-sweet-potato", "lentil-power-bowl"],
    timeline: [
      { time: "0:00", action: "Oven on. Start the bolognese base — onion, mushroom, turkey." },
      { time: "0:10", action: "Sweet potato cubes into the oven on a tray." },
      { time: "0:15", action: "Lentils and quinoa into one pot together." },
      { time: "0:25", action: "Salmon and asparagus join the sweet potato tray." },
      { time: "0:32", action: "Pasta on. Undercook it by a minute — it softens on reheating." },
      { time: "0:40", action: "Portion and cool. Sauces and dressings into separate pots." },
    ],
    storage: [
      "Cook pasta one minute short of done so it is not mushy when reheated.",
      "Eat the salmon within two days. Fish does not hold like chicken.",
      "Grain bowls are fine eaten cold, which saves you finding a microwave.",
    ],
  },
  {
    slug: "no-cook-week",
    name: "The No-Cook Week",
    session: "20 minutes, any day",
    summary:
      "For weeks when cooking is not happening. Nothing here needs a hob or an oven, and it still hits protein.",
    yieldNote: "5 × lunch, 5 × snack",
    meals: ["tuna-wrap", "greek-yogurt-bowl", "hummus-veg-plate", "cottage-cheese-plate"],
    timeline: [
      { time: "0:00", action: "Cut all the vegetables. Store carrots and cucumber in water." },
      { time: "0:08", action: "Mix the tuna filling in one large tub for the week." },
      { time: "0:12", action: "Portion yogurt into five jars. Berries and nuts kept separate." },
      { time: "0:18", action: "Divide the hummus into small pots so you never dip from the tub." },
    ],
    storage: [
      "Assemble wraps the morning you eat them or the tortilla goes soft.",
      "Nuts and granola stay out of the yogurt until serving so they stay crunchy.",
      "Vegetables in water in a sealed tub stay crisp for four days.",
    ],
  },
  {
    slug: "high-protein-cut",
    name: "High-Protein Cut",
    session: "Sunday · 60 minutes",
    summary:
      "Built for a calorie deficit. Maximum protein and maximum volume per calorie, so you are full rather than hungry.",
    yieldNote: "4 × lunch, 4 × dinner",
    meals: ["chicken-rice-bowl", "shrimp-couscous", "egg-scramble", "hummus-veg-plate"],
    timeline: [
      { time: "0:00", action: "Chicken seasoned and into a 200°C oven." },
      { time: "0:10", action: "Couscous made with boiling water. Covered, left to stand." },
      { time: "0:15", action: "Volume vegetables — zucchini, broccoli, peppers — onto a tray." },
      { time: "0:30", action: "Hard-boil a dozen eggs for grab-and-go protein." },
      { time: "0:45", action: "Portion by weight. On a cut, guessing is how the deficit disappears." },
    ],
    storage: [
      "Weigh portions on a scale. Eyeballing is the main reason cuts stall.",
      "Double the vegetables in every container — volume is what keeps you full.",
      "Keep boiled eggs unpeeled until you eat them so they do not dry out.",
    ],
  },
];

/* ── computed totals ─────────────────────────────────────────────── */

export interface MacroTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const EMPTY: MacroTotals = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

export function itemMacros(item: MealItem): MacroTotals {
  const food = FOODS.find((f) => f.slug === item.slug);
  if (!food) return { ...EMPTY };
  return scale(food, item.grams);
}

/** Sum the macros of every ingredient in a meal. */
export function mealMacros(meal: Meal): MacroTotals {
  return meal.items.reduce<MacroTotals>((acc, item) => {
    const m = itemMacros(item);
    return {
      kcal: acc.kcal + m.kcal,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
      fiber: acc.fiber + m.fiber,
    };
  }, { ...EMPTY });
}

export function getMeal(slug: string): Meal | null {
  return MEALS.find((m) => m.slug === slug) ?? null;
}

export function getPrepPlan(slug: string): PrepPlan | null {
  return PREP_PLANS.find((p) => p.slug === slug) ?? null;
}

export function foodForItem(item: MealItem): Food | null {
  return FOODS.find((f) => f.slug === item.slug) ?? null;
}

/** Dev integrity guard: every meal ingredient must exist in FOODS. */
export function orphanedFoodSlugs(): string[] {
  const known = new Set(FOODS.map((f) => f.slug));
  const missing: string[] = [];
  for (const meal of MEALS) {
    for (const item of meal.items) {
      if (!known.has(item.slug)) missing.push(`${meal.slug} → ${item.slug}`);
    }
  }
  for (const plan of PREP_PLANS) {
    for (const s of plan.meals) {
      if (!MEALS.some((m) => m.slug === s)) missing.push(`${plan.slug} → ${s}`);
    }
  }
  return missing;
}
