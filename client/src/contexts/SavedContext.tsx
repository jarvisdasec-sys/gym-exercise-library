import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { createSavedAccountGuard } from "@/lib/savedAccount";

export type SavedRoutine = {
  id: string;
  name: string;
  routineData: unknown;
  createdAt: string;
};
type SavedState = {
  ownerId: string | null;
  favorites: string[];
  routines: SavedRoutine[];
  loading: boolean;
  error: string | null;
};
type SavedContextValue = {
  favorites: string[];
  routines: SavedRoutine[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => Promise<void>;
};
const SavedContext = createContext<SavedContextValue | null>(null);
const empty = (ownerId: string | null, loading = false): SavedState => ({
  ownerId,
  favorites: [],
  routines: [],
  loading,
  error: null,
});

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<SavedState>(() => empty(null));
  const [reload, setReload] = useState(0);
  const accountGuard = useRef(createSavedAccountGuard());
  const mutations = useRef(new Set<string>());
  const refresh = useCallback(() => setReload(value => value + 1), []);

  useEffect(() => {
    accountGuard.current.select(userId);
    setState(empty(userId, Boolean(supabase && userId)));
    if (!supabase || !userId) return;
    let active = true;
    Promise.all([
      supabase
        .from("user_favorites")
        .select("exercise_slug")
        .eq("user_id", userId),
      supabase
        .from("user_routines")
        .select("id, name, routine_data, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ])
      .then(([favoritesResult, routinesResult]) => {
        if (!active || !accountGuard.current.allows(userId)) return;
        if (favoritesResult.error || routinesResult.error)
          throw new Error("Saved items could not load.");
        setState({
          ownerId: userId,
          loading: false,
          error: null,
          favorites: (favoritesResult.data ?? []).map(row => row.exercise_slug),
          routines: (routinesResult.data ?? []).map(row => ({
            id: row.id,
            name: row.name,
            routineData: row.routine_data,
            createdAt: row.created_at,
          })),
        });
      })
      .catch(() => {
        if (!active || !accountGuard.current.allows(userId)) return;
        setState({
          ...empty(userId),
          error: "Your saved items could not be loaded. Please retry.",
        });
      });
    return () => {
      active = false;
    };
  }, [userId, reload]);

  // Effects run after rendering. Never expose a previous owner's state during that gap.
  const ownsState = state.ownerId === userId;
  const favorites = ownsState && userId ? state.favorites : [];
  const routines = ownsState && userId ? state.routines : [];
  const loading = Boolean(userId && (!ownsState || state.loading));
  const error = ownsState ? state.error : null;
  const value = useMemo<SavedContextValue>(
    () => ({
      favorites,
      routines,
      loading,
      error,
      refresh,
      isFavorite: slug => favorites.includes(slug),
      async toggleFavorite(slug) {
        if (!supabase || !userId || !ownsState || loading || error) return;
        const mutationKey = `${userId}:${slug}`;
        if (mutations.current.has(mutationKey)) return;
        mutations.current.add(mutationKey);
        const removing = favorites.includes(slug);
        try {
          const result = removing
            ? await supabase
                .from("user_favorites")
                .delete()
                .eq("user_id", userId)
                .eq("exercise_slug", slug)
            : await supabase
                .from("user_favorites")
                .insert({ user_id: userId, exercise_slug: slug });
          if (result.error) throw result.error;
          if (!accountGuard.current.allows(userId)) return;
          setState(current =>
            current.ownerId !== userId
              ? current
              : {
                  ...current,
                  favorites: removing
                    ? current.favorites.filter(item => item !== slug)
                    : Array.from(new Set([...current.favorites, slug])),
                }
          );
        } catch {
          if (!accountGuard.current.allows(userId)) return;
          setState(current =>
            current.ownerId !== userId
              ? current
              : {
                  ...current,
                  error: "Your saved items could not be updated. Please retry.",
                }
          );
        } finally {
          mutations.current.delete(mutationKey);
        }
      },
    }),
    [favorites, routines, loading, error, refresh, userId, ownsState]
  );
  return (
    <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used inside SavedProvider");
  return context;
}
