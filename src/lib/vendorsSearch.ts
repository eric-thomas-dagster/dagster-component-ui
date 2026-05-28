/** Search helpers for `vendors/README.md` and vendor pages. */

import {
  countExampleIndexEntries,
  examplesReadmeBodyMatches,
  filterExamplesReadmeByQuery,
  findExampleLinkHits,
  type ExampleLinkHit,
} from "./examplesSearch";

export type VendorLinkHit = ExampleLinkHit;

export {
  countExampleIndexEntries as countVendorIndexEntries,
  examplesReadmeBodyMatches as vendorsReadmeBodyMatches,
  filterExamplesReadmeByQuery as filterVendorsReadmeByQuery,
};

function humanizeSlug(slug: string): string {
  const s = slug.replace(/_/g, " ").replace(/-/g, " ").trim();
  if (!s) return "Vendor";
  return s
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ")
    .trim();
}

/**
 * Index table uses `| Precisely | [precisely.md](precisely.md) | …` — first column is the display name.
 */
export function parseVendorIndexDisplayNames(markdown: string): Map<string, string> {
  const names = new Map<string, string>();
  for (const line of markdown.split("\n")) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\(([^)]+\.md)\)/);
    if (!m) continue;
    const vendorName = m[1].trim();
    if (!vendorName || /^-+$/.test(vendorName) || vendorName.toLowerCase() === "vendor") continue;
    const tail = m[2].replace(/^\.\//, "").split("/").pop() ?? m[2];
    if (tail.toLowerCase() === "readme.md") continue;
    const slug = tail.replace(/\.md$/i, "").trim();
    if (slug) names.set(slug, vendorName);
  }
  return names;
}

function vendorLinkTitle(linkTitle: string, slug: string, indexName?: string): string {
  if (indexName) return indexName;
  const t = linkTitle.trim();
  if (!t || t.toLowerCase() === slug.toLowerCase() || /\.md$/i.test(t)) {
    return humanizeSlug(slug);
  }
  return t;
}

/** Vendor pages linked from the index — titles prefer the table's Vendor column, not `[precisely.md](…)`. */
export function findVendorLinkHits(markdown: string, q: string): VendorLinkHit[] {
  const displayNames = parseVendorIndexDisplayNames(markdown);
  return findExampleLinkHits(markdown, q).map((hit) => ({
    ...hit,
    title: vendorLinkTitle(hit.title, hit.slug, displayNames.get(hit.slug)),
  }));
}
