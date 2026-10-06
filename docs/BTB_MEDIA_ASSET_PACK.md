# BTB Media Asset Pack

Generated for the `gym-exercise-library` repository on 2026-10-06.

## Brand direction

- Near-black backgrounds
- Acid/neon lime green accents
- Premium editorial fitness photography
- High contrast and gritty gym atmosphere
- No generated logos or embedded text inside photos
- Use existing exercise infographics for movement plates; use these photos for page heroes, feature cards, and education/resource sections

## Generated assets

| Asset | Dimensions | Recommended use |
|---|---:|---|
| `/images/site/btb-movement-index-hero.jpg` | 2560×1440 | Home/movement-index hero, exercise library header |
| `/images/site/btb-workouts-hero.jpg` | 2560×1440 | Workouts hub, program finder, workout builder |
| `/images/site/btb-cardio-hero.jpg` | 2560×1440 | Cardio hub and cardio category landing |
| `/images/site/btb-nutrition-hero.jpg` | 2560×1440 | Nutrition hub and meal-planning landing |
| `/images/site/btb-resources-hero.jpg` | 2560×1440 | Resources/education hub |
| `/images/site/btb-mobility-hero.jpg` | 2560×1440 | Mobility & flow page, warm-up/cooldown content |
| `/images/site/btb-running-form.jpg` | 1664×2080 | Running-form card/article image |
| `/images/site/btb-meal-prep.jpg` | 1664×2080 | Meal-prep card/article image |
| `/images/site/btb-education.jpg` | 1664×2080 | Education/article card image |
| `/images/site/btb-program-design.jpg` | 1664×2080 | Program-design/resource card image |

## Existing exercise media

The repository already contains 54 exercise infographic files under:

```text
client/public/images/exercises/
```

The exercise data module references all 54 image paths successfully. No missing image file paths were found in `client/src/lib/exercises.ts`.

However, the exercise catalog has **zero `video` fields**. Videos should be added as optional metadata, not hard-coded inside each component.

## Recommended video links

Use these as optional external demonstrations. They should be stored in the exercise/cardio data objects as `videoUrl` or `youtubeId`, with a visible source label and an external-link fallback. Do not download or re-host third-party videos.

### Barbell bent-over row

- [How To: Bent Over Barbell Row — Gabriel Sey](https://www.youtube.com/watch?v=vT2GjY_Umpw)
- [How to do Barbell Rows Properly — ATHLEAN-X](https://www.youtube.com/watch?v=T3N-TO4reLQ)
- [How To Do a Barbell Bent Over Row — Coach Kelly Cues](https://www.youtube.com/watch?v=FEFjR70BPt8)

### Running form

- [How To Run Properly | Running Technique Explained — Global Triathlon Network](https://www.youtube.com/watch?v=_kGESn8ArrU)
- [10 Minutes to Fix Your Running Form — Nicklas Rossner](https://www.youtube.com/watch?v=v1Bj-0QYnIg)

### Rowing/cardio technique

- [Beginner Rowing Workout — Basic Interval Training — Sunny Health & Fitness](https://www.youtube.com/watch?v=uqs9A0B6s9U)
- [Beginner Rowing Machine 101 — UCanRow2](https://www.youtube.com/watch?v=J1nf2Zfbazs)

## Suggested data shape

```ts
export type MediaLink = {
  provider: "youtube";
  videoId: string;
  url: string;
  title: string;
  sourceLabel: string;
  kind: "form-demo" | "technique" | "beginner-session";
};

// Example exercise extension
{
  slug: "barbell-bent-over-row",
  // existing fields...
  media: {
    image: "/images/exercises/barbell_row.png",
    video: {
      provider: "youtube",
      videoId: "T3N-TO4reLQ",
      url: "https://www.youtube.com/watch?v=T3N-TO4reLQ",
      title: "How to do Barbell Rows Properly for a Big Back",
      sourceLabel: "ATHLEAN-X",
      kind: "form-demo"
    }
  }
}
```

## Embed rules

- Prefer a linked thumbnail or “Watch demonstration on YouTube” button by default.
- If embedding, use YouTube’s privacy-enhanced host: `https://www.youtube-nocookie.com/embed/{VIDEO_ID}`.
- Include `title`, `loading="lazy"`, `allowFullScreen`, and accessible link text.
- Provide a fallback external link if the embed is blocked or unavailable.
- Do not imply BTB endorsement of a third-party creator.
- Add a small source label under the video.
- Do not show a broken video frame when a video is unavailable; show the form guide and external link instead.

## Codex integration targets

1. Add a shared `MediaHero` or equivalent component for 16:9 hero assets.
2. Add a shared `MediaCard` component for the 4:5 feature assets.
3. Update the route map to use the repository’s actual routes:
   - `/e/:slug` for exercise plates
   - `/cardio` and `/cardio/:slug` for cardio
   - `/mobility` for mobility
   - `/nutrition`, `/nutrition/builder`, `/nutrition/meal-prep`, `/nutrition/tracker`
   - `/learn` and `/learn/:slug` for education
   - `/workouts` and `/workouts/tools` for workouts
4. Add `media` metadata to exercise/cardio/article records.
5. Add image existence checks to CI/build validation.
6. Add link checks for all YouTube URLs and a graceful fallback for unavailable videos.
7. Keep all image `alt` text descriptive and avoid duplicating nearby headings.

## Important route note

The repository’s internal routes differ from the public URLs observed in the production audit. The Codex implementation should either add redirects/aliases or update navigation consistently. Do not point new media cards at routes that are not implemented.
