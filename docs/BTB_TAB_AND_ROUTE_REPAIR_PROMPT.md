# BTB Tab and Route Repair Prompt for Codex

You are repairing the BTB Fitness & Health website in this repository.

## Root cause

The production website has tab and content problems because the visible/public URLs do not consistently match the routes implemented in the repository. Do not patch one link at a time. Create one canonical route map and use it everywhere.

## Current canonical routes implemented by the repository

- Exercises / movement index: `/`
- Individual exercise plate: `/e/:slug`
- Workouts hub: `/workouts`
- Workout of the day: `/wod`
- Workout tools: `/workouts/tools`
- Workout builder: `/workouts/builder`
- Workout session: `/workouts/:slug`
- Cardio hub: `/cardio`
- Cardio detail: `/cardio/:slug`
- Mobility: `/mobility`
- Nutrition hub: `/nutrition`
- Nutrition builder: `/nutrition/builder`
- Meal prep: `/nutrition/meal-prep`
- Nutrition tracker: `/nutrition/tracker`
- Calculators hub: `/calculators`
- Education hub: `/learn`
- Education article: `/learn/:slug`
- Machine stickers: `/stickers`
- Saved workouts: `/saved`
- Password reset: `/reset-password`

## Required route/tab behavior

1. Make the top navigation use only canonical routes from one shared route configuration.
2. Every tab must load the correct page after:
   - clicking from another page;
   - browser refresh;
   - opening the URL directly;
   - opening in a new tab;
   - using the mobile navigation sheet.
3. The active-tab state must remain correct on detail pages:
   - `/e/:slug` → Exercises active;
   - `/cardio/:slug` → Cardio active;
   - `/learn/:slug` → Education active;
   - `/workouts/:slug`, `/wod`, `/workouts/tools`, `/workouts/builder` → Workouts active;
   - `/nutrition/*` → Nutrition active;
   - `/calculators` → Calculators active;
   - `/mobility` → Mobility & Flow active.
4. Do not point navigation to legacy public URLs unless explicit redirects are implemented.
5. Add redirects or aliases for legacy URLs users may already have bookmarked:
   - `/exercises` → `/`
   - `/physical-fitness/running` → `/cardio`
   - `/fitness/warm-up-and-cooldown` → `/mobility`
   - `/fitness-calculators` → `/calculators`
   - `/fitness` → `/learn`
   - `/workouts/today` → `/wod`
   - `/workouts/tools` should remain a real page, not a 404.
6. Decide the correct behavior for unsupported legacy routes such as `/resources`, `/app`, `/downloads`, `/account`, `/nutrition/foods`, `/nutrition/education`, `/nutrition/grocery-planner`, and `/nutrition/search`:
   - implement real pages, or
   - redirect to the closest truthful existing page, or
   - render an intentional coming-soon page that is not presented as a finished tool.

## Content correctness checks

### Exercises

- The homepage currently has 54 exercise records and image files.
- Verify every plate opens its own `/e/:slug` detail page.
- Verify the requested Barbell Bent-Over Row opens at `/e/barbell-bent-over-row`.
- The detail page must show the correct exercise name, equipment, muscles, image, setup, movement, breathing, cues, related movements, and optional video link.
- Do not show unrelated exercise information when a user switches plates or uses browser back/forward.

### Cardio

- Cardio cards must open `/cardio/:slug` and show the matching record.
- Search and category tabs must update the visible list without stale detail data.
- Verify the bodyweight/calorie estimate state is clearly labeled and persists only as intended.
- Add the BTB cardio hero image without hiding the exercise list or controls.

### Workouts

- WOD, sessions, tools, and programs must be distinct pages with distinct content.
- Start, save, and mark-complete actions must show visible feedback.
- If program data is not present, do not claim that complete programs exist.

### Nutrition

- `/nutrition`, `/nutrition/builder`, `/nutrition/meal-prep`, and `/nutrition/tracker` must have consistent labels and working links.
- Do not show database, education, grocery, or search tabs unless their pages actually exist.
- Preserve nutrition and medical disclaimers.

### Calculators

- `/calculators` must list implemented calculators only.
- BMI must still calculate 180 lb / 70 in as 25.8.
- Add validation for blank, negative, and impossible values.

## Media integration

Use the new generated images from `client/public/images/site/`:

- `btb-movement-index-hero.jpg`
- `btb-workouts-hero.jpg`
- `btb-cardio-hero.jpg`
- `btb-nutrition-hero.jpg`
- `btb-resources-hero.jpg`
- `btb-mobility-hero.jpg`
- `btb-running-form.jpg`
- `btb-meal-prep.jpg`
- `btb-education.jpg`
- `btb-program-design.jpg`

Use them as page heroes or feature-card imagery; do not replace the 54 exercise infographic images unless explicitly required.

Optional YouTube demonstrations should be stored in data objects, not hard-coded in components. Use the manifest in `docs/BTB_MEDIA_ASSET_PACK.md` for verified examples.

## Routing and deployment

- Ensure Vercel/server rewrites serve the SPA entry for all implemented routes.
- Direct HTTP requests to implemented routes must return 200, not 404 followed by client-side recovery.
- Add a route smoke test that checks every internal navigation href and every declared route.
- Add a browser test that clicks every top-level tab and verifies the page heading and active tab.
- Add a test for every legacy redirect listed above.
- Add a test that exercises browser refresh on `/e/barbell-bent-over-row`, `/cardio/outdoor-running`, `/learn/<known-slug>`, `/nutrition/tracker`, and `/workouts/tools`.

## Acceptance criteria

- No top-level tab opens the wrong page or a page with missing content.
- No visible CTA opens a 404.
- No stale content remains after switching tabs, filters, exercises, cardio modes, or detail routes.
- Every route has a correct page title, heading, breadcrumb/back path, active navigation state, and useful empty/error state.
- All direct routes and redirects pass automated tests.
- Desktop and mobile navigation behave identically in destination and active-state behavior.
- The existing BTB green/black visual system is preserved.
