import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  Dumbbell,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSaved } from "@/contexts/SavedContext";
import { AuthControl } from "./AuthControl";
import { EXERCISES } from "@/lib/exercises";
import { EDU_ARTICLES } from "@/lib/eduIndex";
import { loadDashboardProgress } from "@/lib/dashboardProgress";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export function HomepageDashboard() {
  const { user, loading, configured } = useAuth();
  return (
    <section
      aria-labelledby="home-dashboard-heading"
      className="border-b border-white/10 bg-black py-5 sm:py-7"
    >
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="meta mb-2 flex items-center gap-2 text-[0.48rem] text-lime">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Member
              Operations Center
            </div>
            <h2
              id="home-dashboard-heading"
              className="display text-2xl font-bold text-white sm:text-3xl"
            >
              Your BTB <span className="text-lime">Dashboard.</span>
            </h2>
          </div>
          {user && !loading && (
            <Link
              href="/account"
              className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-lime hover:underline ${focus}`}
            >
              Open full dashboard{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
        {loading ? (
          <p role="status" className="mt-4 text-sm text-white/60">
            Checking your sign-in…
          </p>
        ) : user ? (
          <MemberDashboard compact key={user.id} />
        ) : (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-white/12 bg-plate p-4">
            <p className="max-w-xl text-sm leading-relaxed text-white/65">
              Sign in to see your saved movements, routines and dashboard here.
              Your personal saved items stay private.
            </p>
            {configured ? (
              <AuthControl />
            ) : (
              <p role="status" className="text-xs text-white/50">
                Sign-in is unavailable in this environment. Public guides remain
                available.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export function MemberDashboard({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const { favorites, routines, loading, error, refresh } = useSaved();
  const [progress, setProgress] = useState(loadDashboardProgress);
  useEffect(() => {
    const update = () => setProgress(loadDashboardProgress());
    const visible = () => {
      if (document.visibilityState === "visible") update();
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);
  const savedExercises = EXERCISES.filter(exercise =>
    favorites.includes(exercise.slug)
  );
  const savedValue =
    user && !loading && !error ? String(savedExercises.length) : "—";
  const routineValue =
    user && !loading && !error ? String(routines.length) : "—";
  return (
    <div className="mt-5">
      <p className="text-xs leading-relaxed text-white/50">
        {user
          ? "Saved movements and routines are tied to your account. "
          : "Sign in to sync saved movements and routines. "}
        Learning, mobility and cardio below are stored on this device, not
        synced between accounts or devices.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardMetric
          icon={Dumbbell}
          value={savedValue}
          label="Saved movements"
          detail={
            user
              ? `${routineValue} saved routines · account`
              : "Sign in to synchronize"
          }
          href="/saved"
        />
        <DashboardMetric
          icon={BookOpen}
          value={`${progress.educationCompleted.length}/${EDU_ARTICLES.length}`}
          label="Education completed"
          detail="On this device"
          href="/learn"
        />
        <DashboardMetric
          icon={Check}
          value={String(progress.mobilityCompleted.length)}
          label="Mobility flows completed"
          detail="On this device"
          href="/mobility"
        />
        <DashboardMetric
          icon={Activity}
          value={`${Number(progress.cardioMinutes.toFixed(1))} min`}
          label="Cardio logged"
          detail={[
            "On this device",
            ...(progress.cardioKcal > 0
              ? [`${Math.round(progress.cardioKcal)} kcal est.`]
              : []),
            ...(progress.cardioUnknown > 0
              ? ["Calorie estimate incomplete"]
              : []),
          ].join(" · ")}
          href="/cardio"
        />
      </div>
      {error && user && (
        <div
          role="alert"
          className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-amber-400/35 p-4 text-sm text-white/75"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refresh}
            className={`inline-flex min-h-11 items-center gap-2 text-lime ${focus}`}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry saved
            items
          </button>
        </div>
      )}
      <div
        className={`mt-5 grid gap-4 ${compact ? "xl:grid-cols-2" : "lg:grid-cols-2"}`}
      >
        <section
          className="border border-white/12 p-4 sm:p-5"
          aria-label="Saved account items"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="display text-xl font-bold text-white">
              Saved blueprints
            </h3>
            <Link
              href="/saved"
              className={`inline-flex min-h-11 items-center text-xs text-lime hover:underline ${focus}`}
            >
              Open saved library →
            </Link>
          </div>
          {!user ? (
            <p className="mt-3 text-sm text-white/55">
              Sign in to access your exercise favorites and custom routines.
            </p>
          ) : loading ? (
            <p role="status" className="mt-3 text-sm text-white/55">
              Loading your saved items…
            </p>
          ) : error ? (
            <p className="mt-3 text-sm text-white/55">
              Saved-item totals are unavailable until the connection is
              restored.
            </p>
          ) : (
            <>
              {savedExercises.length === 0 ? (
                <p className="mt-3 text-sm text-white/55">
                  Bookmark an exercise plate to build your library.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {savedExercises.slice(0, compact ? 3 : 6).map(exercise => (
                    <Link
                      key={exercise.slug}
                      href={`/e/${exercise.slug}`}
                      className={`inline-flex min-h-11 items-center border border-white/15 px-3 py-2 text-sm text-white/80 hover:border-lime hover:text-lime ${focus}`}
                    >
                      {exercise.name}
                    </Link>
                  ))}
                </div>
              )}
              {routines.length > 0 && (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="meta text-[0.45rem] text-white/50">
                    Custom routines
                  </p>
                  <ul className="mt-2 space-y-2">
                    {routines.slice(0, compact ? 2 : 4).map(routine => (
                      <li key={routine.id}>
                        <Link
                          href="/saved"
                          className={`inline-flex min-h-11 items-center text-sm text-lime hover:underline ${focus}`}
                        >
                          {routine.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
        <section
          className="border border-white/12 p-4 sm:p-5"
          aria-label="Device learning queue"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="display text-xl font-bold text-white">
              Learning queue
            </h3>
            <Link
              href="/learn"
              className={`inline-flex min-h-11 items-center text-xs text-lime hover:underline ${focus}`}
            >
              Browse education →
            </Link>
          </div>
          {progress.educationBookmarks.length === 0 ? (
            <p className="mt-3 text-sm text-white/55">
              Save an education article to create a reading queue on this
              device.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-white/10">
              {progress.educationBookmarks
                .slice(0, compact ? 2 : 5)
                .map(slug => {
                  const article = EDU_ARTICLES.find(
                    item => item.slug === slug
                  )!;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/learn/${slug}`}
                        className={`flex min-h-11 items-center justify-between gap-3 py-2 text-sm text-white/75 hover:text-lime ${focus}`}
                      >
                        <span>{article.title}</span>
                        {progress.educationCompleted.includes(slug) && (
                          <>
                            <Check
                              className="h-4 w-4 shrink-0 text-lime"
                              aria-hidden="true"
                            />
                            <span className="sr-only">Completed</span>
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function DashboardMetric({
  icon: Icon,
  value,
  label,
  detail,
  href,
}: {
  icon: typeof Activity;
  value: string;
  label: string;
  detail: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`min-w-0 border border-white/12 bg-plate p-3 transition-colors hover:border-lime/60 sm:p-4 ${focus}`}
    >
      <Icon className="h-4 w-4 text-lime" aria-hidden="true" />
      <div className="display mt-3 break-words text-2xl font-bold text-white">
        {value}
      </div>
      <div className="mt-1 text-xs font-semibold text-white/70">{label}</div>
      <div className="mt-2 text-[0.65rem] leading-relaxed text-white/45">
        {detail}
      </div>
    </Link>
  );
}
