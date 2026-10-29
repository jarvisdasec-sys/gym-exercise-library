import { useEffect } from "react";
import { SiteNav } from "../components/SiteNav";
import { GrowthContent } from "../components/GrowthContent";
import { BtbMotion } from "../components/BtbMotion";
import { GroupWorkoutPromo } from "../components/GroupWorkoutPromo";
import { InstagramFollow } from "../components/InstagramFollow";
import { HomepageDashboard } from "../components/MemberDashboard";
import { applyGrowthMetadata, PLANNER_URL } from "../lib/growth";

export default function BrandHome() {
  useEffect(() => applyGrowthMetadata("home"), []);
  const plannerUrl = import.meta.env.VITE_PLANNER_REVIEW_URL || PLANNER_URL;
  return (
    <>
      <SiteNav active="home" />
      <GrowthContent plannerUrl={plannerUrl} />
      <HomepageDashboard />
      <GroupWorkoutPromo />
      <BtbMotion />
      <InstagramFollow />
    </>
  );
}
