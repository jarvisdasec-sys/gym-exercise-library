import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { INSTAGRAM_URL, trackSocialClick } from "@/lib/social";

export function SocialFooter() {
  return (
    <footer className="no-print border-t border-neutral-800 bg-[#0b0b0b]">
      <div className="container flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="display text-base font-semibold text-white">
            Build The Body
          </p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/55">
            Follow @btbfitnessandhealth for exercise form breakdowns, workout
            ideas and practical nutrition education.
          </p>
          <a
            href="/instagram"
            onClick={() => trackSocialClick("/instagram", "footer-hub")}
            className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm text-lime underline decoration-lime/40 underline-offset-4 hover:decoration-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            Coming from Instagram? Start here{" "}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSocialClick(INSTAGRAM_URL, "footer-follow")}
            className="flex min-h-12 items-center justify-center gap-3 border border-lime/50 px-4 py-3 text-sm font-semibold text-lime transition-colors hover:bg-lime/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" /> Follow BTB on
            Instagram
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href="https://www.facebook.com/btbfitnessandhealth"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow BTB on Facebook (opens in a new tab)"
            className="flex h-12 w-12 items-center justify-center border border-neutral-800 text-white/65 transition-colors hover:border-lime hover:text-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
          >
            <Facebook className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
