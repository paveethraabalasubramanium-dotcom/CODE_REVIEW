import { detectLanguage } from "../core/languageDetector.js";

import { runCorrectnessCheck } from "../ai_v2/analyzers/correctnessAnalyzer.js";
import { runScoreAnalysis } from "../ai_v2/analyzers/scoreAnalyzer.js";

import { scoreEngine } from "./scoreEngine.js";
import { buildReport } from "./reportBuilder.js";

export async function runAnalysis(
  question,
  code,
  language = null
) {
  try {
    /*
     * STEP 1 — Detect language
     */
    const detectedLanguage =
      !language || language === "auto"
        ? detectLanguage(code)
        : language;

    console.log("Detected Language:", detectedLanguage);

    /*
     * STEP 2 — Correctness check
     */
    const correctness = await runCorrectnessCheck(
      question,
      code,
      detectedLanguage
    );

    console.log(
      "Correctness:",
      JSON.stringify(correctness, null, 2)
    );

    /*
     * Stop if answer irrelevant / wrong
     */
    if (
      !correctness.isRelevant ||
      !correctness.isCorrect
    ) {
      return {
        success: true,
        rejected: true,
        language: detectedLanguage,
        correctness,
        scores: {
          bugScore: 0,
          logicScore: 0,
          performanceScore: 0,
          maintainabilityScore: 0,
          overallScore: 0
        },
        issues: []
      };
    }

    /*
     * STEP 3 — Score analysis
     */
    const scoreResult = await runScoreAnalysis(
      question,
      code,
      detectedLanguage
    );

    const issues = scoreResult.issues || [];

    console.log(
      "Issues:",
      JSON.stringify(issues, null, 2)
    );

    /*
     * STEP 4 — Score calculation
     */
    const scores = scoreEngine({ issues });

    console.log("Scores:", scores);

    /*
     * STEP 5 — Final report
     */
    return buildReport({
      language: detectedLanguage,
      scores,
      issues,
      stats: {}
    });

  } catch (error) {
    console.error("Analysis Pipeline Error:", error);

    return {
      success: false,
      language: language || "unknown",
      scores: {
        bugScore: 0,
        logicScore: 0,
        performanceScore: 0,
        maintainabilityScore: 0,
        overallScore: 0
      },
      issues: [],
      error: {
        message: error.message,
        stack:
          process.env.NODE_ENV === "development"
            ? error.stack
            : undefined
      }
    };
  }
}