/**
 * Education articles — Gym Floor & Etiquette + Nutrition Basics.
 *
 * STYLE: coach-direct, imperative (ideas.md). The etiquette section exists to
 * lower the intimidation barrier that drives new-member cancellations, so it is
 * written to reassure without being patronising.
 *
 * COMPLIANCE: nutrition content here is GENERAL EDUCATION. No individual calorie
 * or macro prescriptions, no diet plans presented as medical advice, and anyone
 * with a clinical condition or disordered-eating history is routed to a
 * registered dietitian or doctor.
 */
import type { EduArticle } from "./education";

export const ETIQUETTE_ARTICLES: EduArticle[] = [
  {
    slug: "unwritten-rules",
    section: "etiquette",
    title: "The Unwritten Rules",
    summary:
      "Everything nobody tells you on the tour, in the order it will come up.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "Gym etiquette is mostly common courtesy applied to shared equipment. Nobody expects a new member to know the conventions, and nobody minds being asked. The list below covers what actually comes up on a busy floor.",
      },
      {
        kind: "heading",
        text: "Put your weights back",
      },
      {
        kind: "para",
        text: "This is the one that genuinely annoys people, and it is the easiest to get right. Strip the bar when you are finished, return plates to the correct pegs, and put dumbbells back in their numbered slot. Leaving a loaded bar means the next person has to guess whether you are done and then do your clearing up.",
      },
      {
        kind: "heading",
        text: "Wipe down what you sweat on",
      },
      {
        kind: "para",
        text: "Benches, pads and handles. Most gyms provide spray and paper or expect you to carry a towel. It takes ten seconds and it is the single most visible signal that you know what you are doing.",
      },
      {
        kind: "heading",
        text: "Do not camp on equipment",
      },
      {
        kind: "para",
        text: "Resting between sets is part of training and nobody should rush you. Sitting on a machine answering messages for ten minutes is different. If your rest periods are long, stay by the equipment and stay ready, or offer to share it.",
      },
      {
        kind: "heading",
        text: "Sharing and working in",
      },
      {
        kind: "para",
        text: "On a busy floor it is completely normal to alternate sets with someone on the same machine or bench. The phrase is asking to work in. Say \"mind if I work in with you?\" — most people will say yes. If you are the one being asked, saying yes costs you nothing since you were resting anyway.",
      },
      {
        kind: "heading",
        text: "Give people space",
      },
      {
        kind: "list",
        items: [
          "Do not stand directly behind someone mid-set, particularly on a squat or deadlift.",
          "Do not walk between a lifter and the mirror they are using to check form.",
          "Do not start a conversation with someone who is under a loaded bar or mid-set.",
          "Leave a dumbbell's width of space when working next to someone at the rack.",
        ],
      },
      {
        kind: "heading",
        text: "Unsolicited advice",
      },
      {
        kind: "para",
        text: "Do not offer it, and do not feel obliged to accept it. The exception is genuine safety — if someone is about to get pinned under a bar, say something. Otherwise, coaching strangers is the job of the gym's trainers.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Nobody is watching you",
        text: "The most common fear among new members is being judged. In practice, experienced lifters are absorbed in their own sets and rest timers. Dropping a weight, needing help, or asking where something is are all completely unremarkable.",
      },
    ],
  },
  {
    slug: "equipment-orientation",
    section: "etiquette",
    title: "Know Your Equipment",
    summary:
      "Bars, clips, pins, cables and machines — what each one is and how to set it up.",
    minutes: 6,
    body: [
      {
        kind: "para",
        text: "Most equipment intimidation comes from not knowing what a piece of kit is called or how to adjust it. Here is the floor, in plain terms.",
      },
      {
        kind: "heading",
        text: "Bars",
      },
      {
        kind: "table",
        headers: ["Bar", "Typical weight", "What it is for"],
        rows: [
          [
            "Standard Olympic barbell",
            "20 kg / 45 lb",
            "Squats, bench press, rows, deadlifts — the default bar on most racks",
          ],
          [
            "Women's Olympic barbell",
            "15 kg / 35 lb",
            "Same use, thinner shaft and shorter — easier to grip",
          ],
          [
            "EZ-curl bar",
            "Around 7–10 kg / 15–25 lb",
            "Curls and skull crushers; the bends spare your wrists",
          ],
          [
            "Trap / hex bar",
            "Varies widely, often 25 kg / 55 lb",
            "Deadlifts and carries, with a more upright torso position",
          ],
          [
            "Fixed barbells",
            "Marked on the bar",
            "Pre-loaded, no plates needed — convenient for curls and presses",
          ],
        ],
        caption:
          "Bar weights vary between gyms. If a lift matters to you, weigh the bar or ask staff rather than assuming.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Always use clips",
        text: "Collars or clips stop plates sliding off if the bar tilts. An unclipped bar that unloads on one side is one of the more dangerous things that happens on a gym floor, and it is entirely preventable.",
      },
      {
        kind: "heading",
        text: "Adjusting a machine",
      },
      {
        kind: "para",
        text: "Nearly every machine has a seat height or pad position adjustment, usually a spring-loaded pin you pull out while sliding the seat. The rule for setting it: the joint that is meant to move should line up with the machine's pivot. On a leg extension that means your knee sits level with the axis; on a chest press the handles should sit roughly at mid-chest.",
      },
      {
        kind: "steps",
        items: [
          "Sit down first and see where you land before changing anything.",
          "Adjust the seat so the working joint lines up with the machine's pivot point.",
          "Set the weight pin to something obviously light for the first set.",
          "Do two or three easy reps to check the path feels natural before loading up.",
          "If it still feels wrong after adjusting, ask a member of staff — machines suit different limb lengths differently.",
        ],
      },
      {
        kind: "heading",
        text: "Cable machines",
      },
      {
        kind: "para",
        text: "A cable stack is the most versatile equipment on the floor: change the handle and the pulley height and one station covers dozens of exercises. Handles clip on and off. Pulley height is set by a pin on the upright. Nothing you can do with the pin is dangerous, so experiment.",
      },
      {
        kind: "plates",
        slugs: ["lat-pulldown", "cable-crossover", "tricep-cable-pushdown", "cable-face-pulls"],
        note: "Four different exercises from essentially the same machine, just with a different handle and pulley height.",
      },
      {
        kind: "heading",
        text: "Safety features worth knowing",
      },
      {
        kind: "list",
        items: [
          "Squat rack J-hooks — the arms holding the bar. Set them roughly at chest height for squats.",
          "Safety bars or straps — adjustable rails inside a rack that catch the bar if you fail a rep. Set them just below your bottom position.",
          "Smith machine and hack squat catches — rotate the handles to lock the sled at any point.",
          "Emergency stop on treadmills — the red button or the magnetic clip you attach to your clothing.",
        ],
      },
    ],
  },
  {
    slug: "asking-for-a-spot",
    section: "etiquette",
    title: "Spotting & Asking For Help",
    summary:
      "How to ask, how to spot someone properly, and which lifts genuinely need it.",
    minutes: 4,
    body: [
      {
        kind: "para",
        text: "A spotter is someone who helps you rack the bar if a rep fails. Asking for one is completely routine, and being asked is a compliment rather than an inconvenience.",
      },
      {
        kind: "heading",
        text: "How to ask",
      },
      {
        kind: "para",
        text: "Wait until the person is between sets, then say how many reps you are aiming for. \"Could you spot me? Going for five.\" That tells them when to step in. Nobody who trains regularly will refuse.",
      },
      {
        kind: "heading",
        text: "How to spot a bench press",
      },
      {
        kind: "steps",
        items: [
          "Stand close behind the head of the bench, hands hovering under the bar with a mixed grip ready.",
          "Help lift the bar out of the hooks if they ask for a hand-off, then let go cleanly.",
          "Keep your hands near the bar but not touching it. Do not shadow the bar so closely that you interfere.",
          "If the bar stalls and starts sinking, take it with both hands and guide it back to the hooks.",
          "Do not count reps out loud unless asked — some people find it distracting.",
        ],
      },
      {
        kind: "heading",
        text: "Which lifts need a spotter",
      },
      {
        kind: "table",
        headers: ["Lift", "Spotter?", "Why"],
        rows: [
          ["Barbell bench press", "Yes, when heavy", "The bar can pin you across the chest"],
          ["Barbell back squat", "Use the rack's safety bars", "A spotter is less reliable than properly set safeties"],
          ["Overhead press", "Rarely useful", "A failed rep can be lowered to the front; spotting overhead is awkward"],
          ["Deadlift", "No", "You simply put the bar down. Never let anyone touch it mid-rep"],
          ["Machines and cables", "No", "Release the handles and the weight returns on its own"],
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "Train alone safely",
        text: "If you often train without a partner, use the rack's safety bars, keep dumbbell pressing as your heavy chest option, and stop sets one rep earlier than you would with a spotter present.",
      },
      {
        kind: "plates",
        slugs: ["barbell-bench-press", "barbell-back-squat", "incline-dumbbell-press"],
        note: "The lifts where this matters most. Dumbbell pressing is the safest heavy chest option when training alone.",
      },
    ],
  },
];

