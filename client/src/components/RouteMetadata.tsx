import { useEffect } from "react";
import { useLocation } from "wouter";
import { applyFallbackRouteMetadata } from "../lib/defaultRouteMetadata";
export { applyFallbackRouteMetadata } from "../lib/defaultRouteMetadata";

export function RouteMetadata() {
  const [path] = useLocation();
  useEffect(() => {
    applyFallbackRouteMetadata(path);
  }, [path]);
  return null;
}
