/**
 * ExercisePlate — the QR landing page. `/e/:slug`
 *
 * This is what a member sees after scanning a sticker on a machine, almost
 * always on a phone, often mid-set. So:
 *  - The poster is the FIRST thing on screen. No masthead, no hero, no scroll
 *    required to reach the blueprint.
 *  - Chrome is a single thin bar with one escape route back to the wall.
 *  - Related plates for the same body part sit below for quick pivots.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"): lime hairlines, mono index
 * numerals, corner registration ticks, one hazard rule per section.
 */

import { useEffect, useMemo } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Link, useParams } from "wouter";
import { ArrowRight, Bookmark, Download, Dumbbell, ExternalLink, QrCode, Video } from "lucide-react";
import { PlateQr } from "@/components/PlateQr";
import { plateUrl, plateUrlLabel } from "@/lib/plateUrl";
import { CATEGORIES, INDEXED_EXERCISES } from "@/lib/exercises";
import { WORKOUTS } from "@/lib/workouts";
import { getExerciseGuide } from "@/lib/exerciseGuides";
import { useSaved } from "@/contexts/SavedContext";
import { useAuth } from "@/contexts/AuthContext";
import { getExerciseVideo } from "@/lib/exerciseVideos";

export default function ExercisePlate() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const exercise = useMemo(
    () => INDEXED_EXERCISES.find((e) => e.slug === slug) ?? null,
    [slug],
  );

  const related = useMemo(() => {
    if (!exercise) return [];
    return INDEXED_EXERCISES.filter(
      (e) => e.category === exercise.category && e.slug !== exercise.slug,
    ).slice(0, 6);
  }, [exercise]);

  /** Sessions that program this movement — lets a member jump into context. */
  const inSessions = useMemo(() => {
    if (!exercise) return [];
    return WORKOUTS.filter((w) =>
      w.blocks.some((b) => b.items.some((i) => i.slug === exercise.slug)),
    );
  }, [exercise]);

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useSaved();

  useEffect(() => {
    if (!exercise) return;
    document.title = `${exercise.name} Form Guide | BTB Fitness & Health`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    description?.setAttribute(
      "content",
      `${exercise.name} form guide from BTB: setup, execution, coaching cues, common mistakes, and safer progressions.`,
    );
  }, [exercise]);

  if (!exercise) {
    return (
      <div className="flex min-h-screen flex-col">
        <PlateBar />
        <div className="container flex flex-1 flex-col items-start justify-center py-24">
          <p className="display text-3xl font-bold text-white">
            Plate not found
          </p>
          <p className="meta mt-3 text-[0.5rem] text-muted-foreground">
            That sticker points to a movement that is no longer in the index
          </p>
          <Link
            href="/"
            className="mt-7 bg-lime px-5 py-3 transition-colors duration-200 hover:bg-lime-dim"
          >
            <span className="meta text-[0.55rem] font-bold text-black">
              Back to the wall
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel =
    CATEGORIES.find((c) => c.id === exercise.category)?.label ??
    exercise.category;
  const url = plateUrl(exercise.slug);
  const guide = getExerciseGuide(exercise);
  const video = getExerciseVideo(exercise.slug);
  const saved = isFavorite(exercise.slug);

  return (
    <div className="min-h-screen">
      <PlateBar />

      {/* ── plate header: tight instrumentation row ─────────────────── */}
      <div className="border-b border-white/10">
        <div className="hazard-rule" />
        <div className="container py-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="meta text-[0.6rem] font-bold text-lime/60">
              {exercise.plate}
            </span>
            <h1 className="display text-[1.85rem] font-bold leading-none text-white sm:text-[2.75rem]">
              {exercise.name}
            </h1>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Tag label={categoryLabel} lime />
            <Tag label={exercise.difficulty} />
            <Tag label={exercise.equipment} />
            <Tag label={exercise.primary} />
          </div>
        </div>
      </div>

      {/* ── the poster, immediately ─────────────────────────────────── */}
      <div className="container py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="relative min-w-0 flex-1 border border-white/12">
            <span className="absolute -left-px -top-px z-10 h-3 w-3 border-l-2 border-t-2 border-lime" />
            <span className="absolute -bottom-px -right-px z-10 h-3 w-3 border-b-2 border-r-2 border-lime" />
            <img
              src={exercise.image}
              alt={`${exercise.name} full exercise guide`}
              className="pop-in block w-full"
            />
          </div>

          {/* side utility column */}
          <aside className="w-full shrink-0 lg:w-[268px]">
            {inSessions.length > 0 && (
              <div className="mb-3 border border-white/12 p-4">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-3.5 w-3.5 text-lime" />
                  <span className="meta text-[0.45rem] font-bold text-lime">
                    Trained in
                  </span>
                </div>
                <div className="mt-3 flex flex-col">
                  {inSessions.map((w) => (
                    <Link
                      key={w.slug}
                      href={`/workouts/${w.slug}`}
                      className="group flex items-center justify-between gap-2 border-b border-white/8 py-2 last:border-b-0 transition-colors duration-200"
                    >
                      <span className="display truncate text-[0.9rem] font-semibold text-white/75 transition-colors duration-200 group-hover:text-lime">
                        {w.name}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-white/25 transition-colors duration-200 group-hover:text-lime" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-lime/35 p-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-3.5 w-3.5 text-lime" />
                <span className="meta text-[0.48rem] font-bold text-lime">
                  Machine Sticker
                </span>
              </div>
              <div className="mt-3.5 flex items-start gap-3.5">
                <div className="border-2 border-lime bg-white p-1.5">
                  <PlateQr value={url} size={104} />
                </div>
                <p className="meta break-all text-[0.42rem] leading-relaxed text-white/45">
                  {plateUrlLabel(exercise.slug)}
                </p>
              </div>
              <p className="meta mt-3.5 text-[0.42rem] leading-relaxed text-white/40">
                This code opens this exact plate. Print and mount it on the
                equipment.
              </p>
            </div>

            <a
              href={exercise.image}
              download={`btb-${exercise.slug}.png`}
              className="mt-3 flex items-center justify-center gap-2 border border-white/15 py-3 transition-colors duration-200 hover:border-lime hover:text-lime"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="meta text-[0.5rem]">Save this plate</span>
            </a>

            <button
              type="button"
              onClick={() => void toggleFavorite(exercise.slug)}
              aria-pressed={saved}
              className={`mt-3 flex w-full items-center justify-center gap-2 border py-3 transition-colors duration-200 ${saved ? "border-lime bg-lime text-black" : "border-lime/35 text-lime hover:bg-lime/10"}`}
            >
              <Bookmark className="h-3.5 w-3.5" fill={saved ? "currentColor" : "none"} />
              <span className="meta text-[0.5rem] font-bold">{saved ? "Saved to library" : "Save this movement"}</span>
            </button>
            {!user && <p className="meta mt-2 text-center text-[0.38rem] text-white/35">Sign in to sync saved movements across devices.</p>}

            <div className="mt-3 border border-white/12 p-4">
              <p className="display text-sm font-semibold leading-snug text-lime">
                Stay consistent.
                <br />
                Stay disciplined.
                <br />
                Build the body.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {video && (
        <section className="border-y border-white/10 bg-black/30">
          <div className="container py-8 sm:py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-lime"><Video className="h-4 w-4" /><span className="meta text-[0.45rem] font-bold">Watch the movement</span></div>
                <h2 className="display text-2xl font-bold text-white">See the standard. Then own your reps.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">A third-party demonstration paired with BTB coaching cues. Turn captions on when training without sound.</p>
              </div>
              <a href={`https://www.youtube.com/watch?v=${video.id}&cc_load_policy=1`} target="_blank" rel="noreferrer" className="meta inline-flex items-center gap-2 border border-lime/35 px-3 py-2 text-[0.42rem] text-lime hover:bg-lime/10"><ExternalLink className="h-3 w-3" />Open video / transcript</a>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="overflow-hidden border border-white/15 bg-black" style={{ aspectRatio: "16 / 9" }}>
                <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${video.id}?cc_load_policy=1&rel=0`} title={`${exercise.name} form demonstration`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
              <div className="border border-white/12 p-4">
                <div className="meta text-[0.42rem] text-lime">{video.sourceLabel}</div>
                <h3 className="display mt-2 text-lg font-semibold text-white">{video.title}</h3>
                <div className="mt-4 border-t border-white/10 pt-3"><div className="meta text-[0.4rem] text-white/35">BTB FOCUS</div><p className="mt-1.5 text-sm leading-relaxed text-white/65">{video.focus}</p></div>
                <div className="mt-4 border-t border-white/10 pt-3"><div className="meta text-[0.4rem] text-lime">SAFETY CHECK</div><p className="mt-1.5 text-sm leading-relaxed text-white/65">{video.safety}</p></div>
                <p className="meta mt-4 text-[0.38rem] leading-relaxed text-white/35">External video links open YouTube. BTB does not control the third-party video or its captions.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── premium coaching guide ─────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="container py-10 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-lime" />
                <span className="meta text-[0.45rem] text-lime">Coach’s guide · Form first</span>
              </div>
              <h2 className="display text-2xl font-bold text-white sm:text-3xl">Run the movement clean.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">Use the guide with the blueprint. Pick a load that makes every rep look like the first one.</p>
            </div>
            <span className="meta border border-lime/35 px-3 py-2 text-[0.45rem] text-lime">{exercise.difficulty} · {exercise.primary}</span>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <GuideBlock title="Set up" items={guide.setup} />
            <GuideBlock title="Execute" items={guide.execution} />
            <GuideBlock title="Coach cues" items={guide.cues} compact />
            <GuideBlock title="Common mistakes" items={guide.mistakes} warning />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <InfoBlock label="Breathing" value={guide.breathing} />
            <InfoBlock label="Tempo" value={guide.tempo} />
            <InfoBlock label="Safety check" value={guide.safety} warning />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoBlock label="Scale it down" value={guide.easier} />
            <InfoBlock label="Progress it" value={guide.harder} />
          </div>
        </div>
      </section>

      {/* ── related plates ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="container pb-14">
          <div className="hazard-rule mb-3" />
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-xl font-bold text-white sm:text-2xl">
              More {categoryLabel}
            </h2>
            <Link
              href="/"
              className="meta shrink-0 border border-lime/35 px-2.5 py-1 text-[0.45rem] text-lime transition-colors hover:bg-lime/10"
            >
              All 54 plates
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((ex, i) => (
              <Link
                key={ex.slug}
                href={`/e/${ex.slug}`}
                className="group rise-in relative block border border-white/12 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-lime"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <img
                    src={ex.image}
                    alt={ex.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <span className="meta absolute left-1.5 top-1.5 border border-lime/40 bg-black/85 px-1.5 py-0.5 text-[0.42rem] font-bold text-lime">
                    {ex.plate}
                  </span>
                  <span className="display absolute inset-x-2 bottom-2 text-[0.7rem] font-semibold leading-tight text-white transition-colors duration-200 group-hover:text-lime">
                    {ex.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container py-7">
          <p className="meta text-[0.42rem] text-muted-foreground">
            © 2024 Build The Body (BTB) · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

function PlateBar() {
  return (
    <SiteNav active="plates">
      <Link
        href="/workouts"
        className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
      >
        <span className="meta text-[0.5rem]">Sessions</span>
      </Link>
      <Link
        href="/"
        className="hidden shrink-0 items-center gap-2 border border-white/15 px-3 py-2 transition-colors duration-200 hover:border-lime hover:text-lime sm:flex"
      >
        <span className="meta text-[0.5rem]">All Plates</span>
      </Link>
    </SiteNav>
  );
}

function Tag({ label, lime = false }: { label: string; lime?: boolean }) {
  return (
    <span
      className={`meta border px-2 py-1 text-[0.45rem] ${
        lime
          ? "border-lime/40 bg-lime/10 text-lime"
          : "border-white/15 text-white/55"
      }`}
    >
      {label}
    </span>
  );
}

function GuideBlock({ title, items, compact = false, warning = false }: { title: string; items: string[]; compact?: boolean; warning?: boolean }) {
  return (
    <section className={`border p-4 sm:p-5 ${warning ? "border-red-200/20" : "border-white/12"}`}>
      <h3 className={`display text-lg font-semibold ${warning ? "text-red-200" : "text-lime"}`}>{title}</h3>
      <ol className={`mt-4 ${compact ? "grid gap-2 sm:grid-cols-2" : "space-y-3"}`}>
        {items.map((item, index) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/70">
            <span className="meta flex h-5 w-5 shrink-0 items-center justify-center border border-lime/40 text-[0.4rem] text-lime">{index + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function InfoBlock({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <section className={`border p-4 ${warning ? "border-red-200/20" : "border-white/12"}`}>
      <h3 className={`meta text-[0.45rem] font-bold ${warning ? "text-red-200" : "text-lime"}`}>{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{value}</p>
    </section>
  );
}
