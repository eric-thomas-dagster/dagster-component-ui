import type { CSSProperties, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useCatalog } from "../context/CatalogContext";
import { ThemeToggle } from "./ThemeToggle";

type ExternalNavItem = { href: string; label: string };

const externalNav: ExternalNavItem[] = [
  { href: "https://docs.dagster.io", label: "Docs" },
  {
    href: "https://github.com/eric-thomas-dagster/dagster-component-templates",
    label: "GitHub",
  },
];

function navPillStyle(active: boolean): CSSProperties {
  return {
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: active ? "var(--text)" : "var(--text-muted)",
    background: active ? "rgba(124, 58, 237, 0.15)" : "transparent",
    textDecoration: "none",
    whiteSpace: "nowrap",
  };
}

export function Layout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const { openSearchPalette } = useCatalog();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          background: "var(--header-bg)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            to="/"
            aria-label="Eric's Dagster Component Registry home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              textDecoration: "none",
              color: "var(--text)",
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                flexWrap: "nowrap",
                alignItems: "center",
                gap: 0,
                whiteSpace: "nowrap",
                lineHeight: 1.2,
                minWidth: 0,
              }}
            >
              <span className="brand-name-eric brand-name-eric--masthead">Eric</span>
              <span
                style={{
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  fontSize: "clamp(12px, 2.1vw, 15px)",
                }}
              >
                &rsquo;s Dagster Component Registry
              </span>
            </span>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={() => openSearchPalette()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text-muted)",
                  fontSize: 14,
                  fontWeight: 500,
                }}
                title="Search catalog (⌘K)"
              >
                <Search size={16} strokeWidth={2} aria-hidden />
                <span>Search</span>
                <span className="kbd" style={{ marginLeft: 2 }}>
                  ⌘K
                </span>
              </button>
              <ThemeToggle />
            </div>
            <Link
              to="/examples"
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: loc.pathname.startsWith("/examples") ? "var(--text)" : "var(--text-muted)",
                background: loc.pathname.startsWith("/examples")
                  ? "rgba(124, 58, 237, 0.15)"
                  : "transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Examples
            </Link>
            <Link
              to="/get-started"
              style={navPillStyle(loc.pathname === "/get-started")}
              title="Install the CLI and add templates (uvx or pip)"
            >
              Get started
            </Link>
            <Link
              to="/ai-assistants"
              style={navPillStyle(loc.pathname === "/ai-assistants")}
              title="Claude, Cursor, GitHub Copilot — dagster-component init and workflows"
            >
              AI assistants
            </Link>
            <Link
              to="/dagster-plus"
              style={navPillStyle(loc.pathname === "/dagster-plus")}
              title="Deploy catalog components to Dagster+ (guide from the CLI repo)"
            >
              Dagster+
            </Link>
            {externalNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 24px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
            color: "var(--text-dim)",
            fontSize: 13,
          }}
        >
          <span>
            Data from{" "}
            <a href="https://github.com/eric-thomas-dagster/dagster-component-templates">
              dagster-component-templates
            </a>
            .
          </span>
          <span>Open source · MIT</span>
        </div>
      </footer>
    </div>
  );
}
