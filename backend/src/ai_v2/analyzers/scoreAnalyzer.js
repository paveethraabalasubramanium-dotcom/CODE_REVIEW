import { askGeminiV2 } from "../geminiClientV2.js";
import { scoringPrompt } from "../prompts/scoringPrompt.js";
import { extractJson } from "../utils/extractJson.js";

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

function validateIssues(issues = []) {
  if (!Array.isArray(issues)) return [];

  return issues
    .filter(Boolean)
    .map((issue) => ({
      type: VALID_TYPES.includes(issue.type)
        ? issue.type
        : "BUG",

      severity: VALID_SEVERITIES.includes(issue.severity)
        ? issue.severity
        : "LOW",

      line:
        typeof issue.line === "number"
          ? issue.line
          : 1,

      rule:
        typeof issue.rule === "string"
          ? issue.rule
          : "unknown-rule",

      message:
        typeof issue.message === "string"
          ? issue.message
          : "No explanation provided"
    }));
}

/* ---------- LOOP DETECTION ---------- */

function detectNestedLoops(code) {
  const lines = code.split("\n");

  let depth = 0;
  let maxDepth = 0;
  let firstLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const isLoop =
      /^for\s*\(/.test(line) ||
      /^while\s*\(/.test(line) ||
      /^for\s+/.test(line) ||
      /^while\s+/.test(line);

    if (isLoop) {
      depth++;

      if (depth > maxDepth) {
        maxDepth = depth;
        firstLine = i + 1;
      }
    }

    if (line.includes("}")) {
      depth = Math.max(0, depth - 1);
    }
  }

  if (maxDepth >= 3) {
    return [{
      type: "PERFORMANCE",
      severity: "HIGH",
      line: firstLine,
      rule: "o-n-cube",
      message:
        "Triple nested loops detected. Estimated O(n³) complexity."
    }];
  }

  if (maxDepth >= 2) {
    return [{
      type: "PERFORMANCE",
      severity: "MEDIUM",
      line: firstLine,
      rule: "o-n-square",
      message:
        "Nested loops detected. Estimated O(n²) complexity."
    }];
  }

  return [];
}

/* ---------- RECURSION DETECTION ---------- */

function detectRecursion(code) {
  const functionDefs = [
    /function\s+([a-zA-Z_]\w*)\s*\(/g,
    /def\s+([a-zA-Z_]\w*)\s*\(/g,
    /\b(?:int|void|float|double|long|char|bool|string)\s+([a-zA-Z_]\w*)\s*\(/gi
  ];

  const functionNames = [];

  for (const regex of functionDefs) {
    let match;
    while ((match = regex.exec(code)) !== null) {
      functionNames.push(match[1]);
    }
  }

  for (const name of functionNames) {
    const callRegex = new RegExp(
      `\\b${name}\\s*\\(`,
      "g"
    );

    const matches = code.match(callRegex) || [];

    if (matches.length >= 2) {
      return [{
        type: "PERFORMANCE",
        severity: "MEDIUM",
        line: 1,
        rule: "recursive-overhead",
        message:
          "Recursive implementation may cause stack overhead."
      }];
    }
  }

  return [];
}

/* ---------- DEDUP ---------- */

function normalizePerformanceIssues(issues) {
  const performance = issues.filter(
    i => i.type === "PERFORMANCE"
  );

  const others = issues.filter(
    i => i.type !== "PERFORMANCE"
  );

  const hasCube = performance.some(
    i => i.rule === "o-n-cube"
  );

  if (hasCube) {
    return [
      ...others,
      ...performance.filter(
        i => i.rule === "o-n-cube"
      )
    ];
  }

  return issues;
}

function dedupeIssues(issues) {
  return issues.filter(
    (issue, index, arr) =>
      index ===
      arr.findIndex(
        x =>
          x.type === issue.type &&
          x.rule === issue.rule
      )
  );
}

function injectRuleBasedIssues(code, issues) {
  let finalIssues = [...issues];

  const performanceIssues = [
    ...detectNestedLoops(code),
    ...detectRecursion(code)
  ];

  for (const issue of performanceIssues) {
    const exists = finalIssues.some(
      x => x.rule === issue.rule
    );

    if (!exists) {
      finalIssues.push(issue);
    }
  }

  finalIssues =
    normalizePerformanceIssues(finalIssues);

  finalIssues =
    dedupeIssues(finalIssues);

  return finalIssues;
}

export async function runScoreAnalysis(
  code,
  language,
  correctness
) {
  try {
    const prompt = scoringPrompt(
      code,
      language,
      correctness
    );

    const rawResponse =
      await askGeminiV2(prompt);

    const jsonText =
      extractJson(rawResponse);

    if (!jsonText) {
      throw new Error(
        "Failed to extract JSON"
      );
    }

    const parsed =
      JSON.parse(jsonText);

    let issues =
      validateIssues(parsed.issues || []);

    issues =
      injectRuleBasedIssues(code, issues);

    return {
      issues,
      rawResponse
    };
  } catch (error) {
    console.error(
      "Score Analyzer Error:",
      error.message
    );
    throw error;
  }
}
