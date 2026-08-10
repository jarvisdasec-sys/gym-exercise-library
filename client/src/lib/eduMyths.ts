/**
 * Education articles — myth-busting, filed under Training Fundamentals.
 *
 * SCOPE DISCIPLINE: these are claims about how training and bodies work that
 * are demonstrably wrong and cause members to waste effort. We deliberately do
 * NOT cover anything that requires diagnosing a person, and we do not make
 * hormonal or metabolic claims beyond correcting plain factual errors.
 */
import type { EduArticle } from "./education";

export const MYTH_ARTICLES: EduArticle[] = [
  {
    slug: "gym-myths",
    section: "training",
    title: "Myths Worth Dropping",
    summary:
      "Spot reduction, toning, muscle turning to fat, and the rest of the gym-floor folklore.",
    minutes: 6,
    body: [
      {
        kind: "para",
        text: "Some ideas persist on gym floors for decades despite being straightforwardly wrong. They matter because each one leads people to spend effort where it will not pay off.",
      },
      {
        kind: "heading",
        text: "You cannot target fat loss to one area",
      },
      {
        kind: "para",
        text: "Doing hundreds of sit-ups does not remove fat from your midsection specifically. Fat is mobilised from across the body in a pattern largely determined by genetics, not by which muscle you just worked. Ab exercises build abdominal muscle; whether it is visible depends on overall body fat.",
      },
      {
        kind: "plates",
        slugs: ["hanging-leg-raise", "kneeling-cable-crunch", "plank"],
        note: "Worth doing to build the muscle. Not a route to removing fat from that area specifically.",
      },
      {
        kind: "heading",
        text: "Toning is not a separate process",
      },
      {
        kind: "para",
        text: "There is no distinct mechanism called toning. The appearance people mean by it is a combination of having some muscle and having low enough body fat to see it. The training that produces it is the same resistance training everyone else does — not high-rep work with tiny weights.",
      },
      {
        kind: "heading",
        text: "Muscle does not turn into fat",
      },
      {
        kind: "para",
        text: "They are entirely different tissues; neither converts into the other. What happens when someone stops training is that muscle mass declines from disuse while fat mass often rises because energy intake stayed the same. Two separate changes, one misleading impression.",
      },
      {
        kind: "heading",
        text: "Lifting heavy will not make women bulky",
      },
      {
        kind: "para",
        text: "Building substantial muscle is slow and difficult for everyone, and the hormonal environment makes it slower still for most women. Heavy resistance training is the most effective route to the strength and shape most women say they want, and the outcome people fear is not something that happens by accident from three sessions a week.",
      },
      {
        kind: "heading",
        text: "Sweat is not a measure of anything",
      },
      {
        kind: "para",
        text: "Sweating reflects temperature regulation, room conditions and individual physiology. A heavy squat session might produce less sweat than a hot spin class while driving far more adaptation. Judge sessions by the log, not the puddle.",
      },
      {
        kind: "table",
        headers: ["Claim", "Reality"],
        rows: [
          [
            "You must eat within 30 minutes of training",
            "Total daily intake matters far more than a narrow window",
          ],
          [
            "Machines are for beginners only",
            "Machines are a legitimate tool at every level; they simply hold the movement path",
          ],
          [
            "Free weights are always better than machines",
            "Each has advantages. The best exercise is often the one you can load and repeat well",
          ],
          [
            "No pain, no gain",
            "Effort yes, pain no. Joint pain is information, not a badge",
          ],
          [
            "You need to confuse the muscles",
            "Muscles do not get confused. Progression requires repeating and beating a movement",
          ],
          [
            "Cardio kills your gains",
            "Ordinary amounts of conditioning coexist fine with lifting",
          ],
          [
            "Lifting stunts growth in teenagers",
            "Not supported. Supervised, well-taught resistance training is broadly considered appropriate for young people",
          ],
        ],
      },
      {
        kind: "callout",
        tone: "note",
        title: "How to evaluate the next claim you hear",
        text: "Ask who benefits from you believing it, whether there is human research behind it, and whether the effect would be big enough to notice. Most gym folklore fails all three.",
      },
    ],
  },
];
