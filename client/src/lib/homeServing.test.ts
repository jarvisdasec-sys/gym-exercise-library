import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
const root = path.resolve(import.meta.dirname, "../../..");

describe("physical homepage and generic SPA shell serving", () => {
  it("writes the public snapshot to the physical index and preserves the original app shell first", () => {
    const source = readFileSync(
      path.join(root, "scripts/build-home.tsx"),
      "utf8"
    );
    expect(source).toContain(
      'writeFile(path.join(output, "index.html"), html)'
    );
    expect(source).toContain('writeFile(path.join(output, "home.html"), html)');
    expect(
      source.indexOf('writeFile(path.join(output, "app.html"), html)')
    ).toBeLessThan(source.indexOf("html = html"));
  });
  it("preserves Instagram routes and never serves the home snapshot as the generic fallback", () => {
    const config = JSON.parse(
      readFileSync(path.join(root, "vercel.json"), "utf8")
    );
    expect(config.rewrites[0]).toEqual({
      source: "/instagram",
      destination: "/instagram.html",
    });
    expect(config.rewrites.at(-1)).toEqual({
      source: "/(.*)",
      destination: "/app.html",
    });
    const server = readFileSync(path.join(root, "server/index.ts"), "utf8");
    expect(server).toContain('res.sendFile(path.join(staticPath, "app.html"))');
  });
});
