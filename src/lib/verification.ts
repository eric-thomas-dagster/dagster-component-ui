import type {
  ManifestComponent,
  ManifestValidation,
  ManifestValidationLevel,
  VerificationStatus,
} from "../types";

export type VerificationTone = "neutral" | "positive" | "caution" | "negative";

export type ResolvedVerification = {
  status: VerificationStatus;
  label: string;
  shortLabel: string;
  tone: VerificationTone;
  checkedAt?: string;
  /** How to label the date line on component detail */
  checkedAtKind?: "verification" | "validation";
  notes?: string;
};

function trimDate(v: ManifestValidation): string | undefined {
  return (
    v.last_validated?.trim() ||
    v.last_validated_at?.trim() ||
    undefined
  );
}

function validationLevelPresentation(level: ManifestValidationLevel): {
  status: VerificationStatus;
  shortLabel: string;
  labelBase: string;
  tone: VerificationTone;
} {
  switch (level) {
    case "code":
      return {
        status: "validated_code",
        shortLabel: "Code OK",
        labelBase:
          "Catalog validation at code level (schema, codegen, or CI). Treat as recorded assurance—not a substitute for your own env checks.",
        tone: "positive",
      };
    case "infra":
      return {
        status: "validated_infra",
        shortLabel: "Infra OK",
        labelBase:
          "Catalog validation at infrastructure level (deploy wiring, integration checks, or similar).",
        tone: "positive",
      };
    case "live":
      return {
        status: "validated_live",
        shortLabel: "Live OK",
        labelBase:
          "Catalog validation in a live or staging environment.",
        tone: "positive",
      };
    default: {
      const _x: never = level;
      return _x;
    }
  }
}

export function resolveVerification(c: ManifestComponent): ResolvedVerification {
  const v = c.verification;
  const notes = v?.notes?.trim() || undefined;
  const checkedAtVerification = v?.checked_at?.trim() || undefined;

  /** `not_recorded` must not hide a newer `validation` block on the same row. */
  if (v?.status === "known_issue") {
    return {
      status: "known_issue",
      label: "A known problem is recorded—read notes and avoid for new work until fixed.",
      shortLabel: "Known issue",
      tone: "negative",
      checkedAt: checkedAtVerification,
      checkedAtKind: checkedAtVerification ? "verification" : undefined,
      notes,
    };
  }

  if (
    v?.status &&
    v.status !== "not_recorded"
  ) {
    const checkedAt = checkedAtVerification;
    switch (v.status) {
      case "ci_smoke":
        return {
          status: "ci_smoke",
          label: "A CI smoke test or automated check is recorded for this template.",
          shortLabel: "CI checked",
          tone: "positive",
          checkedAt,
          checkedAtKind: checkedAt ? "verification" : undefined,
          notes,
        };
      case "manual_spot_check":
        return {
          status: "manual_spot_check",
          label: "Someone manually spot-checked this template (see notes when present).",
          shortLabel: "Manual check",
          tone: "positive",
          checkedAt,
          checkedAtKind: checkedAt ? "verification" : undefined,
          notes,
        };
      case "community_reported_working":
        return {
          status: "community_reported_working",
          label: "Community feedback indicates this template worked in at least one real setup.",
          shortLabel: "Community OK",
          tone: "positive",
          checkedAt,
          checkedAtKind: checkedAt ? "verification" : undefined,
          notes,
        };
      default:
        break;
    }
  }

  const val = c.validation;
  const level = val?.level;
  if (
    val &&
    (level === "code" || level === "infra" || level === "live")
  ) {
    const { status, shortLabel, labelBase, tone } = validationLevelPresentation(level);
    const checkedAt = trimDate(val);
    return {
      status,
      label: labelBase,
      shortLabel,
      tone,
      checkedAt,
      checkedAtKind: checkedAt ? "validation" : undefined,
      notes,
    };
  }

  if (v?.status === "not_recorded") {
    return {
      status: "not_recorded",
      label:
        "Verification is explicitly marked as not recorded. Assume untested until you validate it.",
      shortLabel: "Unverified",
      tone: "neutral",
      checkedAt: checkedAtVerification,
      checkedAtKind: checkedAtVerification ? "verification" : undefined,
      notes,
    };
  }

  const checkedAtLegacy = checkedAtVerification;
  return {
    status: "not_recorded",
    label:
      "This template is not marked as tested by the catalog. Treat it as community-maintained: validate in your project before production.",
    shortLabel: "Unverified",
    tone: "neutral",
    checkedAt: checkedAtLegacy,
    checkedAtKind: checkedAtLegacy ? "verification" : undefined,
    notes,
  };
}

