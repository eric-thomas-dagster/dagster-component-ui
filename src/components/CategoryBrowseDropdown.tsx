import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ManifestComponent } from "../types";
import { categoryLabel } from "../lib/format";
import { ComponentIcon } from "./ComponentIcon";

type Props = {
  categoryCounts: [string, number][];
  samplesByCategory: Map<string, ManifestComponent>;
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
};

export function CategoryBrowseDropdown({
  categoryCounts,
  samplesByCategory,
  selectedCategory,
  onSelectCategory,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const [highlight, setHighlight] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categoryCounts;
    return categoryCounts.filter(([cat]) => {
      const label = categoryLabel(cat).toLowerCase();
      return cat.toLowerCase().includes(q) || label.includes(q);
    });
  }, [categoryCounts, query]);

  const rows = useMemo(() => {
    if (filtered.length === 0) return [] as ({ kind: "all" } | { kind: "cat"; cat: string; n: number })[];
    const head: ({ kind: "all" } | { kind: "cat"; cat: string; n: number })[] = [{ kind: "all" }];
    for (const [cat, n] of filtered) {
      head.push({ kind: "cat", cat, n });
    }
    return head;
  }, [filtered]);

  const selectedCount = useMemo(() => {
    if (!selectedCategory) return undefined;
    return categoryCounts.find(([c]) => c === selectedCategory)?.[1];
  }, [categoryCounts, selectedCategory]);

  const selectedSample = selectedCategory ? samplesByCategory.get(selectedCategory) : undefined;

  const pickIndex = useCallback(
    (idx: number) => {
      const row = rows[idx];
      if (!row) return;
      if (row.kind === "all") {
        onSelectCategory("");
        setOpen(false);
        setQuery("");
        return;
      }
      onSelectCategory(row.cat === selectedCategory ? "" : row.cat);
      setOpen(false);
      setQuery("");
    },
    [onSelectCategory, rows, selectedCategory]
  );

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  useEffect(() => {
    setHighlight((h) => {
      const max = Math.max(0, rows.length - 1);
      return Math.min(h, max);
    });
  }, [rows.length, open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setQuery("");
        return;
      }
      if (rows.length === 0) return;
      if (e.target === filterInputRef.current) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlight((h) => Math.min(h + 1, rows.length - 1));
        }
        if (e.key === "Enter") {
          e.preventDefault();
          pickIndex(highlight);
        }
        return;
      }
      if (!rootRef.current?.contains(e.target as Node)) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, rows.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        pickIndex(highlight);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, highlight, pickIndex, rows.length]);

  const onKeyTrigger = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
      }
    },
    []
  );

  useEffect(() => {
    if (!open || !listRef.current || rows.length === 0) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-row-index="${highlight}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open, rows.length]);

  return (
    <div ref={rootRef} className="category-browse-root" style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        className="category-browse-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyTrigger}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderRadius: 12,
          border: `1px solid ${open ? "var(--accent-bright)" : "var(--border-strong)"}`,
          background: "var(--bg-card)",
          color: "var(--text)",
          font: "inherit",
          textAlign: "left",
          boxShadow: open ? "0 0 0 3px var(--accent-glow)" : undefined,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <span style={{ color: "var(--text-dim)", fontSize: 18 }} aria-hidden>
          ≡
        </span>
        {selectedCategory ? (
          <>
            <span style={{ flexShrink: 0 }}>
              <ComponentIcon icon={selectedSample?.icon} size={32} title="" />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>
                {categoryLabel(selectedCategory)}
              </span>
              <span style={{ display: "block", fontSize: 12, color: "var(--text-dim)", marginTop: 2 }} className="mono">
                {selectedCategory} · {selectedCount ?? "—"} templates
              </span>
            </span>
          </>
        ) : (
          <span style={{ flex: 1, color: "var(--text-muted)", fontSize: 15 }}>
            Browse by category…
          </span>
        )}
        <span style={{ color: "var(--text-dim)", fontSize: 12, flexShrink: 0 }} aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {selectedCategory ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCategory("");
          }}
          style={{
            marginTop: 8,
            padding: "6px 12px",
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          Clear category filter
        </button>
      ) : null}

      {open ? (
        <div
          className="category-browse-panel"
          role="listbox"
          aria-label="Categories"
          ref={listRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 6px)",
            zIndex: 50,
            maxHeight: "min(70vh, 520px)",
            display: "flex",
            flexDirection: "column",
            borderRadius: 12,
            border: "1px solid var(--border-strong)",
            background: "var(--bg-elevated)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <input
              ref={filterInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter categories…"
              aria-label="Filter categories"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
          <div style={{ overflow: "auto", flex: 1, padding: 6 }}>
            {filtered.length === 0 ? (
              <p style={{ padding: "16px 12px", margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
                No categories match “{query.trim()}”.
              </p>
            ) : (
              rows.map((row, idx) => {
                if (row.kind === "all") {
                  const active = !selectedCategory;
                  const hi = highlight === idx;
                  return (
                    <button
                      key="all"
                      type="button"
                      role="option"
                      aria-selected={active}
                      data-row-index={idx}
                      onClick={() => pickIndex(idx)}
                      onMouseEnter={() => setHighlight(idx)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 10px",
                        border: "none",
                        borderRadius: 8,
                        background: hi ? "var(--pill-bg)" : active ? "rgba(34, 211, 238, 0.08)" : "transparent",
                        color: "var(--text)",
                        font: "inherit",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 14 }}>All categories</span>
                      <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-dim)" }}>
                        {categoryCounts.reduce((s, [, n]) => s + n, 0)} templates
                      </span>
                    </button>
                  );
                }
                const { cat, n } = row;
                const sample = samplesByCategory.get(cat);
                const active = selectedCategory === cat;
                const hi = highlight === idx;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="option"
                    aria-selected={active}
                    data-row-index={idx}
                    onClick={() => pickIndex(idx)}
                    onMouseEnter={() => setHighlight(idx)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 10px",
                      border: "none",
                      borderRadius: 8,
                      background: hi ? "var(--pill-bg)" : active ? "rgba(124, 58, 237, 0.12)" : "transparent",
                      color: "var(--text)",
                      font: "inherit",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ flexShrink: 0 }}>
                      <ComponentIcon icon={sample?.icon} size={28} title="" />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{categoryLabel(cat)}</span>
                      <span
                        style={{ display: "block", fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}
                        className="mono"
                      >
                        {cat}
                      </span>
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--cyan)",
                      }}
                    >
                      {n}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
