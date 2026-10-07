// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
type FixtureUser = { id: string; email: string };
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  listener: null as
    | null
    | ((event: string, session: { user: FixtureUser } | null) => void),
  unsubscribe: vi.fn(),
}));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      getUser: () => mocks.getUser(),
      onAuthStateChange: (listener: typeof mocks.listener) => {
        mocks.listener = listener;
        return { data: { subscription: { unsubscribe: mocks.unsubscribe } } };
      },
    },
  },
}));
let root: Root,
  host: HTMLDivElement,
  finish: (value: { data: { user: FixtureUser | null } }) => void;
function Probe() {
  const { user, loading } = useAuth();
  return <pre>{JSON.stringify({ id: user?.id ?? null, loading })}</pre>;
}
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  window.history.replaceState({}, "", "/");
  mocks.listener = null;
  mocks.unsubscribe.mockClear();
  mocks.getUser.mockImplementation(
    () =>
      new Promise(resolve => {
        finish = resolve;
      })
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
const render = async () =>
  act(async () =>
    root.render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )
  );
describe("authentication initialization privacy", () => {
  it("does not restore a signed-out user from a late initial getUser response", async () => {
    await render();
    await act(async () => mocks.listener!("SIGNED_OUT", null));
    await act(async () =>
      finish({
        data: { user: { id: "old-user", email: "old@example.invalid" } },
      })
    );
    expect(host.textContent).toBe('{"id":null,"loading":false}');
  });
  it("keeps the newly signed-in user instead of a stale previous session", async () => {
    await render();
    await act(async () =>
      mocks.listener!("SIGNED_IN", {
        user: { id: "new-user", email: "new@example.invalid" },
      })
    );
    await act(async () =>
      finish({
        data: { user: { id: "old-user", email: "old@example.invalid" } },
      })
    );
    expect(host.textContent).toContain('"id":"new-user"');
    expect(host.textContent).not.toContain("old-user");
  });
  it("still validates an INITIAL_SESSION using the initial authoritative user lookup", async () => {
    await render();
    await act(async () =>
      mocks.listener!("INITIAL_SESSION", {
        user: { id: "cached-user", email: "cached@example.invalid" },
      })
    );
    await act(async () => finish({ data: { user: null } }));
    expect(host.textContent).toBe('{"id":null,"loading":false}');
  });
});
