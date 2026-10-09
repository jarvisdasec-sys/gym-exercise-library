import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer, type Server } from "node:http";

process.env.VITEST = "true";
const { createApp } = await import("../../../server/index");

let fixtureDirectory = "";
let server: Server | undefined;
let baseUrl = "";

async function request(pathname: string) {
  const response = await fetch(`${baseUrl}${pathname}`);
  return {
    status: response.status,
    robots: response.headers.get("x-robots-tag"),
    body: await response.text(),
  };
}

beforeEach(async () => {
  fixtureDirectory = await mkdtemp(path.join(tmpdir(), "btb-serving-"));
  await mkdir(path.join(fixtureDirectory, "guides"));
  await Promise.all([
    writeFile(path.join(fixtureDirectory, "home.html"), "home snapshot"),
    writeFile(path.join(fixtureDirectory, "start.html"), "start snapshot"),
    writeFile(path.join(fixtureDirectory, "app.html"), "generic client shell"),
    writeFile(path.join(fixtureDirectory, "404.html"), "not found snapshot"),
    writeFile(
      path.join(fixtureDirectory, "guides", "plank.html"),
      "plank guide"
    ),
    writeFile(
      path.join(fixtureDirectory, "route-manifest.json"),
      JSON.stringify({
        snapshotRoutes: { "/": "home.html", "/start": "start.html" },
        appRoutes: ["/workouts", "/workouts/push-day", "/reset-password"],
        guideSlugs: ["plank"],
      })
    ),
  ]);
  server = createServer(await createApp(fixtureDirectory));
  await new Promise<void>(resolve => server?.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("No HTTP address");
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  await new Promise<void>((resolve, reject) =>
    server?.close(error => (error ? reject(error) : resolve()))
  );
  await rm(fixtureDirectory, { recursive: true, force: true });
});

describe("exact public route serving", () => {
  it("serves known snapshots, known guides, and known app routes", async () => {
    await expect(request("/")).resolves.toMatchObject({
      status: 200,
      body: "home snapshot",
    });
    await expect(request("/start/")).resolves.toMatchObject({
      status: 200,
      body: "start snapshot",
    });
    await expect(request("/e/plank")).resolves.toMatchObject({
      status: 200,
      body: "plank guide",
    });
    await expect(request("/workouts/push-day")).resolves.toMatchObject({
      status: 200,
      body: "generic client shell",
    });
    await expect(request("/reset-password?token=redacted")).resolves.toMatchObject({
      status: 200,
      body: "generic client shell",
    });
  });

  it("returns a non-indexable 404 for unknown pages, guides, and missing assets", async () => {
    for (const pathname of [
      "/e/not-a-real-guide",
      "/not-a-real-route",
      "/images/missing.png",
    ]) {
      const response = await request(pathname);
      expect(response.status).toBe(404);
      expect(response.robots).toBe("noindex, nofollow");
      expect(response.body).toBe("not found snapshot");
    }
  });
});
