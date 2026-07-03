export function buildReport({
  language,
  scores,
  issues,
  stats
}) {

  const severitySummary = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };

  for (const issue of issues) {

    if (
      severitySummary[
        issue.severity
      ] !== undefined
    ) {
      severitySummary[
        issue.severity
      ]++;
    }

  }

  return {
    language,

    scores,

    issues,

    complexity: {
      totalLines:
        stats?.totalLines || 0,

      codeLines:
        stats?.codeLines || 0,

      functions:
        stats?.functions || 0,

      loops:
        stats?.loops || 0,

      conditionals:
        stats?.conditionals || 0
    },

    summary: {
      totalIssues:
        issues.length,

      severitySummary
    }
  };
}