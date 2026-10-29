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

# Client-growth review release

- [x] Client-focused brand homepage: beginner proposition, working free-planner CTA, author/book credibility, existing imagery, black/neon responsive navigation; all existing member/library/workout tools retained.
- [x] Start Here and Plus interest: printable worksheet/walkthrough, explicit free versus proposed membership, no fake checkout/cloud claims; contact composer validates fields and provides email/copy/download without falsely reporting receipt.
- [x] Discovery repair: initial HTML has actual known exercise-guide content and unique metadata; proper robots/sitemap; missing guides/routes return non-indexable 404; static Node/Vercel serving and manifest consistent.
- [x] Review handoff: passing checks/build/regressions, desktop/mobile verification and read-only integration review, saved feature PR/review URL; production unchanged until approval.

Client-growth review PR: https://github.com/jarvisdasec-sys/gym-exercise-library/pull/7

# BTB app and Instagram links

- [x] Add prominent **Download BTB App** and **Follow BTB on Instagram** homepage buttons that open the official App Store listing (`https://apps.apple.com/us/app/btb-fitness-health/id6782528786`) and BTB Instagram profile (`https://www.instagram.com/btbfitnessandhealth/`) directly; retain existing homepage content, styling, mobile wrapping and public initial-HTML rendering.
- [x] Add a clearly labeled App Store download link beside the existing Instagram follow link in the shared website footer; external links open safely in a new tab and remain keyboard accessible.
- [x] Validate the changed links with regression tests, TypeScript and the production build. The two new link regressions, full regression suite, `pnpm check`, `pnpm build` and generated homepage link assertions passed.
- [ ] Save the changes to the website's GitHub repository and confirm production separately before claiming that the links are live.

# BTB seven-day starter launch

- [ ] Convert the complete BTB 7-Day Starter Plan into a branded downloadable PDF, preserving all seven days, beginner strength options, meal-prep safety, checkboxes, write-in spaces and linked resources; publish the final PDF as a real downloadable website file without an account/email gate.
- [ ] Publish a dedicated accessible starter-plan page with the full content, route-specific initial HTML metadata, a clear PDF download, and prominent links from the existing homepage and Start Here page; preserve all current tools, navigation, member data and deployment behavior. The owner requested publication on October 16, 2026; use the existing GitHub/Vercel workflow, not a replacement website.
- [ ] Create a matching Instagram advertisement image and caption pointing to the live starter resource; save as a reviewable draft without changing today's existing 5 PM image post or publishing an unreviewed launch post.

# BTB community blog

- [ ] Make the blog prominent near the top of the front page, immediately after the hero/benefits strip and before the next workout/content modules. Use a high-contrast BTB-lime feature panel and a readable “READ THE → BLOG ←” callout whose arrows point inward at the word BLOG; keep the linked Blog destination obvious on desktop and mobile.
- [x] Start the blog with four separate public starter stories covering weight lifting, health, cardio and gear; provide topic filters, a browsable blog landing page and individual article pages.
- [ ] Let anybody publish an article, post, image or other contribution directly on the blog with no account/sign-in, no email handoff and no editorial approval; successful posts appear publicly immediately. Accept one JPEG, PNG or WebP image up to 5 MB, allow an optional display name, and collect no email/contact details. Show submitted text as plain text (do not execute HTML or scripts) and tell contributors their text/image will become public immediately.
- [ ] Apply the scoped Supabase table, anonymous RLS and public image-bucket setup; verify anonymous listing, detail pages, form submission and image rendering; run TypeScript, regressions and production build. Do not claim the direct-post flow is live until the migration has been applied and verified in the actual Supabase project.

Implementation status: source passes pnpm check, pnpm build, all 173 tests, and homepage/dynamic-route assertions. Production code is not merged or deployed; the Supabase migration remains unapplied because the Manus browser could not sign in.
