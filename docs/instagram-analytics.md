# BTB Instagram-to-website analytics

## Implementation

Use the owner-connected PostHog US project (650290) for public website traffic and the existing controlled social-link clicks. Preserve the GitHub/Vercel deployment and all BTB layouts, routes, authentication and content. This project is newly connected and had no ingested events at setup time; pre-installation traffic cannot be reconstructed.

`client/src/lib/trafficAnalytics.ts` owns the public project ingestion token, production-domain guard, cookieless SDK initialization, campaign filtering, event sanitization, and non-blocking page/click capture. The token is intentionally public and write-only; no personal API credential is included. The SDK is lazy-loaded only in production builds on the two BTB hostnames. `client/src/components/TrafficAnalytics.tsx` observes application navigation and reports deduplicated public-page views; `social.ts` reuses the existing controlled CTAs and preserves optional Umami support.

Only public educational and tool pages are measured. Account, password recovery, saved content, nutrition tracking, workout builder, invalid paths and preview domains are excluded. URL fragments and arbitrary query strings are removed before transmission, including SDK initial/session URL fields. Only controlled UTM labels survive. Autocapture, profiles/identification, replay, console logs, exception capture, heatmaps, performance capture and feature-flag fetching are disabled. Do Not Track and Global Privacy Control are respected. Verification events are tagged `btb_analytics_test=true` and must be excluded from reporting.

The chosen cookieless SDK configuration requires enabling PostHog's server hash mode. Project setting changes require owner confirmation: `cookieless_server_hash_mode=2` and `anonymize_ips=true`. Do not apply these settings or publish the integration until approved. Cookieless visitor/session measurements are estimates, not persistent identified people; do not claim cookie-free tracking alone proves legal compliance.

## Weekly reporting

Preserve the user's daily 7:00 AM America/Denver Post, Reel and Story draft creation. Add a separate Monday analytics section to that same recurring execution rather than replacing or duplicating the existing schedule. Deliver the report here, covering the previous complete Monday–Sunday Mountain Time week, with a like-for-like previous-week comparison when both periods have data.

Use the pinned connected project and actual discovered event/property schema. First consult the governed metric catalog; use approved matching definitions if present. Otherwise label measures as source-derived, not saved canonical business definitions, and prefer PostHog's typed web-analytics calculations. Verify BTB hostname scope and exclude verification/internal traffic. Attribute sessions using verified entry UTM source `instagram` or Instagram referral domains without double counting overlaps; do not count outbound follow clicks as incoming traffic. Show source-tagged versus referrer-only attribution separately when supported. Use consistent session-entry attribution for downstream activity, not only UTM parameters on every later page.

Include Instagram-attributed sessions/visitors/pageviews, share of website sessions, week-over-week changes, daily pattern, leading landing pages and campaigns/mediums, and available engagement measures. Traffic reporting does not infer untracked account signup conversions or Instagram impressions/reach from website data. Explain lost attribution from missing UTMs, blocked scripts and stripped referrers. If collection was absent or a comparison week predates installation, show unavailable/partial coverage rather than inventing zeros, percentages or historical traffic. Finish with two or three evidence-based growth actions.

## Authoritative references

- [PostHog web analytics installation](https://posthog.com/docs/web-analytics/installation#platforms)
- [Cookieless tracking](https://posthog.com/tutorials/cookieless-tracking)
- [Data collection controls](https://posthog.com/docs/privacy/data-collection#cookieless-tracking)

SDK settings and project behavior were checked against the connected instance's authoritative MCP documentation. Type checks, regression tests and production build validate the code; actual ingestion and weekly report querying must be verified after the owner-approved project configuration and production deployment.
