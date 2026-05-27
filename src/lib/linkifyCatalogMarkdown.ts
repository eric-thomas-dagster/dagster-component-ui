import type { ManifestComponent } from "../types";
import { componentId } from "./componentId";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Router basename prefix, e.g. "" or "/app". */
export function catalogDetailHref(id: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  return `${prefix}/c/${encodeURIComponent(id)}`;
}

/** Vendor markdown often links to the public registry; rewrite to this deployment. */
export function rewritePublishedRegistryComponentUrls(markdown: string): string {
  return markdown.replace(
    /https:\/\/dagster-component-ui\.vercel\.app\/c\/([a-zA-Z0-9_.-]+)/g,
    (_m, id: string) => catalogDetailHref(id)
  );
}

/**
 * Turn catalog ids in markdown into links to this registry’s component pages.
 * - Backtick-wrapped ids
 * - `dagster-component add <id>` and optional @ref
 */
export function linkifyCatalogMarkdown(markdown: string, components: ManifestComponent[]): string {
  const ids = [...new Set(components.map(componentId).filter(Boolean))].sort((a, b) => b.length - a.length);
  let s = markdown;
  for (const id of ids) {
    const href = catalogDetailHref(id);
    const esc = escapeRegExp(id);
    s = s.replace(
      new RegExp("`" + esc + "`", "g"),
      "[`" + id + "`](" + href + ")"
    );
  }
  for (const id of ids) {
    const esc = escapeRegExp(id);
    const href = catalogDetailHref(id);
    s = s.replace(
      new RegExp(`(dagster-component\\s+add\\s+)(${esc})(@[^\\s#\`]+)?`, "g"),
      (_, prefix: string, mid: string, pin: string | undefined) =>
        `${prefix}[${mid}${pin ?? ""}](${href})`
    );
  }
  return s;
}
