import { fetchExamplesIndexReadmeCached } from "./loadCommunityExamples";

export type CliExampleRef = { slug: string; title: string };

/**
 * Parse `examples/README.md` demo tables: rows look like
 * `| [Title](slug.md) | \`comp_a\`, \`comp_b\` | highlights |`.
 * Returns each manifest-style component id → demos that list it in the Components column.
 */
export function buildCliExampleComponentIndex(markdown: string): Map<string, CliExampleRef[]> {
  const map = new Map<string, CliExampleRef[]>();

  const push = (componentId: string, ref: CliExampleRef) => {
    const list = map.get(componentId) ?? [];
    if (!list.some((x) => x.slug === ref.slug)) {
      list.push(ref);
      map.set(componentId, list);
    }
  };

  const tick = /`([a-zA-Z0-9_-]+)`/g;

  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.includes(".md")) continue;

    const parts = trimmed.split("|").map((p) => p.trim());
    if (parts.length < 4) continue;

    const demoCell = parts[1] ?? "";
    if (!demoCell || /^demo$/i.test(demoCell) || /^-+$/ .test(demoCell)) continue;

    const linkMatch = demoCell.match(/\[([^\]]+)\]\(([^)]+\.md)\)/);
    if (!linkMatch) continue;

    const title = linkMatch[1].trim();
    const mdPath = linkMatch[2].trim();
    const tail = mdPath.replace(/^\.\//, "").split("/").pop() ?? mdPath;
    if (tail.toLowerCase() === "readme.md") continue;
    const slug = tail.replace(/\.md$/i, "");
    if (!slug) continue;

    const componentsCell = parts[2] ?? "";
    if (!componentsCell || /^-+$/ .test(componentsCell)) continue;

    tick.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = tick.exec(componentsCell)) !== null) {
      push(m[1], { slug, title });
    }
  }

  for (const [k, list] of map) {
    list.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
    map.set(k, list);
  }

  return map;
}

let indexCache: Map<string, CliExampleRef[]> | null = null;
let indexLoad: Promise<Map<string, CliExampleRef[]>> | null = null;

export function getCliExampleComponentIndex(): Promise<Map<string, CliExampleRef[]>> {
  if (indexCache) return Promise.resolve(indexCache);
  if (!indexLoad) {
    indexLoad = (async () => {
      const readme = await fetchExamplesIndexReadmeCached();
      indexCache = buildCliExampleComponentIndex(readme);
      return indexCache;
    })();
  }
  return indexLoad;
}

export async function getCliExamplesForComponent(componentId: string): Promise<CliExampleRef[]> {
  if (!componentId.trim()) return [];
  const idx = await getCliExampleComponentIndex();
  return idx.get(componentId) ?? [];
}
