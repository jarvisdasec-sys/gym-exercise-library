import { describe, expect, it } from "vitest";
import { matchesRoutePattern } from "./index";

describe("generated dynamic app routes", () => {
  it("serves a direct UUID-backed community article path", () => {
    expect(matchesRoutePattern("/blog/:slug", "/blog/2e3bcf66-9c4c-4fb1-8bf7-d1ff9d8963db")).toBe(true);
    expect(matchesRoutePattern("/blog/:slug/", "/blog/a-simple-first-strength-week/")).toBe(true);
  });

  it("matches exactly one nonempty post slug and leaves unrelated paths unmatched", () => {
    expect(matchesRoutePattern("/blog/:slug", "/blog")).toBe(false);
    expect(matchesRoutePattern("/blog/:slug", "/blog/one/two")).toBe(false);
    expect(matchesRoutePattern("/blog/:slug", "/other/one")).toBe(false);
  });
});
