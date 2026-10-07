import React, { useRef, useState } from "react";
import { ArrowRight, ExternalLink, Instagram, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FEATURED_REELS,
  instagramEmbedUrl,
  instagramReelUrl,
  type FeaturedReel,
} from "@/lib/featuredReels";
import { trackSocialClick } from "@/lib/social";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function BtbMotion() {
  const [selected, setSelected] = useState<FeaturedReel | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const fallbackLink = useRef<HTMLAnchorElement | null>(null);
  return (
    <section
      id="btb-in-motion"
      aria-labelledby="btb-motion-heading"
      className="border-b border-white/10 bg-black py-7 sm:py-9"
    >
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-lime" />
              <span className="meta text-[0.5rem] text-lime">
                Published by @btbfitnessandhealth
              </span>
            </div>
            <h2
              id="btb-motion-heading"
              className="display text-3xl font-bold text-white sm:text-4xl"
            >
              BTB <span className="text-lime">in Motion.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/65">
              Watch the Reel. Open the guide. Put it into practice.
            </p>
          </div>
          <a
            href="/instagram"
            className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-lime hover:underline ${focus}`}
            onClick={() => trackSocialClick("/instagram", "motion-hub")}
          >
            Explore the Instagram hub{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <p
          id="motion-privacy-note"
          className="mt-4 text-xs leading-relaxed text-white/45"
        >
          Covers load from BTB. Instagram's player loads only when you choose it
          and may use cookies. Prefer no embed? Open the original Reel instead.
        </p>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row">
          {FEATURED_REELS.map((reel, index) => (
            <article
              key={reel.id}
              className="min-w-0 flex-1 border border-white/15 bg-plate"
            >
              <div className="flex border-b border-white/12">
                <img
                  src={reel.poster}
                  width={540}
                  height={960}
                  alt={reel.posterAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-48 w-32 shrink-0 bg-black object-contain sm:h-56 sm:w-36"
                />
                <div className="min-w-0 flex-1 p-4">
                  <div className="meta flex items-center justify-between gap-2 text-[0.45rem] text-lime">
                    <span>{reel.topic}</span>
                    <span aria-hidden="true">0{index + 1}</span>
                  </div>
                  <h3 className="display mt-3 text-xl font-bold leading-tight text-white">
                    {reel.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    {reel.description}
                  </p>
                  <p className="meta mt-3 text-[0.4rem] text-white/40">
                    Published{" "}
                    <time dateTime={reel.publishedAt}>{reel.publishedAt}</time>
                  </p>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <button
                  type="button"
                  aria-describedby="motion-privacy-note"
                  onClick={event => {
                    opener.current = event.currentTarget;
                    trackSocialClick(
                      instagramReelUrl(reel.shortcode),
                      `motion-${reel.id}-player`
                    );
                    setSelected(reel);
                  }}
                  className={`flex min-h-11 w-full items-center justify-center gap-2 border border-lime/45 px-3 py-2 text-sm font-semibold text-lime transition-colors hover:bg-lime/10 ${focus}`}
                >
                  <Play className="h-4 w-4" aria-hidden="true" /> Load Instagram
                  player<span className="sr-only">: {reel.title}</span>
                </button>
                <a
                  href={instagramReelUrl(reel.shortcode)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackSocialClick(
                      instagramReelUrl(reel.shortcode),
                      `motion-${reel.id}-instagram`
                    )
                  }
                  className={`flex min-h-11 items-center justify-center gap-2 text-xs text-white/65 hover:text-lime ${focus}`}
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" /> Open
                  original Reel{" "}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">
                    : {reel.title} (opens in a new tab)
                  </span>
                </a>
                <a
                  href={reel.guideHref}
                  onClick={() =>
                    trackSocialClick(reel.guideHref, `motion-${reel.id}-guide`)
                  }
                  className={`flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-2 text-sm font-semibold text-white hover:text-lime ${focus}`}
                >
                  {reel.guideLabel}
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-lime"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={open => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="max-h-[90dvh] overflow-y-auto border-lime/35 bg-[#0b0b0b] text-white sm:max-w-[470px]"
          onOpenAutoFocus={event => {
            event.preventDefault();
            fallbackLink.current?.focus();
          }}
          onCloseAutoFocus={event => {
            event.preventDefault();
            opener.current?.focus();
          }}
        >
          <DialogHeader className="text-left">
            <DialogTitle className="display pr-6 text-2xl">
              {selected?.title}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Original published BTB Reel. Instagram controls playback and may
              require sign-in.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <a
                ref={fallbackLink}
                href={instagramReelUrl(selected.shortcode)}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-lime hover:underline ${focus}`}
              >
                Player blocked or unavailable? Open on Instagram{" "}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <iframe
                key={selected.shortcode}
                src={instagramEmbedUrl(selected.shortcode)}
                title={`Published BTB Reel: ${selected.title}`}
                referrerPolicy="no-referrer"
                allow="encrypted-media; fullscreen; picture-in-picture"
                className="h-[600px] w-full border-0 bg-black"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
