import { ArrowUpRight, Instagram } from "lucide-react";
import { INSTAGRAM_URL, trackSocialClick } from "@/lib/social";

export function InstagramFollow() {
  return (
    <section
      aria-labelledby="instagram-follow-heading"
      className="border-b border-white/10 bg-black"
    >
      <div className="container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Instagram
            className="mt-1 h-5 w-5 shrink-0 text-lime"
            aria-hidden="true"
          />
          <div>
            <h2
              id="instagram-follow-heading"
              className="display text-xl font-semibold text-white"
            >
              Train with BTB.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              Exercise form breakdowns, workout ideas and practical nutrition
              education at @btbfitnessandhealth.
            </p>
          </div>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSocialClick(INSTAGRAM_URL, "homepage-follow")}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 border border-lime/50 px-5 py-3 text-sm font-semibold text-lime transition-colors hover:bg-lime/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
        >
          Follow BTB on Instagram{" "}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
