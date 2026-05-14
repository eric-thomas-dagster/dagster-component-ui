/** Search helpers for the CLI `examples/README.md` (markdown). */

export function queryWords(q: string): string[] {
  return q.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function haystackMatches(haystack: string, q: string): boolean {
  const words = queryWords(q);
  if (!words.length) return true;
  const h = haystack.toLowerCase();
  return words.every((w) => h.includes(w));
}

/** Rough plain text for full-document search. */
export function markdownToSearchPlain(md: string): string {
  let t = md;
  t = t.replace(/```[\s\S]*?```/g, " ");
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  t = t.replace(/^#{1,6}\s+/gm, " ");
  t = t.replace(/[*_~>#|]/g, " ");
  t = t.replace(/\s+/g, " ");
  return t.trim();
}

export type ExampleLinkHit = { slug: string; title: string };

/** Count distinct example pages linked from `examples/README.md` (`[title](*.md)` rows, excluding README self-links). */
export function countExampleIndexEntries(markdown: string): number {
  const slugs = new Set<string>();
  const linkRe = /\[([^\]]*)\]\(([^)]+\.md)\)/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(markdown)) !== null) {
    const rawPath = m[2];
    const tail = rawPath.replace(/^\.\//, "").split("/").pop() ?? rawPath;
    if (tail.toLowerCase() === "readme.md") continue;
    const slug = tail.replace(/\.md$/i, "").trim();
    if (slug) slugs.add(slug);
  }
  return slugs.size;
}

/** Entries that map to in-app `/examples/:slug` routes (from `[text](path.md)` links). */
export function findExampleLinkHits(markdown: string, q: string): ExampleLinkHit[] {
  const words = queryWords(q);
  if (!words.length) return [];
  const hits: ExampleLinkHit[] = [];
  const seen = new Set<string>();
  const linkRe = /\[([^\]]*)\]\(([^)]+\.md)\)/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(markdown)) !== null) {
    const title = m[1].trim();
    const rawPath = m[2];
    const tail = rawPath.replace(/^\.\//, "").split("/").pop() ?? rawPath;
    if (tail.toLowerCase() === "readme.md") continue;
    const slug = tail.replace(/\.md$/i, "");
    const hay = `${title} ${slug} ${rawPath}`.toLowerCase();
    if (!words.every((w) => hay.includes(w))) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);
    hits.push({ slug, title: title || slug });
  }
  return hits;
}

export function examplesReadmeBodyMatches(markdown: string, q: string): boolean {
  const words = queryWords(q);
  if (!words.length) return false;
  const plain = markdownToSearchPlain(markdown);
  return words.every((w) => plain.includes(w));
}

/**
 * Keep markdown chunks that start at a line `## …` boundary (plus any preamble before the first `##`).
 * Drops sections that do not contain all query words.
 */
export function filterExamplesReadmeByQuery(markdown: string, q: string): string {
  const words = queryWords(q);
  if (!words.length) return markdown;
  const match = (chunk: string) => words.every((w) => chunk.toLowerCase().includes(w));
  const parts = markdown.split(/(?=\n## )/);
  const kept = parts.filter((p) => match(p));
  return kept.join("").trim();
}
