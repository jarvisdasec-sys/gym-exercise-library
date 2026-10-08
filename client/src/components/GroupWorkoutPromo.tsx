import React from "react";

export function GroupWorkoutPromo() {
  return (
    <section
      className="border-b border-white/10 bg-black py-7 sm:py-9"
      aria-labelledby="group-workout-promo-title"
    >
      <div className="container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="meta text-[0.5rem] font-bold text-lime">
            Group workouts / No equipment
          </p>
          <h2
            id="group-workout-promo-title"
            className="display mt-3 text-2xl font-bold text-white sm:text-3xl"
          >
            Your crew. <span className="text-lime">Your next 15 days.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Train anywhere with 4, 6, 8 or 10 people. Follow bodyweight
            strength, at-home cardio, dance and recovery with complete form
            instructions.
          </p>
        </div>
        <a
          href="/workouts/groups"
          className="meta inline-flex min-h-12 shrink-0 items-center justify-center border border-lime px-5 py-3 text-[0.55rem] font-bold text-lime transition-colors hover:bg-lime hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
        >
          Open Group Workouts →
        </a>
      </div>
    </section>
  );
}