function isPositiveTrustStatus(s: VerificationStatus | undefined): boolean {
  if (!s || s === "not_recorded") return false;
  if (s === "known_issue") return false;
  return true;
}

export function countVerificationBreakdown(components: ManifestComponent[]): {
  total: number;
  withPositiveSignal: number;
  knownIssues: number;
  withAnyMetadata: number;
} {
  let withPositiveSignal = 0;
  let knownIssues = 0;
  let withAnyMetadata = 0;

  for (const c of components) {
    const resolved = resolveVerification(c);
    const s = resolved.status;
    if (s !== "not_recorded") withAnyMetadata += 1;
    if (isPositiveTrustStatus(s)) withPositiveSignal += 1;
    if (s === "known_issue") knownIssues += 1;
  }

  return {
    total: components.length,
    withPositiveSignal,
    knownIssues,
    withAnyMetadata,
  };
}

export function communityHelpfulCount(c: ManifestComponent): number {
  const n = c.community_signals?.helpful_count;
  if (typeof n !== "number" || n < 0) return 0;
  return Math.floor(n);
}

/** URL `?trust=` values; empty means no filter. */
export type TrustUrlFilter = "" | "live" | "infra" | "code" | "validated" | "verified" | "issue";

export function normalizeTrustFilterParam(raw: string | null | undefined): TrustUrlFilter {
  const v = (raw ?? "").trim().toLowerCase();
  if (v === "live" || v === "infra" || v === "code" || v === "validated" || v === "verified" || v === "issue") {
    return v;
  }
  return "";
}

export function componentMatchesTrustUrlFilter(c: ManifestComponent, filter: TrustUrlFilter): boolean {
  if (!filter) return true;
  const { status } = resolveVerification(c);
  switch (filter) {
    case "live":
      return status === "validated_live";
    case "infra":
      return status === "validated_infra";
    case "code":
      return status === "validated_code";
    case "validated":
      return (
        status === "validated_live" || status === "validated_infra" || status === "validated_code"
      );
    case "verified":
      return status !== "not_recorded" && status !== "known_issue";
    case "issue":
      return status === "known_issue";
    default:
      return true;
  }
}

export function trustFilterHeading(filter: TrustUrlFilter): string {
  switch (filter) {
    case "live":
      return "Live OK";
    case "infra":
      return "Infra OK";
    case "code":
      return "Code OK";
    case "validated":
      return "Validated (code / infra / live)";
    case "verified":
      return "With trust signal";
    case "issue":
      return "Known issue";
    default:
      return "";
  }
}

/** Home hero + search palette: filter catalog by resolved verification / validation tier. */
export const TRUST_FILTER_CHIPS: { trust: Exclude<TrustUrlFilter, "">; label: string; hint: string }[] = [
  { trust: "live", label: "Live OK", hint: "validation.level live" },
  { trust: "infra", label: "Infra OK", hint: "validation.level infra" },
  { trust: "code", label: "Code OK", hint: "validation.level code" },
  { trust: "validated", label: "Any validated", hint: "Code, Infra, or Live OK" },
  { trust: "verified", label: "Any verified", hint: "CI, manual, community, or validated tier" },
  { trust: "issue", label: "Known issues", hint: "Manifest known_issue" },
];
