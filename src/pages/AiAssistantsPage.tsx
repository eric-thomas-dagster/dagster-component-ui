import { Link } from "react-router-dom";
import { CopyButton } from "../components/CopyButton";
import {
  CLI_AI_INIT_CALLOUT,
  COMMUNITY_CLI_README_WEB,
  COMMUNITY_CLI_VALUE_PROP,
  cliOption1UvxInit,
} from "../lib/registryRequirements";

export function AiAssistantsPage() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 64px" }}>
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
        AI IDEs
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
        Use this catalog with AI coding assistants
      </h1>

      <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.65 }}>
        Claude, Cursor, GitHub Copilot, and similar tools work best when the repo tells them how your team adds
        components. This registry is browseable and every template has a stable id, schema URL, and install line—give the
        assistant that context instead of free-form YAML.
      </p>

      <div
        style={{
          padding: "16px 18px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          marginBottom: 22,
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 10px" }}>
          Practical workflow
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, color: "var(--text-muted)", lineHeight: 1.65, fontSize: 14 }}>
          <li>
            Point the model at this site (or a specific <Link to="/">component page</Link>) so it sees real ids and
            attributes.
          </li>
          <li>
            Prefer terminal-backed commands—<span className="mono">dagster-component search</span>,{" "}
            <span className="mono">info</span>, <span className="mono">schema</span>, <span className="mono">add</span>
            —over hallucinated folder layouts.
          </li>
          <li>
            Run <span className="mono">dagster-component schema &lt;id&gt;</span> when you need structured attribute keys
            for YAML or chat prompts.
          </li>
          <li>
            For <Link to="/examples">Examples</Link>, link the docs the same way you would for a human reviewer.
          </li>
        </ol>
      </div>

      <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.65 }}>
        {COMMUNITY_CLI_VALUE_PROP}
      </p>

      <h2
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--text)",
          margin: "28px 0 10px",
        }}
      >
        Bootstrap repo hints with <span className="mono">init</span>
      </h2>
      <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.65 }}>
        {CLI_AI_INIT_CALLOUT}
      </p>
      <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 12px", lineHeight: 1.6 }}>
        That typically adds instruction files such as <span className="mono">CLAUDE.md</span>,{" "}
        <span className="mono">.cursorrules</span>, and GitHub Copilot&apos;s{" "}
        <span className="mono">.github/copilot-instructions.md</span> (exact set can evolve with the CLI—see the{" "}
        <a href={COMMUNITY_CLI_README_WEB} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
          CLI README
        </a>
        ). Commit them so every contributor—and every agent session—gets the same defaults.
      </p>

      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)", margin: "0 0 6px", letterSpacing: "0.04em" }}>
        One-shot bootstrap (uvx, no permanent CLI install)
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
          marginBottom: 12,
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
          {cliOption1UvxInit()}
        </code>
        <CopyButton text={cliOption1UvxInit()} label="Copy" />
      </div>
      <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "0 0 28px", lineHeight: 1.55 }}>
        After <span className="mono">init</span>, open any template page here and use{" "}
        <span className="mono">dagster-component schema &lt;id&gt;</span> for validation-friendly YAML. For installing
        templates into a project, see <Link to="/get-started">Get started</Link>.
      </p>

      <p style={{ fontSize: 14, color: "var(--text-dim)", margin: 0, lineHeight: 1.55 }}>
        <Link to="/get-started" style={{ color: "var(--cyan)" }}>
          Get started (install &amp; quick reference)
        </Link>
        {" · "}
        <Link to="/examples" style={{ color: "var(--cyan)" }}>
          Examples
        </Link>
      </p>
    </div>
  );
}
