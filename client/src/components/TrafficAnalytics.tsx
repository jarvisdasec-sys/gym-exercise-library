import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { captureTrafficPage, captureGrowthClick } from "@/lib/trafficAnalytics";
import { growthLinkTarget } from "@/lib/trafficLink";

export function TrafficAnalytics() {
  const [location] = useLocation();
  const search = useSearch();
  useEffect(() => {
    void captureTrafficPage(window.location.href);
  }, [location, search]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link) return;
      const href = link.getAttribute("href") || "";
      const target = growthLinkTarget(href);
      if (target) void captureGrowthClick(target);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
