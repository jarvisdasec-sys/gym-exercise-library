export const BLOG_CATEGORIES = ["Weight Lifting", "Health", "Cardio", "Gear"] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogFilter = "All topics" | BlogCategory;

export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: string;
  summary: string;
  author: string;
  readTime: number;
  image: string;
  imageAlt: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "a-simple-first-strength-week",
    category: "Weight Lifting",
    title: "A simple first strength week",
    summary: "Build a repeatable lifting habit with a few movements, steady practice, and room to recover.",
    author: "BTB Fitness & Health",
    readTime: 4,
    image: "/images/site/btb-workouts-hero.jpg",
    imageAlt: "BTB workout training floor",
    sections: [
      {
        heading: "Keep the first plan small",
        paragraphs: [
          "A useful strength plan does not need a long list of exercises. Start with a handful of movements that cover the body, learn the setup, and leave enough energy to come back for the next session.",
          "For a first week, two nonconsecutive full-body sessions can be easier to organize than trying to train every day. Choose a push, a pull, a squat or hinge, and an optional core movement from the BTB exercise library.",
        ],
        bullets: ["Use a load you can control through the full movement.", "Begin with a small number of comfortable sets.", "Write down what you did so next time is easier to plan."],
      },
      {
        heading: "Practice before you chase numbers",
        paragraphs: [
          "Set your stance and equipment before the first rep. Move smoothly, keep the range comfortable, and stop a set when technique starts to change. A lighter option is still real training when it lets you practice with control.",
          "Progress can mean repeating the same session with more confidence. Add difficulty gradually only when the current version feels manageable and recovery is going well.",
        ],
      },
      {
        heading: "Make recovery part of the schedule",
        paragraphs: [
          "A plan is repeatable when it fits around sleep, work, and the rest of life. Keep a rest day between harder sessions if that suits you, and adjust the exercise or seek qualified advice when pain, injury, or a medical concern is involved.",
        ],
      },
    ],
  },
  {
    slug: "everyday-health-small-habits",
    category: "Health",
    title: "Everyday health: small habits that stick",
    summary: "A practical reset for movement, meals, rest, and routines—without turning wellbeing into another all-or-nothing project.",
    author: "BTB Fitness & Health",
    readTime: 4,
    image: "/images/site/btb-education.jpg",
    imageAlt: "BTB fitness and health learning resources",
    sections: [
      {
        heading: "Choose one useful next step",
        paragraphs: [
          "Health routines are easier to repeat when they are specific and realistic. Instead of changing everything at once, choose one small action you can connect to a normal part of your day—such as a short walk after lunch or preparing tomorrow's water bottle before bed.",
          "The goal is not to earn a perfect streak. If a day gets busy, make the next step smaller or return to it tomorrow. A routine should support your life, not make one missed day feel like failure.",
        ],
        bullets: ["Pick a time and place that already fits your schedule.", "Make the first version short enough to feel doable.", "Notice what helped, then adjust the plan without judgment."],
      },
      {
        heading: "Build around the basics",
        paragraphs: [
          "Regular movement, meals that work for your needs, sufficient rest, and time to decompress can all be part of a steadier week. There is no single routine that fits everyone, so use your circumstances and preferences to shape the details.",
          "A paper checklist or phone reminder can make the next action visible. Keep it simple: a few checkboxes are often more useful than an elaborate tracking system you do not want to open.",
        ],
      },
      {
        heading: "Make room for individual needs",
        paragraphs: [
          "This article is general education, not medical advice or a personalized care plan. For health conditions, medication, injury, pregnancy, or other individual concerns, ask an appropriately qualified professional what is right for you.",
        ],
      },
    ],
  },
  {
    slug: "cardio-at-your-own-pace",
    category: "Cardio",
    title: "Cardio at your own pace",
    summary: "A welcoming way to restart conditioning: choose movement you enjoy, begin comfortably, and let consistency lead.",
    author: "BTB Fitness & Health",
    readTime: 3,
    image: "/images/site/btb-cardio-hero.jpg",
    imageAlt: "BTB cardio training session",
    sections: [
      {
        heading: "Pick movement you will come back to",
        paragraphs: [
          "Cardio can be a walk, a bike ride, a dance session, or another activity that gets you moving. The best starting option is one that feels accessible and fits the place and equipment you have.",
          "Begin with an easy warm-up and a comfortable effort. If you can speak in short sentences and still feel in control, that may be a useful starting check for many everyday sessions. Slow down or pause whenever your body asks for a change.",
        ],
      },
      {
        heading: "Try a simple session structure",
        paragraphs: [
          "Keep the first session uncomplicated. Use the pattern below as a flexible template, not a test you have to pass:",
        ],
        bullets: ["Start with a few easy minutes of walking or gentle movement.", "Continue at a steady, comfortable pace for a short block of time.", "Finish by easing the pace and taking a moment to recover."],
      },
      {
        heading: "Build by repeating, not rushing",
        paragraphs: [
          "When a session feels manageable, repeat it before making it longer or more demanding. You can change one thing at a time—duration, terrain, or pace—so it is easier to tell how the adjustment feels.",
          "Stop for concerning symptoms and seek professional guidance when needed. This is general education, not a personalized exercise prescription.",
        ],
      },
    ],
  },
  {
    slug: "gear-that-earns-its-place",
    category: "Gear",
    title: "Gear that earns its place",
    summary: "Start with the essentials you will use, then add equipment only when it solves a real problem in your routine.",
    author: "BTB Fitness & Health",
    readTime: 3,
    image: "/images/site/btb-movement-index-hero.jpg",
    imageAlt: "BTB exercise library and training equipment",
    sections: [
      {
        heading: "Start with what you have",
        paragraphs: [
          "A useful workout does not begin with a shopping cart. Comfortable clothing, a clear space, and a plan that fits the equipment already available can be enough to get started. If you train outdoors, plan for the conditions and choose a route that feels appropriate for you.",
          "Before buying anything, name the problem you want the item to solve. If there is no clear answer, it may be a nice-to-have rather than a need.",
        ],
      },
      {
        heading: "Choose for fit, use, and safety",
        paragraphs: [
          "If you do purchase gear, choose an option that suits your activity, fits correctly, and can be used safely in your space. Inspect equipment regularly and follow its instructions. A resistance band, for example, should be checked for wear before use and anchored only as directed by its manufacturer.",
        ],
        bullets: ["A water bottle that is easy to bring along.", "A stable mat or clear floor space if your routine needs it.", "One adjustable or versatile item only when it fills a real training gap."],
      },
      {
        heading: "Spend for the habit, not the hype",
        paragraphs: [
          "Online reviews and product claims can make every accessory sound essential. Give yourself time to test the routine first. Gear should make training more practical—not become a new barrier to beginning.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find(post => post.slug === slug);
}
