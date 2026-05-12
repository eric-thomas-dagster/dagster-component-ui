/**
 * Baselines for “works with” / install hints.
 * **dagster-community-components-cli** is on PyPI; it installs **dagster-component** (search, info, add, schema, …).
 * Users still need Dagster in the environment for their code location.
 */

export const COMMUNITY_CLI_VALUE_PROP =
  "The dagster-community-components-cli package installs the dagster-component program on your PATH. add is one subcommand—the same binary includes search, info, schema, list, update, remove, init, and other helpers built for this registry (see the CLI README and each component page).";

export const REGISTRY_DAGSTER_SPEC = ">=1.10.0";
export const REGISTRY_PYTHON_SPEC = ">=3.10";

export const COMMUNITY_CLI_REPO_WEB =
  "https://github.com/eric-thomas-dagster/dagster-community-components-cli";
/** Maintainer docs; avoid duplicating install ladders on this site. */
export const COMMUNITY_CLI_README_WEB =
  "https://github.com/eric-thomas-dagster/dagster-community-components-cli/blob/main/README.md";

export const COMMUNITY_CLI_PYPI_PACKAGE = "dagster-community-components-cli";

export const UV_INSTALL_SHELL = "curl -LsSf https://astral.sh/uv/install.sh | sh";
export const UV_INSTALL_DOCS = "https://docs.astral.sh/uv/getting-started/installation/";

/** In-app copy: setup scripts and snippets often call uvx, which is not installed via pip or Dagster alone. */
export const UVX_REQUIRES_UV_EXPLAINER =
  "uvx ships with uv (Astral). Install uv first if a command or demo script uses uvx—otherwise you will see “uvx: command not found”.";

/** Follow-up: avoid uv entirely by installing the CLI from PyPI. */
export const UVX_ALTERNATIVE_PIP_CLI =
  "Or skip uv: pip install dagster-community-components-cli, then run dagster-component … instead of uvx.";

export const COMMUNITY_INSTALLER_TEMPLATE_TREE =
  "https://github.com/eric-thomas-dagster/dagster-component-templates/tree/main/assets/infrastructure/community_component_installer";

/** Copy for the CommunityComponentInstallerComponent tip (local / YAML-driven; not a Dagster+–only UI). */
export const COMMUNITY_INSTALLER_CALLOUT =
  "CommunityComponentInstallerComponent is a normal catalog template: add it with dagster-component add or copy the folder, then configure YAML to pull other registry components at materialization or refresh. Pin versions with id@ref. There is no Dagster+–exclusive installer UI yet—you run this locally like any other component.";

/** @deprecated use COMMUNITY_INSTALLER_TEMPLATE_TREE */
export const DAGSTER_PLUS_INSTALLER_TREE = COMMUNITY_INSTALLER_TEMPLATE_TREE;

/** Placeholder on marketing/home copy—real pages substitute the manifest id. */
export const CLI_HOME_PLACEHOLDER_COMPONENT_ID = "your_component_id";

/** Single copy block: uvx one-liner + pip install + add (PyPI). */
export function canonicalInstallSnippet(componentIdPlaceholder: string): string {
  return [
    "# Zero-install (recommended) — needs uv on PATH so uvx exists:",
    `uvx --from ${COMMUNITY_CLI_PYPI_PACKAGE} dagster-component add ${componentIdPlaceholder}`,
    "",
    "# Or install the CLI permanently:",
    `pip install ${COMMUNITY_CLI_PYPI_PACKAGE}`,
    `dagster-component add ${componentIdPlaceholder}`,
  ].join("\n");
}

export type CliQuickRefLine = { command: string; note: string };

/** Shown under the canonical install on Home. */
export const CLI_QUICK_REFERENCE_LINES: CliQuickRefLine[] = [
  { command: "dagster-component search <query>", note: "Find by id / name / description / tags." },
  { command: "dagster-component info <id>", note: "Details before installing." },
  { command: "dagster-component add <id>", note: "Install into the current project." },
  { command: "dagster-component add <id>@v1.2.0", note: "Pin to a tag." },
  { command: "dagster-component add <id>@a1b2c3d", note: "Pin to a commit SHA." },
];

/** Dagster runtime remains a project prerequisite; not installed by the component CLI. */
export function pipInstallDagsterCore(): string {
  return `python -m pip install -U "dagster${REGISTRY_DAGSTER_SPEC}"`;
}

export const INSTALL_VERSION_NOTE =
  "Shown versions are catalog defaults—not pinned per-template. Align `dagster` with your deployment and Dagster docs for your release.";

export const INSTALL_PYPI_NOTE =
  "The CLI installs this component's declared pip dependencies; you still need Dagster in your environment for your code location—see above.";

