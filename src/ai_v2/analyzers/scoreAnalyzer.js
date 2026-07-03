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

/*
 * Detect hardcoded final output instead of computed result
 */
function detectHardcodedOutput(code, language) {
  const patterns = {
    python: [
      /^\s*print\s*\(\s*["']?\d+["']?\s*\)\s*$/m
    ],
    javascript: [
      /^\s*console\.log\s*\(\s*["']?\d+["']?\s*\)\s*;?\s*$/m
    ],
    java: [
      /^\s*System\.out\.println\s*\(\s*["']?\d+["']?\s*\)\s*;\s*$/m
    ],
    cpp: [
      /^\s*cout\s*<<\s*\d+\s*(<<\s*endl)?\s*;\s*$/m
    ],
    c: [
      /^\s*printf\s*\(\s*["']?\d+["']?\s*\)\s*;\s*$/m
    ]
  };

  const languagePatterns = patterns[language] || [];
  return languagePatterns.some((pattern) => pattern.test(code));
}

/*
 * Ignore false positive magic numbers
 */
function isFalsePositiveMagicNumber(issue, code) {
  if (
    issue.type !== "MAINTAINABILITY" ||
    issue.rule !== "magic-number"
  ) {
    return false;
  }

  const lines = code.split("\n");
  const line = lines[(issue.line || 1) - 1] || "";
  const trimmed = line.trim();

  const safePatterns = [
    /^[a-zA-Z_]\w*\s*=\s*\d+(\.\d+)?$/,
    /^[a-zA-Z_]\w*\s*,/,
    /range\s*\(\s*\d+\s*\)/,
    /for\s*\(.*\d+.*\)/,
    /^\s*print\s*\(\s*\d+\s*\)\s*$/
  ];

  return safePatterns.some((pattern) => pattern.test(trimmed));
}

/*
 * Detect business-logic magic numbers and GROUP them
 */
function detectMagicNumbers(code) {
  const lines = code.split("\n");
  const foundNumbers = [];
  let firstLine = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    const businessLogicPatterns = [
      /if\s+.*[<>!=]=?\s*\d+/,
      /[+\-*/]\s*\d+(\.\d+)?/,
      /=.*[+\-*/].*\d+/
    ];

    const matched = businessLogicPatterns.some((pattern) =>
      pattern.test(trimmed)
    );

    if (!matched) return;

    const matches = trimmed.match(/\b\d+(\.\d+)?\b/g);

    if (matches) {
      foundNumbers.push(...matches);

      if (firstLine === null) {
        firstLine = index + 1;
      }
    }
  });

  if (!foundNumbers.length) {
    return [];
  }

  const uniqueNumbers = [...new Set(foundNumbers)];

  return [
    {
      type: "MAINTAINABILITY",
      severity:
        uniqueNumbers.length >= 2 ? "MEDIUM" : "LOW",
      line: firstLine || 1,
      rule: "magic-number",
      message:
        `Hardcoded numeric literals (${uniqueNumbers.join(", ")}) ` +
        `are used directly in business logic. Replace them with named constants.`
    }
  ];
}

function validateIssues(issues = []) {
  if (!Array.isArray(issues)) return [];

  return issues
    .filter((issue) => issue && typeof issue === "object")
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

/*
 * Merge AI issues + deterministic rule issues
 */
function injectRuleBasedIssues(
  code,
  language,
  issues,
  correctness
) {
  let finalIssues = [...issues];

  /*
   * Remove false positive magic number reports
   */
  finalIssues = finalIssues.filter(
    (issue) =>
      !isFalsePositiveMagicNumber(issue, code)
  );

  /*
   * Hardcoded output detection
   */
  const alreadyHasHardcoded = finalIssues.some(
    (issue) => issue.rule === "hardcoded-output"
  );

  if (
    correctness?.isCorrect === false &&
    detectHardcodedOutput(code, language) &&
    !alreadyHasHardcoded
  ) {
    finalIssues.push({
      type: "LOGIC",
      severity: "HIGH",
      line: 1,
      rule: "hardcoded-output",
      message:
        "Code directly prints hardcoded output instead of computing required result."
    });
  }

  /*
   * Magic number detection (grouped)
   */
  const magicIssues = detectMagicNumbers(code);

  const alreadyHasMagic = finalIssues.some(
    (issue) => issue.rule === "magic-number"
  );

  if (!alreadyHasMagic && magicIssues.length) {
    finalIssues.push(magicIssues[0]);
  }

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

    const rawResponse = await askGeminiV2(prompt);
    const jsonText = extractJson(rawResponse);

    if (!jsonText) {
      throw new Error(
        "Failed to extract JSON from Gemini response"
      );
    }

    const parsed = JSON.parse(jsonText);

    let validatedIssues = validateIssues(
      parsed.issues || []
    );

    validatedIssues = injectRuleBasedIssues(
      code,
      language,
      validatedIssues,
      correctness
    );

    return {
      issues: validatedIssues,
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