const SEVERITY_PENALTIES = {
  CRITICAL: 20,
  HIGH: 15,
  MEDIUM: 8,
  LOW: 3
};

const SCORE_WEIGHTS = {
  bug: 0.20,
  logic: 0.50,
  performance: 0.15,
  maintainability: 0.15
};

function clamp(v) {
  return Math.max(0, Math.min(100, v));
}

export function calculateScores(input) {
  const issues = Array.isArray(input)
    ? input
    : input?.issues || [];

  let bug = 0;
  let logic = 0;
  let perf = 0;
  let maintain = 0;

  for (const issue of issues) {
    const penalty =
      SEVERITY_PENALTIES[issue.severity] || 0;

    if (issue.type === "BUG") bug += penalty;
    if (issue.type === "LOGIC") logic += penalty;
    if (issue.type === "PERFORMANCE") perf += penalty;
    if (issue.type === "MAINTAINABILITY") maintain += penalty;
  }

  const bugScore = clamp(100 - bug);
  const logicScore = clamp(100 - logic);
  const performanceScore = clamp(100 - perf);
  const maintainabilityScore = clamp(100 - maintain);

  const overallScore = clamp(
    Math.round(
      bugScore * SCORE_WEIGHTS.bug +
      logicScore * SCORE_WEIGHTS.logic +
      performanceScore * SCORE_WEIGHTS.performance +
      maintainabilityScore * SCORE_WEIGHTS.maintainability
    )
  );

  return {
    bugScore,
    logicScore,
    performanceScore,
    maintainabilityScore,
    overallScore
  };
}