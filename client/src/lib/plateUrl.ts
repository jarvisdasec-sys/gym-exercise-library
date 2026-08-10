/**
 * Canonical deep-link for a single exercise plate.
 *
 * A printed QR sticker is scanned by a member's PHONE, which cannot reach the
 * dev preview or a localhost origin. So codes must always encode the public
 * production host, regardless of where the page is being previewed from.
 * When previewing on the live domain, the current origin is used as-is.
 *
 * Shape: https://<origin>/e/<slug>
 */

/** Public host that printed stickers must point at. */
const PUBLIC_HOST = "btbfitnessandhealth.com";

/** Hosts that a member's phone can never resolve — never encode these. */
function isPrivateHost(host: string): boolean {
  return (
    host.startsWith("localhost") ||
    host.startsWith("127.") ||
    host.startsWith("169.254.") ||
    host.startsWith("192.168.") ||
    host.endsWith(".local")
  );
}

/** Origin used for all scannable links. */
function publicOrigin(): string {
  if (typeof window === "undefined" || !window.location?.host) {
    return `https://${PUBLIC_HOST}`;
  }
  const { host, origin } = window.location;
  return isPrivateHost(host) ? `https://${PUBLIC_HOST}` : origin;
}

export function plateUrl(slug: string): string {
  return `${publicOrigin()}/e/${slug}`;
}

/** Short display form used under printed stickers, e.g. "btb.site/e/plank". */
export function plateUrlLabel(slug: string): string {
  return `${publicOrigin().replace(/^https?:\/\//, "")}/e/${slug}`;
}
