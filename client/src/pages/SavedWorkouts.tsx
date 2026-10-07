import { Bookmark, Dumbbell, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/contexts/AuthContext";
import { useSaved } from "@/contexts/SavedContext";
import { EXERCISES } from "@/lib/exercises";

export default function SavedWorkouts() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, loading, routines, error, refresh } = useSaved();
  const savedExercises = EXERCISES.filter(exercise =>
    favorites.includes(exercise.slug)
  );
  return (
    <div className="min-h-screen">
      <SiteNav active="saved" />
      <main className="container py-9 sm:py-12">
        <div className="mb-3.5 flex items-center gap-3">
          <span className="h-px w-8 bg-lime" />
          <span className="meta text-[0.45rem] text-lime">
            Personal Training Index
          </span>
        </div>
        <h1 className="display text-3xl font-bold leading-none text-white sm:text-5xl">
          My Saved <span className="text-lime">Workouts.</span>
        </h1>
        {authLoading ? (
          <p role="status" className="mt-7 text-sm text-white/55">
            Checking your sign-in…
          </p>
        ) : !user ? (
          <div className="mt-7 border border-white/12 p-6 text-white/65">
            <Bookmark className="h-6 w-6 text-lime" aria-hidden="true" />
            <p className="mt-3 text-sm">
              Sign in to access your saved exercises and custom routines.
            </p>
          </div>
        ) : loading ? (
          <p role="status" className="mt-7 text-sm text-white/55">
            Loading your saved items…
          </p>
        ) : error ? (
          <div
            role="alert"
            className="mt-7 flex flex-wrap items-center justify-between gap-4 border border-amber-400/35 p-5 text-sm text-white/75"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex min-h-11 items-center gap-2 text-lime focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry saved items
            </button>
          </div>
        ) : (
          <div className="mt-7 grid gap-7 lg:grid-cols-2">
            <section>
              <h2 className="display text-xl font-bold text-white">
                Saved blueprints
              </h2>
              {savedExercises.length === 0 ? (
                <p className="mt-4 text-sm text-white/55">
                  Bookmark an exercise plate to build your library.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {savedExercises.map(exercise => (
                    <Link
                      key={exercise.slug}
                      href={`/e/${exercise.slug}`}
                      className="border border-white/12 bg-plate p-4 transition-colors hover:border-lime"
                    >
                      <span className="meta text-[0.45rem] text-lime">
                        {exercise.category}
                      </span>
                      <h3 className="display mt-2 text-lg font-semibold text-white">
                        {exercise.name}
                      </h3>
                      <p className="mt-1 text-xs text-white/55">
                        {exercise.primary}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            <section>
              <h2 className="display text-xl font-bold text-white">
                Custom splits
              </h2>
              {routines.length === 0 ? (
                <div className="mt-4 border border-white/12 p-5 text-sm text-white/55">
                  <Dumbbell className="h-5 w-5 text-lime" aria-hidden="true" />
                  <p className="mt-3">No custom routines saved yet.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {routines.map(routine => (
                    <div
                      key={routine.id}
                      className="border border-white/12 p-4"
                    >
                      <h3 className="display text-lg font-semibold text-white">
                        {routine.name}
                      </h3>
                      <p className="meta mt-2 text-[0.42rem] text-white/45">
                        Saved {new Date(routine.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
