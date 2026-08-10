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

import { useMemo } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Link, useParams } from "wouter";
import { ArrowRight, Download, Dumbbell, QrCode } from "lucide-react";
import { PlateQr } from "@/components/PlateQr";
import { plateUrl, plateUrlLabel } from "@/lib/plateUrl";
import { CATEGORIES, INDEXED_EXERCISES } from "@/lib/exercises";
import { WORKOUTS } from "@/lib/workouts";

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
