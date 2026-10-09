import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { GrowthContent } from "../client/src/components/GrowthContent";
import {
  BTB_CONTACT,
  GROWTH_META,
  PLANNER_URL,
} from "../client/src/lib/growth";

const output = path.resolve("dist/public");
const PUBLIC_ORIGIN = "https://www.btbfitnessandhealth.com";
const plannerUrl = process.env.VITE_PLANNER_REVIEW_URL?.trim() || PLANNER_URL;
type GrowthPage = keyof typeof GROWTH_META;

// Vite supplies the automatic JSX runtime in the browser. `tsx` evaluates the
// shared component with the classic runtime during this static build, so expose
// React for JSX compiled by that component without changing its client source.
(globalThis as typeof globalThis & { React: typeof React }).React = React;

const escapeAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function setMeta(
  html: string,
  attribute: "name" | "property",
  name: string,
  value: string
) {
  const tag = `<meta ${attribute}="${name}" content="${escapeAttribute(value)}" />`;
  const existing = new RegExp(`<meta\\b[^>]*${attribute}="${name}"[^>]*>`, "i");
  return existing.test(html)
    ? html.replace(existing, tag)
    : html.replace("</head>", `${tag}\n</head>`);
}

function withMetadata(shell: string, page: GrowthPage) {
  const metadata = GROWTH_META[page];
  const canonical = `${PUBLIC_ORIGIN}${metadata.path}`;
  let html = shell
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeAttribute(metadata.title)}</title>`
    )
    .replace(/, maximum-scale=1/g, "")
    .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "");

  for (const [attribute, name, value] of [
    ["name", "description", metadata.description],
    ["name", "robots", "index,follow,max-image-preview:large"],
    ["property", "og:type", "website"],
    ["property", "og:site_name", "Build The Body (BTB)"],
    ["property", "og:title", metadata.title],
    ["property", "og:description", metadata.description],
    ["property", "og:url", canonical],
    [
      "property",
      "og:image",
      `${PUBLIC_ORIGIN}/images/site/btb-movement-index-hero.jpg`,
    ],
    [
      "property",
      "og:image:alt",
      "BTB training illustration in a black and neon-green gym",
    ],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", metadata.title],
    ["name", "twitter:description", metadata.description],
    [
      "name",
      "twitter:image",
      `${PUBLIC_ORIGIN}/images/site/btb-movement-index-hero.jpg`,
    ],
  ] as const) {
    html = setMeta(html, attribute, name, value);
  }

  return html.replace(
    "</head>",
    `<link rel="canonical" href="${canonical}" />\n</head>`
  );
}

function StaticInquiryFallback() {
  return (
    <section id="btb-inquiry" className="growth-section">
      <div className="growth-wrap growth-split">
        <div>
          <p className="growth-kicker">CONTACT BTB / EMAIL DRAFT</p>
          <h2>
            Ask a question.
            <br />
            <em>Keep control of the send.</em>
          </h2>
        </div>
        <div>
          <p className="growth-lead">
            JavaScript adds the inquiry composer. Without it, this link opens a
            message addressed to BTB that you can review and send yourself.
          </p>
          <a
            className="growth-action"
            href={`mailto:${BTB_CONTACT}?subject=BTB%20inquiry`}
          >
            Prepare an email to BTB →
          </a>
        </div>
      </div>
    </section>
  );
}

function StaticPage({ page }: { page: GrowthPage }) {
  return (
    <>
      <header className="border-b border-white/10 bg-black">
        <nav
          aria-label="BTB navigation"
          className="container flex flex-wrap items-center justify-between gap-4 py-5"
        >
          <a href="/" className="display text-xl font-bold text-lime">
            BTB <span className="sr-only">Fitness &amp; Health</span>
          </a>
          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <a href="/start">Start here</a>
            <a href="/exercises">Exercise guides</a>
            <a href="/workouts">Workouts</a>
            <a href="/nutrition">Nutrition</a>
          </div>
        </nav>
      </header>
      <GrowthContent page={page} plannerUrl={plannerUrl} />
      {page === "start" && <StaticInquiryFallback />}
      <footer className="border-t border-white/10">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-7 text-sm text-white/60">
          <span>BTB Fitness &amp; Health</span>
          <a href="/plus" className="text-lime">
            Help shape BTB Plus
          </a>
        </div>
      </footer>
    </>
  );
}

const shell = await readFile(path.join(output, "index.html"), "utf8");
if (!shell.includes('<div id="root"></div>')) {
  throw new Error(
    "The app HTML root changed; cannot safely render public pages."
  );
}

// Preserve a generic client shell before any route-specific metadata or markup
// is added. Known application routes use this shell; public snapshots do not.
await writeFile(path.join(output, "app.html"), shell);

for (const page of ["home", "start", "plus"] as const) {
  const markup = renderToStaticMarkup(<StaticPage page={page} />);
  if (/<iframe\b/i.test(markup)) {
    throw new Error(
      "Public growth snapshots must not load third-party players."
    );
  }
  const html = withMetadata(shell, page).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`
  );
  const file = page === "home" ? "home.html" : `${page}.html`;
  await writeFile(path.join(output, file), html);
  if (page === "home") await writeFile(path.join(output, "index.html"), html);
}

console.log(
  "Generated public home, start, and BTB Plus snapshots with route-specific metadata; no account data is included."
);
