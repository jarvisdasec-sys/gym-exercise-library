import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { GroupWorkoutSection } from "../client/src/components/GroupWorkoutSection";
import {
  GROUP_TITLE,
  GROUP_DESCRIPTION,
  GROUP_URL,
  GROUP_IMAGE,
} from "../client/src/lib/groupWorkoutMetadata";

const output = path.resolve("dist/public");
let html = await readFile(path.join(output, "app.html"), "utf8");
const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
function setMeta(attribute: "name" | "property", name: string, value: string) {
  const tag = `<meta ${attribute}="${name}" content="${escape(value)}" />`;
  const existing = new RegExp(`<meta\\b[^>]*${attribute}="${name}"[^>]*>`, "i");
  html = existing.test(html)
    ? html.replace(existing, tag)
    : html.replace("</head>", `${tag}\n</head>`);
}
html = html
  .replace(/<title>[^<]*<\/title>/, `<title>${escape(GROUP_TITLE)}</title>`)
  .replace(/, maximum-scale=1/g, "");
setMeta("name", "description", GROUP_DESCRIPTION);
setMeta(
  "name",
  "keywords",
  "group workouts, bodyweight exercises, home cardio, dance fitness, 15-day program"
);
for (const [name, value] of Object.entries({
  "og:type": "website",
  "og:site_name": "BTB — Build The Body",
  "og:title": GROUP_TITLE,
  "og:description": GROUP_DESCRIPTION,
  "og:url": GROUP_URL,
  "og:image": GROUP_IMAGE,
}))
  setMeta("property", name, value);
for (const [name, value] of Object.entries({
  "twitter:card": "summary_large_image",
  "twitter:title": GROUP_TITLE,
  "twitter:description": GROUP_DESCRIPTION,
  "twitter:image": GROUP_IMAGE,
}))
  setMeta("name", name, value);
html = html
  .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "")
  .replace("</head>", `<link rel="canonical" href="${GROUP_URL}" />\n</head>`);
const markup = renderToStaticMarkup(
  <>
    <header className="border-b border-white/10 bg-black">
      <nav
        className="container flex flex-wrap items-center justify-between gap-4 py-5"
        aria-label="BTB navigation"
      >
        <a href="/" className="display text-xl font-bold text-lime">
          BTB · Build The Body
        </a>
        <div className="flex flex-wrap gap-5 text-sm text-white/70">
          <a href="/">Exercises</a>
          <a href="/workouts">Workouts</a>
          <a href="/cardio">Cardio</a>
          <a href="/mobility">Mobility &amp; Flow</a>
        </div>
      </nav>
    </header>
    <main className="container pb-12">
      <div className="pt-8">
        <a
          href="/workouts"
          className="meta inline-flex min-h-11 items-center text-[0.5rem] text-lime"
        >
          ← All workout sessions
        </a>
        <h1 className="display mt-3 text-3xl font-bold text-white sm:text-4xl">
          Group Workouts
        </h1>
      </div>
      <GroupWorkoutSection />
      <noscript>
        Enable JavaScript to use the day selector, group options and interval
        timer. The displayed exercise instructions remain readable.
      </noscript>
    </main>
    <footer className="container border-t border-white/10 py-7 text-sm text-white/60">
      Stay consistent. Stay disciplined. Build the body.
    </footer>
  </>
);
if (!html.includes('<div id="root"></div>'))
  throw new Error(
    "Generic app shell changed; cannot safely prerender group workouts."
  );
html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
await writeFile(path.join(output, "group-workouts.html"), html);
console.log(
  "Generated public group-workout instructions and metadata, with no account data."
);
