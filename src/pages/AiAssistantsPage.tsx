import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CopyButton } from "../components/CopyButton";
import {
  CLI_AI_INIT_CALLOUT,
  COMMUNITY_CLI_README_WEB,
  COMMUNITY_CLI_VALUE_PROP,
  COMMUNITY_CLI_PYPI_PACKAGE,
  cliOption1UvxInit,
} from "../lib/registryRequirements";

const DEFAULT_PUBLIC_ORIGIN = "https://dagster-component-ui.vercel.app";

const sectionH2: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: "var(--text)",
  margin: "32px 0 12px",
  letterSpacing: "-0.02em",
};

const sectionH3: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: "var(--text-muted)",
  margin: "18px 0 8px",
};

const mutedP: React.CSSProperties = {
  fontSize: 14,
  color: "var(--text-muted)",
  lineHeight: 1.65,
  margin: "0 0 12px",
};

const listStyle: React.CSSProperties = {
  margin: "0 0 12px",
  paddingLeft: 20,
  color: "var(--text-muted)",
  lineHeight: 1.65,
  fontSize: 14,
};

const promptBox: React.CSSProperties = {
  marginTop: 10,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg-elevated)",
  fontSize: 13,
  color: "var(--text-muted)",
  lineHeight: 1.55,
  whiteSpace: "pre-wrap",
};

function ExamplePrompt({ text, label }: { text: string; label: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)" }}>{label}</span>
        <CopyButton text={text.trim()} label="Copy prompt" />
      </div>
      <div style={promptBox}>{text.trim()}</div>
    </div>
  );
}

