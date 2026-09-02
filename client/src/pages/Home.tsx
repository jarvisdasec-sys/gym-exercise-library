/**
 * BTB Gym Exercise Library — the Blueprint Wall.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall" + Brief Amendments):
 *  - The intro is a COMPACT LIBRARY MASTHEAD, not a marketing hero. The poster
 *    wall must be the primary visual event immediately after the first screen.
 *  - Asymmetric: persistent 260px left rail + fluid plate wall. No lone centered column.
 *  - Lime = wayfinding (active state, counts, hairlines). One lime fill per view.
 *  - Blueprint motifs are mandatory system language: lime hairlines, oversized mono
 *    index numerals, corner registration ticks, one hazard rule per category section.
 *  - Voice: coach-direct, imperative, zero hype. No soft marketing copy anywhere.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { BtbLogo } from "@/components/BtbLogo";
import { BookSpotlight } from "@/components/BookSpotlight";
import { FreeChapterModal } from "@/components/FreeChapterModal";
import { SuggestionBox } from "@/components/SuggestionBox";
import {
  Apple,
  ArrowRight,
  Clock,
  Dumbbell,
  Flame,
  Gauge,
  PackageOpen,
  QrCode,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { PlateTile } from "@/components/PlateTile";
import { PlateLightbox } from "@/components/PlateLightbox";
import {
  CATEGORIES,
  DIFFICULTIES,
  INDEXED_EXERCISES,
  type CategoryId,
  type Difficulty,
  type IndexedExercise,
} from "@/lib/exercises";
import { getWodForDate } from "@/lib/wod";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">(
    "all",
  );
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "all">(
    "all",
  );
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [railOpen, setRailOpen] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const wallRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INDEXED_EXERCISES.filter((ex) => {
      if (activeCategory !== "all" && ex.category !== activeCategory)
        return false;
      if (activeDifficulty !== "all" && ex.difficulty !== activeDifficulty)
        return false;
      if (!q) return true;
      return (
        ex.name.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        ex.primary.toLowerCase().includes(q) ||
        ex.category.includes(q)
      );
    });
  }, [activeCategory, activeDifficulty, query]);

  const groups = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: filtered.filter((e) => e.category === cat.id),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  const openIndex = filtered.findIndex((e) => e.slug === openSlug);
  const openExercise: IndexedExercise | null =
    openIndex >= 0 ? filtered[openIndex] : null;

  const step = (dir: 1 | -1) => {
    if (openIndex < 0 || filtered.length === 0) return;
    const next = (openIndex + dir + filtered.length) % filtered.length;
    setOpenSlug(filtered[next].slug);
  };

  const hasFilters =
    activeCategory !== "all" || activeDifficulty !== "all" || query.length > 0;

  const resetFilters = () => {
    setActiveCategory("all");
    setActiveDifficulty("all");
    setQuery("");
  };

  useEffect(() => {
    setRailOpen(false);
  }, [activeCategory, activeDifficulty]);

  return (
    <div className="min-h-screen">
      {/* ══ STICKY TOP BAR ══════════════════════════════════════════ */}
      <SiteNav active="plates">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH MOVEMENT / MUSCLE"
            className="meta h-10 w-full border border-white/12 bg-white/[0.03] pl-9 pr-8 text-[0.55rem] text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground/60 focus:border-lime"
            style={{ transitionTimingFunction: "var(--ease-out-snap)" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-lime"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          onClick={() => setRailOpen((v) => !v)}
          className="flex h-10 shrink-0 items-center gap-2 border border-white/12 px-3 transition-colors duration-200 hover:border-lime hover:text-lime lg:hidden"
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <Link
          href="/stickers"
          aria-label="Machine stickers"
          className="hidden h-10 shrink-0 items-center gap-2 border border-white/12 px-3 transition-colors duration-200 hover:border-lime hover:text-lime xl:flex"
        >
          <QrCode className="h-4 w-4" />
        </Link>
        {/* the single lime fill for this view — the live plate count */}
        <div className="hidden h-10 shrink-0 items-center gap-2 bg-lime px-3.5 sm:flex">
          <span className="meta text-[0.7rem] font-bold text-black">
            {String(filtered.length).padStart(2, "0")}
          </span>
          <span className="meta text-[0.45rem] font-bold text-black/70">
            Plates
          </span>
        </div>
      </SiteNav>

      {/* ══ MASTHEAD — compact library banner, not a marketing hero ══ */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/25" />

        <div className="container relative">
          <div className="flex flex-col gap-8 py-9 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:py-11">
            <div className="min-w-0">
              <div className="mb-3.5 flex items-center gap-3">
                <span className="h-px w-8 bg-lime" />
                <span className="meta text-[0.45rem] text-lime">
                  Movement Index · Rev. 01
                </span>
              </div>

              <h1 className="display text-[2.5rem] font-bold leading-[0.88] text-white sm:text-[3.5rem] lg:text-[4rem]">
                Find the movement.
                <br />
                <span className="text-lime">Own the form.</span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">
                Start position, end position, muscle map, and the mistakes that
                stall progress. One plate per movement. Pick a body part and
                scan the wall.
              </p>
            </div>

            {/* index readout — utility, not decoration */}
            <div className="grid shrink-0 grid-cols-3 border border-white/12 divide-x divide-white/12 lg:grid-cols-3">
              {[
                { n: "54", l: "Blueprints" },
                { n: "06", l: "Body Parts" },
                { n: "03", l: "Levels" },
              ].map((s) => (
                <div key={s.l} className="px-4 py-3.5 sm:px-6">
                  <div className="meta text-xl font-bold text-lime">{s.n}</div>
                  <div className="meta mt-1.5 text-[0.42rem] text-white/50">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hazard-rule absolute inset-x-0 bottom-0" />
      </section>

      <HomepageWodCard />

      <SuggestionBox />

      <BookSpotlight onDownloadChapter={() => setChapterModalOpen(true)} />

      {/* ══ RAIL + WALL ═════════════════════════════════════════════ */}
      <div className="container" ref={wallRef}>
        <div className="flex gap-0 lg:gap-9">
          {/* ── LEFT RAIL ──────────────────────────────────────────── */}
          <aside
            className={`${
              railOpen
                ? "fixed inset-x-0 bottom-0 top-20 z-30 overflow-y-auto border-t border-white/10 bg-background px-5 py-6"
                : "hidden"
            } lg:sticky lg:top-20 lg:block lg:h-[calc(100vh-5rem)] lg:w-[248px] lg:shrink-0 lg:overflow-y-auto lg:border-0 lg:bg-transparent lg:px-0 lg:py-8`}
          >
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between border-b border-white/12 pb-2">
                <h2 className="meta text-[0.45rem] text-muted-foreground">
                  Body Part
                </h2>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="meta text-[0.45rem] text-lime transition-opacity hover:opacity-70"
                  >
                    Reset
                  </button>
                )}
              </div>

              <nav className="flex flex-col">
                <RailItem
                  label="All Movements"
                  count={INDEXED_EXERCISES.length}
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                />
                {CATEGORIES.map((cat) => (
                  <RailItem
                    key={cat.id}
                    label={cat.label}
                    count={
                      INDEXED_EXERCISES.filter((e) => e.category === cat.id)
                        .length
                    }
                    active={activeCategory === cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                  />
                ))}
              </nav>
            </div>

            <div className="mb-7">
              <h2 className="meta mb-3 border-b border-white/12 pb-2 text-[0.45rem] text-muted-foreground">
                Load Level
              </h2>
              <div className="flex flex-wrap gap-1.5">
                <ChipButton
                  label="Any"
                  active={activeDifficulty === "all"}
                  onClick={() => setActiveDifficulty("all")}
                />
                {DIFFICULTIES.map((d) => (
                  <ChipButton
                    key={d}
                    label={d}
                    active={activeDifficulty === d}
                    onClick={() => setActiveDifficulty(d)}
                  />
                ))}
              </div>
            </div>

            <div className="relative border border-white/12 p-4">
              <span className="tick-static absolute -top-px -left-px h-2.5 w-2.5 border-t-2 border-l-2 border-lime" />
              <span className="tick-static absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-lime" />
              <p className="display text-sm font-semibold leading-snug text-lime">
                Stay consistent.
                <br />
                Stay disciplined.
                <br />
                Build the body.
              </p>
              <p className="meta mt-3 text-[0.42rem] leading-relaxed text-muted-foreground">
                Tap a plate to open it. ← → to move through the set.
              </p>
            </div>

            <Link
              href="/workouts"
              className="mt-3 flex items-center gap-2.5 border border-lime/35 p-3.5 transition-colors duration-200 hover:bg-lime/8"
            >
              <Dumbbell className="h-4 w-4 shrink-0 text-lime" />
              <span className="min-w-0">
                <span className="meta block text-[0.45rem] font-bold text-lime">
                  Workout sessions
                </span>
                <span className="meta mt-1 block text-[0.4rem] text-muted-foreground">
                  Push · Pull · Legs · More
                </span>
              </span>
            </Link>

            <Link
              href="/nutrition"
              className="mt-2 flex items-center gap-2.5 border border-lime/35 p-3.5 transition-colors duration-200 hover:bg-lime/8"
            >
              <Apple className="h-4 w-4 shrink-0 text-lime" />
              <span className="min-w-0">
                <span className="meta block text-[0.45rem] font-bold text-lime">
                  Nutrition
                </span>
                <span className="meta mt-1 block text-[0.4rem] text-muted-foreground">
                  Macros · Meals · Tracker
                </span>
              </span>
            </Link>

            <Link
              href="/stickers"
              className="mt-2 flex items-center gap-2.5 border border-white/12 p-3.5 transition-colors duration-200 hover:border-lime/40"
            >
              <QrCode className="h-4 w-4 shrink-0 text-white/50" />
              <span className="min-w-0">
                <span className="meta block text-[0.45rem] text-white/70">
                  Print QR stickers
                </span>
                <span className="meta mt-1 block text-[0.4rem] text-muted-foreground">
                  One label per machine
                </span>
              </span>
            </Link>

            {railOpen && (
              <button
                onClick={() => setRailOpen(false)}
                className="mt-6 w-full bg-lime py-3 lg:hidden"
              >
                <span className="meta text-[0.55rem] font-bold text-black">
                  Show {filtered.length} plates
                </span>
              </button>
            )}
          </aside>

          {/* ── PLATE WALL ─────────────────────────────────────────── */}
          <main className="min-w-0 flex-1 py-8">
            {groups.length === 0 ? (
              <div className="border border-white/10 px-8 py-24 text-center">
                <p className="display text-2xl font-semibold text-white">
                  No plates match
                </p>
                <p className="meta mt-3 text-[0.5rem] text-muted-foreground">
                  Loosen the filters or search another movement
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 border border-lime px-5 py-2.5 transition-colors duration-200 hover:bg-lime/10"
                >
                  <span className="meta text-[0.5rem] font-bold text-lime">
                    Reset filters
                  </span>
                </button>
              </div>
            ) : (
              groups.map((group, gi) => (
                <section key={group.id} className="mb-12 last:mb-4">
                  {/* ── category header: inventory board rule ──────── */}
                  <div className="mb-5">
                    <div className="hazard-rule mb-3" />
                    <div className="flex items-end justify-between gap-6">
                      <div className="flex min-w-0 items-baseline gap-3">
                        <span className="meta shrink-0 text-[0.55rem] font-bold text-lime/50">
                          {String(gi + 1).padStart(2, "0")}
                        </span>
                        <h2 className="display shrink-0 text-[1.75rem] font-bold leading-none text-white sm:text-[2.25rem]">
                          {group.label}
                        </h2>
                        <span
                          className="display outline-type hidden shrink-0 text-[2.25rem] font-bold leading-none sm:block"
                          aria-hidden="true"
                        >
                          {group.label}
                        </span>
                      </div>
                      <span className="meta shrink-0 border border-lime/35 px-2 py-1 text-[0.45rem] text-lime">
                        {String(group.items.length).padStart(2, "0")} Plates
                      </span>
                    </div>
                    <p className="meta mt-2.5 text-[0.45rem] text-muted-foreground">
                      {group.blurb}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {group.items.map((ex, i) => (
                      <PlateTile
                        key={ex.slug}
                        exercise={ex}
                        index={i}
                        onOpen={setOpenSlug}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </main>
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="mt-6 border-t border-white/10">
        <div className="hazard-rule" />
        <div className="container flex flex-col items-start justify-between gap-7 py-9 sm:flex-row sm:items-center">
          <div>
            <BtbLogo compact />
            <p className="meta mt-3.5 text-[0.42rem] text-muted-foreground">
              54 plates · Every machine on the floor
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="display text-sm font-semibold text-lime">
              Stay consistent. Stay disciplined. Build the body.
            </p>
            <p className="meta mt-2.5 text-[0.42rem] text-muted-foreground">
              © 2024 Build The Body (BTB) · All Rights Reserved
            </p>
          </div>
        </div>
      </footer>

      <PlateLightbox
        exercise={openExercise}
        total={filtered.length}
        position={openIndex + 1}
        onClose={() => setOpenSlug(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
      <FreeChapterModal
        open={chapterModalOpen}
        onOpenChange={setChapterModalOpen}
      />
    </div>
  );
}

function HomepageWodCard() {
  const workout = getWodForDate();

  return (
    <section
      className="btb-wod-section border-b border-white/10 bg-black py-6 sm:py-8"
      aria-labelledby="btb-wod-heading"
    >
      <div className="btb-wod-wrap container">
        <article className="btb-wod-card relative mx-auto w-full max-w-5xl border border-lime bg-plate p-5 sm:p-7 lg:p-8">
          <span className="btb-wod-tick absolute -left-px -top-px h-4 w-4 border-l-4 border-t-4 border-lime" />
          <span className="btb-wod-tick absolute -bottom-px -right-px h-4 w-4 border-b-4 border-r-4 border-lime" />

          <div className="btb-wod-layout grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center lg:gap-10">
            <div className="btb-wod-primary min-w-0">
              <div className="btb-wod-kicker flex items-center gap-3">
                <Flame className="h-5 w-5 text-lime" aria-hidden="true" />
                <span className="meta text-[0.5rem] font-bold text-lime">
                  Daily Training Sheet
                </span>
              </div>

              <h2
                id="btb-wod-heading"
                className="btb-wod-heading display mt-4 text-[2.25rem] font-bold leading-none text-white sm:text-[3rem]"
              >
                Workout of the day
              </h2>
              <p className="btb-wod-name display mt-2 text-2xl font-bold text-lime sm:text-3xl">
                {workout.title}
              </p>

              <div className="btb-wod-facts mt-5 grid grid-cols-1 border border-white/12 sm:grid-cols-3 sm:divide-x sm:divide-white/12">
                <WodFact icon={Gauge} label="Difficulty" value={workout.difficulty} />
                <WodFact icon={Clock} label="Duration" value={workout.duration} />
                <WodFact icon={PackageOpen} label="Equipment" value={workout.equipment.join(" · ")} />
              </div>
            </div>

            <div className="btb-wod-summary border-t border-white/12 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="meta text-[0.45rem] font-bold text-lime">Main workout</p>
              <ul className="btb-wod-exercises mt-3 space-y-2.5">
                {workout.exercises.slice(0, 4).map((exercise) => (
                  <li key={exercise.name} className="btb-wod-exercise flex items-baseline justify-between gap-4 border-b border-white/8 pb-2 text-sm">
                    <span className="font-medium text-white/80">{exercise.name}</span>
                    <span className="meta shrink-0 text-right text-[0.42rem] text-white/50">{exercise.prescription}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/wod"
                className="btb-wod-cta mt-5 flex w-full items-center justify-center gap-3 border border-lime px-5 py-3.5 text-lime transition-colors duration-200 hover:bg-lime hover:text-black sm:w-auto"
              >
                <span className="meta text-[0.52rem] font-bold">View today&apos;s workout</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function WodFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="btb-wod-fact border-b border-white/12 p-3 last:border-b-0 sm:border-b-0">
      <div className="flex items-center gap-2 text-lime">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="meta text-[0.4rem]">{label}</span>
      </div>
      <p className="display mt-2 text-sm font-semibold leading-tight text-white">{value}</p>
    </div>
  );
}

/* ── rail primitives ─────────────────────────────────────────────── */

function RailItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between border-l-2 border-b border-b-white/8 py-2 pl-3 pr-2 text-left transition-colors duration-200 ${
        active
          ? "border-l-lime bg-lime/8"
          : "border-l-white/10 hover:border-l-white/40 hover:bg-white/[0.03]"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out-snap)" }}
    >
      <span
        className={`display text-[0.95rem] font-semibold transition-colors duration-200 ${
          active ? "text-lime" : "text-white/70 group-hover:text-white"
        }`}
      >
        {label}
      </span>
      <span
        className={`meta text-[0.48rem] ${
          active ? "text-lime" : "text-muted-foreground"
        }`}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}

function ChipButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-2.5 py-1.5 transition-colors duration-200 ${
        active
          ? "border-lime bg-lime/10 text-lime"
          : "border-white/12 text-white/55 hover:border-white/40 hover:text-white"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out-snap)" }}
    >
      <span className="meta text-[0.45rem]">{label}</span>
    </button>
  );
}