export const NUTRITION_ARTICLES: EduArticle[] = [
  {
    slug: "calories-and-energy-balance",
    section: "nutrition",
    title: "Calories & Energy Balance",
    summary:
      "Why total intake decides body weight, and why that is simpler in theory than in practice.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "Body weight tracks the balance between the energy you take in and the energy you use. Consistently take in less than you use and weight falls; consistently take in more and it rises. That is the mechanism, and no arrangement of meal timing or food combinations overrides it.",
      },
      {
        kind: "heading",
        text: "Where it gets complicated",
      },
      {
        kind: "para",
        text: "The principle is simple; applying it is not. Both sides of the equation are hard to measure and neither is fixed. People routinely underestimate what they eat, energy expenditure adjusts as you lose weight, and daily movement outside exercise varies far more than most people realise. This is why two people eating the same reported amount can see different results.",
      },
      {
        kind: "list",
        items: [
          "Portion estimates drift — cooking oils, sauces and drinks are the usual blind spots.",
          "Expenditure falls as you get lighter, so a deficit shrinks over time without you changing anything.",
          "Incidental movement drops when you diet, which reduces expenditure invisibly.",
          "Water weight shifts several pounds day to day and has nothing to do with fat.",
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "Use estimates as a starting point, not a verdict",
        text: "Any calculator, including ours, produces a population estimate. The useful number is what actually happens to your weight over two or three weeks of consistent eating. Adjust from that.",
      },
      {
        kind: "heading",
        text: "What to measure instead of chasing precision",
      },
      {
        kind: "para",
        text: "Weigh yourself at the same time under the same conditions, several times a week, and look at the weekly average rather than any single reading. Trends over weeks tell you what is happening. Individual days tell you almost nothing.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "When calorie tracking is not the right tool",
        text: "If you have a history of disordered eating, or tracking makes you anxious or preoccupied, this approach can do more harm than good. Speak to a doctor or a registered dietitian about approaches that suit you.",
      },
    ],
  },
  {
    slug: "protein-explained",
    section: "nutrition",
    title: "Protein: What It Actually Does",
    summary:
      "Why it matters for training, how much research suggests, and where to get it.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "Protein supplies the amino acids your body uses to repair and build tissue, including the muscle you are damaging and rebuilding every session. It is also the most filling of the three macronutrients, which makes it useful whether you are trying to gain muscle or lose fat.",
      },
      {
        kind: "heading",
        text: "How much the research points to",
      },
      {
        kind: "para",
        text: "The International Society of Sports Nutrition's position stand on protein reports that for stimulating muscle protein synthesis, general recommendations are around 0.25 g of high-quality protein per kilogram of body weight per serving, or an absolute dose of roughly 20 to 40 g [1]. Daily requirements for people training regularly sit well above the general population's minimum.",
      },
      {
        kind: "quote",
        text: "General recommendations are 0.25 g of a high-quality protein per kg of body weight, or an absolute dose of 20–40 g.",
        attribution:
          "Jäger et al., International Society of Sports Nutrition Position Stand: Protein and Exercise (2017)",
      },
      {
        kind: "heading",
        text: "Spread it across the day",
      },
      {
        kind: "para",
        text: "Getting a reasonable amount of protein at each of several meals is more practical than a single enormous serving, mostly because it is easier to eat and keeps you fuller. The idea that protein must arrive within a narrow window after training is far less important than hitting a sensible daily total.",
      },
      {
        kind: "heading",
        text: "Where to get it",
      },
      {
        kind: "para",
        text: "Animal sources — meat, fish, eggs, dairy — deliver a complete amino acid profile in a small volume. Plant sources work perfectly well too, though you generally need a larger volume and more variety across the day. The food index lists per-item protein for every item in the database.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Powder is food, not magic",
        text: "Whey or plant protein powder is a convenient way to hit a daily total, nothing more. It has no advantage over chicken, eggs or lentils beyond being fast and portable. See the supplements section for the detail.",
      },
    ],
    sources: [
      {
        label:
          "Jäger R, et al. ISSN Position Stand: Protein and Exercise. J Int Soc Sports Nutr (2017)",
        url: "https://link.springer.com/article/10.1186/s12970-017-0177-8",
      },
    ],
  },
  {
    slug: "carbs-and-fats",
    section: "nutrition",
    title: "Carbohydrate & Fat",
    summary:
      "What each one does, why neither is the villain, and how they fit around training.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "Carbohydrate and fat are both energy sources, and the popular framing of one as good and the other as bad does not survive contact with the evidence. What matters is your total intake, whether you get enough of the nutrients that come packaged with them, and whether the split suits how you train and eat.",
      },
      {
        kind: "heading",
        text: "Carbohydrate",
      },
      {
        kind: "para",
        text: "Carbohydrate is the fuel your body prefers for hard, repeated efforts — which describes resistance training and most conditioning work. Cutting it very low tends to make heavy sessions feel flat. Sources that arrive with fibre and micronutrients, such as oats, potatoes, rice, fruit and legumes, do more for you than sources that arrive with nothing else.",
      },
      {
        kind: "heading",
        text: "Fat",
      },
      {
        kind: "para",
        text: "Dietary fat supports hormone production and the absorption of fat-soluble vitamins, and it makes food palatable. It is also the most energy-dense macronutrient, which means it is the easiest place to accidentally add a few hundred calories through oils and dressings. Going extremely low is a bad idea; being casual about how much oil goes in the pan is also a bad idea.",
      },
      {
        kind: "table",
        headers: ["", "Per gram", "Main role", "Watch for"],
        rows: [
          [
            "Carbohydrate",
            "About 4 kcal",
            "Fuel for hard training, fibre, micronutrients",
            "Liquid sources add up invisibly",
          ],
          [
            "Fat",
            "About 9 kcal",
            "Hormones, vitamin absorption, satiety",
            "Cooking oils and dressings are easy to underestimate",
          ],
          [
            "Protein",
            "About 4 kcal",
            "Tissue repair and growth, satiety",
            "Usually the one people get least of",
          ],
        ],
      },
      {
        kind: "heading",
        text: "Timing around training",
      },
      {
        kind: "para",
        text: "Eating some carbohydrate in the hours before you train usually makes the session feel better, and that is the honest extent of the claim. If you train early and prefer to lift fasted, that is a legitimate choice. Beyond avoiding a heavy meal immediately beforehand, timing is a comfort question rather than a performance one for most gym-goers.",
      },
    ],
  },
  {
    slug: "reading-a-label",
    section: "nutrition",
    title: "Reading A Nutrition Label",
    summary:
      "How to decode a panel in ten seconds and spot the two tricks that catch everyone.",
    minutes: 4,
    body: [
      {
        kind: "para",
        text: "A nutrition panel answers most questions about a product faster than the marketing on the front of the pack. There are two things to check first, and they are the two things packaging is designed to obscure.",
      },
      {
        kind: "heading",
        text: "First: what is the serving size?",
      },
      {
        kind: "para",
        text: "Every number on the panel refers to that serving, and the serving is often smaller than what anyone eats. A bag containing two and a half servings will report calories for one. Check the serving size before you read anything else, then work out how many servings you are actually having.",
      },
      {
        kind: "heading",
        text: "Second: per 100 g lets you compare products",
      },
      {
        kind: "para",
        text: "Per-100 g figures are the only fair way to compare two products, because serving sizes differ between brands. Our food index lets you toggle between per-serving and per-100 g for exactly this reason.",
      },
      {
        kind: "heading",
        text: "The claims on the front",
      },
      {
        kind: "table",
        headers: ["Claim", "What it often means in practice"],
        rows: [
          ["High protein", "Higher than a comparable product, which may still be low"],
          ["Low fat", "Frequently higher in sugar to compensate for flavour"],
          ["No added sugar", "May still be high in naturally occurring sugars"],
          ["Natural", "Has no consistent regulated meaning on most products"],
          ["Light or lite", "Lighter than the standard version, not necessarily light"],
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "The ingredients list is ordered by weight",
        text: "Ingredients appear in descending order of quantity. If sugar or oil appears in the first three, the product is substantially made of it, whatever the front of the pack says.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Scan it instead of reading it",
        text: "The nutrition tab includes a barcode scanner that pulls the panel from the Open Food Facts database. Because that database is crowd-sourced, always check the resolved product matches what is in your hand before logging it.",
      },
    ],
  },
  {
    slug: "hydration",
    section: "nutrition",
    title: "Hydration",
    summary:
      "How much water, what actually counts, and why expensive electrolyte drinks are usually unnecessary.",
    minutes: 3,
    body: [
      {
        kind: "para",
        text: "Being meaningfully dehydrated degrades performance and makes training feel harder than it is. Being slightly under is common and easily fixed. Being obsessive about water intake is unnecessary.",
      },
      {
        kind: "heading",
        text: "A practical approach",
      },
      {
        kind: "list",
        items: [
          "Drink to thirst across the day, and drink deliberately around training since thirst lags behind need.",
          "Bring a bottle to the floor rather than relying on trips to the fountain.",
          "Pale straw-coloured urine is a reasonable rough indicator. Consistently dark suggests you are behind.",
          "Tea, coffee, milk and food all contribute. Water does not have to come as water.",
        ],
      },
      {
        kind: "heading",
        text: "Electrolytes",
      },
      {
        kind: "para",
        text: "You lose sodium and other electrolytes in sweat, and replacing them matters for long, hot, or very sweaty sessions. For a 45-minute session in an air-conditioned gym, water and a normal diet cover it. Sports drinks are formulated for prolonged endurance work, and using them for a weights session mostly adds sugar and cost.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "More is not always better",
        text: "Drinking very large volumes of plain water quickly, particularly during prolonged exercise, can dangerously dilute blood sodium. This is rare but serious. Drink to thirst rather than forcing litres to hit a target.",
      },
    ],
  },
];
