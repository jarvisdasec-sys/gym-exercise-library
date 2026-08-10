# BTB Gym Exercise Library — Design Brief

## Reference-Driven Task

This project is a **replication/extension task**: the 54 exercise infographics already exist and
carry a locked-in visual identity (the "BTB — Build The Body" blueprint). The website is a
display vessel for those assets, so the infographics themselves are the ground-truth spec.
The site must feel like it belongs to the same brand system as the posters it hosts.

### Ground-Truth Spec (from the infographics)

| Attribute | Locked Value |
| --- | --- |
| Background | Near-black (`#050505` → `#0b0b0b`), matte, no blue tint |
| Signature accent | Acid/neon lime green (`#a6ff00` family) |
| Panel treatment | 1px lime-green hairline border, transparent/near-black fill, ~10px radius |
| Type | Heavy condensed uppercase display for titles; clean grotesque for body |
| Iconography | Barbell mark flanked by plate "wings" |
| Tagline | STAY CONSISTENT. STAY DISCIPLINED. BUILD THE BODY. |

## Chosen Approach — "Blueprint Wall"

Rather than a generic centered card grid, the library is presented as a **wall of blueprints**:
a dense, industrial index with a persistent left rail (categories) and a right-hand plate wall
(the infographics). The feel is a gym's equipment-orientation board — utilitarian, high-contrast,
bolted-down, with lime as wayfinding paint rather than decoration.

### Core Principles

1. **Asymmetric rail + wall.** Persistent left filter rail on desktop; content never sits in a
   lone centered column.
2. **Lime as wayfinding, not wallpaper.** Green marks state (active, hover, count) and hairlines.
   Large lime fills are reserved for a single primary action per view.
3. **Hairline over shadow.** Depth comes from 1px borders, subtle inner glow, and grain — not
   soft drop shadows.
4. **The poster is the hero.** Chrome stays quiet so the 1664×2080 plates dominate.

### Layout Paradigm

- Sticky top bar (logo + search + count) spanning full width, hairline bottom border.
- Desktop: 260px left rail (category nav with live counts) + fluid plate wall.
- Plate wall: masonry-adjacent responsive grid of 4:5 poster tiles, each with an index number
  (`01`–`54`), name, and equipment line in a bottom hairline caption strip.
- Category sections are separated by full-bleed rules carrying the category name in outlined type.
- Clicking a plate opens a full-screen lightbox with keyboard nav (←/→/Esc) and a download link.

### Signature Elements

1. **Plate index numerals** — oversized, low-opacity monospace numbers behind each caption.
2. **Corner ticks** — small lime L-shaped registration marks at tile corners on hover, like a
   print crop mark.
3. **Diagonal hazard rule** — thin lime/black diagonal-stripe divider used once per category
   header, echoing gym floor tape.

### Interaction Philosophy

Immediate and mechanical. Hover raises the tile 2px and lights its border to full lime.
No bouncy spring easing; everything resolves in under 220ms with a snappy ease-out.

### Animation

- Tile entrance: 20px rise + fade, staggered 40ms per item, 220ms ease-out.
- Lightbox: backdrop fade 160ms; image scales from 0.97 → 1 over 200ms.
- Filter change: cross-fade the wall at 180ms; never animate layout width/height.
- All non-essential motion gated behind `prefers-reduced-motion: no-preference`.

### Typography System

- **Display:** Oswald (700) — condensed, uppercase, tight tracking. Matches the poster titles.
- **Body/UI:** Barlow (400/500/600) — a grotesque with slightly squared terminals, industrial feel.
- **Numerals/meta:** JetBrains Mono (500) for index numbers, counts, and equipment tags.
- Rule: display type is always uppercase with `letter-spacing: 0.02em`; body never uppercase
  below 14px.

### Brand Essence

A print-grade exercise reference wall for commercial gym floors and their members — built so a
lifter can find the right form cue in seconds. **Disciplined. Industrial. Unambiguous.**

### Brand Voice

Coach-direct, no hype, no filler. Imperative mood.
Examples: "Find the movement. Own the form." / "54 plates. Every machine on the floor."

### Wordmark & Logo

The existing BTB mark: `BTB` in heavy condensed caps flanked by two barbell-plate "wing" glyphs,
with `BUILD THE BODY` micro-set beneath. Rendered in lime on black.

### Signature Brand Color

`#a6ff00` — BTB Acid Lime. Ownable, aggressive, and already established across all 54 plates.

## Style Decisions

- Never place lime text on a lime fill; lime fills always carry near-black text.
- Poster tiles keep their native 4:5 aspect ratio — never crop a plate to a square.
- Grain overlay stays at or below 4% opacity so poster text remains crisp.
- The landing intro must function as a compact library masthead, not a separate marketing
  hero; the poster wall is visible as the primary visual event immediately after the first screen.
- The BTB wordmark must always include the heavy condensed `BTB` mark with barbell-plate wing
  glyphs and `BUILD THE BODY` microtext, rendered in acid lime on near-black.
- Blueprint motifs are mandatory system language: lime hairlines, oversized mono index numerals,
  corner registration ticks, and one diagonal hazard rule per category section recur consistently
  wherever the library chrome frames the posters.
- All supporting text, nav labels and meta copy stay coach-direct and imperative — set in mono
  caps where it functions as instrumentation. No soft marketing sentences anywhere.

## Education Section — Content Rules (locked)

- The Education tab is EDUCATION, never prescription. Explain how things work; never tell an
  individual member what they personally should take, eat or do.
- Supplements are graded by EVIDENCE STRENGTH with the source named — not by popularity, and not
  by what a gym could profitably sell. Where evidence is weak or absent, say so plainly.
- Doses appear only as "doses used in studies", attributed. Never as advice.
- Every article carries a scope note routing anyone with a health condition, on medication,
  pregnant or breastfeeding, or under 18 to a qualified professional.
- Warn callouts (amber) are reserved for genuine safety information and stay visually distinct
  from note callouts (lime), so they cannot be skimmed past.
- No content that diagnoses or treats injury, and no hormonal or metabolic claims beyond
  correcting plain factual errors.
- Every cross-link points at a real plate or session slug — verified, never a dead end.
