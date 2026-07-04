const VALID_TYPES = [
  "BUG",
  "LOGIC",
  "PERFORMANCE",
  "MAINTAINABILITY"
];

const VALID_SEVERITIES = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW"
];

function removeDuplicateIssues(issues) {
  return issues.filter(
    (issue, index, arr) =>
      index ===
      arr.findIndex(
        (x) =>
          x.type === issue.type &&
          x.rule === issue.rule
      )
  );
}

function normalizePerformanceConflicts(issues) {
  const performanceIssues = issues.filter(
    (issue) => issue.type === "PERFORMANCE"
  );

  const others = issues.filter(
    (issue) => issue.type !== "PERFORMANCE"
  );

  const hasCube = performanceIssues.some(
    (issue) => {
      const msg = issue.message.toLowerCase();

      return (
        issue.rule === "o-n-cube" ||
        issue.rule === "nested-loops-complexity" ||
        msg.includes("o(n^3)") ||
        msg.includes("o(n³)")
      );
    }
  );

  if (!hasCube) return issues;

  const filtered = performanceIssues.filter(
    (issue) => {
      const msg = issue.message.toLowerCase();

      const isSquare =
        issue.rule === "o-n-square" ||
        msg.includes("o(n^2)") ||
        msg.includes("o(n²)");

      const isFalseRecursion =
        issue.rule === "recursive-overhead";

      return !(isSquare || isFalseRecursion);
    }
  );

  return [...others, ...filtered];
}

export function normalizeIssues(issues = []) {
  if (!Array.isArray(issues)) return [];

  let normalized = issues.map((issue) => {
    const type = String(
      issue?.type || "UNKNOWN"
    ).toUpperCase();

    const severity = String(
      issue?.severity || "LOW"
    ).toUpperCase();

    return {
      type: VALID_TYPES.includes(type)
        ? type
        : "UNKNOWN",

      severity: VALID_SEVERITIES.includes(severity)
        ? severity
        : "LOW",

      line:
        Number.isInteger(issue?.line) &&
        issue.line > 0
          ? issue.line
          : 1,

      rule:
        typeof issue?.rule === "string"
          ? issue.rule
          : "unknown-rule",

      message:
        typeof issue?.message === "string"
          ? issue.message
          : "No message provided"
    };
  });

  normalized =
    removeDuplicateIssues(normalized);

  normalized =
    normalizePerformanceConflicts(normalized);

  return normalized;
}