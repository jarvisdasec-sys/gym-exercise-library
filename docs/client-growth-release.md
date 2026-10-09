# BTB client-growth review release

This release works in the existing BTB repository and Vercel architecture. It does not create a replacement brand site or silently publish changes.

## What visitors see

The root now introduces practical training and meal-prep education for busy gym beginners, with the black/neon-green BTB identity, a focused recipe-planner action, author/book credibility, a useful workflow explanation and FAQ. The original 54-guide library remains at `/exercises`; existing accounts, saved movements, workouts, nutrition tools, education, group sessions and Instagram media remain available. `/start` connects the real tools and a free printable weekly worksheet. Exact App Store links distinguish the app from the browser-local planner.

`/plus` is explicitly proposed membership research—not a paid subscription. No card, trial, renewal, paid entitlement, cross-product login or cloud sync is implemented.

## Inquiry boundary

The new inquiry composer validates name/email/topic/message and prepares an email to the existing BTB Yahoo address. It offers email-app, copy and text-download choices. Draft preparation is **not confirmed delivery or registration**; a visitor must send from their email app. No backend lead database or automatic mailing-list subscription was invented. Reliable automated lead delivery remains a follow-up integration requiring an actual configured destination/provider and appropriately separated marketing permission.

## Discovery repair

Build-generated initial HTML includes the real source-guide text for every known exercise, unique titles/descriptions/canonicals, absolute social images and related links. The library and growth pages also have public HTML. Robots and XML sitemap use their correct content types. Unknown pages/guides/assets return true 404; Node adds nonindexable headers and Vercel uses custom 404 output. Exact known route rewrites preserve legacy routes and password recovery rather than serving every typo as a successful homepage. Existing account data is never serialized into public snapshots.

This improves technical accessibility to crawlers; it does not guarantee ranking, indexing, clients or revenue. Search Console verification remains necessary after publication.

## Measurement and preservation

Existing production-only privacy-respecting traffic measurement includes the new public routes and fixed tool-click labels. It does not capture inquiry content, health records, sessions or personal profiles, and continues honoring Do Not Track/Global Privacy Control. Preview visits do not initialize production analytics.

The supplied hero artwork was losslessly reframed (no crop) and compressed to WebP; the original remains unchanged. There are no invented testimonials, clients, outcomes or professional credentials.

## Verification

TypeScript, 156 regression tests, production build and desktop/mobile browser checks pass. Actual Start Here → Workouts navigation was checked to avoid stale Start/Plus metadata, and password-recovery routing was verified. Existing library search, group/session navigation and inquiry draft/edit invalidation remain functional.

Production remains unchanged until the owner approves the exact release. Preview-only builds may set `VITE_PLANNER_REVIEW_URL`; normal deployed builds default to the existing permanent Meal Planner URL.
