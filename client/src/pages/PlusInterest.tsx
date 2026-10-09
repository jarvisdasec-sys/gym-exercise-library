import { useEffect } from "react";
import { SiteNav } from "../components/SiteNav";
import { GrowthContent } from "../components/GrowthContent";
import { ClientInquiry } from "../components/ClientInquiry";
import { applyGrowthMetadata, PLANNER_URL } from "../lib/growth";
export default function PlusInterest() {
  useEffect(() => applyGrowthMetadata("plus"), []);
  return (
    <>
      <SiteNav active="plus" />
      <GrowthContent
        page="plus"
        plannerUrl={import.meta.env.VITE_PLANNER_REVIEW_URL || PLANNER_URL}
      />
      <ClientInquiry initialTopic="Future BTB Plus membership" />
    </>
  );
}
