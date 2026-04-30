/**
 * Baselines for “works with” / install hints.
 * Primary path: dagster-community-components-cli (Git or uvx); it copies the template and installs pip deps.
 * Users still need Dagster in the environment for their code location.
 */

export const REGISTRY_DAGSTER_SPEC = ">=1.10.0";
export const REGISTRY_PYTHON_SPEC = ">=3.10";

export const COMMUNITY_CLI_REPO_WEB =
  "https://github.com/eric-thomas-dagster/dagster-community-components-cli";
export const COMMUNITY_CLI_PIP_GIT_SPEC =
  "git+https://github.com/eric-thomas-dagster/dagster-community-components-cli.git";
/** Not on PyPI yet; copy hints use this name once published. */
export const COMMUNITY_CLI_PYPI_PACKAGE = "dagster-community-components-cli";

export const UV_INSTALL_SHELL = "curl -LsSf https://astral.sh/uv/install.sh | sh";
export const UV_INSTALL_DOCS = "https://docs.astral.sh/uv/getting-started/installation/";

export const DAGSTER_PLUS_INSTALLER_TREE =
  "https://github.com/eric-thomas-dagster/dagster-component-templates/tree/main/assets/infrastructure/community_component_installer";

/** Placeholder on marketing/home copy—real pages substitute the manifest id. */
export const CLI_HOME_PLACEHOLDER_COMPONENT_ID = "your_component_id";

/** Dagster runtime remains a project prerequisite; not installed by the component CLI. */
export function pipInstallDagsterCore(): string {
  return `python -m pip install -U "dagster${REGISTRY_DAGSTER_SPEC}"`;
}

export const INSTALL_VERSION_NOTE =
  "Shown versions are catalog defaults—not pinned per-template. Align `dagster` with your deployment and Dagster docs for your release.";

export const INSTALL_PYPI_NOTE =
  "The CLI installs this component's declared pip dependencies; you still need Dagster in your environment for your code location—see above.";

export const ADD_SINGLE_COMPONENT_SUMMARY =
  "From your Dagster project root, run the dagster-component CLI once: it resolves the project, copies this template into the right folder, and installs its Python dependencies (no separate pip list step). Pick an install option below; uvx avoids pinning the CLI itself.";

export const CLI_YAML_LSP_CALLOUT =
  "The CLI prepends a `# yaml-language-server: $schema=<url>` comment to example.yaml—if you use the YAML language server (VS Code YAML extension, Cursor, Neovim yamlls) you get validation and hover against this template's schema without extra config.";

export const CLI_AI_INIT_CALLOUT =
  "Run dagster-component init in your repo to drop CLAUDE.md, .cursorrules, and .github/copilot-instructions.md so assistants favor dagster-component search / add instead of inventing components from scratch.";

export function cliOption1Uvx(componentId: string): string {
  return [
    "uvx --from git+https://github.com/eric-thomas-dagster/dagster-community-components-cli.git \\",
    `    dagster-component add ${componentId}`,
  ].join("\n");
}

export function cliOption2PipGit(componentId: string): string {
  return [`pip install ${COMMUNITY_CLI_PIP_GIT_SPEC}`, `dagster-component add ${componentId}`].join("\n");
}

/** PyPI path is forward-looking; first line is a comment so copy-paste is safe once published. */
export function cliOption3Pypi(componentId: string): string {
  return [
    "# Coming soon — package not on PyPI yet",
    `pip install ${COMMUNITY_CLI_PYPI_PACKAGE}`,
    `dagster-component add ${componentId}`,
  ].join("\n");
}

export type CliExtraCommand = { command: string; detail: string };

/** Detail page: CLI commands with this component’s id where it helps. */
export function cliExtraCommandsForComponent(componentId: string): CliExtraCommand[] {
  return [
    { command: "dagster-component search <keyword>", detail: "Find a component in the catalog." },
    { command: `dagster-component info ${componentId}`, detail: "Show details and URLs for this component." },
    { command: `dagster-component schema ${componentId}`, detail: "Print attribute schema—useful for AI assistants." },
    {
      command: `dagster-component add ${componentId}@v1.2.0`,
      detail: "Install pinned to a tag, commit, or branch (example ref).",
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
