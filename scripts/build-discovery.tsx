import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  absolutePublicUrl,
  BTB_SITE_ORIGIN,
  getExerciseGuideMetadata,
} from "../client/src/lib/exerciseMetadata";
import {
  CATEGORIES,
  INDEXED_EXERCISES,
  type IndexedExercise,
} from "../client/src/lib/exercises";
import { getExerciseGuide } from "../client/src/lib/exerciseGuides";
import { LEGACY_ROUTE_REDIRECTS, ROUTES } from "../client/src/lib/routes";
import { WORKOUTS } from "../client/src/lib/workouts";
import { CARDIO } from "../client/src/lib/cardio";
import { EDU_ARTICLES } from "../client/src/lib/eduIndex";
import { TRAINING_PROGRAMS } from "../client/src/lib/programs";

const output = path.resolve("dist/public");
const guidesOutput = path.join(output, "guides");
const PUBLIC_IMAGE = `${BTB_SITE_ORIGIN}/images/site/btb-movement-index-hero.jpg`;

type PageMeta = {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
  robots?: string;
  type?: "article" | "website";
};

type RouteManifest = {
  snapshotRoutes: Record<string, string>;
  appRoutes: string[];
  guideSlugs: string[];
};

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

function withMetadata(shell: string, metadata: PageMeta) {
  let html = shell
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeAttribute(metadata.title)}</title>`
    )
    .replace(/, maximum-scale=1/g, "")
    .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "");

  for (const [attribute, name, value] of [
    ["name", "description", metadata.description],
    [
      "name",
      "robots",
      metadata.robots ?? "index,follow,max-image-preview:large",
    ],
    ["property", "og:type", metadata.type ?? "website"],
    ["property", "og:site_name", "Build The Body (BTB)"],
    ["property", "og:title", metadata.title],
    ["property", "og:description", metadata.description],
    ["property", "og:url", metadata.url],
    ["property", "og:image", metadata.image],
    ["property", "og:image:alt", metadata.imageAlt],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", metadata.title],
    ["name", "twitter:description", metadata.description],
    ["name", "twitter:image", metadata.image],
  ] as const) {
    html = setMeta(html, attribute, name, value);
  }

  return html.replace(
    "</head>",
    `<link rel="canonical" href="${escapeAttribute(metadata.url)}" />\n</head>`
  );
}

function renderPage(
  shell: string,
  metadata: PageMeta,
  content: React.ReactNode
) {
  if (!shell.includes('<div id="root"></div>')) {
    throw new Error(
      "The app HTML root changed; cannot safely render discovery pages."
    );
  }
  const markup = renderToStaticMarkup(content);
  if (/<iframe\b/i.test(markup)) {
    throw new Error(
      "Public discovery pages must not load third-party players."
    );
  }
  return withMetadata(shell, metadata).replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`
  );
}

function PublicHeader() {
  return (
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
          <a href="/exercises">Exercise library</a>
          <a href="/workouts">Workouts</a>
          <a href="/nutrition">Nutrition</a>
        </div>
      </nav>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-7 text-sm text-white/60">
        <span>BTB Fitness &amp; Health</span>
        <a href="/start#btb-inquiry" className="text-lime">
          Ask BTB a question
        </a>
      </div>
    </footer>
  );
}

function GuideList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-white/12 p-5">
      <h2 className="display text-xl font-bold text-lime">{title}</h2>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-white/75"
          >
            <span className="meta shrink-0 text-lime">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function GuideDetail({ label, value }: { label: string; value: string }) {
  return (
    <section className="border border-white/12 p-5">
      <h2 className="meta text-[0.5rem] font-bold text-lime">{label}</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/75">{value}</p>
    </section>
  );
}

