import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";
import { componentDisplayName } from "../lib/componentDisplay";
import type { ManifestComponent } from "../types";
import { componentId } from "../lib/componentId";
import { matchesQuery, sortByRelevance } from "../lib/search";
import { categoryLabel } from "../lib/format";
import { ComponentIcon } from "./ComponentIcon";
import { fetchExamplesIndexReadmeCached } from "../lib/loadCommunityExamples";
import {
  examplesReadmeBodyMatches,
  findExampleLinkHits,
  type ExampleLinkHit,
} from "../lib/examplesSearch";

const MAX_COMPONENT_RESULTS = 50;
const MAX_EXAMPLE_LINK_RESULTS = 24;

type PaletteRow =
  | { kind: "component"; c: ManifestComponent }
  | { kind: "example"; hit: ExampleLinkHit }
  | { kind: "examples_index" };

export function SearchPalette({
  open,
  onClose,
  components,
}: {
  open: boolean;
  onClose: () => void;
  components: ManifestComponent[];
}) {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlight, setHighlight] = useState(0);
  const [examplesReadme, setExamplesReadme] = useState<string | null>(null);
  const [examplesLoadState, setExamplesLoadState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  useEffect(() => {
    if (!open) {
      setExamplesLoadState((s) => (s === "loading" ? "idle" : s));
      return;
    }
    if (examplesReadme !== null) {
      setExamplesLoadState("ok");
      return;
    }
    let cancelled = false;
    setExamplesLoadState("loading");
    void fetchExamplesIndexReadmeCached()
      .then((text) => {
        if (cancelled) return;
        setExamplesReadme(text);
        setExamplesLoadState("ok");
      })
      .catch(() => {
        if (cancelled) return;
        setExamplesLoadState("err");
      });
    return () => {
      cancelled = true;
    };
  }, [open, examplesReadme]);

  useEffect(() => {
    if (open) {
      setQ("");
      setHighlight(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const filteredComponents = useMemo(() => {
    const list = components.filter((c) => matchesQuery(c, q));
    return sortByRelevance(list, q).slice(0, MAX_COMPONENT_RESULTS);
  }, [components, q]);

  const exampleLinkHits = useMemo(() => {
    if (!examplesReadme || !q.trim()) return [];
    return findExampleLinkHits(examplesReadme, q).slice(0, MAX_EXAMPLE_LINK_RESULTS);
  }, [examplesReadme, q]);

  const showExamplesIndexHit = useMemo(() => {
    if (!examplesReadme || !q.trim()) return false;
    return examplesReadmeBodyMatches(examplesReadme, q);
  }, [examplesReadme, q]);

  const rows: PaletteRow[] = useMemo(() => {
    const out: PaletteRow[] = filteredComponents.map((c) => ({ kind: "component", c }));
    for (const hit of exampleLinkHits) {
      out.push({ kind: "example", hit });
    }
    if (showExamplesIndexHit) {
      out.push({ kind: "examples_index" });
    }
    return out;
  }, [filteredComponents, exampleLinkHits, showExamplesIndexHit]);

  useEffect(() => {
    setHighlight(0);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (rows.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, rows.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      }
      if (e.key === "Enter") {
        const row = rows[highlight];
        if (!row) return;
        e.preventDefault();
        if (row.kind === "component") {
          nav(`/c/${encodeURIComponent(componentId(row.c))}`);
        } else if (row.kind === "example") {
          nav(`/examples/${encodeURIComponent(row.hit.slug)}`);
        } else {
          const qq = q.trim();
          nav(qq ? `/examples?q=${encodeURIComponent(qq)}` : "/examples");
        }
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, rows, highlight, nav, onClose, q]);

  if (!open) return null;

  const qTrim = q.trim();
  const examplesStillLoading = examplesLoadState === "loading" && Boolean(qTrim);
  const empty =
    rows.length === 0 && components.length > 0 && Boolean(qTrim) && !examplesStillLoading;

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Search catalog and examples"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "12vh 16px",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          borderRadius: 14,
          border: "1px solid var(--border-strong)",
          background: "var(--bg-elevated)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
            <Search
              size={22}
              strokeWidth={2}
              style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: 2 }}
              aria-hidden
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search templates, tags, examples README, and example pages…"
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: 16,
                  outline: "none",
                  padding: "2px 0 4px",
                }}
              />
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.4 }}>
                Catalog components plus the live CLI examples index (same keywords search both).
              </p>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span>
              <span className="kbd">↑</span> <span className="kbd">↓</span> navigate
            </span>
            <span>
              <span className="kbd">↵</span> open
            </span>
            <span>
              <span className="kbd">esc</span> close
            </span>
          </div>
        </div>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 8,
            maxHeight: "min(50vh, 400px)",
            overflowY: "auto",
          }}
        >
          {components.length === 0 && !qTrim ? (
            <li style={{ padding: "20px 14px", color: "var(--text-muted)", fontSize: 14 }}>Loading catalog…</li>
          ) : examplesStillLoading && rows.length === 0 ? (
            <li style={{ padding: "20px 14px", color: "var(--text-muted)", fontSize: 14 }}>
              Loading examples index for search…
            </li>
          ) : empty ? (
            <li style={{ padding: "20px 14px", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
              No templates or examples match <span className="mono">{qTrim}</span>. Try a shorter keyword or browse{" "}
              <button
                type="button"
                onClick={() => {
                  nav(`/examples?q=${encodeURIComponent(qTrim)}`);
                  onClose();
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--cyan)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Examples
              </button>{" "}
              on the full page.
            </li>
          ) : !qTrim ? (
            <li style={{ padding: "20px 14px", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5 }}>
              Start typing to search the component catalog and CLI examples.
            </li>
          ) : (
            rows.map((row, i) => {
              if (row.kind === "component") {
                const c = row.c;
                return (
                  <li key={`c-${componentId(c)}`}>
                    <button
                      type="button"
                      onClick={() => {
                        nav(`/c/${encodeURIComponent(componentId(c))}`);
                        onClose();
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 12px",
                        background: i === highlight ? "rgba(124, 58, 237, 0.2)" : "transparent",
                        color: "var(--text)",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                      onMouseEnter={() => setHighlight(i)}
                    >
                      <span style={{ flexShrink: 0, marginTop: 2 }}>
                        <ComponentIcon icon={c.icon} size={22} title="" />
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{componentDisplayName(c, null)}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          <span className="mono">{componentId(c)}</span>
                          {" · "}
                          {categoryLabel(c.category)}
                          {" · "}
                          <span style={{ color: "var(--text-dim)" }}>Template</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              }
              if (row.kind === "example") {
                const { hit } = row;
                return (
                  <li key={`ex-${hit.slug}`}>
                    <button
                      type="button"
                      onClick={() => {
                        nav(`/examples/${encodeURIComponent(hit.slug)}`);
                        onClose();
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 12px",
                        background: i === highlight ? "rgba(124, 58, 237, 0.2)" : "transparent",
                        color: "var(--text)",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                      onMouseEnter={() => setHighlight(i)}
                    >
                      <span style={{ flexShrink: 0, marginTop: 2, color: "var(--accent-bright)" }}>
                        <BookOpen size={22} strokeWidth={2} aria-hidden />
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{hit.title}</span>
                        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          <span className="mono">/examples/{hit.slug}</span>
                          {" · "}
                          <span style={{ color: "var(--text-dim)" }}>Example</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              }
              return (
                <li key="examples-readme">
                  <button
                    type="button"
                    onClick={() => {
                      const qq = q.trim();
                      nav(qq ? `/examples?q=${encodeURIComponent(qq)}` : "/examples");
                      onClose();
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 12px",
                      background: i === highlight ? "rgba(124, 58, 237, 0.2)" : "transparent",
                      color: "var(--text)",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                    onMouseEnter={() => setHighlight(i)}
                  >
                    <span style={{ flexShrink: 0, marginTop: 2, color: "var(--accent-bright)" }}>
                      <BookOpen size={22} strokeWidth={2} aria-hidden />
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Examples README (filtered)</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Open the examples page with this search · matching sections only
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