export const ADD_SINGLE_COMPONENT_SUMMARY =
  "From your Dagster code-location root, run dagster-component add with this template's id (PyPI package dagster-community-components-cli, or uvx without installing). The CLI copies the template and installs declared pip dependencies. Full options and workflows are in the CLI README—link below.";

export const CLI_YAML_LSP_CALLOUT =
  "The CLI prepends a `# yaml-language-server: $schema=<url>` comment to example.yaml—if you use the YAML language server (VS Code YAML extension, Cursor, Neovim yamlls) you get validation and hover against this template's schema without extra config.";

export const CLI_AI_INIT_CALLOUT =
  "Run uvx --from dagster-community-components-cli dagster-component init from your project root to drop CLAUDE.md, .cursorrules, and .github/copilot-instructions.md so assistants favor dagster-component search / add instead of inventing components from scratch.";

/** Preamble for pages that list bare `dagster-component <subcommand>` quick reference lines. */
export const CLI_QUICK_COMMANDS_UVX_PREAMBLE =
  "These all run as uvx --from dagster-community-components-cli dagster-component <subcommand>, or as plain dagster-component <subcommand> if you've installed the CLI globally (pip install dagster-community-components-cli).";

/** One-liner for component detail and examples. */
export function cliUvxAddOneLine(componentId: string): string {
  return `uvx --from ${COMMUNITY_CLI_PYPI_PACKAGE} dagster-component add ${componentId}`;
}

export function cliOption1Uvx(componentId: string): string {
  return cliUvxAddOneLine(componentId);
}

/** Home / AI section: bootstrap assistant config without pip-installing the CLI. */
export function cliOption1UvxInit(): string {
  return `uvx --from ${COMMUNITY_CLI_PYPI_PACKAGE} dagster-component init`;
}

/** Permanent install + add (two lines). */
export function cliPipInstallThenAdd(componentId: string): string {
  return [`pip install ${COMMUNITY_CLI_PYPI_PACKAGE}`, `dagster-component add ${componentId}`].join("\n");
}

export type CliExtraCommand = { command: string; detail: string };

/** Detail page: CLI commands with this component’s id where it helps. */
export function cliExtraCommandsForComponent(componentId: string): CliExtraCommand[] {
  return [
    { command: `dagster-component search <query>`, detail: "Find by id, name, description, or tags." },
    { command: `dagster-component info ${componentId}`, detail: "Details and URLs for this component." },
    { command: `dagster-component schema ${componentId}`, detail: "Print attribute schema—useful for AI assistants." },
    { command: `dagster-component add ${componentId}`, detail: "Install into the current project." },
    {
      command: `dagster-component add ${componentId}@v1.2.0`,
      detail: "Pin to a tag, branch, or commit ref.",
    },
    { command: "dagster-component list", detail: "List components installed in the current project." },
    {
      command: `dagster-component update ${componentId}`,
      detail: "Re-fetch the latest template files for this component.",
    },
    { command: `dagster-component remove ${componentId}`, detail: "Remove this component from the project." },
  ];
}

export function pipInstallTemplatePackages(pip: string[]): string {
  if (!pip.length) return "";
  return `pip install ${pip.map((p) => `"${p}"`).join(" ")}`;
}

export function buildInstallBundle(
  pip: string[] | undefined,
  opts?: { componentPath?: string; hasRequirementsFile?: boolean }
): {
  coreInstall: string;
  templateInstall: string | null;
  copyAll: string;
  fullGuide: string;
} {
  const coreInstall = pipInstallDagsterCore();
  const templateInstall = pip?.length ? pipInstallTemplatePackages(pip) : null;

  const relPath = opts?.componentPath ?? "path/to/component";

  const copyAll = templateInstall
    ? `${coreInstall}\n\n# Template-specific packages (from manifest)\n${templateInstall}`
    : `${coreInstall}\n\n# No extra pip packages listed in the manifest for this template.`;

  const lines = [
    "# --- Advanced: manual copy (no dagster-component CLI) ---",
    "# Install Dagster + template deps, then copy the folder from GitHub into defs/components/ (or use tiged below).",
    "",
    "# --- Dagster ---",
    coreInstall,
    "",
    "# --- Copy this folder from a templates repo checkout ---",
    `# cp -r dagster-component-templates/${relPath} ./defs/components/`,
  ];
  if (opts?.hasRequirementsFile) {
    lines.push(
      "",
      "# --- Or install from requirements.txt after copying ---",
      "# pip install -r defs/components/<your-folder>/requirements.txt"
    );
  }
  if (templateInstall) {
    lines.push("", "# --- Same deps as one pip line (from manifest) ---", templateInstall);
  } else {
    lines.push("", "# (No extra pip lines in manifest — add what your code needs.)");
  }

  const fullGuide = lines.join("\n");

  return { coreInstall, templateInstall, copyAll, fullGuide };
}
