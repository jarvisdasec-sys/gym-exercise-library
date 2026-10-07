# BTB Instagram integration

## Scope and implementation

Extend the existing React/Vite BTB website in its current GitHub repository and Vercel deployment. Do not migrate hosting, modify account permissions, change Supabase configuration, or enable Instagram publishing.

Reuse the industrial Blueprint Wall style: black surfaces, BTB lime wayfinding, Oswald headings, Barlow body copy, JetBrains Mono labels, squared panels, borders, registration ticks, and coach-direct copy. Preserve the homepage's movement-library emphasis. Interactions use existing hover transitions and visible keyboard focus, with no new autoplay media.

### Project structure

- `client/src/lib/social.ts`: canonical profile, controlled landing destinations, bio URL, and optional existing-analytics click events.
- `client/src/components/InstagramLanding.tsx`: account-independent public content shared with build-time rendering.
- `client/src/pages/Instagram.tsx` and `client/src/lib/instagramMetadata.ts`: application route, navigation, and metadata lifecycle.
- `client/src/components/InstagramFollow.tsx`: compact homepage follow CTA.
- `client/src/components/SocialFooter.tsx`: visible site-wide follow button and hub link.
- `scripts/build-instagram.tsx`: static public content and unique production metadata; no member data.
- `vercel.json` and `server/index.ts`: direct `/instagram` serving before SPA fallback.
- `client/public/images/social/`: optimized copies of existing assets, preserving originals and aspect ratios.
- Tests validate route/data integrity, markup, safe links, optional events, metadata cleanup, and complete App navigation.

## Completed outcomes

- [x] `/instagram` is a mobile-friendly public hub with the existing barbell-row guide, movement index, Workout of the Day, Meal Builder, calculators, mobility, education, four real workout sessions, account access, and a follow button.
- [x] The homepage has a compact “Train with BTB” Instagram CTA without removing functionality.
- [x] Exercise, workout, nutrition, mobility, and education pages retain the global footer and gain a readable Instagram CTA and hub link.
- [x] Follow links use `https://www.instagram.com/btbfitnessandhealth/`, open externally safely, and have keyboard focus states.
- [x] The prepared bio URL is `https://www.btbfitnessandhealth.com/instagram?utm_source=instagram&utm_medium=bio&utm_campaign=btb_profile`.
- [x] Controlled click events reuse Umami when configured and never block normal navigation. No new tracker or arbitrary-query collection was added.
- [x] Direct landing HTML contains public content, unique metadata, an absolute production canonical URL, and a lightweight preview image. Client navigation cleans up route metadata.
- [x] Tests, type checks, a production build, raw-HTML checks, and an independent code review completed before publication.

## Validation and release notes

Baseline: 51 tests passed. Final implementation: 65 tests passed, `pnpm check` passed, and the production build passed. Local and temporary public HTTPS previews return HTTP 200 for `/instagram`, `/instagram/`, and the route manifest; raw HTML contains the page content and correct canonical metadata. Existing production source remains at `3e7103f` until owner-approved publication.

The pinned pnpm 10.18.1 workspace configuration preserves the existing Wouter patch and Tailwind/nanoid override and allows only the existing esbuild and Tailwind native build scripts. Frozen-lockfile installation was verified; no dependency versions or lockfile content changed.

The original 3.9 MB exercise PNG and 4.4 MB hero JPEG remain untouched. Landing-only copies are approximately 148 KB (832 × 1040 WebP) and 108 KB (1200 × 675 JPEG).

The existing live production bundle did not show a configured Umami script. UTM links and event wiring are ready, but analytics reporting still requires the site's analytics configuration. Do not claim reports are active.

## Owner-facing boundaries

Production publication is pending review/approval. The Instagram profile's bio has not been edited; it is separate from website code. No Instagram login is needed for website links. This implementation does not publish posts, embed an automatic Instagram feed, or modify ownership/security settings.
