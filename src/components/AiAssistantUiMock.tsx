import type { CSSProperties, ReactNode } from "react";

const dots: CSSProperties = { width: 10, height: 10, borderRadius: "50%" };

type UiMockProps = {
  /** Fake window / tab title */
  windowTitle: string;
  /** Badge in title bar, e.g. "Claude" */
  variantLabel: string;
  caption: string;
  children: ReactNode;
};

/**
 * Illustrative UI frame—reads like a screenshot but needs no image assets or product licensing.
 */
export function AiAssistantUiMock({ windowTitle, variantLabel, caption, children }: UiMockProps) {
  return (
    <figure style={{ margin: "22px 0 8px" }}>
      <div
        style={{
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "hidden",
          background: "var(--bg-deep)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
        }}
        className="ai-assistant-ui-mock"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: "var(--bg-elevated)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ display: "flex", gap: 6, flexShrink: 0 }} aria-hidden>
            <span style={{ ...dots, background: "#f87171" }} />
            <span style={{ ...dots, background: "#fbbf24" }} />
            <span style={{ ...dots, background: "#4ade80" }} />
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-dim)",
              flex: 1,
              textAlign: "center",
              fontFamily: "ui-monospace, monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {windowTitle}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--cyan)",
              padding: "3px 8px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            {variantLabel}
          </span>
        </div>
        {children}
      </div>
      <figcaption
        style={{
          fontSize: 11,
          color: "var(--text-dim)",
          marginTop: 10,
          lineHeight: 1.45,
          fontStyle: "italic",
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

const lineNum: CSSProperties = {
  display: "inline-block",
  width: 22,
  marginRight: 12,
  color: "var(--text-dim)",
  fontSize: 11,
  userSelect: "none",
  textAlign: "right",
};

export function MockEditorBody({
  filepath,
  lines,
}: {
  filepath: string;
  lines: readonly string[];
}) {
  return (
    <div style={{ padding: "12px 14px 16px", background: "var(--code-bg)" }}>
      <div
        style={{
          fontSize: 11,
          color: "var(--text-dim)",
          marginBottom: 10,
          fontFamily: "ui-monospace, monospace",
          borderBottom: "1px solid var(--border)",
          paddingBottom: 8,
        }}
      >
        {filepath}
      </div>
      <pre
        style={{
          margin: 0,
          fontFamily: "ui-monospace, monospace",
          fontSize: 12,
          lineHeight: 1.55,
          color: "var(--text-muted)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline" }}>
            <span style={lineNum}>{i + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function MockChatBody({
  messages,
}: {
  messages: readonly { role: "user" | "assistant"; text: string }[];
}) {
  return (
    <div style={{ padding: "14px 14px 18px", background: "var(--bg-card)" }}>
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            marginBottom: i < messages.length - 1 ? 12 : 0,
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "92%",
              padding: "10px 12px",
              borderRadius: m.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              background: m.role === "user" ? "rgba(124, 58, 237, 0.2)" : "var(--bg-elevated)",
              border: "1px solid var(--border)",
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--text-muted)",
              fontFamily: "ui-sans-serif, system-ui",
              whiteSpace: "pre-wrap",
            }}
          >
            {m.text}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Cursor-style: narrow sidebar + wide panel */
export function MockSplitIdeBody({
  sidebarLabel,
  sidebarHighlight,
  panelTitle,
  panelContent,
}: {
  sidebarLabel: string;
  sidebarHighlight: string;
  panelTitle: string;
  panelContent: ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: 160, background: "var(--bg-card)" }}>
      <div
        style={{
          width: 112,
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          padding: "10px 8px",
          background: "var(--bg-elevated)",
          fontSize: 10,
          color: "var(--text-dim)",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ marginBottom: 8 }}>{sidebarLabel}</div>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            padding: "6px 8px",
            borderRadius: 6,
            background: "rgba(34, 211, 238, 0.12)",
            border: "1px solid var(--border)",
            color: "var(--cyan)",
            wordBreak: "break-all",
          }}
        >
          {sidebarHighlight}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            padding: "8px 12px",
            fontSize: 11,
            borderBottom: "1px solid var(--border)",
            color: "var(--text-dim)",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {panelTitle}
        </div>
        <div style={{ padding: 12 }}>{panelContent}</div>
      </div>
    </div>
  );
}
