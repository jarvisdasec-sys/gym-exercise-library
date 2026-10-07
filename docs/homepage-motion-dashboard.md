# BTB homepage: published Reels and member dashboard

## Completed implementation

The existing React/Vite/Supabase site and GitHub/Vercel deployment are preserved. The homepage now has a compact member dashboard immediately below its masthead and **BTB in Motion** below the Workout of the Day. Existing movement filtering, book/suggestion sections, routes, sign-in and privacy-conscious analytics remain in place. The daily content/Monday analytics automation, Instagram publishing settings and bio, and subscription/access policies are not changed.

Three genuine published VIDEO/Reel posts were retrieved from the verified connected @btbfitnessandhealth account:

| Published Reel | Published date (UTC) | Matching public BTB destination |
| --- | --- | --- |
| Barbell row: https://www.instagram.com/reel/DeKXGoCskEV/ | 2026-10-06 | /e/barbell-bent-over-row |
| Training tools: https://www.instagram.com/reel/DcwOQKdJ9PT/ | 2026-09-01 | /workouts/tools |
| Stay focused: https://www.instagram.com/reel/Dco_U3hBoC-/ | 2026-08-29 | /learn/how-to-not-quit |

Their exact genuine covers were downloaded from their public Instagram embeds and preserved as local, optimized WebP copies (540 × 960). There is no replacement footage, generated image, rehosted video/music or invented engagement data. These are curated published posts, not a live API feed: the manifest and local covers can be intentionally updated when new published Reels are selected.

Instagram is not contacted on initial page load. A deliberately chosen player opens in an accessible dialog without autoplay permission, and its canonical Instagram link remains available if embedding is blocked or requires Instagram sign-in. Initial keyboard focus remains on the parent-page fallback link; Escape works before entering the cross-origin player. The close button is available while interacting with the player, and closing restores focus to the invoking Reel button. Native Instagram controls its own content and playback.

## Dashboard behavior and data boundaries

The homepage waits for authentication readiness. Guests receive the real existing sign-in prompt, not fabricated statistics or a preview session. Signed-in members receive actual account-owned favorites/routines, existing device-local learning/mobility/cardio summaries, saved-item shortcuts and a learning queue. `/account` reuses the same presentation; `/saved` has useful loading/error/retry states.

Saved rows are bound to their owner **at render time**, including the render-before-effect gap on account changes. Stale requests and mutations cannot populate another account, and duplicate in-flight same-slug saves are ignored. A late initial authentication lookup cannot restore a signed-out/replaced user. Unknown or unavailable saved totals display a dash and a retry/error message rather than falsely reporting zero.

Learning, mobility and cardio retain the site's existing **device-local browser storage**. These legacy stores are not account-scoped and are not newly synced across devices; labels and explanatory copy distinguish them from account-owned saved data. Cardio calorie estimates are preserved, and incomplete estimates are identified. No dashboard counts, names, emails or other personal values are added to analytics. Public build output contains only public content and a guest dashboard prompt, never private member records.

## Project structure and design

`featuredReels.ts` holds the curated post IDs, safe URLs and public guide pairings; `BtbMotion.tsx` renders the public section and opt-in player. The exact covers live under `client/public/images/reels/`. `MemberDashboard.tsx` shares the full/compact dashboard; `dashboardProgress.ts` validates legacy device summaries. The existing auth/saved providers retain Supabase and add race/error protections. `scripts/build-home.tsx` produces public-only initial homepage HTML with route metadata. Vercel and the Node preview serve it only at the root, preserving the existing Instagram and SPA routing.

The Blueprint Wall language is retained: black/white/lime, Oswald/Barlow/JetBrains Mono, mono indices, lime hairlines and direct coaching copy. Compact source-preview rows stack on phones. Controls are touch-sized, focus is visible, covers are uncropped and lazy-loaded, and video does not autoplay.

## Validation receipt

| Check | Result |
| --- | --- |
| Pinned package manager / existing dependency set | Preserved; no new dependency added |
| TypeScript (`pnpm check`) | Passed |
| Regression suite (`pnpm test`) | **123 tests passed across 18 files** |
| Production build (`pnpm build`) | Passed; public homepage and Instagram HTML generated |
| Git diff integrity | Passed |
| Public HTML | Real links/content, root canonical, absolute share image, scalable viewport, no default iframe or member fixtures |
| Real browser: 1440 × 1000 | Passed |
| Real browser: 390 × 844 | Passed |
| Real browser: 320 × 740 | Passed |
| Default Instagram requests | **0** on each checked viewport |
| Real sign-in form | Available through the existing production anonymous configuration; no test authentication or records created |
| Player / focus / fallback | Correct source, no-referrer, no autoplay permission, close/Escape and focus return passed |
| Existing filters / guide navigation / Instagram hub | Passed; homepage canonical does not leak to the tool route |
| Browser runtime errors | **0** on each checked viewport |

Mocked member fixtures exist only in isolated unit tests; the actual preview uses real Supabase authentication and does not invent a user. No real visitor records or new accounts were created for verification. Actual credentialed sign-in was not performed on a visitor's behalf.

Independent read-only review identified rewrite-order compatibility, keyboard focus, duplicate save requests, a lost calorie estimate and stale metadata. Each was corrected; regressions and real-browser checks passed. The existing large-chunk Vite advisory is non-fatal and does not block the successful build. The external repository has no active managed-project LSP binding; it was not migrated, and its existing TypeScript compiler check was used.

## Release boundary

A review pull request and working temporary preview are prepared for the owner. **Production remains unchanged until the owner approves the exact three-Reel and homepage-dashboard publication payload.**

## Production root-file correction

The owner approved publication of both homepage features on 2026-10-07. PR #4 was merged as `5596546972d2894fc79efdcb4a981fa6a635914d`, and Vercel reported successful deployment. Direct live HTTP inspection confirmed the new active bundle and three cards in `/home.html`, but `/` still resolved the physical empty `index.html` before the explicit root rewrite. This was a serving issue, not a missing browser feature.

The focused correction writes the same public-only generated homepage to both `index.html` and `home.html`, preserving the original generic shell in `app.html` first. Vercel and Node route all non-home SPA fallbacks to `app.html`, so other pages do not inherit a homepage canonical or initial homepage content. No Reel selection, member-data behavior, authentication, analytics scope or automation settings change. The correction stays within the approved publication payload.
