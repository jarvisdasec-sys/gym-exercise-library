import { useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";
import { GroupWorkoutSection } from "@/components/GroupWorkoutSection";
import { applyGroupWorkoutMetadata } from "@/lib/groupWorkoutMetadata";

export default function GroupWorkouts() {
  useEffect(applyGroupWorkoutMetadata, []);
  return (
    <div className="min-h-screen">
      <SiteNav active="workouts" />
      <main className="container pb-12">
        <div className="pt-8">
          <a
            href="/workouts"
            className="meta inline-flex min-h-11 items-center text-[0.5rem] text-lime"
          >
            ← All workout sessions
          </a>
          <h1 className="display mt-3 text-3xl font-bold text-white sm:text-4xl">
            Group Workouts
          </h1>
        </div>
        <GroupWorkoutSection />
      </main>
    </div>
  );
}
