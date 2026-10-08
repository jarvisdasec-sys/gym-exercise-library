# Build The Body — 15-day group workouts

## Correct deployment target
The live website `www.btbfitnessandhealth.com` is served by `jarvisdasec-sys/gym-exercise-library` through its existing Vercel pipeline. The earlier standalone preview and `jarvisdasec-sys/BTB` pull request are not this deployment target. This change ports the completed workout program into the actual React/Vite website; it does not replace the site with the standalone page or change hosting, permissions, billing, authentication, analytics or other existing features.

## Integration and behavior
Create a native, reusable React group-workout section in the existing site's typography and **primary lime token** (`var(--primary)`, currently `oklch(90% .26 128)`). Retain the Blueprint Wall visual language, coach-direct voice, numbered training board, and accessible outlined controls. Add the full section to `/workouts`, a dedicated `/workouts/groups` destination before the existing generic workout-slug route, and a homepage callout that links to it in both client and public static HTML. Existing workout boards, account features and routes remain in place.

Reuse the tested 15-day program and all 29 standard/easier movement guides. Each day includes timed work/rest, rounds, warm-up, cooldown and numbered setup/movement/return instructions, plus breathing and form cues. Include cardio, bodyweight strength, a dedicated Zumba-inspired dance day, core, low-impact movement and recovery. Groups of exactly 4, 6, 8 and 10 form 2, 3, 4 and 5 pairs; pair starts are staggered across four exercises and everyone works simultaneously in their own space. Five pairs may use the same movement in separate spaces; no equipment is shared.

The schedule is anchored to October 8, 2026 at midnight UTC, advances daily and repeats after day 15. Display cycle dates and permit browsing every day. A shared-screen timer includes start, pause/resume, reset and next-phase controls; preserve session identity and credit completion to its original cycle across midnight. Browser storage is optional and device-local; no new account data or cross-device timer synchronization is claimed. Always allow extra rest and easier alternatives. No licensed music or instructor-led Zumba video is provided.

## Source structure
- `client/src/lib/groupWorkouts.ts`: existing date, assignment, session and timer helpers with native TypeScript types.
- `client/src/lib/groupExerciseCoaching.ts`: all 29 standard/easier numbered instruction sets.
- `client/src/components/GroupWorkoutSection.tsx` and scoped CSS: native UI and lifecycle-clean timer.
- `client/src/components/GroupWorkoutPromo.tsx`: shared homepage callout, safe for static rendering.
- `client/src/pages/GroupWorkouts.tsx`: dedicated page using existing SiteNav and footer.
- Existing App routes, Workouts/Home pages, homepage generator and route manifest gain only the relevant integration points.
- A public static `/workouts/groups` snapshot will carry meaningful body content and route metadata using the existing build approach, without private account data; existing Vercel routing remains authoritative.

## Publication boundary
Prepare and test a pull request in the actual live repository. Show the exact change and obtain owner confirmation before merging into production `main`, because that branch triggers a public website deployment. After approval, merge using normal GitHub workflow, inspect provider-reported deployment status and verify the live page and entry links. An open pull request or successful local build is not a live deployment. All automated browser verification of the live site will carry `btb_analytics_test=1`; public links shown to the user remain clean.

## Implementation verification — October 8, 2026
The native integration now passes the site's TypeScript check, its **125 existing tests** and **12 new program/component/app integration tests** (137 in the full run). Two additional metadata-cleanup regression cases pass, and the affected application integration tests were rechecked after the review correction. The production build succeeds and generates the homepage entry and `/group-workouts.html` public snapshot.

The production-build preview serves HTTP 200 for the homepage, dedicated group route, existing workout route and synchronized route manifest, both locally and publicly. A targeted browser inspection confirms 15 day selectors, four visible three-step instruction cards on the selected day, the actual `oklch(90% .26 128)` primary token, Oswald headings and no horizontal page overflow at the inspected viewport. Existing responsive CSS includes 800px and 480px adaptations. Native DOM tests exercise all four group sizes, every day in standard/easier mode, timer start/pause/resume/reset/phase skip/finish/restart, completion undo, blocked storage, interval cleanup, and UTC midnight attribution.

A read-only integration review found one low-severity metadata fallback duplication. It is fixed by importing the current homepage defaults rather than copying older values; direct static visits and SPA cleanup are covered by the added regressions. No other confirmed functional, route, storage, lifecycle or privacy issue was identified.

**Still not live:** production `main` has not been merged for this group-workout change. The only remaining step is owner-approved publication of the exact prepared PR, followed by provider deployment-status and live-route verification. The native preview is https://3001-iianv6i1f3a4rq5n39n4k-bcf86da2.us1.manus.computer/workouts/groups.
