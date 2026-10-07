import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { InstagramLanding } from "../client/src/components/InstagramLanding";
import {
  INSTAGRAM_DESCRIPTION,
  INSTAGRAM_PAGE_URL,
  INSTAGRAM_PREVIEW_IMAGE,
  INSTAGRAM_TITLE,
  INSTAGRAM_URL,
} from "../client/src/lib/social";

const outputDirectory = path.resolve("dist/public");
let html = await readFile(path.join(outputDirectory, "index.html"), "utf8");
const escapeAttribute = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const setMeta = (
  attribute: "name" | "property",
  name: string,
  value: string
) => {
  const tag = `<meta ${attribute}="${name}" content="${escapeAttribute(value)}" />`;
  const existing = new RegExp(`<meta\\b[^>]*${attribute}="${name}"[^>]*>`, "i");
  if (existing.test(html)) html = html.replace(existing, tag);
  else html = html.replace("</head>", `  ${tag}\n  </head>`);
};
html = html.replace(
  /<title>[^<]*<\/title>/,
  `<title>${escapeAttribute(INSTAGRAM_TITLE)}</title>`
);
html = html.replace(/, maximum-scale=1/g, "");
setMeta("name", "description", INSTAGRAM_DESCRIPTION);
setMeta("property", "og:title", INSTAGRAM_TITLE);
setMeta("property", "og:description", INSTAGRAM_DESCRIPTION);
setMeta("property", "og:url", INSTAGRAM_PAGE_URL);
setMeta("property", "og:image", INSTAGRAM_PREVIEW_IMAGE);
setMeta("name", "twitter:title", INSTAGRAM_TITLE);
setMeta("name", "twitter:description", INSTAGRAM_DESCRIPTION);
setMeta("name", "twitter:image", INSTAGRAM_PREVIEW_IMAGE);
html = html.replace(
  "</head>",
  `  <link rel="canonical" href="${INSTAGRAM_PAGE_URL}" />\n  </head>`
);
const markup = renderToStaticMarkup(
  <>
    <header className="border-b border-white/10 bg-black">
      <nav
        aria-label="BTB navigation"
        className="container flex flex-wrap items-center justify-between gap-4 py-5"
      >
        <a href="/" className="display text-2xl font-bold text-lime">
          BTB <span className="sr-only">Movement Index</span>
        </a>
        <div className="flex flex-wrap gap-5 text-sm text-white/70">
          <a href="/">Exercise guides</a>
          <a href="/workouts">Workouts</a>
          <a href="/nutrition">Nutrition</a>
          <a href="/account">Account</a>
        </div>
      </nav>
    </header>
    <InstagramLanding />
    <footer className="border-t border-white/12">
      <div className="container py-8">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center text-lime"
        >
          Follow @btbfitnessandhealth on Instagram
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </footer>
  </>
);
if (!html.includes('<div id="root"></div>'))
  throw new Error("The app HTML root changed; cannot render Instagram safely.");
html = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
await writeFile(path.join(outputDirectory, "instagram.html"), html);
console.log(
  "Generated /instagram: static public content, route metadata and production canonical URL."
);
