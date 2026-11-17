import { captureTrafficPage, captureGrowthClick } from "./lib/trafficAnalytics";
import { growthLinkTarget } from "./lib/trafficLink";

// The standalone starter page uses the same cookieless, public-only controls.
void captureTrafficPage(window.location.href);
document.addEventListener("click", event => {
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  const target = growthLinkTarget(link?.getAttribute("href") || "");
  if (target) void captureGrowthClick(target);
}, true);