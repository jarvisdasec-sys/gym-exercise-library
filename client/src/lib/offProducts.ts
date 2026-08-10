/**
 * Open Food Facts integration — packaged product lookup by barcode and by name.
 *
 * VERIFIED API CONTRACT (probed against the live service):
 *  - Barcode:  GET /api/v2/product/{code}.json?fields=...
 *              → { status: 1, product: {...} } on a hit.
 *              → HTTP 404 when the barcode is unknown (must be caught, not just
 *                checked via `status`).
 *  - Search:   GET /cgi/search.pl?search_terms=...&json=1
 *              → { count, page, page_size, products: [...] }
 *              The v2 /api/v2/search endpoint returns an HTML error page and is
 *              deliberately NOT used.
 *  Both endpoints send `Access-Control-Allow-Origin: *`, so this static site can
 *  call them directly from the browser with no proxy.
 *
 * DATA-QUALITY REALITIES this module defends against (all observed live):
 *  1. `serving_size` is free text ("1 1/4 cup (30 g)") — never parsed. The numeric
 *     `serving_quantity` is used instead, and falls back to 100 g when absent.
 *  2. Values arrive absurdly precise (316.666666666667) — rounded on display.
 *  3. Fibre is frequently missing — treated as 0, never presented as measured.
 *  4. Crowd-sourced names can mismatch the barcode entirely (a "Kellogg's" code
 *     returning Pringles). The UI ALWAYS shows the resolved product for
 *     confirmation before anything is logged.
 *  5. `brands` is a comma-joined string, sometimes with junk — first token only.
 *  6. Test/junk records exist, so a 200 does not guarantee a real product.
 *
 * LICENSING: product data is Open Database License (ODbL). Attribution to
 * Open Food Facts is shown wherever these results appear.
 */

const BASE = "https://world.openfoodfacts.org";

const FIELDS = [
  "code",
  "product_name",
  "product_name_en",
  "generic_name",
  "brands",
  "quantity",
  "serving_size",
  "serving_quantity",
  "nutriments",
  "image_front_small_url",
  "nutriscore_grade",
].join(",");

/** A packaged product normalised into the same shape as our USDA foods. */
export interface OffProduct {
  /** barcode */
  code: string;
  name: string;
  brand: string;
  /** human label for the serving, e.g. "1 serving (60 g)" — display only */
  servingLabel: string | null;
  /** numeric grams for one serving; null when the product has no serving data */
  servingGrams: number | null;
  /** package size text, e.g. "60g" */
  quantity: string | null;
  imageUrl: string | null;
  /** per 100 g — the canonical basis, matching our USDA foods */
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  /** true when the source had no usable energy value */
  incomplete: boolean;
}

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

/** Round to one decimal to tame values like 316.666666666667. */
function tidy(v: number | null): number {
  return v === null ? 0 : Math.round(v * 10) / 10;
}

/**
 * Normalise a raw Open Food Facts product record.
 * Returns null when there is not enough data to be worth showing.
 */
function normalise(raw: Record<string, unknown>): OffProduct | null {
  const code = String(raw.code ?? "").trim();
  if (!code) return null;

  const n = (raw.nutriments ?? {}) as Record<string, unknown>;

  // Energy: prefer the explicit kcal per 100 g, then derive from kJ if needed.
  let kcal = num(n["energy-kcal_100g"]);
  if (kcal === null) {
    const kj = num(n["energy-kj_100g"]) ?? num(n["energy_100g"]);
    if (kj !== null) kcal = kj / 4.184;
  }

  const protein = num(n["proteins_100g"]);
  const carbs = num(n["carbohydrates_100g"]);
  const fat = num(n["fat_100g"]);
  const fiber = num(n["fiber_100g"]);

  // Nothing usable at all — do not surface an empty row to the member.
  if (kcal === null && protein === null && carbs === null && fat === null) {
    return null;
  }

  const rawName =
    (raw.product_name as string) ||
    (raw.product_name_en as string) ||
    (raw.generic_name as string) ||
    "";
  const name = rawName.trim() || `Unnamed product ${code}`;

  // `brands` is comma-joined and sometimes carries junk — first token only.
  const brand =
    String(raw.brands ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)[0] ?? "";

  const servingGrams = num(raw.serving_quantity);
  const servingLabel =
    typeof raw.serving_size === "string" && raw.serving_size.trim()
      ? raw.serving_size.trim()
      : null;

  return {
    code,
    name,
    brand,
    servingLabel,
    // Guard against nonsense serving values seen in the wild.
    servingGrams:
      servingGrams !== null && servingGrams > 0 && servingGrams <= 2000
        ? Math.round(servingGrams * 10) / 10
        : null,
    quantity:
      typeof raw.quantity === "string" && raw.quantity.trim()
        ? raw.quantity.trim()
        : null,
    imageUrl: (raw.image_front_small_url as string) || null,
    kcal: tidy(kcal),
    protein: tidy(protein),
    carbs: tidy(carbs),
    fat: tidy(fat),
    fiber: tidy(fiber),
    incomplete: kcal === null,
  };
}

