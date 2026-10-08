# BTB homepage update

- [x] BTB in Motion appears on the homepage with three genuine published @btbfitnessandhealth Reels, real preserved covers, canonical Instagram links, matching existing public BTB guides/tools, deliberate opt-in playback without autoplay or initial Instagram requests, and an always-available direct Instagram fallback.
- [x] The user's dashboard appears on the homepage after real sign-in, reuses actual saved/account data, clearly labels device-local progress, provides loading/empty/error/retry states and working destinations, exposes no private dashboard data to guests/public prerendering, and immediately hides prior-user data on logout/account changes; /account remains functional.
- [x] Public homepage content and metadata are available in initial HTML; existing exercise filters, WOD, sign-in, analytics privacy settings and daily/Monday automation remain unchanged. TypeScript, 123 regressions, production build and desktop/phone browser checks passed.
- [ ] Publish this exact update to production only after the owner approves the review payload. Implementation is complete; this is the remaining external publication boundary, not an unfinished feature.

# Group workouts — actual live-site integration

- [x] Integrate a native Group Workouts section into the real BTB website's `/workouts` page, add `/workouts/groups` before the generic workout-slug route, and expose a homepage link in client and public HTML; preserve all existing website sections, accounts, routes and deployment settings.
- [x] Use **Build The Body**, black and the actual website's primary green. Provide exactly 4, 6, 8 and 10 people, appropriate pair organization and rotation, and a browsable automatically repeating 15-day equipment-free cycle covering at-home cardio, Zumba-inspired dance, bodyweight strength, core, mobility and recovery.
- [x] Preserve complete numbered instructions for all 29 exercises and easier versions, breathing/form cues, durations, rounds, rest, warm-up and cooldown. Ensure timer start, pause/resume, reset and next-phase controls work and unmount cleanly; local persistence is optional and crossing midnight does not misattribute completion.
- [ ] Validate TypeScript, existing and new regressions, production build and affected responsive integration. Prepare the actual-repository PR and publish to the live domain only after approval of the exact payload; verify production deployment before claiming the feature is live.

Implementation verification complete: TypeScript, 137 full-run tests, added metadata regressions, production build and actual-site preview checks pass; read-only review issue fixed. Production publication remains pending owner approval.
