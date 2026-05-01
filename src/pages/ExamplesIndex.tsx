import { Link } from "react-router-dom";
import { EXAMPLE_DEMOS } from "../data/examplesCatalog";

export function ExamplesIndex() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" }}>
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
      <h1
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          margin: "0 0 16px",
          lineHeight: 1.15,
        }}
      >
        End-to-end pipelines from community components
      </h1>
      <p style={{ fontSize: 16, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.6, maxWidth: 820 }}>
        Each demo is a small Dagster project you can run locally—built entirely from templates in this catalog. They
        answer “what does it look like to chain these together?” Source lives in{" "}
        <a
          href="https://github.com/eric-thomas-dagster/dagster-community-components-cli/tree/main/examples"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--cyan)" }}
        >
          dagster-community-components-cli/examples
        </a>
        .
      </p>
      <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "0 0 32px", lineHeight: 1.55, maxWidth: 820 }}>
        These examples also serve as integration tests—writing them surfaced and fixed real component bugs.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {EXAMPLE_DEMOS.map((d) => (
          <Link
            key={d.slug}
            to={`/examples/${encodeURIComponent(d.slug)}`}
            className="registry-card"
            style={{
              display: "block",
              padding: 20,
              textDecoration: "none",
              color: "var(--text)",
              borderRadius: "var(--radius, 12px)",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 17 }}>{d.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.45, marginBottom: 10 }}>
              {d.oneLiner}
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "ui-monospace, monospace",
                color: "var(--text-dim)",
                lineHeight: 1.4,
              }}
            >
              {d.pipeline}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
