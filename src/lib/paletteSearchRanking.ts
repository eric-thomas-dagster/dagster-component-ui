import type { ManifestComponent } from "../types";
import { componentRelevanceScore } from "./search";

type LinkHit = { slug: string; title: string };

export type PaletteSearchRow =
  | { kind: "component"; c: ManifestComponent }
  | { kind: "example"; hit: LinkHit }
  | { kind: "examples_index" }
  | { kind: "vendor"; hit: LinkHit }
  | { kind: "vendors_index" };

function queryWords(q: string): string[] {
  return q.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

/** Shared text scoring for landing pages, index rows, and link hits. */
function scoreTextMatch(q: string, fields: string[]): number {
  const words = queryWords(q);
  if (!words.length) return 0;
  let n = 0;
  for (const raw of fields) {
    const f = raw.toLowerCase();
    if (words.length > 1 && f.includes(q.trim().toLowerCase())) n += 28;
    if (f === q.trim().toLowerCase()) n += 100;
    else if (f.startsWith(q.trim().toLowerCase())) n += 45;
    else if (f.includes(q.trim().toLowerCase())) n += 22;
    for (const w of words) {
      if (f === w) n += 42;
      else if (f.startsWith(w)) n += 22;
      else if (f.includes(w)) n += 12;
    }
  }
  return n;
}

export function paletteRowScore(row: PaletteSearchRow, q: string): number {
  const s = q.trim().toLowerCase();
  if (!s) return 0;

  switch (row.kind) {
    case "component":
      return componentRelevanceScore(row.c, s);
    case "vendor":
      return 82 + scoreTextMatch(s, [row.hit.title, row.hit.slug]);
    case "vendors_index":
      return 58 + scoreTextMatch(s, ["vendors", s]);
    case "example":
      return 58 + scoreTextMatch(s, [row.hit.title, row.hit.slug]);
    case "examples_index":
      return 48 + scoreTextMatch(s, ["examples", s]);
  }
}

export function sortPaletteRows<T extends PaletteSearchRow>(rows: T[], q: string): T[] {
  const s = q.trim().toLowerCase();
  if (!s || rows.length <= 1) return rows;
  return [...rows].sort((a, b) => paletteRowScore(b, s) - paletteRowScore(a, s));
}
