/**
 * Education content — the BTB knowledge base.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"): coach-direct, imperative, no
 * hype. Articles read like a training manual, not a blog. Section labels are
 * mono caps; body copy is plain sentences a nervous first-timer can follow.
 *
 * COMPLIANCE RULES BAKED INTO THIS FILE — do not relax them:
 *  1. This is EDUCATION, not prescription. We explain how things work; we never
 *     tell an individual member what they personally should take or do.
 *  2. Supplements are graded by EVIDENCE STRENGTH with the source named. Where
 *     evidence is weak or absent we say so plainly, including for products a gym
 *     could profitably sell. Honesty is the point of the section.
 *  3. Doses appear only as "doses used in studies", attributed, never as advice.
 *  4. Anything touching injury, illness, medication, pregnancy or under-18s
 *     routes to a qualified professional. No diagnosis, no treatment.
 *  5. Every factual claim in the supplement section traces to a real citation
 *     recorded in /home/ubuntu/supplement_evidence_notes.md.
 */

export type EduSectionKey =
  | "start-here"
  | "training"
  | "etiquette"
  | "nutrition"
  | "recovery"
  | "supplements";

export interface EduSection {
  key: EduSectionKey;
  /** short label for the rail */
  label: string;
  /** display title on the section header */
  title: string;
  /** one imperative line under the title */
  tagline: string;
  /** who this section is for */
  audience: string;
}

/** A block of article body content. Kept as a small union so pages render it. */
export type EduBlock =
  | { kind: "para"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "callout"; tone: "note" | "warn"; title: string; text: string }
  | { kind: "quote"; text: string; attribution: string }
  | {
      kind: "table";
      headers: string[];
      rows: string[][];
      caption?: string;
    }
  | { kind: "plates"; slugs: string[]; note: string }
  | { kind: "sessions"; slugs: string[]; note: string };

export interface EduArticle {
  slug: string;
  section: EduSectionKey;
  title: string;
  /** one-line summary for the index card */
  summary: string;
  /** estimated read time in minutes */
  minutes: number;
  /** the article body */
  body: EduBlock[];
  /** named sources, shown at the foot of the article */
  sources?: { label: string; url: string }[];
}

export const EDU_SECTIONS: EduSection[] = [
  {
    key: "start-here",
    label: "Start Here",
    title: "Start Here",
    tagline: "Your first month, without the guesswork.",
    audience: "Brand new to lifting, or coming back after years away",
  },
  {
    key: "training",
    label: "Training",
    title: "Training Fundamentals",
    tagline: "The rules that decide whether the work pays off.",
    audience: "Anyone who trains and wants to know why it works",
  },
  {
    key: "etiquette",
    label: "Gym Floor",
    title: "Gym Floor & Etiquette",
    tagline: "Know the room. Use the kit. Own the space.",
    audience: "New members and anyone unsure of the unwritten rules",
  },
  {
    key: "nutrition",
    label: "Nutrition",
    title: "Nutrition Basics",
    tagline: "Fewer rules than you think. Applied more often.",
    audience: "Members who want food to support the training",
  },
  {
    key: "recovery",
    label: "Recovery",
    title: "Recovery & Sleep",
    tagline: "You grow between sessions, not during them.",
    audience: "Anyone stalling, sore, or training on empty",
  },
  {
    key: "supplements",
    label: "Supplements",
    title: "Supplements: The Evidence",
    tagline: "What works, what doesn't, and who says so.",
    audience: "Anyone deciding whether a product is worth the money",
  },
];