export function AiAssistantsPage() {
  const [origin, setOrigin] = useState(DEFAULT_PUBLIC_ORIGIN);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const registryRoot = origin.replace(/\/$/, "");
  const exampleComponentUrl = `${registryRoot}/c/rest_api_fetcher`;

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
        AI IDEs &amp; assistants
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
        Claude, Cursor, Copilot: how to use this component catalog
      </h1>

      <p style={{ ...mutedP, fontSize: 15 }}>
        Models guess wrong if they invent component names or YAML. You get predictable output when the repo (and your
        prompts) point to <strong style={{ color: "var(--text)" }}>real template ids</strong>,{" "}
        <strong style={{ color: "var(--text)" }}>this registry</strong>, and the{" "}
        <strong style={{ color: "var(--text)" }}>
          <span className="mono">dagster-component</span>
        </strong>{" "}
        CLI. Below is what to do in each tool—files to add, what the model reads, and prompts you can paste verbatim.
      </p>

      <div
        style={{
          padding: "16px 18px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          marginBottom: 8,
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>
          One-time: teach the repo with <span className="mono">dagster-component init</span>
        </p>
        <p style={{ ...mutedP, margin: 0 }}>
          {CLI_AI_INIT_CALLOUT} Exact filenames can change with the CLI—see the{" "}
          <a href={COMMUNITY_CLI_README_WEB} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
            CLI README
          </a>
          . Commit the generated files so Claude Code, Cursor, and Copilot all see the same rules.
        </p>
      </div>

      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-dim)", margin: "16px 0 6px", letterSpacing: "0.04em" }}>
        Run once from your Dagster project root (uvx — no pip install required)
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
          marginBottom: 8,
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
      <p style={{ fontSize: 13, color: "var(--text-dim)", margin: "0 0 24px", lineHeight: 1.55 }}>
        Prefer a global install? After <Link to="/get-started">Get started</Link>, run{" "}
        <span className="mono">dagster-component init</span> the same way.
      </p>

      <p style={{ ...mutedP, fontSize: 14 }}>
        {COMMUNITY_CLI_VALUE_PROP}
      </p>

      <h2 style={sectionH2}>Anthropic Claude (Claude Code &amp; claude.ai)</h2>
      <h3 style={sectionH3}>What Claude reads</h3>
      <ul style={listStyle}>
        <li>
          <strong style={{ color: "var(--text)" }}>Claude Code</strong> (the CLI coding agent) loads project context from
          files in your repo. After <span className="mono">init</span>, <span className="mono">CLAUDE.md</span> at the
          repository root is the primary place to tell Claude to prefer{" "}
          <span className="mono">dagster-component</span> and this catalog—keep it committed.
        </li>
        <li>
          <strong style={{ color: "var(--text)" }}>Claude.ai</strong> (chat or Projects): the repo files are not
          automatic. Either work inside a synced project that includes <span className="mono">CLAUDE.md</span>, or paste
          the same policy from that file into a Project instruction, then attach or link specific registry pages.
        </li>
      </ul>
      <h3 style={sectionH3}>How to leverage components</h3>
      <ol style={listStyle}>
        <li>
          Open a template page on this site (example:{" "}
          <a href={exampleComponentUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)" }}>
            {exampleComponentUrl}
          </a>
          —swap <span className="mono">rest_api_fetcher</span> for your id). Give Claude that URL or paste the id and
          description from the page.
        </li>
        <li>
          In a terminal (or Claude Code bash), run{" "}
          <span className="mono">dagster-component search &lt;keyword&gt;</span> and{" "}
          <span className="mono">dagster-component info &lt;id&gt;</span> so the assistant reasons over CLI output, not
          memory.
        </li>
        <li>
          For YAML, run <span className="mono">dagster-component schema &lt;id&gt;</span> and paste stdout into the chat
          before asking for <span className="mono">example.yaml</span>.
        </li>
      </ol>
      <ExamplePrompt
        label="Claude — discovery + add"
        text={`
You are helping in a Dagster repo that uses the community component catalog at ${registryRoot}.

Rules:
- Do not invent component folder names or ids. Use only ids from that registry or from \`dagster-component search\` / \`info\`.
- To add a template, the user runs \`dagster-component add <id>\` from the project root (see Get Started on the site).

Task: They want to ingest from a REST API. Search conceptually (I'll run commands—or you suggest the exact search term), then output:
1) The best-matching catalog id
2) The exact \`dagster-component add ...\` line
3) A short plan to run \`dagster-component schema <id>\` before writing YAML
`.trim()}
      />
      <ExamplePrompt
        label="Claude — YAML from schema"
        text={`
Here is the output of \`dagster-component schema rest_api_fetcher\` (I will paste it in the next message).

Generate a minimal \`example.yaml\` for dev only. Use only attribute keys from the schema. If something is required and unknown, use a placeholder and list it explicitly.
`.trim()}
      />

      <h2 style={sectionH2}>Cursor</h2>
      <h3 style={sectionH3}>What Cursor reads</h3>
      <ul style={listStyle}>
        <li>
          <span className="mono">.cursorrules</span> at the repo root (and/or rules under{" "}
          <span className="mono">.cursor/rules</span> if your team uses Rule files) steer Chat, Composer, and background
          agents. <span className="mono">dagster-component init</span> seeds the stack your CLI version documents—merge with
          your team standards if needed.
        </li>
        <li>
          Cursor&apos;s terminal is full shell access: run{" "}
          <span className="mono">uvx --from ${COMMUNITY_CLI_PYPI_PACKAGE} dagster-component …</span> the same as locally,
          then paste command output into the chat with{" "}
          <kbd className="kbd" style={{ fontSize: 11 }}>
            @Terminal
          </kbd>{" "}
          (or copy/paste) so the model does not hallucinate keys.
        </li>
      </ul>
      <h3 style={sectionH3}>How to leverage components</h3>
      <ol style={listStyle}>
        <li>
          Pin the registry in a rule: e.g. &quot;Canonical template ids and docs live at {registryRoot}; never invent
          ids.&quot;
        </li>
        <li>
          In Composer, use <strong style={{ color: "var(--text)" }}>@</strong> references: e.g.{" "}
          <span className="mono">@file</span> on your generated <span className="mono">example.yaml</span>, and paste a
          registry URL in the message so the model can align with the template README.
        </li>
        <li>
          Optionally add the YAML language server / schema URL from a component page (README / schema link) so inline
          editing gets hovers—mention that in <span className="mono">.cursorrules</span> so agents keep the comment header
          that points at <span className="mono">schema.json</span>.
        </li>
      </ol>
      <ExamplePrompt
        label="Cursor — Composer"
        text={`
@Codebase

Project uses Dagster community components. Registry: ${registryRoot}

I need to add a component that writes a dataframe to Parquet. Steps:
1) Find the best catalog id (I'll accept either a registry link you pick or you tell me the exact \`dagster-component search\` query).
2) Give the one-line install: \`uvx --from ${COMMUNITY_CLI_PYPI_PACKAGE} dagster-component add <id>\`.
3) After I paste \`dagster-component schema <id>\` output, propose \`example.yaml\` with only schema keys.
Do not invent component ids.
`.trim()}
      />

      <h2 style={sectionH2}>GitHub Copilot (VS Code, JetBrains, Copilot chat)</h2>
      <h3 style={sectionH3}>What Copilot reads</h3>
      <ul style={listStyle}>
        <li>
          After <span className="mono">init</span>, look for{" "}
          <span className="mono">.github/copilot-instructions.md</span>. GitHub documents this path for{" "}
          <strong style={{ color: "var(--text)" }}>repository-wide</strong> guidance in Copilot Chat and related flows when
          the file is on your default branch.
        </li>
        <li>
          Keep instructions short and actionable: &quot;Use {registryRoot} for ids&quot;, &quot;run{" "}
          <span className="mono">dagster-component schema</span> before YAML&quot;, and &quot;no made-up template names&quot;.
        </li>
      </ul>
      <h3 style={sectionH3}>How to leverage components</h3>
      <ol style={listStyle}>
        <li>
          In VS Code: open Copilot Chat, confirm the workspace is the Dagster repo so instruction files apply. Ask it to
          propose an <span className="mono">add</span> command only after you or it have chosen an id from the registry.
        </li>
        <li>
          For inline completions while editing YAML: structure matters—paste schema output into the chat first, or open
          the template&apos;s <span className="mono">schema.json</span> in the editor so Copilot sees real keys.
        </li>
        <li>
          On github.com, link issues/PRs to specific component pages so reviewers (and Copilot in the browser) share the
          same id.
        </li>
      </ol>
      <ExamplePrompt
        label="Copilot Chat (VS Code)"
        text={`
Repository uses Dagster community component templates. Canonical ids: ${registryRoot}.

Before suggesting YAML or file paths:
- Prefer \`dagster-component search\` / \`info\` / \`schema\` over guessing.
- If you recommend a component, include its registry URL and the exact \`dagster-component add <id>\` command.

Now: help me pick a component for <describe task>.
`.trim()}
      />

      <h2 style={sectionH2}>Other assistants (same pattern)</h2>
      <p style={mutedP}>
        Windsurf, JetBrains AI, Continue, etc. all improve when (1) repo-level instruction files say &quot;use{" "}
        <span className="mono">dagster-component</span> + {registryRoot}&quot;, (2) you paste CLI or schema output into the
        chat, and (3) you link a component page instead of describing the template in prose.
      </p>

      <h2 style={{ ...sectionH2, marginTop: 28 }}>Quick commands recap</h2>
      <ul style={{ ...listStyle, marginBottom: 24 }}>
        <li>
          <span className="mono">dagster-component search &lt;query&gt;</span> — find ids by keyword
        </li>
        <li>
          <span className="mono">dagster-component info &lt;id&gt;</span> — URLs and metadata
        </li>
        <li>
          <span className="mono">dagster-component schema &lt;id&gt;</span> — YAML keys for prompts
        </li>
        <li>
          <span className="mono">dagster-component add &lt;id&gt;</span> — install template into the project
        </li>
      </ul>

      <p style={{ fontSize: 14, color: "var(--text-dim)", margin: 0, lineHeight: 1.55 }}>
        <Link to="/get-started" style={{ color: "var(--cyan)" }}>
          CLI install &amp; quick reference
        </Link>
        {" · "}
        <Link to="/examples" style={{ color: "var(--cyan)" }}>
          Examples
        </Link>
      </p>
      <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 16, lineHeight: 1.45 }}>
        Copy-paste prompts use <span className="mono">{registryRoot}</span> when you opened this page in the
        browser—substitute your own host if you self-host the registry.
      </p>
    </div>
  );
}
