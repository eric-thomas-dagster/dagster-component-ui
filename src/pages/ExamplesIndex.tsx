import { useEffect, useMemo, useState } from "react";
import { ExamplesMarkdown } from "../components/ExamplesMarkdown";
import {
  COMMUNITY_CLI_EXAMPLES_INDEX_README_URL,
  COMMUNITY_CLI_EXAMPLES_TREE_WEB,
} from "../data/examplesCatalog";
import { useCatalog } from "../context/CatalogContext";
import { linkifyCatalogMarkdown } from "../lib/linkifyCatalogMarkdown";
import {
  fetchExamplesIndexReadme,
  rewriteExamplesIndexLinks,
} from "../lib/loadCommunityExamples";

export function ExamplesIndex() {
  const { components } = useCatalog();
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const raw = await fetchExamplesIndexReadme();
        const linked = rewriteExamplesIndexLinks(raw);
        if (!cancelled) setReadme(linked);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load examples");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const linkedReadme = useMemo(() => {
    if (!readme || !components.length) return readme;
    return linkifyCatalogMarkdown(readme, components);
  }, [readme, components]);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 64px" }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
          margin: "0 0 12px",
        }}
      >
        Examples
      </p>

      <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "0 0 24px", lineHeight: 1.5 }}>
        This page mirrors the demos folder README from the CLI repo—it updates whenever that file changes (no duplicated
        list in this codebase). Browse the folder on GitHub:{" "}
        <a href={COMMUNITY_CLI_EXAMPLES_TREE_WEB} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
          examples/
        </a>
      </p>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading examples index…</p>}
      {error && (
        <div className="callout-help" style={{ marginBottom: 24, borderLeftColor: "var(--error)" }}>
          <p style={{ margin: 0, fontWeight: 600, color: "var(--text)" }}>Could not load README</p>
          <p style={{ margin: "8px 0 0", fontSize: 14 }}>{error}</p>
          <p style={{ margin: "12px 0 0", fontSize: 13 }}>
            <a href={COMMUNITY_CLI_EXAMPLES_INDEX_README_URL} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
              Open README.md (raw)
            </a>
          </p>
        </div>
      )}
      {readme != null && linkedReadme != null && <ExamplesMarkdown>{linkedReadme}</ExamplesMarkdown>}
    </div>
  );
}