/* ── in-memory cache ─────────────────────────────────────────────── */
/** Barcodes are scanned repeatedly, so cache for the life of the page. */
const barcodeCache = new Map<string, OffProduct | null>();

export type LookupResult =
  | { ok: true; product: OffProduct }
  | { ok: false; reason: "not-found" | "no-nutrition" | "network" };

/** Look up a single product by barcode. */
export async function lookupBarcode(
  barcode: string,
): Promise<LookupResult> {
  const code = barcode.replace(/\D/g, "");
  if (!code) return { ok: false, reason: "not-found" };

  if (barcodeCache.has(code)) {
    const hit = barcodeCache.get(code) ?? null;
    return hit
      ? { ok: true, product: hit }
      : { ok: false, reason: "not-found" };
  }

  try {
    const res = await fetch(
      `${BASE}/api/v2/product/${encodeURIComponent(code)}.json?fields=${FIELDS}`,
    );

    // Unknown barcodes come back as a hard 404, not as status 0.
    if (res.status === 404) {
      barcodeCache.set(code, null);
      return { ok: false, reason: "not-found" };
    }
    if (!res.ok) return { ok: false, reason: "network" };

    const data = await res.json();
    if (data?.status !== 1 || !data?.product) {
      barcodeCache.set(code, null);
      return { ok: false, reason: "not-found" };
    }

    const product = normalise(data.product);
    if (!product) return { ok: false, reason: "no-nutrition" };

    barcodeCache.set(code, product);
    return { ok: true, product };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/**
 * Search packaged products by brand or product name.
 * Uses the legacy CGI endpoint, which is the one that actually works.
 */
export async function searchProducts(
  query: string,
  signal?: AbortSignal,
): Promise<OffProduct[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url =
    `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(q)}` +
    `&search_simple=1&action=process&json=1&page_size=24&fields=${FIELDS}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    const list: unknown[] = Array.isArray(data?.products) ? data.products : [];

    const seen = new Set<string>();
    const out: OffProduct[] = [];
    for (const raw of list) {
      const p = normalise(raw as Record<string, unknown>);
      if (!p || p.incomplete) continue; // no calories = not loggable
      if (seen.has(p.code)) continue;
      seen.add(p.code);
      barcodeCache.set(p.code, p);
      out.push(p);
    }
    return out;
  } catch {
    // AbortError included — the caller replaces results anyway.
    return [];
  }
}

/** Scale a product's per-100g macros to an arbitrary gram amount. */
export function scaleProduct(product: OffProduct, grams: number) {
  const f = grams / 100;
  return {
    kcal: product.kcal * f,
    protein: product.protein * f,
    carbs: product.carbs * f,
    fat: product.fat * f,
    fiber: product.fiber * f,
  };
}

/** Default gram amount to pre-fill: one serving if known, else 100 g. */
export function defaultGrams(product: OffProduct): number {
  return product.servingGrams ?? 100;
}

/** Display name combining brand and product without duplicating the brand. */
export function displayName(product: OffProduct): string {
  if (!product.brand) return product.name;
  const lowerName = product.name.toLowerCase();
  if (lowerName.includes(product.brand.toLowerCase())) return product.name;
  return `${product.brand} ${product.name}`;
}
