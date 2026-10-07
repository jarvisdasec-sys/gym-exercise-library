import React from "react";
import { ArrowRight, ArrowUpRight, Instagram } from "lucide-react";
import {
  FEATURED_INSTAGRAM_EXERCISE,
  INSTAGRAM_DESTINATIONS,
  INSTAGRAM_URL,
  INSTAGRAM_WORKOUTS,
  trackSocialClick,
} from "../lib/social";

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime";

/** Account-independent content reused in the app and build-time public HTML. */
export function InstagramLanding() {
  return (
    <main id="instagram-main" className="container py-8 sm:py-12">
      <section
        aria-labelledby="instagram-heading"
        className="border-b border-white/12 pb-8 sm:pb-10"
      >
        <p className="meta flex items-center gap-3 text-[0.6rem] text-lime">
          <Instagram className="h-4 w-4" aria-hidden="true" />{" "}
          @btbfitnessandhealth
        </p>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1
              id="instagram-heading"
              className="display text-4xl font-bold leading-[0.95] text-white sm:text-6xl"
            >
              Beyond the Reel.
              <br />
              <span className="text-lime">Into your routine.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
              Find the full form guide, choose a workout, or explore BTB
              nutrition and mobility tools. One useful next step. No scrolling
              through a feed to find it.
            </p>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSocialClick(INSTAGRAM_URL, "instagram-hero")}
            className={`inline-flex min-h-12 items-center justify-center gap-3 border border-lime px-5 py-3 text-sm font-semibold text-lime transition-colors hover:bg-lime hover:text-black ${focus}`}
          >
            Follow BTB on Instagram{" "}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>

      <section
        aria-labelledby="featured-guide-heading"
        className="relative mt-8 overflow-hidden border border-lime/40 bg-plate"
      >
        <span
          aria-hidden="true"
          className="absolute -left-px -top-px h-4 w-4 border-l-4 border-t-4 border-lime"
        />
        <div className="flex flex-col md:flex-row">
          <a
            href={FEATURED_INSTAGRAM_EXERCISE.href}
            aria-label="Open the Barbell Bent-Over Row form guide"
            onClick={() =>
              trackSocialClick(
                FEATURED_INSTAGRAM_EXERCISE.href,
                "instagram-featured-image"
              )
            }
            className={`block w-full shrink-0 border-b border-white/12 bg-black md:w-72 md:border-b-0 md:border-r ${focus}`}
          >
            <img
              src={FEATURED_INSTAGRAM_EXERCISE.image}
              alt="BTB Barbell Bent-Over Row exercise form plate"
              className="mx-auto h-72 w-full object-contain p-3 md:h-full md:max-h-80"
              width="832"
              height="1040"
              fetchPriority="high"
            />
          </a>
          <div className="flex min-w-0 flex-1 flex-col justify-center p-6 sm:p-8">
            <p className="meta text-[0.6rem] text-lime">Featured form guide</p>
            <h2
              id="featured-guide-heading"
              className="display mt-3 text-3xl font-bold text-white sm:text-4xl"
            >
              {FEATURED_INSTAGRAM_EXERCISE.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
              {FEATURED_INSTAGRAM_EXERCISE.description}
            </p>
            <a
              href={FEATURED_INSTAGRAM_EXERCISE.href}
              onClick={() =>
                trackSocialClick(
                  FEATURED_INSTAGRAM_EXERCISE.href,
                  "instagram-featured-guide"
                )
              }
              className={`mt-6 inline-flex min-h-12 w-fit items-center gap-3 bg-lime px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-lime/85 ${focus}`}
            >
              Open the row guide{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="next-step-heading" className="mt-10 sm:mt-12">
        <div className="hazard-rule mb-5" aria-hidden="true" />
        <h2
          id="next-step-heading"
          className="display text-3xl font-bold text-white"
        >
          Choose your next step.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Start with the movement index if you're new to BTB. The guides and
          tools below are available to browse without signing in.
        </p>
        <div className="mt-6 divide-y divide-white/12 border-y border-white/12">
          {INSTAGRAM_DESTINATIONS.map((item, index) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() =>
                trackSocialClick(item.href, `instagram-${item.id}`)
              }
              className={`group flex min-h-24 items-center gap-4 py-5 transition-colors hover:bg-white/[0.03] sm:gap-6 sm:px-4 ${focus}`}
            >
              <span
                aria-hidden="true"
                className="meta w-8 shrink-0 text-lg text-lime/60"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <span className="meta text-[0.55rem] text-lime">
                  {item.label}
                </span>
                <h3 className="display mt-1 text-xl font-semibold text-white sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </div>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-white/50 transition-colors group-hover:text-lime"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="session-heading"
        className="mt-10 border-l-2 border-lime pl-5 sm:mt-12 sm:pl-8"
      >
        <p className="meta text-[0.6rem] text-lime">Ready-to-train sessions</p>
        <h2
          id="session-heading"
          className="display mt-3 text-3xl font-bold text-white"
        >
          Pick a session. Know the plan.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Individual workout sessions with exercise guides. Choose an option
          that fits your experience and available equipment.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {INSTAGRAM_WORKOUTS.map(workout => (
            <a
              key={workout.href}
              href={workout.href}
              onClick={() =>
                trackSocialClick(workout.href, "instagram-workout-session")
              }
              className={`flex min-h-16 items-center justify-between gap-6 border border-white/15 px-4 py-3 transition-colors hover:border-lime/60 sm:min-w-52 ${focus}`}
            >
              <span>
                <span className="display block text-lg font-semibold text-white">
                  {workout.title}
                </span>
                <span className="mt-1 block text-xs text-white/55">
                  {workout.description}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-lime"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="account-heading"
        className="mt-10 flex flex-col gap-5 border border-white/15 p-6 sm:mt-12 sm:p-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h2
            id="account-heading"
            className="display text-2xl font-semibold text-white"
          >
            Keep your training together.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Sign in or create an account to access your member dashboard and
            saved movements and routines. An account is not required to explore
            the public guides.
          </p>
        </div>
        <a
          href="/account"
          onClick={() => trackSocialClick("/account", "instagram-account")}
          className={`inline-flex min-h-12 shrink-0 items-center justify-center gap-3 border border-lime/60 px-5 py-3 text-sm font-semibold text-lime transition-colors hover:bg-lime/10 ${focus}`}
        >
          Open your dashboard{" "}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-white/50">
        BTB provides general fitness and nutrition education, not individualized
        medical advice. Calculator results are estimates. Adapt training to your
        ability and seek qualified guidance for pain, injury or medical
        concerns.
      </p>
    </main>
  );
}
