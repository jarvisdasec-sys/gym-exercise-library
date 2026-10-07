import { Activity, LogIn, ShieldCheck } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { MemberDashboard } from "@/components/MemberDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function Account() {
  const { user, configured, loading } = useAuth();
  return (
    <div className="min-h-screen">
      <SiteNav active="saved" />
      <main className="container py-9 sm:py-12">
        <div className="mb-3.5 flex items-center gap-3">
          <span className="h-px w-8 bg-lime" />
          <span className="meta text-[0.45rem] text-lime">
            Member Operations Center
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="display text-3xl font-bold leading-none text-white sm:text-5xl">
              Your BTB <span className="text-lime">Dashboard.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
              Keep your saved blueprints, learning progress, and conditioning
              output in one place.
            </p>
          </div>
          <div className="border border-white/12 px-4 py-3">
            <div className="meta text-[0.4rem] text-white/35">
              MEMBER STATUS
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-white">
              {loading ? (
                "Checking sign-in…"
              ) : user ? (
                <>
                  <ShieldCheck
                    className="h-4 w-4 text-lime"
                    aria-hidden="true"
                  />{" "}
                  {user.email}
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 text-lime" aria-hidden="true" />{" "}
                  Device-only mode
                </>
              )}
            </div>
          </div>
        </div>
        {!loading && !user && (
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border border-lime/30 bg-lime/[0.05] p-5">
            <div>
              <div className="meta text-[0.45rem] text-lime">
                SYNC YOUR PROGRESS
              </div>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
                Your device progress remains here. Create an account to sync
                saved movements and routines across devices.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/55">
              <LogIn className="h-4 w-4 text-lime" aria-hidden="true" /> Use
              Sign In above
            </div>
          </div>
        )}
        {loading ? (
          <p role="status" className="mt-7 text-sm text-white/60">
            Checking your sign-in…
          </p>
        ) : (
          <MemberDashboard key={user?.id ?? "device-only"} />
        )}
        {!configured && (
          <p className="mt-8 text-center text-xs text-white/35">
            Authentication is not configured in this environment. Device-local
            tracking remains available.
          </p>
        )}
      </main>
    </div>
  );
}
