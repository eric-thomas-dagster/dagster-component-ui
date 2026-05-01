/** Demo pipelines shipped with dagster-community-components-cli (see repo examples/). */

export const COMMUNITY_CLI_EXAMPLES_RAW_BASE =
  "https://raw.githubusercontent.com/eric-thomas-dagster/dagster-community-components-cli/main/examples";

export type ExampleDemoMeta = {
  slug: string;
  title: string;
  oneLiner: string;
  pipeline: string;
};

export const EXAMPLE_DEMOS: ExampleDemoMeta[] = [
  {
    slug: "titanic",
    title: "Titanic — descriptive analytics",
    oneLiner: "Filter, summarize, write a CSV report",
    pipeline: "csv → filter → summarize → csv",
  },
  {
    slug: "penguins",
    title: "Palmer Penguins — ML feature engineering",
    oneLiner: "Impute, encode, scale, write Parquet",
    pipeline: "csv → impute → onehot → scale → parquet",
  },
  {
    slug: "earthquakes",
    title: "USGS Earthquakes — REST + JSON pipeline",
    oneLiner: "Flatten nested GeoJSON, sort, write JSONL",
    pipeline: "rest → flatten → select → sort → json",
  },
  {
    slug: "partitioned_earthquakes",
    title: "Earthquakes (partitioned) — daily backfillable",
    oneLiner: "Same shape, daily partitions",
    pipeline: "rest → flatten → select → sort → json (×daily)",
  },
  {
    slug: "spacex",
    title: "SpaceX Launches — datetime + ranking + Excel",
    oneLiner: "Parse dates, rank newest-first, write Excel",
    pipeline: "rest → select → datetime → rank → excel",
  },
  {
    slug: "countries",
    title: "REST Countries — formula + summarize + JSON",
    oneLiner: "Density per country, rolled up by region",
    pipeline: "rest → formula → summarize → json",
  },
  {
    slug: "weather",
    title: "NYC Weather — running totals + transpose + CSV",
    oneLiner: "Cumulative precip pivoted by date",
    pipeline: "rest → datetime → running_total → transpose → csv",
  },
  {
    slug: "releases",
    title: "Dagster GitHub Releases — filter + sort + Parquet",
    oneLiner: "Stable releases, newest-first, Parquet",
    pipeline: "rest → select → datetime → filter → sort → parquet",
  },
];

export function exampleMarkdownUrl(slug: string): string {
  return `${COMMUNITY_CLI_EXAMPLES_RAW_BASE}/${slug}.md`;
}

export function exampleSetupScriptCurl(slug: string): string {
  return `curl -fsSL ${COMMUNITY_CLI_EXAMPLES_RAW_BASE}/setup_${slug}_demo.sh | bash`;
}

export function getExampleBySlug(slug: string): ExampleDemoMeta | undefined {
  return EXAMPLE_DEMOS.find((d) => d.slug === slug);
}
