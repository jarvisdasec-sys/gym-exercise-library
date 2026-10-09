import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "../../..");

describe("public snapshots and exact route serving", () => {
  it("preserves the original generic app shell before rendering home, start, and Plus snapshots", () => {
    const source = readFileSync(
      path.join(root, "scripts/build-home.tsx"),
      "utf8"
    );
    expect(source).toContain('writeFile(path.join(output, "app.html"), shell)');
    expect(source).toContain(
      'for (const page of ["home", "start", "plus"] as const)'
    );
    expect(source).toContain(
      'if (page === "home") await writeFile(path.join(output, "index.html"), html)'
    );
    expect(source).toContain("VITE_PLANNER_REVIEW_URL?.trim() || PLANNER_URL");
    expect(
      source.indexOf('writeFile(path.join(output, "app.html"), shell)')
    ).toBeLessThan(
      source.indexOf('for (const page of ["home", "start", "plus"] as const)')
    );
  });

  it("uses exact static rewrites and leaves unmatched paths to the platform 404", () => {
    const config = JSON.parse(
      readFileSync(path.join(root, "vercel.json"), "utf8")
    );
    expect(config.rewrites).toEqual(
      expect.arrayContaining([
        { source: "/instagram", destination: "/instagram.html" },
        { source: "/start", destination: "/start.html" },
        { source: "/exercises", destination: "/library.html" },
        {
          source: "/e/barbell-bench-press",
          destination: "/guides/barbell-bench-press.html",
        },
      ])
    );
    expect(
      config.rewrites.some(
        (rewrite: { source: string }) => rewrite.source === "/(.*)"
      )
    ).toBe(false);

    const discovery = readFileSync(
      path.join(root, "scripts/build-discovery.tsx"),
      "utf8"
    );
    expect(discovery).toContain('path.join(output, "robots.txt")');
    expect(discovery).toContain('path.join(output, "sitemap.xml")');
    expect(discovery).toContain('path.join(output, "route-manifest.json")');
  });

  it("keeps a generic client shell only for known app routes and sends all others to a non-indexable 404", () => {
    const server = readFileSync(path.join(root, "server/index.ts"), "utf8");
    expect(server).toContain('res.sendFile(path.join(staticPath, "app.html"))');
    expect(server).toContain(
      'res.status(404).sendFile(path.join(staticPath, "404.html")'
    );
    expect(server).toContain('res.set("X-Robots-Tag", "noindex, nofollow")');
    expect(server).not.toContain('app.get("*", (_req, res) =>');
  });
});
