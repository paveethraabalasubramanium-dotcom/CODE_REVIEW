import {
  RULE_CATEGORY,
  VALID_RULES,
  normalizeRuleName,
  normalizeSeverity,
  normalizeText
} from "../core/ruleRegistry.js";

function normalizeConfidence(value) {
  if (typeof value === "number") {
    if (value > 1) {
      return Math.min(1, value / 100);
    }
    if (value >= 0) {
      return Math.min(1, value);
    }
  }
  return 1;
}

export function normalizeIssues(issues = []) {
  return issues.map((issue) => {
    const normalizedRule = normalizeRuleName(issue);
    const normalizedSeverity = normalizeSeverity(issue.severity);
    const rawType = String(issue.type || issue.originalType || "UNKNOWN").toUpperCase();
    const derivedType = RULE_CATEGORY[normalizedRule] || rawType;
    const normalizedType = VALID_RULES[derivedType]
      ? derivedType
      : RULE_CATEGORY[normalizedRule] || "MAINTAINABILITY";

    return {
      ...issue,
      type: normalizedType,
      rule: normalizedRule,
      message: String(issue.message || issue.rule || "No description available"),
      severity: normalizedSeverity,
      line:
        typeof issue.line === "number"
          ? issue.line
          : Number(issue.line) || 0,
      sources: Array.isArray(issue.sources)
        ? [...new Set(issue.sources)]
        : issue.sources
        ? [issue.sources]
        : ["scanner"],
      confidence: normalizeConfidence(issue.confidence)
    };
  });
}
