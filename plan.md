# BTB client-growth review release

Update the existing GitHub/Vercel site on feat/btb-client-growth; do not publish/merge until user approves exact review. Keep auth/saved account flows and all 54 exercises, workouts, nutrition, education, Instagram hub, group features. Existing 139 tests baseline. No active Manus project for LSP; use pnpm check as diagnostic fallback.

## Product implementation
New BrandHome main landing with clear beginner proposition, hero using existing BTB gym asset, real product walkthrough, exact Meal Planner and App Store paths, author/book credibility with verified links and free chapter flow, FAQ, and existing BtbMotion/GroupWorkoutPromo/member dashboard entry retained. Existing Home becomes /exercises and its library navigation points there; no redirects loop. Add /start and /plus pages: guided tool selection, downloadable printable weekly worksheet, local checklist; Plus explicitly research/beta interest only, no active subscription or charge. Inquiry composer validates name/email/topic/message, creates explicit email draft to existing Yahoo contact; copy/download fallback; never claims delivery occurred. No email backend credentials currently available; no fake registered lead.

## Discovery repair
Static HTML for new landing/start/plus/exercise library and all known exercise detail pages, actual source guides/titles/canonicals/absolute previews. Correct robots/text sitemap/XML. Known missing guide/route must be 404, non-indexable; preserve known SPA dynamic pages. Vercel and Node serving consistent. Build scripts no browser prerender dependency. Initial markup public only. Route manifest reflects all page routes.

## Visual direction
Industrial editorial athletic product site. Black/charcoal, exact #8CFF00 accent, spacious asymmetric two-column hero with condensed Oswald and Barlow body, JetBrains Mono labels. Registration ticks, thin neon separators, crop-framed gym artwork. High contrast lime buttons with black text, 44px touch targets, focus rings. Motion only subtle hover/entrance; reduced motion respected. No unverified outcomes/clients or fake proof. Brand essence: practical training and meal-prep education for busy beginners; confident, useful, direct. Copy: “Build the week. Not another excuse.” and “Train with confidence. Prep with purpose.” Reuse distinctive existing BTB wordmark. Show actual tools and preserve library access.

## Structure
client/src/pages: BrandHome, StartHere, PlusInterest, existing Home library. client/src/components: growth-page components and contact composer. client/src/lib: growth URLs/metadata/helpers. client/src/components/growth.css scoped styles. scripts: static public growth and guide generation. server/index.ts and vercel.json serving. Existing contexts/provider stack remains.

# BTB community blog

## Product implementation
Add a public `/blog` editorial hub and `/blog/:slug` article pages within the existing React/Wouter/Vercel site. Add a visually distinct Blog destination to primary navigation and a prominent homepage feature section. Seed four complete starter articles—one each about weight lifting, health, cardio, and gear—with category labels, reading times, imagery reused from existing BTB assets, and article detail views. Add `/blog/contribute` with a visitor-facing contribution form for articles, short posts, images, and other ideas. Use the existing BTB contact address to prepare an editable email draft; contributors attach any images in their email app. Explain that submissions go to editorial review and are not published automatically. Do not imply that the static deployment uploads or stores submissions. Preserve existing site routes, styling, and unrelated features.

## Design
Extend the existing Blueprint Wall aesthetic: matte black, BTB acid lime `#a6ff00`, Oswald display type, Barlow reading text, and JetBrains Mono section labels. Use an editorial asymmetrical hero and prominent featured story, with strongly differentiated category cards, restrained image treatments, hairline dividers, and responsive layouts. Keep keyboard focus, contrast, descriptive image alternatives, and reduced-motion behavior.

## Structure
Add reusable blog content records in `client/src/lib/blog.ts`; public list, article, and contribution pages in `client/src/pages/Blog.tsx`, `BlogArticle.tsx`, and `BlogSubmit.tsx`; scoped visual rules in `client/src/components/blog.css`; and route/navigation/homepage links in existing app files. Extend route manifest and sitemap generation for public blog paths, and add focused tests for starter content, route exposure, and contribution draft behavior. Keep the source site on a review branch/PR; production publication remains a separate owner-approved action.
