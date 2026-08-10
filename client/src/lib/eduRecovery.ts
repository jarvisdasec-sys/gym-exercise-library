/**
 * Education articles — Recovery & Sleep + Supplements.
 *
 * THE SUPPLEMENT SECTION IS THE HIGHEST-RISK CONTENT ON THIS SITE. Rules:
 *  1. Every claim traces to a named, real, verifiable source. Sources are listed
 *     on the article and recorded in /home/ubuntu/supplement_evidence_notes.md.
 *  2. Supplements are graded by EVIDENCE STRENGTH, not by popularity or by what
 *     a gym could profitably sell. Where evidence is absent we say so plainly.
 *  3. Doses are reported as "doses used in studies", attributed — never as a
 *     recommendation to an individual.
 *  4. No claim that any supplement treats, prevents or cures anything.
 *  5. Every article routes people with conditions, on medication, pregnant, or
 *     under 18 to a doctor or pharmacist.
 */
import type { EduArticle } from "./education";

export const RECOVERY_ARTICLES: EduArticle[] = [
  {
    slug: "sleep-and-training",
    section: "recovery",
    title: "Sleep & Training",
    summary:
      "The highest-leverage recovery tool there is, and the one most lifters ignore.",
    minutes: 5,
    body: [
      {
        kind: "para",
        text: "If you are training consistently and not progressing, sleep is the first place to look — ahead of your programme, ahead of your supplements, ahead of almost everything else. Short sleep degrades performance, blunts recovery, increases perceived effort and makes appetite harder to manage. No training plan compensates for it.",
      },
      {
        kind: "heading",
        text: "What under-sleeping does to a session",
      },
      {
        kind: "list",
        items: [
          "The same weight feels heavier, so you do less work at the same effort.",
          "Coordination and reaction time drop, which matters most on technical lifts.",
          "Appetite regulation shifts, making a controlled intake harder to sustain.",
          "Motivation falls, so sessions get skipped rather than merely being worse.",
        ],
      },
      {
        kind: "heading",
        text: "Fixing the obvious things first",
      },
      {
        kind: "para",
        text: "Most sleep problems among people who train are behavioural rather than clinical: a late session that leaves you wired, caffeine too late in the day, or an inconsistent schedule. Those are all fixable without much effort.",
      },
      {
        kind: "steps",
        items: [
          "Keep the same rough wake time every day, including weekends. Consistency matters more than total hours in isolation.",
          "Stop caffeine well before bed — its effects last far longer than the alert feeling does. See the supplements section for detail.",
          "If you train late and struggle to wind down, allow a longer gap between finishing and going to bed.",
          "Keep the room dark and cool, and get bright light in the morning rather than at night.",
        ],
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Persistent sleep problems are a medical matter",
        text: "If you sleep badly most nights despite sensible habits, or you snore heavily and wake unrefreshed, speak to a doctor. Sleep disorders are common, treatable, and not something to solve with training advice.",
      },
    ],
  },
  {
    slug: "rest-days",
    section: "recovery",
    title: "Rest Days Are Training",
    summary:
      "Why the adaptation happens between sessions, and what to do on an off day.",
    minutes: 4,
    body: [
      {
        kind: "para",
        text: "Training provides the stimulus. The adaptation — the actual repair and growth — happens in the hours and days afterwards, provided you give it food and sleep. Train every day without regard for recovery and you accumulate fatigue faster than adaptation, which looks exactly like a plateau.",
      },
      {
        kind: "heading",
        text: "How many rest days",
      },
      {
        kind: "para",
        text: "There is no single number. What matters is whether performance is holding up. If your lifts are climbing, sleep is decent and you are not permanently sore, your current arrangement is working. If lifts are stalling and you feel run down, more rest is a more likely fix than more training.",
      },
      {
        kind: "heading",
        text: "Active recovery",
      },
      {
        kind: "para",
        text: "A rest day does not have to mean the sofa. Easy movement — a walk, a gentle ride, some light stretching — tends to leave people feeling better than complete inactivity, without adding meaningful fatigue. The test is whether it leaves you fresher, not more tired.",
      },
      {
        kind: "sessions",
        slugs: ["core-and-abs"],
        note: "Light core work is a reasonable low-fatigue option on an easier day.",
      },
      {
        kind: "heading",
        text: "Signs you are under-recovering",
      },
      {
        kind: "list",
        items: [
          "Lifts drifting backwards across several weeks despite consistent effort.",
          "Waking unrefreshed most mornings.",
          "Losing interest in sessions you normally look forward to.",
          "Persistent aches in joints rather than muscles.",
          "Getting ill more often than usual.",
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "Deloads belong here too",
        text: "A planned easier week is a recovery tool, not an admission of weakness. The training fundamentals section covers when to use one.",
      },
    ],
  },
  {
    slug: "stretching-and-mobility",
    section: "recovery",
    title: "Stretching & Mobility",
    summary:
      "What stretching does, what it does not do, and where to put it in your week.",
    minutes: 4,
    body: [
      {
        kind: "para",
        text: "Stretching improves how far a joint can comfortably move. That is genuinely useful — for reaching a full squat depth, for pressing overhead without arching, for getting into position on a row. What it does not reliably do is prevent injury or remove muscle soreness, despite both claims being repeated constantly.",
      },
      {
        kind: "heading",
        text: "Where to put it",
      },
      {
        kind: "table",
        headers: ["When", "What kind", "Why"],
        rows: [
          [
            "Before lifting",
            "Dynamic — movement through range",
            "Prepares the joint without reducing force output",
          ],
          [
            "After lifting",
            "Static holds, if you like them",
            "Convenient timing, you are already warm",
          ],
          [
            "Separate session",
            "Longer static or mobility work",
            "Best option if range of motion is a genuine limiter for you",
          ],
        ],
      },
      {
        kind: "heading",
        text: "Lifting through a full range is mobility work",
      },
      {
        kind: "para",
        text: "Taking exercises through their complete range under control does much of what stretching does, with the added benefit of building strength in those positions. A properly performed squat, Romanian deadlift or overhead press is a mobility exercise as well as a strength one.",
      },
      {
        kind: "plates",
        slugs: ["romanian-deadlift", "barbell-back-squat", "dumbbell-overhead-press"],
        note: "Full-range lifts that build strength and usable range at the same time.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Do not stretch into pain",
        text: "A stretch should feel like tension, not sharpness. If a specific position hurts or a joint feels unstable, that needs assessing by a physiotherapist rather than stretching harder.",
      },
    ],
  },
];

export const SUPPLEMENT_ARTICLES: EduArticle[] = [
  {
    slug: "how-to-judge-a-supplement",
    section: "supplements",
    title: "How To Judge Any Supplement",
    summary:
      "The regulatory reality, the contamination risk, and the questions that cut through marketing.",
    minutes: 6,
    body: [
      {
        kind: "para",
        text: "Read this before the individual product articles. Supplements are the most aggressively marketed corner of fitness, and the marketing is largely unconstrained by evidence. Understanding why explains most of what follows.",
      },
      {
        kind: "heading",
        text: "Supplements are not approved before sale",
      },
      {
        kind: "para",
        text: "In the United States, dietary supplements are not reviewed for safety or effectiveness before they reach shelves. The FDA can act against a product only after it is on the market [1]. That is a fundamentally different regime from medicines, and it means the presence of a product in a shop tells you nothing about whether it works or whether the label is accurate.",
      },
      {
        kind: "quote",
        text: "Unlike drugs, supplements are not intended to treat, diagnose, prevent, or cure diseases. That means supplements should not make claims, such as \"reduces pain\" or \"treats heart disease\".",
        attribution: "US Food and Drug Administration, quoted in Clemesha et al. (2020)",
      },
      {
        kind: "heading",
        text: "Labels are not always accurate",
      },
      {
        kind: "para",
        text: "Analyses have repeatedly found products containing ingredients not on the label. One review of adulterated supplements identified unapproved pharmaceutical ingredients including chlorpromazine, doxepin, furosemide and phenylbutazone in products sold as dietary supplements [2]. Separately, over-the-counter products have been found to contain designer steroid compounds [3].",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "If you are drug tested, this matters enormously",
        text: "The IOC consensus statement notes that inadvertent ingestion of substances prohibited under anti-doping codes is a known risk of taking some supplements [4]. If you compete in tested sport, use only products carrying independent batch certification such as Informed Sport or NSF Certified for Sport — and understand that even that reduces rather than eliminates risk.",
      },
      {
        kind: "heading",
        text: "Five questions that cut through the marketing",
      },
      {
        kind: "steps",
        items: [
          "Is there human research on this ingredient, at this dose, in people like me? Animal and test-tube studies are not enough.",
          "Does the label disclose actual amounts, or hide them inside a proprietary blend? A blend means you cannot know whether any ingredient is at an effective dose.",
          "Is the claimed effect large enough to matter? Many real effects are too small to notice.",
          "What is this replacing? A supplement that costs a week of groceries is competing with food that would have done more.",
          "Is my training, food and sleep already handled? If not, no product will compensate.",
        ],
      },
      {
        kind: "heading",
        text: "The honest hierarchy",
      },
      {
        kind: "para",
        text: "The IOC's expert consensus on supplements for high-performance athletes concluded that of the many products marketed for performance, only a few — naming caffeine, creatine, specific buffering agents and nitrate — have good evidence of benefit [4]. Everything else marketed at gym-goers sits below that line, and much of it sits a long way below.",
      },
      {
        kind: "quote",
        text: "Supplements claiming to directly or indirectly enhance performance are typically the largest group of products marketed to athletes, but only a few (including caffeine, creatine, specific buffering agents and nitrate) have good evidence of benefits.",
        attribution:
          "Maughan et al., IOC consensus statement, British Journal of Sports Medicine (2018)",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Before taking anything",
        text: "Speak to a doctor or pharmacist if you take any medication, have a health condition, are pregnant or breastfeeding, or are under 18. Supplements interact with medicines, and \"natural\" does not mean inert. Nothing in this section is advice about your individual situation.",
      },
    ],
    sources: [
      {
        label: "US FDA — Dietary Supplements",
        url: "https://www.fda.gov/food/dietary-supplements",
      },
      {
        label:
          "Tucker J, et al. Unapproved Pharmaceutical Ingredients Included in Dietary Supplements (2018)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6324457/",
      },
      {
        label:
          "Rahnema CD, et al. Designer steroids — over-the-counter supplements and their androgenic component. Andrology (2015)",
        url: "https://pubmed.ncbi.nlm.nih.gov/25684733/",
      },
      {
        label:
          "Maughan RJ, et al. IOC consensus statement: dietary supplements and the high-performance athlete. Br J Sports Med (2018)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867441/",
      },
    ],
  },
  {
    slug: "creatine",
    section: "supplements",
    title: "Creatine Monohydrate",
    summary:
      "The best-evidenced supplement in the category, and one of the cheapest.",
    minutes: 6,
    body: [
      {
        kind: "callout",
        tone: "note",
        title: "Evidence: strong",
        text: "Named by the IOC consensus statement as one of the few supplements with good evidence of benefit, and the subject of an extensive ISSN position stand.",
      },
      {
        kind: "para",
        text: "Creatine is a compound found naturally in red meat and seafood and produced by your own liver and kidneys. Around 95% of it sits in skeletal muscle, where it helps regenerate the energy currency your muscles use for short, hard efforts [1].",
      },
      {
        kind: "heading",
        text: "What the evidence shows",
      },
      {
        kind: "para",
        text: "The ISSN position stand concludes that creatine monohydrate is the most effective nutritional supplement available for increasing high-intensity exercise capacity and lean body mass during training, a conclusion it notes was echoed by the American Dietetic Association, Dietitians of Canada and the American College of Sports Medicine [1]. After loading, performance of high-intensity or repeated efforts is generally improved by roughly 10 to 20%, depending on how much muscle stores rise.",
      },
      {
        kind: "para",
        text: "The mechanism is well understood rather than speculative. A normal diet leaves muscle creatine stores only about 60 to 80% saturated; supplementation raises muscle creatine and phosphocreatine by 20 to 40% [1].",
      },
      {
        kind: "heading",
        text: "Protocols used in the research",
      },
      {
        kind: "para",
        text: "Reported for information, not as a recommendation for you. The ISSN describes the most effective loading approach as 5 g of creatine monohydrate four times daily for five to seven days, after which stores are generally maintained on 3 to 5 g per day, with larger athletes sometimes needing 5 to 10 g [1]. An alternative is 3 g daily for 28 days, which reaches the same place more slowly. Taking it with carbohydrate, or carbohydrate and protein, improved retention in studies.",
      },
      {
        kind: "heading",
        text: "Safety",
      },
      {
        kind: "para",
        text: "This is the most reassuring safety record in the category. The ISSN reports that short and long-term supplementation — up to 30 g per day for five years — is safe and well tolerated in healthy individuals and in patient populations ranging from infants to the elderly [1]. There is no evidence that your body stops making its own creatine after you stop taking it.",
      },
      {
        kind: "table",
        headers: ["Common claim", "What the evidence says"],
        rows: [
          [
            "It damages your kidneys",
            "Not supported in healthy people across long-term studies [1]. Anyone with existing kidney disease should speak to their doctor",
          ],
          [
            "You need to cycle on and off",
            "No evidence of long-term suppression of your own production, so no physiological need to cycle [1]",
          ],
          [
            "Expensive forms work better",
            "Claims that citrate, ethyl ester, buffered forms or nitrate give greater retention than monohydrate are described as unfounded [1]",
          ],
          [
            "It is a steroid",
            "It is not. It is a compound found in ordinary food — a pound of uncooked beef or salmon provides roughly 1 to 2 g [1]",
          ],
          [
            "It causes cramping and dehydration",
            "Research cited in the position stand found creatine users experienced significantly less cramping and heat illness, not more [1]",
          ],
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "Buy the cheap one",
        text: "Creatine monohydrate is both the best-studied form and the least expensive. The premium versions on the shelf next to it are the ones without the evidence. Vegetarians tend to have lower baseline stores and may notice more from it [1].",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Who should check first",
        text: "Speak to a doctor before using it if you have kidney disease or any chronic condition, take regular medication, are pregnant or breastfeeding, or are under 18.",
      },
    ],
    sources: [
      {
        label:
          "Kreider RB, et al. ISSN position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. J Int Soc Sports Nutr (2017)",
        url: "https://www.tandfonline.com/doi/full/10.1186/s12970-017-0173-z",
      },
      {
        label:
          "Maughan RJ, et al. IOC consensus statement: dietary supplements and the high-performance athlete. Br J Sports Med (2018)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867441/",
      },
    ],
  },
  {
    slug: "protein-powder",
    section: "supplements",
    title: "Protein Powder",
    summary:
      "Convenient food, not a special substance. Useful for exactly one reason.",
    minutes: 4,
    body: [
      {
        kind: "callout",
        tone: "note",
        title: "Evidence: strong for what it is",
        text: "Protein intake supporting training adaptation is well established. Powder specifically is a delivery method, not a separate effect.",
      },
      {
        kind: "para",
        text: "Protein powder is dried protein, usually from milk (whey or casein) or plants (soy, pea, rice). It does something no other supplement in this section does: it makes hitting a daily protein target easy when food is inconvenient. That is its entire value, and it is a real one.",
      },
      {
        kind: "heading",
        text: "What the research supports",
      },
      {
        kind: "para",
        text: "The ISSN position stand on protein reports general recommendations of around 0.25 g of high-quality protein per kilogram of body weight per serving, or an absolute dose of roughly 20 to 40 g, for stimulating muscle protein synthesis [1]. Whether that arrives as chicken, eggs, lentils or powder is largely immaterial to the muscle.",
      },
      {
        kind: "heading",
        text: "Choosing between the types",
      },
      {
        kind: "table",
        headers: ["Type", "Characteristics", "Reasonable use"],
        rows: [
          [
            "Whey concentrate",
            "Cheapest, digests quickly, contains some lactose",
            "The sensible default for most people",
          ],
          [
            "Whey isolate",
            "More filtered, less lactose, costs more",
            "Worth it if concentrate upsets your stomach",
          ],
          [
            "Casein",
            "Digests slowly, thick when mixed",
            "Preference, not necessity — the overnight-muscle claims are overstated",
          ],
          [
            "Plant blends",
            "Vegan; blends cover the amino acid profile better than single sources",
            "The obvious choice on a plant-based diet",
          ],
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "The anabolic window is much wider than advertised",
        text: "Rushing a shake down within minutes of finishing is not necessary. Total daily protein, spread reasonably across meals, is what matters.",
      },
      {
        kind: "heading",
        text: "When to skip it",
      },
      {
        kind: "para",
        text: "If you already eat protein at most meals and hit a sensible daily total, powder adds convenience and nothing else. It is not a requirement for building muscle, and framing it as one is marketing.",
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
    slug: "caffeine",
    section: "supplements",
    title: "Caffeine & Pre-Workout",
    summary:
      "Genuinely effective, widely overdosed, and the reason your sleep is bad.",
    minutes: 5,
    body: [
      {
        kind: "callout",
        tone: "note",
        title: "Evidence: strong",
        text: "One of the four categories the IOC consensus statement names as having good evidence of performance benefit [1].",
      },
      {
        kind: "para",
        text: "Caffeine reduces how hard a given effort feels and improves performance across a wide range of activities. It works, it is cheap, and it is in coffee. The problems with it are practical rather than a question of whether it does anything.",
      },
      {
        kind: "heading",
        text: "The three things people get wrong",
      },
      {
        kind: "list",
        items: [
          "Dose creep. More is not proportionally better, and past a point you get jitters, a racing heart and a worse session rather than a better one.",
          "Timing. Caffeine lingers in your system for many hours. An afternoon pre-workout is a common cause of the poor sleep that then undermines the training.",
          "Tolerance. Habitual use blunts the effect, so the dose that once worked becomes the dose you need to feel normal.",
        ],
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Sleep beats stimulants",
        text: "Using caffeine late to power through a session, then sleeping badly, then needing more caffeine tomorrow is a loop that costs more than the sessions gained. If you train in the evening, consider training without it.",
      },
      {
        kind: "heading",
        text: "What is actually in a pre-workout",
      },
      {
        kind: "para",
        text: "Most pre-workout powders are caffeine plus some combination of beta-alanine, citrulline and assorted ingredients with thinner evidence, sold at a substantial markup. Judge one by its disclosed ingredient amounts. If the label hides quantities behind a proprietary blend, you cannot know whether anything in it is dosed usefully.",
      },
      {
        kind: "table",
        headers: ["Typical ingredient", "Evidence position"],
        rows: [
          ["Caffeine", "Strong — the ingredient doing most of the work [1]"],
          [
            "Beta-alanine",
            "Reasonable for high-intensity efforts of roughly one to ten minutes; the tingling it causes is harmless and is not the effect",
          ],
          [
            "Citrulline",
            "Modest evidence; the pumped feeling is real but is not the same as a performance gain",
          ],
          [
            "Proprietary blends",
            "Unassessable by design. Undisclosed amounts mean undisclosed effectiveness",
          ],
        ],
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Who should be careful",
        text: "Caffeine affects heart rate and blood pressure and interacts with several medications. Speak to a doctor or pharmacist if you have a heart condition, high blood pressure or anxiety, are pregnant or breastfeeding, or are under 18. Concentrated caffeine powders have caused deaths through dosing errors — never measure bulk powder by eye.",
      },
    ],
    sources: [
      {
        label:
          "Maughan RJ, et al. IOC consensus statement: dietary supplements and the high-performance athlete. Br J Sports Med (2018)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867441/",
      },
    ],
  },
  {
    slug: "vitamins-and-minerals",
    section: "supplements",
    title: "Vitamins, Minerals & Omega-3",
    summary:
      "These correct deficiencies. They do not improve on adequate. The distinction is everything.",
    minutes: 6,
    body: [
      {
        kind: "callout",
        tone: "note",
        title: "Evidence: strong for correcting a deficiency, weak otherwise",
        text: "Fixing a genuine shortfall helps. Taking more when you are already replete generally does nothing, and in some cases causes harm.",
      },
      {
        kind: "para",
        text: "This is the most misunderstood category. Micronutrients are essential, and a real deficiency measurably impairs health and training. But the benefit comes from removing the deficiency — not from pushing intake ever higher. Once you are sufficient, more is not better, and for some nutrients more is actively worse.",
      },
      {
        kind: "heading",
        text: "Vitamin D",
      },
      {
        kind: "para",
        text: "Many people are insufficient at some point in the year, particularly with limited sun exposure. The IOC consensus notes there is no consensus on the blood level that defines deficiency, that supplementation of roughly 800 to 2000 IU per day is recommended to maintain status in the general population, and that guidelines specific to athletes are not yet established [1]. Higher restorative doses require monitoring to avoid toxicity.",
      },
      {
        kind: "heading",
        text: "Iron — the one to be careful with",
      },
      {
        kind: "para",
        text: "Iron deficiency genuinely impairs training, and it is more common in menstruating women, endurance athletes and people eating little meat. But iron is also the clearest case where self-prescribing is a bad idea. The IOC statement is direct about it.",
      },
      {
        kind: "quote",
        text: "High-dose iron supplements, however, should not be taken unless iron deficiency is present.",
        attribution:
          "Maughan et al., IOC consensus statement, British Journal of Sports Medicine (2018)",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Iron needs a blood test, not a guess",
        text: "Diagnosis requires several measures taken together, and iron overload causes real harm. Fatigue has many causes. Get tested and follow clinical advice rather than buying a supplement on a hunch.",
      },
      {
        kind: "heading",
        text: "Zinc, magnesium and multivitamins",
      },
      {
        kind: "para",
        text: "These appear in almost every stack and are usually unnecessary if you eat a varied diet. Zinc in particular has a defined upper limit: over-supplementation interferes with copper and iron utilisation, adversely affects HDL cholesterol, and at higher doses causes anaemia, neutropenia and impaired immune function [2]. A multivitamin is cheap insurance against a patchy diet; it is not a performance product.",
      },
      {
        kind: "heading",
        text: "Omega-3",
      },
      {
        kind: "para",
        text: "Reasonable general-health rationale, particularly if you eat little oily fish. The claims made for it in a training context — recovery, soreness, body composition — run well ahead of the evidence. Treat it as a dietary gap-filler rather than a performance supplement.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Test, do not guess",
        text: "The sensible route for any micronutrient is a blood test through your doctor, then supplementation targeted at what is actually low, with follow-up. Speak to a doctor or pharmacist before starting anything, especially alongside medication.",
      },
    ],
    sources: [
      {
        label:
          "Maughan RJ, et al. IOC consensus statement: dietary supplements and the high-performance athlete. Br J Sports Med (2018)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867441/",
      },
      {
        label:
          "Clemesha CG, et al. 'Testosterone Boosting' Supplements Composition and Claims Are not Supported by the Academic Literature. World J Mens Health (2020)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6920068/",
      },
    ],
  },
  {
    slug: "performance-supplements",
    section: "supplements",
    title: "Beta-Alanine, Bicarbonate & Nitrate",
    summary:
      "Three with real evidence, narrow applications, and unglamorous side effects.",
    minutes: 5,
    body: [
      {
        kind: "callout",
        tone: "note",
        title: "Evidence: good, within narrow limits",
        text: "The IOC names buffering agents and nitrate alongside caffeine and creatine as having good evidence [1]. The important word is narrow — each helps a specific kind of effort.",
      },
      {
        kind: "para",
        text: "These three are the least marketed of the well-evidenced supplements, largely because their benefits are specific and their side effects are unappealing. That makes them more honest than most of the shelf.",
      },
      {
        kind: "heading",
        text: "Beta-alanine",
      },
      {
        kind: "para",
        text: "Helps buffer the acidity that builds up during sustained hard efforts, so its usefulness concentrates on work lasting roughly one to ten minutes — think high-rep sets taken close to failure, hard intervals, or a rowing test. It needs consistent daily use over weeks to build up; a single dose before training does nothing. The tingling sensation many people get is harmless and is not the mechanism.",
      },
      {
        kind: "heading",
        text: "Sodium bicarbonate",
      },
      {
        kind: "para",
        text: "Ordinary baking soda, used as an acute buffer for similar high-intensity efforts. The catch is gastrointestinal distress, which for some people is severe enough to ruin the session it was meant to improve. Anyone considering it should trial it well away from anything that matters.",
      },
      {
        kind: "heading",
        text: "Dietary nitrate and beetroot juice",
      },
      {
        kind: "para",
        text: "Relates to endurance efficiency — using slightly less oxygen at a given pace. Most relevant to sustained endurance work rather than lifting. Beetroot juice is the usual vehicle, and it will alarm you the next day if you are not expecting the colour change.",
      },
      {
        kind: "table",
        headers: ["Supplement", "Helps with", "Main drawback"],
        rows: [
          [
            "Beta-alanine",
            "Sustained high-intensity work, roughly 1–10 minutes",
            "Needs weeks of daily use; harmless tingling",
          ],
          [
            "Sodium bicarbonate",
            "Similar high-intensity buffering, acutely",
            "Gastrointestinal distress is common and can be severe",
          ],
          [
            "Nitrate / beetroot",
            "Endurance efficiency",
            "Little relevance to strength training",
          ],
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "Individual response varies widely",
        text: "The IOC statement stresses that responses to supplements vary substantially between people because of genetics, gut microbiome and habitual diet, and that anything intended to help performance should be trialled in training first [1].",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "Check before use",
        text: "Sodium bicarbonate is a significant sodium load, which matters if you have high blood pressure or kidney concerns. Speak to a doctor or pharmacist first, and always if you take medication or are pregnant or breastfeeding.",
      },
    ],
    sources: [
      {
        label:
          "Maughan RJ, et al. IOC consensus statement: dietary supplements and the high-performance athlete. Br J Sports Med (2018)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5867441/",
      },
    ],
  },
  {
    slug: "what-does-not-work",
    section: "supplements",
    title: "What The Evidence Does Not Support",
    summary:
      "Testosterone boosters, fat burners, BCAAs and the rest of the shelf. Named plainly.",
    minutes: 7,
    body: [
      {
        kind: "callout",
        tone: "warn",
        title: "Evidence: weak, absent, or contradicted",
        text: "Everything in this article is widely sold and heavily marketed. That is not the same as working. Where research exists it is largely unsupportive; where it does not exist, we say so.",
      },
      {
        kind: "para",
        text: "A gym could make money selling most of what follows. We would rather members knew what the research says, because the credibility of everything else on this site depends on us not pretending.",
      },
      {
        kind: "heading",
        text: "Testosterone boosters",
      },
      {
        kind: "para",
        text: "The evidence here is unusually damning. An analysis of 50 testosterone-boosting products found 90% claimed to raise testosterone, but only 24.8% of their ingredients had any published data showing an increase. Some 61.5% of ingredients had no data at all on testosterone, and 10.1% had data showing a decrease [1].",
      },
      {
        kind: "para",
        text: "A later systematic review covering 52 studies and 27 proposed boosters concluded that most fail to increase total testosterone, with Tribulus terrestris and D-aspartic acid — two of the most common ingredients — specifically among those that do not work [2].",
      },
      {
        kind: "table",
        headers: ["Finding", "Figure"],
        rows: [
          ["Products claiming to boost testosterone", "90%"],
          ["Ingredients with any data showing an increase", "24.8%"],
          ["Ingredients with no testosterone data at all", "61.5%"],
          ["Ingredients with data showing a decrease", "10.1%"],
          ["Ingredients with more than two supporting studies", "5.5%"],
        ],
        caption:
          "From Clemesha et al. (2020), analysing 50 products and 109 unique ingredients [1].",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "And they are not harmless",
        text: "The same analysis found products carrying a median of 1,291% of the recommended daily intake of vitamin B12, 807% of B6 and 272% of zinc, with thirteen products exceeding the upper tolerable limit for zinc, B3 or magnesium [1]. It also documents a case of bilateral pulmonary embolism linked to an over-the-counter fenugreek-containing product, and a trial in which red clover produced no sexual benefit but a significant rise in liver enzymes [1].",
      },
      {
        kind: "heading",
        text: "Fat burners and thermogenics",
      },
      {
        kind: "para",
        text: "Where effects exist at all they are small — reviews describe minor reductions in body mass relative to what diet and training achieve. Chromium supplements, a long-standing ingredient in this category, are not effective for weight loss [3].",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "This category has caused serious harm",
        text: "Fat burners and related products have caused acute liver failure, with some associated with severe hepatotoxicity [4]. This is documented clinical harm, not a theoretical risk. Weigh a marginal, unproven effect against that.",
      },
      {
        kind: "heading",
        text: "The rest of the shelf",
      },
      {
        kind: "table",
        headers: ["Product", "Position"],
        rows: [
          [
            "BCAAs",
            "Largely redundant if your total protein intake is adequate — you are buying a fraction of what protein already provides",
          ],
          [
            "Tribulus terrestris",
            "Systematic reviews find it does not increase testosterone in humans [2]",
          ],
          [
            "D-aspartic acid",
            "Among the boosters specifically found not to raise total testosterone [2]",
          ],
          [
            "Glutamine",
            "No meaningful case for healthy people who train and eat normally",
          ],
          [
            "Mass gainers",
            "Expensive calories. Milk, oats and peanut butter do the same job cheaper",
          ],
          [
            "ZMA",
            "Zinc and magnesium, useful only if you are deficient — and zinc has an upper limit worth respecting",
          ],
          [
            "Detox and cleanse products",
            "Your liver and kidneys already do this. No credible mechanism",
          ],
          [
            "Collagen for joints",
            "Emerging at best, frequently overstated. Not in the same evidential class as creatine",
          ],
        ],
      },
      {
        kind: "heading",
        text: "Where that money is better spent",
      },
      {
        kind: "para",
        text: "A month of testosterone booster or fat burner typically costs more than a month of creatine monohydrate, which actually has the evidence behind it — or several weeks of the extra protein-rich food that would do more than either. Nothing in the supplement aisle competes with sleeping properly and training consistently.",
      },
      {
        kind: "callout",
        tone: "warn",
        title: "If you think something is medically wrong, see a doctor",
        text: "Persistent fatigue, low libido, unexplained weight change or low mood deserve proper medical assessment, not a supplement. These symptoms have real causes that are diagnosable and often treatable. Buying a product delays finding out.",
      },
    ],
    sources: [
      {
        label:
          "Clemesha CG, Thaker H, Samplaski MK. 'Testosterone Boosting' Supplements Composition and Claims Are not Supported by the Academic Literature. World J Mens Health (2020)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6920068/",
      },
      {
        label:
          "Morgado A, et al. Do 'testosterone boosters' really increase serum total testosterone? A systematic review. Int J Impot Res (2024)",
        url: "https://www.nature.com/articles/s41443-023-00763-9",
      },
      {
        label:
          "Jeukendrup AE, Randell R. Fat burners: nutrition supplements that increase fat metabolism. Obesity Reviews (2011)",
        url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-789x.2011.00908.x",
      },
      {
        label:
          "Krishna YR, et al. Acute liver failure caused by 'fat burners' and dietary supplements",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3076034/",
      },
    ],
  },
];
