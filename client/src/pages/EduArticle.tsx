/**
 * Article reader — a single education piece.
 *
 * STYLE CONTRACT (ideas.md — "Blueprint Wall"): hairline panels, mono caps meta,
 * condensed display headings, lime as wayfinding only. Reading measure is capped
 * so long-form copy stays legible, but the page keeps the industrial chrome
 * (index numerals, hazard rule, registration ticks) so it belongs to the wall.
 *
 * CONTENT INTEGRITY: source lists render verbatim from the article data so every
 * cited claim stays traceable. Warn callouts are visually distinct from notes
 * because several of them carry genuine safety information.
 */
import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  Info,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { BtbLogo } from "@/components/BtbLogo";
import NotFound from "@/pages/NotFound";
import { findArticle, articleNeighbours, sectionMeta } from "@/lib/eduIndex";
import type { EduBlock } from "@/lib/education";
import { EXERCISES } from "@/lib/exercises";
import { WORKOUTS } from "@/lib/workouts";

export default function EduArticle() {
  const [, params] = useRoute("/learn/:slug");
  const slug = params?.slug ?? "";
  const article = findArticle(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) return <NotFound />;

  const section = sectionMeta(article.section);
  const { prev, next } = articleNeighbours(slug);

  return (
    <div className="min-h-screen">
      <SiteNav active="education" />

      {/* ── article masthead ─────────────────────────────────────────── */}
      <header className="border-b border-white/10">
        <div className="container max-w-[860px] py-8">
          <Link
            href="/learn"
            className="meta mb-5 inline-flex items-center gap-1.5 text-[0.45rem] text-white/45 transition-colors duration-200 hover:text-lime"
          >
            <ArrowLeft className="h-3 w-3" />
            All education
          </Link>

          <div className="meta mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.45rem]">
            <span className="text-lime">{section?.title}</span>
            <span className="text-white/20">/</span>
            <span className="flex items-center gap-1 text-white/35">
              <Clock className="h-2.5 w-2.5" />
              {article.minutes} min read
            </span>
          </div>

          <h1 className="display text-[2.1rem] leading-[0.95] text-white sm:text-[2.9rem]">
            {article.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-white/55">
            {article.summary}
          </p>
          <div className="hazard-rule mt-5" />
        </div>
      </header>

      {/* ── body ─────────────────────────────────────────────────────── */}
      <article className="container max-w-[860px] py-8">
        {article.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        {/* sources */}
        {article.sources && article.sources.length > 0 && (
          <div className="mt-10 border-t border-white/12 pt-5">
            <div className="meta mb-3 text-[0.45rem] text-lime">Sources</div>
            <ol className="space-y-2">
              {article.sources.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-[0.8rem] leading-relaxed">
                  <span className="meta shrink-0 pt-[3px] text-[0.42rem] text-white/30">
                    [{i + 1}]
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-white/55 transition-colors duration-200 hover:text-lime"
                  >
                    <span>{s.label}</span>
                    <ExternalLink className="mt-[3px] h-2.5 w-2.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* scope note on every article */}
        <div className="mt-8 border border-white/12 p-4">
          <p className="text-[0.78rem] leading-relaxed text-white/45">
            General education for healthy adults — not medical advice or
            individualised prescription. If something hurts, or you are managing
            a health condition, taking medication, pregnant or breastfeeding, or
            under 18, speak to a qualified professional about your own
            circumstances.
          </p>
        </div>

        {/* prev / next within section */}
        {(prev || next) && (
          <nav className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/learn/${prev.slug}`}
                className="group border border-white/12 p-4 transition-colors duration-200 hover:border-lime"
              >
                <div className="meta mb-1.5 flex items-center gap-1.5 text-[0.42rem] text-white/35">
                  <ArrowLeft className="h-2.5 w-2.5" />
                  Previous
                </div>
                <div className="display text-[1rem] text-white transition-colors duration-200 group-hover:text-lime">
                  {prev.title}
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/learn/${next.slug}`}
                className="group border border-white/12 p-4 text-right transition-colors duration-200 hover:border-lime sm:col-start-2"
              >
                <div className="meta mb-1.5 flex items-center justify-end gap-1.5 text-[0.42rem] text-white/35">
                  Next
                  <ArrowRight className="h-2.5 w-2.5" />
                </div>
                <div className="display text-[1rem] text-white transition-colors duration-200 group-hover:text-lime">
                  {next.title}
                </div>
              </Link>
            )}
          </nav>
        )}
      </article>

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

/** Renders one content block. Kept in this file so the mapping stays obvious. */
function Block({ block }: { block: EduBlock }) {
  switch (block.kind) {
    case "para":
      return (
        <p className="mb-5 text-[0.97rem] leading-[1.75] text-white/72">
          {block.text}
        </p>
      );

    case "heading":
      return (
        <h2 className="display mb-3 mt-9 text-[1.35rem] text-white">
          {block.text}
        </h2>
      );

    case "list":
      return (
        <ul className="mb-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[9px] h-[3px] w-[3px] shrink-0 bg-lime" />
              <span className="text-[0.94rem] leading-[1.7] text-white/68">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );

    case "steps":
      return (
        <ol className="mb-5 space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="meta shrink-0 pt-[5px] text-[0.5rem] text-lime">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.94rem] leading-[1.7] text-white/68">
                {item}
              </span>
            </li>
          ))}
        </ol>
      );

    case "callout": {
      const isWarn = block.tone === "warn";
      const Icon = isWarn ? AlertTriangle : Info;
      return (
        <div
          className={`mb-6 mt-2 border-l-2 p-4 ${
            isWarn
              ? "border-l-amber-400 bg-amber-400/[0.05]"
              : "border-l-lime bg-lime/[0.04]"
          }`}
        >
          <div
            className={`meta mb-1.5 flex items-center gap-1.5 text-[0.45rem] ${
              isWarn ? "text-amber-400" : "text-lime"
            }`}
          >
            <Icon className="h-3 w-3" />
            {block.title}
          </div>
          <p className="text-[0.88rem] leading-relaxed text-white/62">
            {block.text}
          </p>
        </div>
      );
    }

    case "quote":
      return (
        <blockquote className="mb-6 border-l-2 border-l-white/20 pl-4">
          <p className="text-[0.97rem] italic leading-[1.7] text-white/70">
            &ldquo;{block.text}&rdquo;
          </p>
          <footer className="meta mt-2 text-[0.42rem] text-white/38">
            — {block.attribution}
          </footer>
        </blockquote>
      );

    case "table":
      return (
        <div className="mb-6 mt-2">
          <div className="overflow-x-auto border border-white/12">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/12 bg-white/[0.03]">
                  {block.headers.map((h, i) => (
                    <th
                      key={i}
                      className="meta px-3.5 py-2.5 text-[0.42rem] text-lime"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-white/[0.07] last:border-b-0"
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-3.5 py-2.5 align-top text-[0.85rem] leading-relaxed ${
                          ci === 0 ? "text-white/80" : "text-white/58"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <p className="meta mt-2 text-[0.4rem] leading-relaxed text-white/30">
              {block.caption}
            </p>
          )}
        </div>
      );

    case "plates": {
      const items = block.slugs
        .map((s) => EXERCISES.find((e) => e.slug === s))
        .filter((e): e is NonNullable<typeof e> => Boolean(e));
      if (items.length === 0) return null;
      return (
        <div className="mb-6 mt-2 border border-white/12 p-4">
          <div className="meta mb-1.5 text-[0.42rem] text-lime">
            From the library
          </div>
          <p className="mb-3 text-[0.82rem] leading-relaxed text-white/50">
            {block.note}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((e) => (
              <Link
                key={e.slug}
                href={`/e/${e.slug}`}
                className="meta border border-white/15 px-2.5 py-1.5 text-[0.42rem] text-white/70 transition-colors duration-200 hover:border-lime hover:text-lime"
              >
                {e.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    case "sessions": {
      const items = block.slugs
        .map((s) => WORKOUTS.find((w) => w.slug === s))
        .filter((w): w is NonNullable<typeof w> => Boolean(w));
      if (items.length === 0) return null;
      return (
        <div className="mb-6 mt-2 border border-white/12 p-4">
          <div className="meta mb-1.5 text-[0.42rem] text-lime">
            Try these sessions
          </div>
          <p className="mb-3 text-[0.82rem] leading-relaxed text-white/50">
            {block.note}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((w) => (
              <Link
                key={w.slug}
                href={`/workouts/${w.slug}`}
                className="meta border border-white/15 px-2.5 py-1.5 text-[0.42rem] text-white/70 transition-colors duration-200 hover:border-lime hover:text-lime"
              >
                {w.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

