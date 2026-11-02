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
import {
  CARDIO,
  CARDIO_CATEGORY_META,
  type CardioExercise,
} from "../client/src/lib/cardio";
import {
  CARDIO_HUB_METADATA,
  getCardioGuideMetadata,
} from "../client/src/lib/cardioMetadata";
import { EDU_ARTICLES } from "../client/src/lib/eduIndex";
import { TRAINING_PROGRAMS } from "../client/src/lib/programs";
import { BLOG_POSTS } from "../client/src/lib/blog";

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
  cardioSlugs: string[];
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
          <a href="/cardio">Cardio</a>
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

function StaticCardioIndex() {
  return (
    <>
      <PublicHeader />
      <main className="container py-8 sm:py-12">
        <p className="meta text-[0.5rem] font-bold text-lime">
          BTB conditioning index / {CARDIO.length} methods
        </p>
        <h1 className="display mt-3 text-4xl font-bold text-white sm:text-5xl">
          Cardio Workouts &amp; Training Guides
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70">
          Compare running, cycling, rowing, walking, swimming, jump rope and
          interval training. Every method includes technique cues, common
          mistakes, three effort levels and a starter session.
        </p>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDIO.map(exercise => (
            <li key={exercise.slug}>
              <article className="h-full border border-white/12 p-4">
                <p className="meta text-[0.45rem] font-bold text-lime">
                  {CARDIO_CATEGORY_META[exercise.category].label} /{" "}
                  {exercise.equipment}
                </p>
                <h2 className="display mt-3 text-xl font-semibold text-white">
                  <a href={`/cardio/${exercise.slug}`}>{exercise.name}</a>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {exercise.summary}
                </p>
                <a
                  href={`/cardio/${exercise.slug}`}
                  className="mt-4 inline-block text-sm text-lime"
                >
                  Read the {exercise.name} cardio guide →
                </a>
              </article>
            </li>
          ))}
        </ul>
        <aside className="mt-8 border border-white/12 p-4 text-sm leading-relaxed text-white/60">
          These are general exercise education and population-average effort
          references, not an individual medical or training prescription. Adapt
          movement to your ability and seek qualified guidance for individual
          health concerns.
        </aside>
      </main>
      <PublicFooter />
    </>
  );
}

