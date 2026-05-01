import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "../components/CopyButton";
import {
  exampleMarkdownUrl,
  exampleSetupScriptCurl,
  getExampleBySlug,
} from "../data/examplesCatalog";
import { useCatalog } from "../context/CatalogContext";
import { linkifyCatalogMarkdown } from "../lib/linkifyCatalogMarkdown";

export function ExampleDetail() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  const meta = slug ? getExampleBySlug(slug) : undefined;
  const { components } = useCatalog();

  const [md, setMd] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mdUrl = useMemo(() => (slug ? exampleMarkdownUrl(slug) : ""), [slug]);
  const runCmd = useMemo(() => (slug ? exampleSetupScriptCurl(slug) : ""), [slug]);

  const linkedMd = useMemo(
    () => (md && components.length ? linkifyCatalogMarkdown(md, components) : md),
    [md, components]
  );

  useEffect(() => {
    if (!mdUrl) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);
    setMd(null);
    (async () => {
      try {
        const res = await fetch(mdUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!cancelled) setMd(text);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Could not load example");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mdUrl]);

  if (!slug) {
    return <p style={{ padding: 48 }}>Missing example slug.</p>;
  }

  if (!meta) {
    return (
      <div style={{ padding: "48px 24px", maxWidth: 560, margin: "0 auto" }}>
        <p style={{ fontWeight: 600 }}>Unknown example</p>
        <p style={{ color: "var(--text-muted)" }}>
          No demo named <span className="mono">{slug}</span>.{" "}
          <Link to="/examples" style={{ color: "var(--cyan)" }}>
            Back to examples
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>
      <p style={{ margin: "0 0 8px" }}>
        <Link to="/examples" style={{ fontSize: 14, color: "var(--cyan)", textDecoration: "none" }}>
          ← All examples
        </Link>
      </p>
      <h1
        style={{
          fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: "0 0 12px",
          lineHeight: 1.2,
        }}
      >
        {meta.title}
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.55 }}>
        {meta.oneLiner}{" "}
        <span style={{ color: "var(--text-dim)", fontSize: 13 }}>({meta.pipeline})</span>
      </p>

      <div
        style={{
          marginBottom: 28,
          padding: "16px 18px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)", margin: "0 0 8px" }}>Run it</p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <code
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              flex: "1 1 240px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {runCmd}
          </code>
          <CopyButton text={runCmd} label="Copy" />
        </div>
        <p style={{ fontSize: 12, color: "var(--text-dim)", margin: "12px 0 0", lineHeight: 1.45 }}>
          Runs the setup script from the CLI repo. Review it before piping to bash, as you would any install script.
        </p>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "0 0 16px" }}>
        <a href={mdUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
          Raw markdown on GitHub
        </a>
      </p>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading…</p>}
      {err && (
        <p style={{ color: "var(--error)" }}>
          {err}{" "}
          <a href={mdUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
            Open source file
          </a>
        </p>
      )}
      {linkedMd != null && !err && (
        <div className="doc-viewer-markdown" style={{ fontSize: 15 }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...rest }) => {
                if (href?.startsWith("http://") || href?.startsWith("https://")) {
                  return (
                    <a href={href} target="_blank" rel="noreferrer" {...rest}>
                      {children}
                    </a>
                  );
                }
                if (href?.startsWith("/")) {
                  return (
                    <Link to={href} {...rest}>
                      {children}
                    </Link>
                  );
                }
                return (
                  <a href={href} {...rest}>
                    {children}
                  </a>
                );
              },
            }}
          >
            {linkedMd}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
