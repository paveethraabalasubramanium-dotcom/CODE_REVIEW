export function normalizeIssues(issues = []) {
  return issues.map((issue) => {
    return {
      type: issue.type || "UNKNOWN",
      severity: (issue.severity || "LOW").toUpperCase(),
      line: issue.line || 1,
      rule: issue.rule || "unknown-rule",
      message: issue.message || "No message provided"
    };
  });
}