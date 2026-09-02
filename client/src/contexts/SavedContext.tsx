import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { createSavedAccountGuard } from "@/lib/savedAccount";

export type SavedRoutine = { id: string; name: string; routineData: unknown; createdAt: string };

type SavedContextValue = {
  favorites: string[];
  routines: SavedRoutine[];
  loading: boolean;
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => Promise<void>;
};

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [loading, setLoading] = useState(false);
  const accountGuard = useRef(createSavedAccountGuard());

  useEffect(() => {
    accountGuard.current.select(user?.id ?? null);
    setFavorites([]);
    setRoutines([]);

    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    const userId = user.id;
    setLoading(true);
    Promise.all([
      supabase.from("user_favorites").select("exercise_slug").eq("user_id", userId),
      supabase.from("user_routines").select("id, name, routine_data, created_at").eq("user_id", userId).order("created_at", { ascending: false }),
    ]).then(([favoriteResult, routineResult]) => {
      if (!accountGuard.current.allows(userId)) return;
      setFavorites((favoriteResult.data ?? []).map((row) => row.exercise_slug));
      setRoutines(
        (routineResult.data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          routineData: row.routine_data,
          createdAt: row.created_at,
        })),
      );
      setLoading(false);
    }).catch(() => {
      if (!accountGuard.current.allows(userId)) return;
      setFavorites([]);
      setRoutines([]);
      setLoading(false);
    });
  }, [user]);

  const value = useMemo<SavedContextValue>(
    () => ({
      favorites,
      routines,
      loading,
      isFavorite: (slug) => favorites.includes(slug),
      async toggleFavorite(slug) {
        if (!supabase || !user) return;
        if (favorites.includes(slug)) {
          await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("exercise_slug", slug);
          setFavorites((current) => current.filter((item) => item !== slug));
        } else {
          const { error } = await supabase.from("user_favorites").insert({ user_id: user.id, exercise_slug: slug });
          if (!error) setFavorites((current) => [...current, slug]);
        }
      },
    }),
    [favorites, loading, routines, user],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used inside SavedProvider");
  return context;
}
