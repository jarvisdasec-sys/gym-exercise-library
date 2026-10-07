import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { captureTrafficPage } from "@/lib/trafficAnalytics";

export function TrafficAnalytics() {
  const [location] = useLocation();
  const search = useSearch();
  useEffect(() => {
    void captureTrafficPage(window.location.href);
  }, [location, search]);
  return null;
}
