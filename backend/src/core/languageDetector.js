const LANGUAGE_PATTERNS = {
  javascript: [
    /\b(const|let|var)\b/,
    /console\.log/,
    /\bfunction\b/,
    /=>/,
    /\brequire\s*\(/,
    /\bimport\b/,
    /\bexport\b/,
    /\basync\b/,
    /\bawait\b/,
    /\{\s*$/
  ],

  python: [
    /\bdef\b/,
    /\bimport\b/,
    /\bprint\s*\(/,
    /\bfor\s+\w+\s+in\s+range\s*\(/,
    /\bwhile\b/,
    /\bif\b.*:/,
    /\belif\b.*:/,
    /\belse\s*:/,
    /\breturn\b/,
    /=\s*input\s*\(/
  ],

  java: [
    /\bpublic\s+class\b/,
    /\bpublic\s+static\s+void\s+main\b/,
    /\bSystem\.out\.println\b/,
    /\bScanner\b/,
    /\bString\b/,
    /\bnew\b/
  ],

  cpp: [
    /#include\s*<iostream>/,
    /#include\s*<vector>/,
    /\bstd::/,
    /\bcout\s*<</,
    /\bcin\s*>>/,
    /\busing\s+namespace\s+std/
  ],

  c: [
    /#include\s*<stdio\.h>/,
    /#include\s*<stdlib\.h>/,
    /\bprintf\s*\(/,
    /\bscanf\s*\(/,
    /\bmalloc\s*\(/,
    /\bfree\s*\(/,
    /\bint\s+main\s*\(/
  ]
};

function scoreLanguage(code, patterns) {
  let score = 0;

  for (const pattern of patterns) {
    if (pattern.test(code)) {
      score++;
    }
  }

  return score;
}

export function detectLanguage(code = "") {
  if (!code || typeof code !== "string") {
    return "unknown";
  }

  let bestLanguage = "unknown";
  let bestScore = 0;

  for (const [language, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    const score = scoreLanguage(code, patterns);

    if (score > bestScore) {
      bestScore = score;
      bestLanguage = language;
    }
  }

  return bestScore >= 1 ? bestLanguage : "unknown";
}

export function detectLanguageDetailed(code = "") {
  const candidates = {};

  for (const [language, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    candidates[language] = scoreLanguage(code, patterns);
  }

  return {
    language: detectLanguage(code),
    candidates
  };
}