# BTB Instagram landing upgrade

## Included changes
- A prominent free 7-day starter-plan CTA directly below the hub introduction.
- A manually curated nutrition card linking to the published carousel: https://www.instagram.com/p/Df253vmilqP/.
- Local optimized WebP cover; no automatic Instagram player, new fonts or added tracking SDK.
- Existing exercise guide, destinations, workout sessions and account links preserved.
- Optional click placements `instagram-starter-plan` and `instagram-latest-nutrition` reuse current analytics. The destination sanitizer explicitly permits only the selected post and public starter route. Privacy opt-outs remain enforced. This verifies wiring, not production analytics reporting.

## Validation
- 189 tests passed across 36 files, including four new growth tests.
- On Node 26, run `NODE_OPTIONS=--no-experimental-webstorage pnpm test` to avoid the runtime's native Web Storage conflicting with happy-dom. The initial unflagged run had 22 storage-related failures; all passed with this test-only runtime flag. No dependencies were changed.
- `pnpm check` passed.
- `pnpm build` passed, including static Instagram rendering.
- Chrome review at 390px and 1440px: no horizontal overflow, cover loaded, expected links present.
- Built static hub contains both new sections. Existing starter HTML and PDF exist in production build output.
- Existing React act/iframe and Node deprecation warnings remain non-fatal.

## Apply and release
Base: main commit `94c73ed9d84c5fb5dc776ad4f769950cdffe1b03`.

1. Start a new branch in a clean checkout of the base commit.
2. Apply the included `btb-instagram-growth.patch` with `git apply --check` first, then `git apply`. Alternatively copy the files from this bundle preserving paths.
3. Install using pinned pnpm: `pnpm install --frozen-lockfile`.
4. Run the validation commands above and review `/instagram` in your existing Vercel preview workflow.
5. Review/merge using your normal GitHub process; release through your existing Vercel deployment. No hosting, permissions or secrets need changing for these edits.

The owner authorized pushing these changes to main and releasing through the existing Vercel project. Production status must be verified separately; this document is not proof of a successful deployment. Roll back by reverting the release commit. Update the editorial card and its explicit analytics URL allowlist together when choosing a newer post.