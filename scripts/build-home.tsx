import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BtbMotion } from "../client/src/components/BtbMotion";
import {
  HOME_TITLE,
  HOME_DESCRIPTION,
  HOME_URL,
  HOME_IMAGE,
} from "../client/src/lib/homeMetadata";

const output = path.resolve("dist/public");
let html = await readFile(path.join(output, "index.html"), "utf8");
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
  .replace(/<title>[^<]*<\/title>/, `<title>${escape(HOME_TITLE)}</title>`)
  .replace(/, maximum-scale=1/g, "");
setMeta("name", "description", HOME_DESCRIPTION);
for (const [key, value] of [
  ["og:title", HOME_TITLE],
  ["og:description", HOME_DESCRIPTION],
  ["og:url", HOME_URL],
  ["og:image", HOME_IMAGE],
])
  setMeta("property", key, value);
for (const [key, value] of [
  ["twitter:title", HOME_TITLE],
  ["twitter:description", HOME_DESCRIPTION],
  ["twitter:image", HOME_IMAGE],
])
  setMeta("name", key, value);
html = html.replace(
  "</head>",
  `<link rel="canonical" href="${HOME_URL}" />\n</head>`
);
const publicMarkup = renderToStaticMarkup(
  <>
    <header className="border-b border-white/10 bg-black">
      <nav
        aria-label="BTB navigation"
        className="container flex flex-wrap items-center justify-between gap-4 py-5"
      >
        <a href="/" className="display text-2xl font-bold text-lime">
          BTB
        </a>
        <div className="flex flex-wrap gap-5 text-sm text-white/70">
          <a href="/">Exercise guides</a>
          <a href="/workouts">Workouts</a>
          <a href="/nutrition">Nutrition</a>
          <a href="/account">Account</a>
        </div>
      </nav>
    </header>
    <main>
      <section className="border-b border-white/10 bg-black py-9">
        <div className="container">
          <p className="meta text-[0.48rem] text-lime">
            Movement Index · 54 blueprints
          </p>
          <h1 className="display mt-4 text-4xl font-bold text-white">
            Find the movement.
            <br />
            <span className="text-lime">Own the form.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/65">
            Explore exercise form guides, structured workouts, nutrition tools
            and practical training education.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-lime">
            <a href="/workouts">Workout sessions</a>
            <a href="/wod">Today's workout</a>
            <a href="/nutrition/builder">Meal Builder</a>
            <a href="/learn">Training education</a>
          </div>
        </div>
      </section>
      <section className="border-b border-white/10 bg-black py-5">
        <div className="container">
          <h2 className="display text-2xl font-bold text-white">
            Your BTB <span className="text-lime">Dashboard.</span>
          </h2>
          <p className="mt-3 text-sm text-white/65">
            Sign in to see your personal saved movements and member dashboard.
            Private account data is never included in this public page.
          </p>
          <a
            href="/account"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-lime"
          >
            Open your dashboard →
          </a>
        </div>
      </section>
      <BtbMotion />
    </main>
    <footer className="container py-7 text-sm text-white/60">
      <a
        href="https://www.instagram.com/btbfitnessandhealth/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Follow @btbfitnessandhealth on Instagram
      </a>
    </footer>
  </>
);
if (!html.includes('<div id="root"></div>'))
  throw new Error(
    "The app HTML root changed; cannot safely prerender the homepage."
  );
html = html.replace(
  '<div id="root"></div>',
  `<div id="root">${publicMarkup}</div>`
);
if (/<iframe\b/i.test(publicMarkup))
  throw new Error(
    "The public homepage must not load third-party players by default."
  );
await writeFile(path.join(output, "home.html"), html);
console.log(
  "Generated public homepage: real published Reels, safe dashboard prompt and route metadata; no member data."
);
