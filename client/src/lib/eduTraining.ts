/**
 * Education articles — Start Here + Training Fundamentals.
 *
 * STYLE: coach-direct, imperative, no hype (ideas.md brand voice). Plain
 * language a first-timer can act on. Cross-links point at real plate slugs from
 * lib/exercises.ts and real session slugs from lib/workouts.ts so nothing dead-ends.
 *
 * COMPLIANCE: general training education. No individualised prescription, no
 * injury diagnosis. Anything painful routes to a professional.
 */
import type { EduArticle } from "./education";

export const START_HERE_ARTICLES: EduArticle[] = [
  {
    slug: "your-first-week",
    section: "start-here",
    title: "Your First Week",
    summary:
      "What to do on day one, how much is enough, and why holding back is the right call.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "The first week has one job: turn up, learn the movements, and leave able to walk normally. That is it. Nothing you do in week one builds noticeable muscle, but plenty of things you could do in week one will make you quit by week three. Almost every beginner who disappears did too much too soon, got wrecked, and decided the gym was not for them.",
      },
      {
        kind: "heading",
        text: "Three sessions, full body, every other day",
      },
      {
        kind: "para",
        text: "Train the whole body each session rather than splitting it into chest day and back day. As a beginner you recover fast and adapt to almost anything, so hitting each movement pattern three times a week beats hitting it once. Leave a day between sessions. Monday, Wednesday, Friday works. So does Tuesday, Thursday, Saturday.",
      },
      {
        kind: "sessions",
        slugs: ["full-body-starter", "machine-circuit"],
        note: "Either of these works as your week-one session. The machine circuit is the softer landing if free weights feel intimidating.",
      },
      {
        kind: "heading",
        text: "Leave reps in the tank",
      },
      {
        kind: "para",
        text: "For the first two weeks, stop every set while you could still do three or four more reps. This feels pointless. It is not. You are teaching your nervous system the movement pattern and finding out how your body responds, and you cannot learn a movement while straining against a weight that is beating you. Loading comes later and it comes fast.",
      },
      {
        kind: "heading",
        text: "Expect to be sore, and expect it to pass",
      },
      {
        kind: "para",
        text: "Muscle soreness peaks a day or two after a session you are not used to, and it fades as you repeat that session. It is a sign of unfamiliarity, not of a good workout, and it is not required for progress. What you should not have is sharp pain during a lift, pain in a joint rather than a muscle, or soreness that stops you moving normally for several days.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Sharp pain is not soreness",
        text: "Muscle soreness is dull, spread over the muscle, and eases as you warm up. Sharp, localised or joint pain is a different signal. Stop the exercise and speak to a doctor or physiotherapist rather than pushing through it.",
      },
      {
        kind: "heading",
        text: "What to actually do on the floor",
      },
      {
        kind: "steps",
        items: [
          "Walk in with a written plan on your phone. Deciding what to do while standing on the floor is how sessions get abandoned.",
          "Spend five to ten minutes getting warm — brisk walking, cycling or the rowing machine until your breathing picks up.",
          "Do the first set of every exercise light, purely to feel the movement, then add weight.",
          "Record what you lifted and for how many reps. Week two you beat it. That is the whole game.",
          "Leave with something in reserve. The aim is to want to come back.",
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "If you have a health condition or an old injury",
        text: "Get clearance from your doctor before starting, and consider a session with a qualified trainer or physiotherapist who can see how you move. This guide is general education and cannot account for your individual situation.",
      },
    ],
  },
  {
    slug: "first-month-plan",
    section: "start-here",
    title: "The First Month",
    summary:
      "A week-by-week path from your first session to a routine that runs itself.",
    minutes: 6,
    body: [
      {
        kind: "para",
        text: "The point of month one is not results. It is building a habit that survives a bad week, and learning the movements well enough that adding weight is safe. Progress in month one is measured by sessions attended, not by weight on the bar.",
      },
      {
        kind: "table",
        headers: ["Week", "Focus", "What changes"],
        rows: [
          [
            "1",
            "Learn the movements",
            "Light weights, three full-body sessions, stop well short of failure",
          ],
          [
            "2",
            "Repeat and record",
            "Same exercises, same order. Add a little weight where last week felt easy",
          ],
          [
            "3",
            "Start pushing",
            "Take your last set closer to hard — two reps left in the tank, not four",
          ],
          [
            "4",
            "Consolidate",
            "Add weight where form held. Keep any lift that still feels awkward exactly where it is",
          ],
        ],
        caption:
          "A conservative on-ramp. If a week feels too easy, you can move faster — but form holds veto.",
      },
      {
        kind: "heading",
        text: "Pick a session and stop reinventing it",
      },
      {
        kind: "para",
        text: "Beginners lose more progress to programme-hopping than to any other mistake. The value of a session comes from repeating it and beating it. Novelty feels productive but resets the measurement, so you never find out whether anything worked.",
      },
      {
        kind: "sessions",
        slugs: ["full-body-starter", "upper-body", "lower-body"],
        note: "Start with Full Body Starter. When three full-body sessions a week stops fitting your schedule, an upper/lower split is the natural next step.",
      },
      {
        kind: "heading",
        text: "The five patterns worth learning first",
      },
      {
        kind: "para",
        text: "Every useful strength programme is built from a handful of movement patterns: push something away, pull something towards you, press something overhead, squat down, and hinge at the hip. Learn one exercise from each and you have a complete session.",
      },
      {
        kind: "plates",
        slugs: [
          "machine-chest-press",
          "seated-cable-row",
          "dumbbell-overhead-press",
          "leg-press",
          "romanian-deadlift",
        ],
        note: "One movement per pattern. Machines first is a perfectly respectable choice — they hold the path for you while you learn.",
      },
      {
        kind: "heading",
        text: "What to do when you miss a session",
      },
      {
        kind: "para",
        text: "Nothing. Do not double up, do not punish yourself with an extra day, and do not restart the plan from week one. Missing one session in a month is statistically irrelevant. Treating it as a failure is what ends training habits.",
      },
    ],
  },
  {
    slug: "how-to-not-quit",
    section: "start-here",
    title: "How To Not Quit",
    summary:
      "Why most people stop in the first eight weeks, and the small decisions that prevent it.",
    minutes: 4,
    body: [
      {
        kind: "para",
        text: "Most people who join a gym stop going within a few months. The reasons are boringly consistent, and almost none of them are about willpower. They are about a plan that was never sustainable, expectations that were never realistic, and a room that felt unwelcoming because nobody explained how it works.",
      },
      {
        kind: "heading",
        text: "Set the bar at showing up",
      },
      {
        kind: "para",
        text: "A short session you actually do beats the ideal session you skip. On a bad day, go and do the first two exercises. You will often finish anyway, and on the days you do not, you have still kept the habit intact — which is the thing that produces results over a year.",
      },
      {
        kind: "heading",
        text: "Expect the timeline to be slow",
      },
      {
        kind: "para",
        text: "Strength improves within weeks, largely because your nervous system gets better at the movement. Visible changes in how you look take months, and are heavily influenced by what you eat and sleep. If you judge month two by the mirror, you will conclude it is not working when it is.",
      },
      {
        kind: "table",
        headers: ["Timeframe", "What genuinely changes"],
        rows: [
          ["Weeks 1–2", "Coordination and confidence. The movements stop feeling foreign"],
          ["Weeks 3–8", "Noticeable strength gains. Weights climb faster than they ever will again"],
          ["Months 2–4", "Measurable body composition change, if food and sleep support it"],
          ["Months 6–12", "Visible change that other people comment on"],
        ],
      },
      {
        kind: "heading",
        text: "Fix the friction, not your motivation",
      },
      {
        kind: "list",
        items: [
          "Train at the same times each week so it stops being a decision.",
          "Pack your bag the night before. Removing one obstacle is worth more than any amount of psyching yourself up.",
          "Pick the gym you pass anyway, not the better one across town.",
          "Have a plan written down before you walk in.",
          "Train with someone if that helps you turn up, and train alone if company slows you down.",
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "Feeling out of place is normal and temporary",
        text: "Nearly everyone feels conspicuous in their first few weeks. Almost nobody is watching — experienced lifters are counting their own reps. If the room feels intimidating, train at quieter hours until it does not.",
      },
    ],
  },
];

