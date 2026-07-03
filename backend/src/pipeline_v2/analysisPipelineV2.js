import { detectLanguage } from "../core/languageDetector.js";
import { runCorrectnessCheck } from "../ai_v2/analyzers/correctnessAnalyzer.js";
import { runScoreAnalysis } from "../ai_v2/analyzers/scoreAnalyzer.js";
import { calculateScores } from "../engine/scoreEngine.js";
import { buildReport } from "../engine/reportBuilder.js";

export async function runAnalysisV2(
  code,
  question,
  language = null
) {
  try {
    if (!code || typeof code !== "string") {
      throw new Error("Invalid source code");
    }

    if (!question || typeof question !== "string") {
      throw new Error("Question is required");
    }

    /*
     * STEP 1 — Language Detection
     */
    const detectedLanguage =
      !language || language === "auto"
        ? detectLanguage(code)
        : language;

    console.log("Detected Language:", detectedLanguage);

    /*
     * STEP 2 — Correctness Validation
     */
    const correctness = await runCorrectnessCheck(
      code,
      question,
      detectedLanguage
    );

    console.log(
      "Correctness Result:",
      JSON.stringify(correctness, null, 2)
    );

    /*
     * Reject ONLY irrelevant submissions
     */
    if (correctness.isRelevant === false) {
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
     * STEP 3 — Score Analysis
     */
    const aiAnalysis = await runScoreAnalysis(
      code,
      detectedLanguage,
      correctness
    );

    const issues = Array.isArray(aiAnalysis?.issues)
      ? aiAnalysis.issues
      : [];

    console.log(
      "AI Issues:",
      JSON.stringify(issues, null, 2)
    );

    /*
     * STEP 4 — Score Calculation
     */
    const scores = calculateScores({ issues });

    console.log(
      "Scores:",
      JSON.stringify(scores, null, 2)
    );

    /*
     * STEP 5 — Build Report
     */
    const report = buildReport({
      language: detectedLanguage,
      scores,
      issues,
      stats: {}
    });

    return {
      success: true,
      rejected: false,
      correctness,
      ...report,
      aiResponse: aiAnalysis.rawResponse || null
    };
  } catch (error) {
    console.error(
      "Analysis Pipeline V2 Error:",
      error
    );

    return {
      success: false,
      rejected: false,
      error: error.message,
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
}