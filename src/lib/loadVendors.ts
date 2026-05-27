import { VENDORS_INDEX_README_URL, VENDORS_RAW_BASE } from "../data/vendorsCatalog";

/** Turn relative `*.md` links in vendors/README.md into in-app `/vendors/:slug` routes. */
export function rewriteVendorsIndexLinks(markdown: string): string {
  return markdown.replace(/\]\(([^)]+\.md)\)/gi, (_full, rawPath: string) => {
    const tail = rawPath.replace(/^\.\//, "").split("/").pop() ?? rawPath;
    if (tail.toLowerCase() === "readme.md") {
      return `](${rawPath})`;
    }
    const slug = tail.replace(/\.md$/i, "");
    return `](/vendors/${encodeURIComponent(slug)})`;
  });
}

export async function fetchVendorsIndexReadme(): Promise<string> {
  const res = await fetch(VENDORS_INDEX_README_URL, { credentials: "omit" });
  if (!res.ok) throw new Error(`Could not load vendors index (HTTP ${res.status})`);
  return res.text();
}

let vendorsIndexReadmeCache: string | null = null;

/** Reuse one fetch for the vendors index (palette + vendors page). */
export async function fetchVendorsIndexReadmeCached(): Promise<string> {
  if (vendorsIndexReadmeCache) return vendorsIndexReadmeCache;
  const t = await fetchVendorsIndexReadme();
  vendorsIndexReadmeCache = t;
  return t;
}

/**
 * Prefer `vendors/<slug>.md` (flat layout), then `vendors/<slug>/README.md` (folder layout).
 */
export async function fetchVendorMarkdown(
  slug: string
): Promise<{ sourceUrl: string; text: string }> {
  const enc = encodeURIComponent(slug);
  const candidates = [
    `${VENDORS_RAW_BASE}/${enc}.md`,
    `${VENDORS_RAW_BASE}/${enc}/README.md`,
  ];
  let lastStatus = 0;
  for (const url of candidates) {
    const res = await fetch(url, { credentials: "omit" });
    if (res.ok) return { sourceUrl: url, text: await res.text() };
    lastStatus = res.status;
  }
  throw new Error(lastStatus ? `Vendor page not found (HTTP ${lastStatus})` : "Vendor page not found");
}

export function markdownFirstH1(text: string): string | null {
  const m = text.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

/** Remove leading `# Title` block so detail page can render our own headline. */
export function stripMarkdownFirstH1(text: string): string {
  return text.replace(/^#\s+.+\r?\n+/, "").trimStart();
}
