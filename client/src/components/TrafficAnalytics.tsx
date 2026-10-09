import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { captureTrafficPage, captureGrowthClick } from "@/lib/trafficAnalytics";
import { APP_STORE_URL, PLANNER_URL } from "@/lib/growth";

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
      const target =
        href === PLANNER_URL
          ? "recipe_planner"
          : href === "/start" || href === "/start#btb-inquiry"
            ? "start_here"
            : href === "/plus"
              ? "plus_interest"
              : href === "/downloads/btb-weekly-starter.html"
                ? "starter_worksheet"
                : href === APP_STORE_URL
                  ? "app_store"
                  : null;
      if (target) void captureGrowthClick(target);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