export const TRAINING_ARTICLES: EduArticle[] = [
  {
    slug: "progressive-overload",
    section: "training",
    title: "Progressive Overload",
    summary:
      "The one principle that separates training from exercising. Everything else is detail.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "Your body changes in response to a demand it is not already equipped to meet. Meet the same demand every week and there is nothing to adapt to, so nothing changes. Progressive overload simply means the demand has to keep rising. It is the difference between training, which has a direction, and exercising, which just burns time.",
      },
      {
        kind: "heading",
        text: "Overload is not only more weight",
      },
      {
        kind: "para",
        text: "Adding weight is the obvious lever and the first one to run out. When the bar will not move up, there are several other ways to make the same session harder, and rotating through them is how experienced lifters keep progressing for years.",
      },
      {
        kind: "table",
        headers: ["Lever", "What it looks like", "When to use it"],
        rows: [
          ["Load", "Same reps, heavier weight", "Whenever the current weight feels controlled"],
          ["Reps", "Same weight, one or two more reps", "When the jump to the next weight is too big"],
          ["Sets", "Add a set to the exercise", "When you have time and recovery to spare"],
          ["Tempo", "Lower the weight more slowly", "When load is capped by equipment or a niggle"],
          ["Range", "Take the movement through more range", "When form allows a fuller stretch"],
          ["Rest", "Shorten rest between sets", "For conditioning-biased goals, not for max strength"],
        ],
      },
      {
        kind: "heading",
        text: "How fast to add weight",
      },
      {
        kind: "para",
        text: "A workable rule is that once you hit the top of your target rep range on every set with clean form, add the smallest available increment next session and expect reps to drop. Then climb back up. Small jumps repeated for a year beat aggressive jumps abandoned in a month.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Form sets the ceiling",
        text: "If adding weight changes how the movement looks, the weight went up but the training stimulus did not. A heavier lift performed worse is not overload — it is a different, sloppier exercise.",
      },
      {
        kind: "heading",
        text: "You cannot progress what you do not record",
      },
      {
        kind: "para",
        text: "Write down the weight and reps for every set. Memory is unreliable and flatters you. A log turns training into a series of small, beatable targets, which is both the mechanism of progress and the thing that keeps people coming back.",
      },
      {
        kind: "sessions",
        slugs: ["push-day", "pull-day", "legs-and-glutes"],
        note: "Every BTB session lists sets and reps so you have a target to beat next time.",
      },
    ],
  },
  {
    slug: "sets-reps-and-rep-ranges",
    section: "training",
    title: "Sets, Reps & Rep Ranges",
    summary:
      "What different rep ranges actually do, and why the differences are smaller than gym folklore claims.",
    minutes: 6,
    body: [
      {
        kind: "para",
        text: "Rep ranges are the most over-complicated topic in training. The short version: heavy and low reps biases towards strength, moderate reps is the most practical way to build muscle, and high reps builds muscular endurance. The ranges overlap heavily, and effort matters more than the exact number.",
      },
      {
        kind: "table",
        headers: ["Range", "Biases towards", "Cost"],
        rows: [
          [
            "1–5 reps",
            "Maximal strength and neural efficiency",
            "Demanding on joints and technique; needs longer rest",
          ],
          [
            "6–12 reps",
            "Muscle size, with strength alongside it",
            "The practical default for most people, most of the time",
          ],
          [
            "12–20 reps",
            "Muscular endurance and connective tissue tolerance",
            "Uncomfortable; easy to stop early because it burns, not because you failed",
          ],
        ],
      },
      {
        kind: "heading",
        text: "Effort is the variable that matters",
      },
      {
        kind: "para",
        text: "A set taken close to the point where you could not complete another clean rep drives adaptation across a wide range of rep counts. A set stopped comfortably short does much less, whatever the number on the bar. This is why two people can run identical programmes and get different results.",
      },
      {
        kind: "heading",
        text: "Reps in reserve: a simple way to gauge effort",
      },
      {
        kind: "para",
        text: "Reps in reserve, or RIR, describes how many more reps you could have done. Finishing a set with two left means RIR 2. Most productive training for size sits somewhere around one to three reps in reserve on working sets, with the first sets of a session slightly easier than the last.",
      },
      {
        kind: "list",
        items: [
          "RIR 0 — you could not have done another rep. Useful occasionally, expensive to recover from.",
          "RIR 1–2 — hard, clean, repeatable. Where most working sets belong.",
          "RIR 3–4 — productive while learning a movement or managing fatigue.",
          "RIR 5+ — warm-up territory. Fine as a warm-up, not as a working set.",
        ],
      },
      {
        kind: "heading",
        text: "How many sets per muscle",
      },
      {
        kind: "para",
        text: "More sets generally produce more growth up to a point, after which recovery becomes the limiting factor and extra volume just costs you sleep and joint comfort. Beginners get results from a surprisingly small amount of hard work. Adding volume is a lever to pull when progress genuinely stalls, not a starting position.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Compounds first, isolation last",
        text: "Order matters more than most people think. Do the movements that use the most muscle while you are fresh, then finish with single-joint work. Every BTB session is built in that order.",
      },
    ],
  },
  {
    slug: "rest-periods",
    section: "training",
    title: "Rest Periods",
    summary:
      "How long to sit between sets, and why rushing costs you more than it saves.",
    minutes: 4,
    body: [
      {
        kind: "para",
        text: "Rest exists so the next set can be hard for the right reason. Cut it too short and the set is limited by breathlessness rather than by the muscle you are trying to train. That feels productive and is often counterproductive.",
      },
      {
        kind: "table",
        headers: ["Exercise type", "Typical rest", "Why"],
        rows: [
          [
            "Heavy compounds — squat, bench, row, press",
            "2–4 minutes",
            "The nervous system and breathing need time; short rest turns a strength set into cardio",
          ],
          [
            "Moderate compounds and machines",
            "1.5–3 minutes",
            "Long enough to repeat the work, short enough to keep the session moving",
          ],
          [
            "Isolation work — curls, raises, extensions",
            "45–90 seconds",
            "Small muscles recover quickly and the sets are less systemically demanding",
          ],
        ],
      },
      {
        kind: "heading",
        text: "Use your breathing as the gauge",
      },
      {
        kind: "para",
        text: "If you are still breathing hard, you are not ready. The practical test is whether you could hold a normal conversation. On heavy lower-body work that can take longer than the clock suggests, and taking the extra minute usually means more total quality work, not less.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Resting is not loafing",
        text: "Sitting on a bench between heavy sets is part of the session, not a break from it. What is not acceptable is occupying a piece of equipment while scrolling — see the gym floor section on sharing kit.",
      },
      {
        kind: "sessions",
        slugs: ["strength-push-pull", "core-and-abs"],
        note: "Every session in the library prescribes rest per movement, so you do not have to guess.",
      },
    ],
  },
  {
    slug: "training-frequency",
    section: "training",
    title: "Frequency & Splits",
    summary:
      "How often to train a muscle, and how to choose a split that fits your actual week.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "The best split is the one you will actually complete. A four-day plan followed every week beats a six-day plan followed half the time. Choose based on the days you can realistically commit, then pick the structure that spreads the work sensibly across them.",
      },
      {
        kind: "table",
        headers: ["Days a week", "Structure that fits", "Notes"],
        rows: [
          ["2", "Two full-body sessions", "Enough to build strength, especially early on"],
          ["3", "Three full-body, or push / pull / legs", "The sweet spot for most beginners"],
          ["4", "Upper / lower, twice each", "Good balance of frequency and recovery"],
          ["5–6", "Push / pull / legs run twice", "Only worth it if sleep and food are handled"],
        ],
      },
      {
        kind: "sessions",
        slugs: ["push-day", "pull-day", "legs-and-glutes", "upper-body", "lower-body"],
        note: "Mix and match. The Workouts tab lists four suggested weekly arrangements built from these sessions.",
      },
      {
        kind: "heading",
        text: "Twice a week per muscle is a reasonable target",
      },
      {
        kind: "para",
        text: "Spreading a muscle's weekly work across two sessions rather than one tends to be easier to recover from and easier to execute with quality, because you are not grinding out the last sets of a twenty-set chest marathon. If you can only train twice a week, full-body sessions get you there automatically.",
      },
      {
        kind: "heading",
        text: "More days is not automatically better",
      },
      {
        kind: "para",
        text: "Training is a demand; adaptation happens while you recover from it. Adding days without adding sleep and food simply accumulates fatigue, and fatigue masks progress. If you are training five days a week and nothing is moving, the answer is rarely a sixth day.",
      },
    ],
  },
  {
    slug: "warm-up-properly",
    section: "training",
    title: "Warming Up",
    summary:
      "A five-minute structure that prepares the lift instead of wasting the session.",
    minutes: 4,
    body: [
      {
        kind: "para",
        text: "A warm-up has two jobs: raise your temperature and rehearse the movement you are about to load. It does not need to be long, and it does not need to involve twenty minutes of stretching. Static stretching a muscle immediately before you try to lift heavy with it is the one thing worth avoiding.",
      },
      {
        kind: "heading",
        text: "The structure",
      },
      {
        kind: "steps",
        items: [
          "Five minutes of easy cardio until your breathing lifts and you feel warm — bike, rower, brisk incline walk.",
          "Move the joints you are about to use through their range: arm circles and band pull-aparts for pressing, bodyweight squats and hip hinges for legs.",
          "Then warm up the specific lift. An empty bar or very light set, then two or three progressively heavier sets before your working weight.",
          "Keep warm-up sets short on reps. You are rehearsing, not accumulating fatigue.",
        ],
      },
      {
        kind: "heading",
        text: "Warm-up sets for a heavy lift",
      },
      {
        kind: "para",
        text: "For a heavy compound, ramping up in a few steps lets you check that everything feels right before it matters. A rough ladder is around half your working weight for five reps, then about seventy per cent for three, then around ninety per cent for one, then your working set. Rest briefly between them.",
      },
      {
        kind: "callout",
        tone: "note",
        title: "Stretching has a place — just not there",
        text: "Long static stretches are better placed after training or in a separate session. Before lifting, keep movement dynamic: motion through range rather than holding an end position.",
      },
      {
        kind: "plates",
        slugs: ["barbell-back-squat", "barbell-bench-press", "barbell-military-press"],
        note: "The lifts most worth ramping into carefully. Each blueprint lists its setup cues.",
      },
    ],
  },
  {
    slug: "soreness-and-stalling",
    section: "training",
    title: "Soreness, Plateaus & Deloads",
    summary:
      "What soreness means, what a plateau actually is, and when to back off on purpose.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "Soreness is a poor measure of a session's quality. It reflects how unaccustomed your body was to what you did, which is why a new exercise wrecks you and the same exercise six weeks later does not — even though you are stronger and doing more work.",
      },
      {
        kind: "heading",
        text: "Chasing soreness misleads you",
      },
      {
        kind: "para",
        text: "If soreness were the goal, the optimal strategy would be to change exercises constantly and never repeat anything. That is precisely the strategy that produces no measurable progress. Judge a session by whether you beat your log, not by how much it hurts to sit down the next day.",
      },
      {
        kind: "heading",
        text: "What a real plateau looks like",
      },
      {
        kind: "para",
        text: "A plateau is several weeks with no improvement in weight or reps on a lift, while training and eating consistently. Two bad sessions is not a plateau — that is normal fluctuation from sleep, stress and food. Before changing anything, check the obvious causes.",
      },
      {
        kind: "list",
        items: [
          "Are you sleeping enough? Short sleep degrades performance and recovery quickly.",
          "Are you eating enough? You cannot add much muscle in a large calorie deficit.",
          "Are you actually training hard? Sets left at four reps in reserve stall progress quietly.",
          "Are you being consistent? Three good weeks and one missed week is not a training block.",
          "Has the exercise stopped fitting you? Some movements suit some bodies badly.",
        ],
      },
      {
        kind: "heading",
        text: "Deloads: backing off on purpose",
      },
      {
        kind: "para",
        text: "A deload is a planned easier week — typically the same movements with meaningfully lighter weights or fewer sets — used to let accumulated fatigue clear so performance can rebound. It feels like wasted time and usually is not. Many lifters find one every six to ten weeks of hard training keeps things moving.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Pain is not a plateau",
        text: "If a lift hurts rather than being hard, do not deload and return to the same thing. Stop that movement and get assessed by a physiotherapist or doctor. Training through joint pain is how small problems become long ones.",
      },
    ],
  },
];
