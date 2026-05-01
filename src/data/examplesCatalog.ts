/** Canonical URLs for examples in dagster-community-components-cli (manifest lives in-repo). */

export const COMMUNITY_CLI_EXAMPLES_RAW_BASE =
  "https://raw.githubusercontent.com/eric-thomas-dagster/dagster-community-components-cli/main/examples";

/** Index for the demos folder — table of demos, how to run scripts, rationale. */
export const COMMUNITY_CLI_EXAMPLES_INDEX_README_URL = `${COMMUNITY_CLI_EXAMPLES_RAW_BASE}/README.md`;

/** Human-friendly browse URL (folder on GitHub). */
export const COMMUNITY_CLI_EXAMPLES_TREE_WEB =
  "https://github.com/eric-thomas-dagster/dagster-community-components-cli/tree/main/examples";

export function exampleSetupScriptCurl(slug: string): string {
  return `curl -fsSL ${COMMUNITY_CLI_EXAMPLES_RAW_BASE}/setup_${slug}_demo.sh | bash`;
}