function StaticCardioGuide({ exercise }: { exercise: CardioExercise }) {
  const category = CARDIO_CATEGORY_META[exercise.category];
  return (
    <>
      <PublicHeader />
      <main className="container py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-white/50">
          <a href="/cardio" className="text-lime">
            Cardio guides
          </a>
          <span aria-hidden="true"> / </span>
          <span>{exercise.name}</span>
        </nav>
        <p className="meta mt-5 text-[0.5rem] font-bold text-lime">
          {category.label} / {exercise.equipment}
        </p>
        <h1 className="display mt-3 text-4xl font-bold text-white sm:text-5xl">
          {exercise.name}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70">
          {exercise.summary}
        </p>

        <section className="mt-8 border-y border-white/10 py-6">
          <h2 className="display text-2xl font-bold text-lime">
            Choose an effort level
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {exercise.intensities.map(intensity => (
              <li key={intensity.label} className="border border-white/12 p-4">
                <h3 className="display text-lg font-semibold text-white">
                  {intensity.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {intensity.effort}
                </p>
                <p className="meta mt-3 text-[0.45rem] text-white/45">
                  {intensity.met} MET · {intensity.source}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-white/45">
            MET values reference the 2024 Adult Compendium of Physical
            Activities. They are population averages, not personal measurements.
          </p>
        </section>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <section className="border border-white/12 p-5">
            <h2 className="display text-xl font-bold text-lime">
              Technique cues
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-white/70">
              {exercise.technique.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
          <section className="border border-white/12 p-5">
            <h2 className="display text-xl font-bold text-lime">
              Common mistakes
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/70">
              {exercise.mistakes.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="border border-white/12 p-5">
            <h2 className="display text-xl font-bold text-lime">
              A starter session
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {exercise.starter}
            </p>
          </section>
          <section className="border border-white/12 p-5">
            <h2 className="display text-xl font-bold text-lime">
              Who it may suit
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {exercise.impact}
            </p>
          </section>
        </div>

        <aside className="mt-6 border border-lime/35 p-4 text-sm leading-relaxed text-white/65">
          General education only—not a personalized medical or exercise
          prescription. Adapt activity to your ability; stop for concerning
          symptoms and seek qualified guidance when needed.
        </aside>
        <div className="mt-7 flex flex-wrap gap-4 text-sm">
          <a href="/cardio" className="text-lime">
            Browse all cardio methods →
          </a>
          <a href="/workouts" className="text-white/65">
            Explore BTB workouts →
          </a>
        </div>
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
    "/7-day-starter": "7-day-starter.html",
    "/plus": "plus.html",
    "/exercises": "library.html",
    "/cardio": "cardio.html",
    "/instagram": "instagram.html",
    "/workouts/groups": "group-workouts.html",
  };
  const snapshotPaths = new Set(Object.keys(snapshotRoutes));
  const appRoutes = [
    // This route is intentionally not part of the public navigation registry,
    // but it is a real App route used by password-recovery links.
    "/reset-password",
    ...Object.values(ROUTES).filter(route => !snapshotPaths.has(route)),
    "/blog",
    "/blog/contribute",
    "/blog/:slug",
    ...BLOG_POSTS.map(post => `/blog/${post.slug}`),
    ...Object.keys(LEGACY_ROUTE_REDIRECTS),
    ...WORKOUTS.map(workout => `/workouts/${workout.slug}`),
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
    cardioSlugs: CARDIO.map(exercise => exercise.slug),
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
  const cardioRewrites = manifest.cardioSlugs.flatMap(slug =>
    withTrailingSlash([`/cardio/${slug}`]).map(source => ({
      source,
      destination: `/cardio-guides/${slug}.html`,
    }))
  );
  const appRewrites = withTrailingSlash(manifest.appRoutes).map(source => ({
    source,
    destination: "/app.html",
  }));
  return {
    buildCommand: "pnpm build",
    outputDirectory: "dist/public",
    rewrites: [
      ...snapshotRewrites,
      ...guideRewrites,
      ...cardioRewrites,
      ...appRewrites,
    ],
  };
}

const shell = await readFile(path.join(output, "app.html"), "utf8");
await mkdir(guidesOutput, { recursive: true });
const cardioOutput = path.join(output, "cardio-guides");
await mkdir(cardioOutput, { recursive: true });

const cardioHubMeta: PageMeta = { ...CARDIO_HUB_METADATA, type: "website" };
await writeFile(
  path.join(output, "cardio.html"),
  renderPage(shell, cardioHubMeta, <StaticCardioIndex />)
);

for (const exercise of CARDIO) {
  const metadata: PageMeta = {
    ...getCardioGuideMetadata(exercise),
    type: "article",
  };
  await writeFile(
    path.join(cardioOutput, `${exercise.slug}.html`),
    renderPage(shell, metadata, <StaticCardioGuide exercise={exercise} />)
  );
}

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
  `${BTB_SITE_ORIGIN}/7-day-starter`,
  `${BTB_SITE_ORIGIN}/plus`,
  `${BTB_SITE_ORIGIN}/exercises`,
  `${BTB_SITE_ORIGIN}/cardio`,
  ...CARDIO.map(exercise => `${BTB_SITE_ORIGIN}/cardio/${exercise.slug}`),
  `${BTB_SITE_ORIGIN}/instagram`,
  `${BTB_SITE_ORIGIN}/blog`,
  ...BLOG_POSTS.map(post => `${BTB_SITE_ORIGIN}/blog/${post.slug}`),
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
  `Generated ${INDEXED_EXERCISES.length} public exercise guides, ${CARDIO.length} cardio guides, the full library, robots.txt, sitemap.xml, 404.html, and exact serving routes.`
);
