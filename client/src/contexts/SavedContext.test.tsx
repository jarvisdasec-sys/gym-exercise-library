// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SavedProvider, useSaved } from "./SavedContext";

type Result = { data: unknown[] | null; error: { message: string } | null };
type Request = {
  owner: string;
  table: string;
  operation: string;
  done: boolean;
  resolve: (value: Result) => void;
};
const mocks = vi.hoisted(() => ({
  user: null as null | { id: string },
  from: vi.fn(),
  requests: [] as Request[],
}));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: mocks.user }),
}));
vi.mock("@/lib/supabase", () => ({
  supabase: { from: (table: string) => mocks.from(table) },
}));
let root: Root,
  host: HTMLDivElement,
  observed: Array<{
    owner: string | null;
    favorites: string[];
    routines: string[];
    loading: boolean;
    error: string | null;
  }>;
let toggle: (slug: string) => Promise<void>;
function Probe() {
  const value = useSaved();
  toggle = value.toggleFavorite;
  const snapshot = {
    owner: mocks.user?.id ?? null,
    favorites: [...value.favorites],
    routines: value.routines.map(item => item.name),
    loading: value.loading,
    error: value.error,
  };
  observed.push(snapshot);
  return (
    <div>
      <pre>{JSON.stringify(snapshot)}</pre>
      <button onClick={value.refresh}>Refresh</button>
    </div>
  );
}
const render = async () =>
  act(async () =>
    root.render(
      <SavedProvider>
        <Probe />
      </SavedProvider>
    )
  );
function complete(owner: string, error = false) {
  for (const request of mocks.requests.filter(
    item => item.owner === owner && !item.done && item.operation === "select"
  )) {
    request.done = true;
    request.resolve(
      error
        ? { data: null, error: { message: "private database detail" } }
        : {
            data:
              request.table === "user_favorites"
                ? [{ exercise_slug: `${owner}-movement` }]
                : [
                    {
                      id: owner,
                      name: `${owner} routine`,
                      routine_data: {},
                      created_at: "2026-10-01",
                    },
                  ],
            error: null,
          }
    );
  }
}
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  mocks.user = { id: "user-a" };
  mocks.requests.length = 0;
  observed = [];
  mocks.from.mockImplementation((table: string) => {
    let owner = "",
      operation = "select";
    const builder = {
      select() {
        return builder;
      },
      eq(key: string, value: string) {
        if (key === "user_id") owner = value;
        return builder;
      },
      order() {
        return builder;
      },
      delete() {
        operation = "delete";
        return builder;
      },
      insert(row: { user_id: string }) {
        owner = row.user_id;
        operation = "insert";
        return builder;
      },
      then(
        resolve: (value: Result) => unknown,
        reject: (error: unknown) => unknown
      ) {
        const promise = new Promise<Result>(finish =>
          mocks.requests.push({
            owner,
            table,
            operation,
            done: false,
            resolve: finish,
          })
        );
        return promise.then(resolve, reject);
      },
    };
    return builder;
  });
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});

describe("saved context account isolation", () => {
  it("never renders User A rows during the render-before-effect gap on switching to User B or logout", async () => {
    await render();
    await act(async () => complete("user-a"));
    expect(host.textContent).toContain("user-a routine");
    mocks.user = { id: "user-b" };
    await render();
    expect(
      observed
        .filter(item => item.owner === "user-b")
        .every(
          item =>
            !item.routines.includes("user-a routine") &&
            !item.favorites.includes("user-a-movement")
        )
    ).toBe(true);
    await act(async () => complete("user-b"));
    expect(host.textContent).toContain("user-b routine");
    mocks.user = null;
    await render();
    expect(host.textContent).not.toContain("user-b routine");
    expect(
      mocks.requests.every(item => ["user-a", "user-b"].includes(item.owner))
    ).toBe(true);
  });
  it("ignores stale requests after an account change and logout", async () => {
    await render();
    mocks.user = { id: "user-b" };
    await render();
    await act(async () => complete("user-a"));
    expect(host.textContent).not.toContain("user-a routine");
    mocks.user = null;
    await render();
    await act(async () => complete("user-b"));
    expect(host.textContent).not.toContain("user-b routine");
    expect(observed.at(-1)?.favorites).toEqual([]);
  });
  it("distinguishes unavailable data from an empty account and allows a real refetch", async () => {
    await render();
    await act(async () => complete("user-a", true));
    expect(observed.at(-1)?.error).toContain("could not be loaded");
    expect(host.textContent).not.toContain("private database detail");
    await act(async () =>
      host.querySelector<HTMLButtonElement>("button")!.click()
    );
    expect(observed.at(-1)?.loading).toBe(true);
    await act(async () => complete("user-a"));
    expect(observed.at(-1)?.error).toBeNull();
    expect(host.textContent).toContain("user-a routine");
  });
  it("ignores duplicate same-slug saves while the first request is pending", async () => {
    await render();
    await act(async () => complete("user-a"));
    let first!: Promise<void>;
    await act(async () => {
      first = toggle("repeat-favorite");
      await Promise.resolve();
      await toggle("repeat-favorite");
    });
    const requests = mocks.requests.filter(item => item.operation === "insert");
    expect(requests).toHaveLength(1);
    await act(async () => {
      requests[0].resolve({ data: [], error: null });
      await first;
    });
    expect(
      observed.at(-1)?.favorites.filter(item => item === "repeat-favorite")
    ).toHaveLength(1);
    expect(observed.at(-1)?.error).toBeNull();
  });
  it("does not apply a late User A favorite mutation to User B", async () => {
    await render();
    await act(async () => complete("user-a"));
    let pending!: Promise<void>;
    await act(async () => {
      pending = toggle("late-a-favorite");
      await Promise.resolve();
    });
    mocks.user = { id: "user-b" };
    await render();
    await act(async () => complete("user-b"));
    const mutation = mocks.requests.find(item => item.operation === "insert")!;
    await act(async () => {
      mutation.resolve({ data: [], error: null });
      await pending;
    });
    expect(observed.at(-1)?.favorites).toEqual(["user-b-movement"]);
  });
});
