// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HomepageDashboard } from "./MemberDashboard";

const mocks = vi.hoisted(() => ({
  auth: {
    user: null as null | { id: string; email: string },
    loading: false,
    configured: true,
    signIn: vi.fn(async () => null),
    signUp: vi.fn(async () => null),
    requestPasswordReset: vi.fn(async () => null),
    signInWithGoogle: vi.fn(async () => null),
    signOut: vi.fn(async () => undefined),
  },
  saved: {
    favorites: ["barbell-bent-over-row"],
    routines: [
      {
        id: "fixture-a",
        name: "A private routine",
        routineData: {},
        createdAt: "2026-10-01",
      },
    ],
    loading: false,
    error: null as string | null,
    refresh: vi.fn(),
  },
  savedReads: vi.fn(),
}));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => mocks.auth }));
vi.mock("@/contexts/SavedContext", () => ({
  useSaved: () => {
    mocks.savedReads();
    return mocks.saved;
  },
}));
let root: Root, host: HTMLDivElement;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.localStorage.clear();
  mocks.auth.user = null;
  mocks.auth.loading = false;
  mocks.auth.configured = true;
  mocks.saved.loading = false;
  mocks.saved.error = null;
  mocks.savedReads.mockClear();
  mocks.saved.refresh.mockClear();
  window.localStorage.setItem(
    "btb.cardio.log.v1",
    JSON.stringify({ day: [{ minutes: 777, kcal: null }] })
  );
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});
const render = async () => act(async () => root.render(<HomepageDashboard />));

describe("homepage member dashboard privacy and states", () => {
  it("offers real sign-in but mounts no private/device dashboard for guests", async () => {
    await render();
    expect(host.textContent).toContain("Sign In / Sign Up");
    expect(host.textContent).not.toContain("A private routine");
    expect(host.textContent).not.toContain("777 min");
    expect(mocks.savedReads).not.toHaveBeenCalled();
  });
  it("waits for authentication even if a previous user object still exists", async () => {
    mocks.auth.user = { id: "fixture-user-a", email: "a@example.invalid" };
    mocks.auth.loading = true;
    await render();
    expect(host.textContent).toContain("Checking your sign-in");
    expect(host.textContent).not.toContain("A private routine");
    expect(mocks.savedReads).not.toHaveBeenCalled();
  });
  it("shows actual saved items and explicitly device-local progress only after sign-in, then hides them at logout", async () => {
    mocks.auth.user = { id: "fixture-user-a", email: "a@example.invalid" };
    await render();
    expect(host.textContent).toContain("A private routine");
    expect(host.textContent).toContain("777 min");
    expect(host.textContent).toContain("On this device");
    expect(host.textContent).toContain(
      "not synced between accounts or devices"
    );
    expect(host.querySelector('a[href="/account"]')).not.toBeNull();
    mocks.auth.user = null;
    await render();
    expect(host.textContent).not.toContain("A private routine");
    expect(host.textContent).not.toContain("777 min");
  });
  it("does not report unavailable saved items as zero and supports retry", async () => {
    mocks.auth.user = { id: "fixture-user-a", email: "a@example.invalid" };
    mocks.saved.loading = true;
    await render();
    expect(host.textContent).toContain("Loading your saved items");
    expect(host.textContent).not.toContain("A private routine");
    mocks.saved.loading = false;
    mocks.saved.error = "Your saved items could not be loaded. Please retry.";
    await render();
    expect(host.querySelector('[role="alert"]')).not.toBeNull();
    expect(host.textContent).toContain("totals are unavailable");
    const retry = Array.from(
      host.querySelectorAll<HTMLButtonElement>("button")
    ).find(button => button.textContent?.includes("Retry saved items"))!;
    await act(async () => retry.click());
    expect(mocks.saved.refresh).toHaveBeenCalledOnce();
  });
  it("reports missing sign-in configuration rather than using a fake session", async () => {
    mocks.auth.configured = false;
    await render();
    expect(host.textContent).toContain("Sign-in is unavailable");
    expect(mocks.savedReads).not.toHaveBeenCalled();
  });
});