function StaticGuide({ exercise }: { exercise: IndexedExercise }) {
  const guide = getExerciseGuide(exercise);
  const category = CATEGORIES.find(item => item.id === exercise.category);
  const related = INDEXED_EXERCISES.filter(
    item => item.category === exercise.category && item.slug !== exercise.slug
  ).slice(0, 6);

  return (
    <>
      <PublicHeader />
      <main className="container py-8 sm:py-12">
        <p className="meta text-[0.5rem] font-bold text-lime">
          {exercise.plate} / {category?.label ?? exercise.category} form guide
        </p>
        <h1 className="display mt-3 text-4xl font-bold text-white sm:text-5xl">
          {exercise.name}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/70">
          Learn the setup, execution, cues, mistakes, and safer progressions for
          this movement before adding load.
        </p>
        <dl className="mt-5 grid gap-3 border-y border-white/10 py-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="meta text-[0.45rem] text-white/45">
              Primary target
            </dt>
            <dd className="mt-1 text-white/80">{exercise.primary}</dd>
          </div>
          <div>
            <dt className="meta text-[0.45rem] text-white/45">Equipment</dt>
            <dd className="mt-1 text-white/80">{exercise.equipment}</dd>
          </div>
          <div>
            <dt className="meta text-[0.45rem] text-white/45">Level</dt>
            <dd className="mt-1 text-white/80">{exercise.difficulty}</dd>
          </div>
        </dl>
        <figure className="mt-7 max-w-3xl border border-white/12">
          <img
            src={absolutePublicUrl(exercise.image)}
            alt={`${exercise.name} exercise guide illustration`}
            className="block w-full"
          />
          <figcaption className="p-3 text-sm text-white/55">
            BTB {exercise.name} movement blueprint.
          </figcaption>
        </figure>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <GuideList title="Set up" items={guide.setup} />
          <GuideList title="Execute" items={guide.execution} />
          <GuideList title="Coach cues" items={guide.cues} />
          <GuideList title="Common mistakes" items={guide.mistakes} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <GuideDetail label="Breathing" value={guide.breathing} />
          <GuideDetail label="Tempo" value={guide.tempo} />
          <GuideDetail label="Safety check" value={guide.safety} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <GuideDetail label="Make it easier" value={guide.easier} />
          <GuideDetail label="Make it harder" value={guide.harder} />
        </div>
        <aside className="mt-6 border border-lime/35 p-4 text-sm leading-relaxed text-white/70">
          This is general exercise education, not individual medical advice.
          Stop if pain—not normal effort—changes the movement, and seek
          qualified help for individual health or injury concerns.
        </aside>

        {related.length > 0 && (
          <section className="mt-10 border-t border-white/10 pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="display text-2xl font-bold text-white">
                More {category?.label ?? exercise.category} guides
              </h2>
              <a href="/exercises" className="text-sm text-lime">
                All 54 exercise guides →
              </a>
            </div>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(item => (
                <li key={item.slug}>
                  <a
                    href={`/e/${item.slug}`}
                    className="block border border-white/12 p-3 transition-colors hover:border-lime"
                  >
                    <img
                      src={absolutePublicUrl(item.image)}
                      alt={`${item.name} exercise guide`}
                      loading="lazy"
                      className="block w-full"
                    />
                    <span className="display mt-3 block text-lg font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-sm text-white/55">
                      {item.primary}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <PublicFooter />
    </>
  );
}

function StaticLibrary() {
  return (
    <>
      <PublicHeader />
      <main className="container py-8 sm:py-12">
        <p className="meta text-[0.5rem] font-bold text-lime">
          BTB movement index / 54 guides
        </p>
        <h1 className="display mt-3 text-4xl font-bold text-white sm:text-5xl">
          Exercise Library
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70">
          Browse every current BTB exercise guide. Each guide includes a real
          movement blueprint, setup, execution, cues, common mistakes, and
          safety notes.
        </p>
        {CATEGORIES.map(category => {
          const exercises = INDEXED_EXERCISES.filter(
            exercise => exercise.category === category.id
          );
          return (
            <section key={category.id} className="mt-10">
              <h2 className="display border-b border-white/10 pb-3 text-3xl font-bold text-lime">
                {category.label}
              </h2>
              <p className="mt-2 text-sm text-white/55">{category.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {exercises.map(exercise => (
                  <li key={exercise.slug}>
                    <article
                      id={exercise.slug}
                      className="h-full border border-white/12 p-3"
                    >
                      <a href={`/e/${exercise.slug}`} className="block">
                        <img
                          src={absolutePublicUrl(exercise.image)}
                          alt={`${exercise.name} exercise guide`}
                          loading="lazy"
                          className="block w-full"
                        />
                        <h3 className="display mt-3 text-xl font-semibold text-white">
                          {exercise.plate}. {exercise.name}
                        </h3>
                      </a>
                      <p className="mt-2 text-sm text-white/65">
                        {exercise.primary} · {exercise.difficulty}
                      </p>
                      <p className="mt-1 text-sm text-white/50">
                        {exercise.equipment}
                      </p>
                      <a
                        href={`/e/${exercise.slug}`}
                        className="mt-3 inline-block text-sm text-lime"
                      >
                        Read {exercise.name} form guide →
                      </a>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>
      <PublicFooter />
    </>
  );
}

function StaticNotFound() {
  return (
    <>
      <PublicHeader />
      <main className="container flex min-h-[52vh] flex-col justify-center py-16">
        <p className="meta text-[0.5rem] font-bold text-lime">
          404 / NOT FOUND
        </p>
        <h1 className="display mt-3 text-4xl font-bold text-white">
          This BTB page is not available.
        </h1>
        <p className="mt-4 max-w-xl text-white/70">
          Check the address or return to a current public BTB resource.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="/" className="text-lime">
            Go to BTB home →
          </a>
          <a href="/exercises" className="text-lime">
            Browse exercise guides →
          </a>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}

function uniqueRoutes(routes: string[]) {
  return [...new Set(routes)].sort();
}

function withTrailingSlash(routes: string[]) {
  return uniqueRoutes(
    routes.flatMap(route => (route === "/" ? [route] : [route, `${route}/`]))
  );
}

function buildManifest(): RouteManifest {
  const snapshotRoutes: Record<string, string> = {
    "/": "home.html",
    "/start": "start.html",
    "/plus": "plus.html",
    "/exercises": "library.html",
    "/instagram": "instagram.html",
    "/workouts/groups": "group-workouts.html",
  };
  const snapshotPaths = new Set(Object.keys(snapshotRoutes));
  const appRoutes = [
    // This route is intentionally not part of the public navigation registry,
    // but it is a real App route used by password-recovery links.
    "/reset-password",
    ...Object.values(ROUTES).filter((route) => !snapshotPaths.has(route)),
    ...Object.keys(LEGACY_ROUTE_REDIRECTS),
    ...WORKOUTS.map(workout => `/workouts/${workout.slug}`),
    ...CARDIO.map(exercise => `/cardio/${exercise.slug}`),
    ...EDU_ARTICLES.map(article => `/learn/${article.slug}`),
    ...TRAINING_PROGRAMS.flatMap(program =>
      program.weeks.flatMap(week =>
        week.workouts.map(
          workout =>
            `/workouts/programs/${program.id}/${week.week}/${workout.day}`
        )
      )
    ),
  ];
  return {
    snapshotRoutes,
    appRoutes: uniqueRoutes(appRoutes),
    guideSlugs: INDEXED_EXERCISES.map(exercise => exercise.slug),
  };
}

function vercelConfig(manifest: RouteManifest) {
  const snapshotRewrites = Object.entries(manifest.snapshotRoutes).flatMap(
    ([source, destination]) =>
      withTrailingSlash([source]).map(path => ({
        source: path,
        destination: `/${destination}`,
      }))
  );
  const guideRewrites = manifest.guideSlugs.flatMap(slug =>
    withTrailingSlash([`/e/${slug}`]).map(source => ({
      source,
      destination: `/guides/${slug}.html`,
    }))
  );
  const appRewrites = withTrailingSlash(manifest.appRoutes).map(source => ({
    source,
    destination: "/app.html",
  }));
  return {
    buildCommand: "pnpm build",
    outputDirectory: "dist/public",
    rewrites: [...snapshotRewrites, ...guideRewrites, ...appRewrites],
  };
}

const shell = await readFile(path.join(output, "app.html"), "utf8");
await mkdir(guidesOutput, { recursive: true });

const libraryMeta: PageMeta = {
  title: "BTB Exercise Library — 54 Form Guides",
  description:
    "Browse 54 BTB exercise form guides with setup, execution, coaching cues, common mistakes, and safety notes.",
  url: `${BTB_SITE_ORIGIN}/exercises`,
  image: PUBLIC_IMAGE,
  imageAlt: "BTB exercise movement index",
};
await writeFile(
  path.join(output, "library.html"),
  renderPage(shell, libraryMeta, <StaticLibrary />)
);

for (const exercise of INDEXED_EXERCISES) {
  const metadata = getExerciseGuideMetadata(exercise);
  await writeFile(
    path.join(guidesOutput, `${exercise.slug}.html`),
    renderPage(
      shell,
      { ...metadata, type: "article" },
      <StaticGuide exercise={exercise} />
    )
  );
}

const notFoundMeta: PageMeta = {
  title: "Page Not Found | BTB Fitness & Health",
  description: "The requested BTB page was not found.",
  url: `${BTB_SITE_ORIGIN}/404`,
  image: PUBLIC_IMAGE,
  imageAlt: "BTB Fitness & Health",
  robots: "noindex,nofollow",
};
await writeFile(
  path.join(output, "404.html"),
  renderPage(shell, notFoundMeta, <StaticNotFound />)
);

const sitemapUrls = [
  `${BTB_SITE_ORIGIN}/`,
  `${BTB_SITE_ORIGIN}/start`,
  `${BTB_SITE_ORIGIN}/plus`,
  `${BTB_SITE_ORIGIN}/exercises`,
  `${BTB_SITE_ORIGIN}/instagram`,
  `${BTB_SITE_ORIGIN}/workouts/groups`,
  ...INDEXED_EXERCISES.map(exercise => `${BTB_SITE_ORIGIN}/e/${exercise.slug}`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
  .map(url => `  <url><loc>${escapeAttribute(url)}</loc></url>`)
  .join("\n")}\n</urlset>\n`;
await writeFile(path.join(output, "sitemap.xml"), sitemap);
await writeFile(
  path.join(output, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /account\nDisallow: /saved\nDisallow: /reset-password\nSitemap: ${BTB_SITE_ORIGIN}/sitemap.xml\n`
);

const manifest = buildManifest();
await writeFile(
  path.join(output, "route-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`
);
await writeFile(
  path.resolve("vercel.json"),
  `${JSON.stringify(vercelConfig(manifest), null, 2)}\n`
);

console.log(
  `Generated ${INDEXED_EXERCISES.length} public exercise guides, the full library, robots.txt, sitemap.xml, 404.html, and exact serving routes.`
);
