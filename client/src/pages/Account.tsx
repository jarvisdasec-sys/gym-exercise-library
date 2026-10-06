import { useMemo, useState } from "react";
import { Activity, BookOpen, Check, Dumbbell, LogIn, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { SiteNav } from "@/components/SiteNav";
import { useAuth } from "@/contexts/AuthContext";
import { useSaved } from "@/contexts/SavedContext";
import { EXERCISES } from "@/lib/exercises";
import { loadCardioLog, sumCardio } from "@/lib/cardioLog";
import { loadEduBookmarks, loadEduCompleted } from "@/lib/eduProgress";
import { EDU_ARTICLES } from "@/lib/eduIndex";

export default function Account() {
  const { user, configured } = useAuth();
  const { favorites, routines, loading } = useSaved();
  const [educationBookmarks] = useState(() => loadEduBookmarks());
  const [educationCompleted] = useState(() => loadEduCompleted());
  const [mobilityCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("btb.mobility.completed.v1") ?? "[]"); } catch { return []; }
  });
  const cardioTotals = useMemo(() => sumCardio(Object.values(loadCardioLog()).flat()), []);
  const savedExercises = EXERCISES.filter((exercise) => favorites.includes(exercise.slug));
  const completedArticles = EDU_ARTICLES.filter((article) => educationCompleted.includes(article.slug));

  return (
    <div className="min-h-screen">
      <SiteNav active="saved" />
      <main className="container py-9 sm:py-12">
        <div className="mb-3.5 flex items-center gap-3"><span className="h-px w-8 bg-lime" /><span className="meta text-[0.45rem] text-lime">Member Operations Center</span></div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><h1 className="display text-3xl font-bold leading-none text-white sm:text-5xl">Your BTB <span className="text-lime">Dashboard.</span></h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">Keep your saved blueprints, learning progress, and conditioning output in one place.</p></div>
          <div className="border border-white/12 px-4 py-3"><div className="meta text-[0.4rem] text-white/35">MEMBER STATUS</div><div className="mt-1 flex items-center gap-2 text-sm text-white">{user ? <><ShieldCheck className="h-4 w-4 text-lime" /> {user.email}</> : <><Activity className="h-4 w-4 text-lime" /> Device-only mode</>}</div></div>
        </div>

        {!user && <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border border-lime/30 bg-lime/[0.05] p-5"><div><div className="meta text-[0.45rem] text-lime">SYNC YOUR PROGRESS</div><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">Your device progress is safe here. Create an account when you want saved movements and routines to follow you across devices.</p></div><div className="flex items-center gap-2 text-xs text-white/55"><LogIn className="h-4 w-4 text-lime" /> Use Sign In above</div></div>}

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={Dumbbell} value={user ? String(savedExercises.length) : "—"} label={user ? "Saved movements" : "Sign in for saved movements"} />
          <Metric icon={BookOpen} value={`${educationCompleted.length}/${EDU_ARTICLES.length}`} label="Education completed" />
          <Metric icon={Check} value={String(mobilityCompleted.length)} label="Mobility flows completed" />
          <Metric icon={Activity} value={`${cardioTotals.minutes} min`} label={`${cardioTotals.kcal ? Math.round(cardioTotals.kcal) + " kcal est. · " : ""}cardio logged`} />
        </section>

        <div className="mt-10 grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="border border-white/12 p-5"><div className="flex items-center justify-between gap-3"><h2 className="display text-xl font-bold text-white">Saved blueprints</h2><Link href="/saved" className="meta text-[0.42rem] text-lime hover:underline">Open library →</Link></div>{!user ? <p className="mt-4 text-sm text-white/55">Sign in to synchronize exercise favorites and custom routines.</p> : loading ? <p className="mt-4 text-sm text-white/55">Loading your saved movements...</p> : savedExercises.length === 0 ? <p className="mt-4 text-sm text-white/55">Bookmark an exercise plate to build your member library.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{savedExercises.slice(0, 6).map((exercise) => <Link key={exercise.slug} href={`/e/${exercise.slug}`} className="border border-white/12 p-3.5 transition-colors hover:border-lime"><span className="meta text-[0.4rem] text-lime">{exercise.category}</span><h3 className="display mt-1.5 text-base font-semibold text-white">{exercise.name}</h3></Link>)}</div>}</section>
          <section className="border border-white/12 p-5"><div className="flex items-center justify-between gap-3"><h2 className="display text-xl font-bold text-white">Learning queue</h2><Link href="/learn" className="meta text-[0.42rem] text-lime hover:underline">Browse education →</Link></div>{educationBookmarks.length === 0 ? <p className="mt-4 text-sm text-white/55">Save an education article to create a reading queue.</p> : <div className="mt-4 space-y-2">{educationBookmarks.slice(0, 5).map((slug) => { const article = EDU_ARTICLES.find((item) => item.slug === slug); if (!article) return null; return <Link key={slug} href={`/learn/${slug}`} className="flex items-center justify-between border-b border-white/[0.08] py-2.5 text-sm text-white/75 hover:text-lime"><span>{article.title}</span>{educationCompleted.includes(slug) && <Check className="h-3.5 w-3.5 text-lime" />}</Link>; })}</div>}</section>
        </div>

        {!configured && <p className="mt-8 text-center text-xs text-white/35">Authentication is not configured in this environment. Device-local tracking remains available.</p>}
      </main>
    </div>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Activity; value: string; label: string }) {
  return <div className="border border-white/12 bg-white/[0.02] p-4"><Icon className="h-4 w-4 text-lime" /><div className="display mt-4 text-2xl font-bold text-white">{value}</div><div className="meta mt-1 text-[0.4rem] leading-relaxed text-white/40">{label}</div></div>;
}
