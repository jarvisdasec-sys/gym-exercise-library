/**
 * Education hub — the knowledge index.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"):
 *  - Asymmetric rail + wall: persistent left section rail on desktop, never a
 *    lone centered column.
 *  - Lime is wayfinding, not wallpaper. One lime fill per view; lime fills carry
 *    near-black text.
 *  - Hairline over shadow. 1px borders, no soft drop shadows, no rounded pills.
 *  - Oversized mono index numerals, corner registration ticks, and one diagonal
 *    hazard rule per section header are mandatory system language.
 *  - Copy is coach-direct and imperative. Meta text is mono caps.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { BookOpen, ChevronRight, Clock, ShieldAlert } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { BtbLogo } from "@/components/BtbLogo";
import { EDU_SECTIONS, type EduSectionKey } from "@/lib/education";
import {
  EDU_ARTICLES,
  articlesInSection,
  totalReadMinutes,
} from "@/lib/eduIndex";

export default function Education() {
  const [active, setActive] = useState<EduSectionKey | "all">("all");

  const visibleSections = useMemo(
    () =>
      active === "all"
        ? EDU_SECTIONS
        : EDU_SECTIONS.filter((s) => s.key === active),
    [active],
  );

  const totalMinutes = totalReadMinutes();

  return (
    <div className="min-h-screen">
      <SiteNav active="education" />

      {/* ── masthead: compact index header, not a marketing hero ─────── */}
      <section className="border-b border-white/10">
        <div className="container py-8 sm:py-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <div className="meta mb-3 flex items-center gap-2 text-[0.5rem] text-lime">
                <BookOpen className="h-3 w-3" />
                <span>Knowledge · Education · Results</span>
              </div>
              <h1 className="display text-[2.6rem] leading-[0.9] text-white sm:text-[3.6rem]">
                Learn The Why
              </h1>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-white/55">
                The library tells you what to do. This tells you why it works —
                so you stop guessing, stop wasting effort, and stop believing
                the shelf.
              </p>
            </div>

            {/* instrumentation block */}
            <div className="flex shrink-0 gap-6 border-l border-white/10 pl-6">
              <Stat value={String(EDU_ARTICLES.length)} label="Articles" />
              <Stat value={String(EDU_SECTIONS.length)} label="Sections" />
              <Stat value={`${totalMinutes}`} label="Min total read" />
            </div>
          </div>
        </div>
      </section>

      {/* ── rail + wall ──────────────────────────────────────────────── */}
      <div className="container flex gap-10 py-8">
        {/* left rail */}
        <aside className="no-print hidden w-[212px] shrink-0 lg:block">
          <div className="sticky top-[5.5rem]">
            <div className="meta mb-3 text-[0.45rem] text-white/35">
              Sections
            </div>
            <nav className="border-t border-white/10">
              <RailItem
                label="All"
                count={EDU_ARTICLES.length}
                isActive={active === "all"}
                onClick={() => setActive("all")}
              />
              {EDU_SECTIONS.map((s) => (
                <RailItem
                  key={s.key}
                  label={s.label}
                  count={articlesInSection(s.key).length}
                  isActive={active === s.key}
                  onClick={() => setActive(s.key)}
                />
              ))}
            </nav>

            <div className="mt-6 border border-white/10 p-3.5">
              <div className="meta mb-2 flex items-center gap-1.5 text-[0.42rem] text-lime">
                <ShieldAlert className="h-3 w-3" />
                <span>Read this first</span>
              </div>
              <p className="text-[0.72rem] leading-relaxed text-white/45">
                General education, not medical or individual advice. Anything
                that hurts, or any decision about medication, needs a doctor or
                physiotherapist — not a website.
              </p>
            </div>
          </div>
        </aside>

        {/* wall */}
        <main className="min-w-0 flex-1">
          {/* mobile section chips */}
          <div className="no-print mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <Chip
              label="All"
              isActive={active === "all"}
              onClick={() => setActive("all")}
            />
            {EDU_SECTIONS.map((s) => (
              <Chip
                key={s.key}
                label={s.label}
                isActive={active === s.key}
                onClick={() => setActive(s.key)}
              />
            ))}
          </div>

          {visibleSections.map((section, si) => {
            const articles = articlesInSection(section.key);
            return (
              <section key={section.key} className="mb-14 last:mb-6">
                {/* section header with the mandated hazard rule */}
                <div className="mb-5">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-3">
                        <span className="meta text-[1.5rem] leading-none text-white/[0.09]">
                          {String(si + 1).padStart(2, "0")}
                        </span>
                        <h2 className="display text-[1.5rem] text-white sm:text-[1.85rem]">
                          {section.title}
                        </h2>
                      </div>
                      <p className="mt-1.5 text-[0.85rem] text-white/50">
                        {section.tagline}
                      </p>
                    </div>
                    <span className="meta shrink-0 text-[0.45rem] text-white/30">
                      {articles.length} {articles.length === 1 ? "Read" : "Reads"}
                    </span>
                  </div>
                  <div className="hazard-rule mt-3" />
                  <div className="meta mt-2 text-[0.42rem] text-white/28">
                    For: {section.audience}
                  </div>
                </div>

                {/* article cards */}
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {articles.map((a, i) => (
                    <Link
                      key={a.slug}
                      href={`/learn/${a.slug}`}
                      className="group relative flex flex-col border border-white/12 p-4 transition-all duration-200 hover:-translate-y-[2px] hover:border-lime"
                      style={{
                        transitionTimingFunction: "var(--ease-out-snap)",
                      }}
                    >
                      {/* corner registration ticks */}
                      <span className="tick left-1 top-1 border-l border-t" />
                      <span className="tick right-1 top-1 border-r border-t" />
                      <span className="tick bottom-1 left-1 border-b border-l" />
                      <span className="tick bottom-1 right-1 border-b border-r" />

                      <div className="mb-2 flex items-center justify-between">
                        <span className="meta text-[0.42rem] text-white/25">
                          {section.label} / {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="meta flex items-center gap-1 text-[0.42rem] text-white/30">
                          <Clock className="h-2.5 w-2.5" />
                          {a.minutes} min
                        </span>
                      </div>

                      <h3 className="display text-[1.05rem] leading-tight text-white transition-colors duration-200 group-hover:text-lime">
                        {a.title}
                      </h3>
                      <p className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-white/48">
                        {a.summary}
                      </p>
                      <span className="meta mt-3 flex items-center gap-1 text-[0.42rem] text-lime opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        Read <ChevronRight className="h-2.5 w-2.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {/* compliance footer — deliberate, not decorative */}
          <div className="border border-white/12 p-5">
            <div className="meta mb-2 flex items-center gap-1.5 text-[0.45rem] text-lime">
              <ShieldAlert className="h-3 w-3" />
              <span>Scope of this section</span>
            </div>
            <p className="text-[0.82rem] leading-relaxed text-white/50">
              Everything here is general education for healthy adults. It is not
              medical advice, not individualised nutrition prescription, and not
              a substitute for assessment by a qualified professional. If a
              movement causes pain, if you are managing a health condition, if
              you take medication, if you are pregnant or breastfeeding, or if
              you are under 18 — speak to a doctor, physiotherapist or
              registered dietitian about your own situation. Claims in the
              supplements section are cited to their published sources so you
              can check them yourself.
            </p>
          </div>
        </main>
      </div>

      <footer className="border-t border-white/10 py-8">
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <BtbLogo compact />
          <p className="meta text-[0.42rem] text-white/30">
            Stay consistent. Stay disciplined. Build the body.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="display text-[1.7rem] leading-none text-lime">
        {value}
      </div>
      <div className="meta mt-1 text-[0.4rem] text-white/35">{label}</div>
    </div>
  );
}

function RailItem({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between border-b border-white/[0.07] py-2.5 text-left transition-colors duration-200 ${
        isActive ? "text-lime" : "text-white/55 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span
          className={`h-4 w-[2px] shrink-0 ${
            isActive ? "bg-lime" : "bg-transparent"
          }`}
        />
        <span className="meta text-[0.48rem] font-bold">{label}</span>
      </span>
      <span className="meta text-[0.42rem] text-white/25">{count}</span>
    </button>
  );
}

function Chip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`meta shrink-0 border px-3 py-2 text-[0.44rem] font-bold transition-colors duration-200 ${
        isActive
          ? "border-lime bg-lime text-black"
          : "border-white/15 text-white/55"
      }`}
    >
      {label}
    </button>
  );
}
