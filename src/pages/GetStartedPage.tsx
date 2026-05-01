import { Link } from "react-router-dom";
import { CopyButton } from "../components/CopyButton";
import {
  INSTALL_PYPI_NOTE,
  INSTALL_VERSION_NOTE,
  pipInstallDagsterCore,
  CLI_HOME_PLACEHOLDER_COMPONENT_ID,
  canonicalInstallSnippet,
  CLI_QUICK_REFERENCE_LINES,
  COMMUNITY_CLI_README_WEB,
  COMMUNITY_CLI_VALUE_PROP,
  UV_INSTALL_DOCS,
  UV_INSTALL_SHELL,
} from "../lib/registryRequirements";

export function GetStartedPage() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 64px" }}>
      <p style={{ margin: "0 0 8px" }}>
        <Link to="/" style={{ fontSize: 14, color: "var(--cyan)", textDecoration: "none" }}>
          ← Registry
        </Link>
      </p>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
          margin: "16px 0 12px",
        }}
      >
        Install &amp; CLI
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
        Get started with the component CLI
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.65 }}>
        Install <span className="mono">dagster-community-components-cli</span> from PyPI (or run via{" "}
        <span className="mono">uvx</span> without installing). From your Dagster code-location root,{" "}
        <span className="mono">dagster-component add</span> copies a template and installs its declared pip dependencies.
        You still need <span className="mono">dagster</span> in the environment for your project. On each template page
        in this registry, the copy button uses that template&apos;s id instead of{" "}
        <code className="mono" style={{ fontSize: 13 }}>{CLI_HOME_PLACEHOLDER_COMPONENT_ID}</code>.
      </p>
      <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.65 }}>
        {COMMUNITY_CLI_VALUE_PROP}{" "}
        <a href={COMMUNITY_CLI_README_WEB} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
          Full command reference (CLI README on GitHub)
        </a>
        .
      </p>
      <p style={{ fontSize: 14, color: "var(--text-dim)", margin: "0 0 20px", lineHeight: 1.55 }}>
        Using <Link to="/ai-assistants" style={{ color: "var(--cyan)" }}>Claude, Cursor, or Copilot</Link>? Run{" "}
        <span className="mono">dagster-component init</span> in your repo so assistants prefer real catalog commands over
        inventing YAML.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          width: "100%",
          marginBottom: 18,
        }}
      >
        <code
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            flex: "1 1 280px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {canonicalInstallSnippet(CLI_HOME_PLACEHOLDER_COMPONENT_ID)}
        </code>
        <CopyButton text={canonicalInstallSnippet(CLI_HOME_PLACEHOLDER_COMPONENT_ID)} label="Copy" />
      </div>

      <div
        style={{
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          marginBottom: 18,
        }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            margin: "0 0 12px",
          }}
        >
          Quick reference
        </h2>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {CLI_QUICK_REFERENCE_LINES.map((row) => (
            <li key={row.command}>
              <code
                className="mono"
                style={{
                  fontSize: 12,
                  display: "block",
                  color: "var(--cyan)",
                  marginBottom: 4,
                  wordBreak: "break-word",
                }}
              >
                {row.command}
              </code>
              <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.45 }}>{row.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: "var(--text-dim)",
          margin: "0 0 8px",
        }}
      >
        Prerequisite — Dagster runtime
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          width: "100%",
        }}
      >
        <code className="mono" style={{ fontSize: 13, color: "var(--text-muted)", flex: "1 1 200px" }}>
          {pipInstallDagsterCore()}
        </code>
        <CopyButton text={pipInstallDagsterCore()} label="Copy" />
      </div>
      <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "12px 0 0", lineHeight: 1.55 }}>
        Don&apos;t have <span className="mono">uv</span> for uvx?{" "}
        <code className="mono" style={{ fontSize: 11 }}>{UV_INSTALL_SHELL}</code> (macOS / Linux) or{" "}
        <a href={UV_INSTALL_DOCS} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
          uv installation
        </a>
        .
      </p>
      <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "10px 0 0", lineHeight: 1.55 }}>
        {INSTALL_PYPI_NOTE} {INSTALL_VERSION_NOTE}
      </p>
    </div>
  );
}
