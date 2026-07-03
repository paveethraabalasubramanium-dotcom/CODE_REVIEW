import { runAnalysisV2 } from "../../pipeline_v2/analysisPipelineV2.js";

export async function analyzeCode(req, res) {
  try {
    const {
      question,
      code,
      language
    } = req.body;

    /*
     * Validate question
     */
    if (
      !question ||
      typeof question !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    /*
     * Validate code
     */
    if (
      !code ||
      typeof code !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Code is required"
      });
    }

    /*
     * Run analysis
     */
    const report =
      await runAnalysisV2(
         code,
         question,
        language
      );

    return res.status(200).json(report);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Analysis failed",
      error: error.message
    });
  }
}