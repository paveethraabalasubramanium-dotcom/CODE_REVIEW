import { askGeminiV2 } from "../geminiClientV2.js";

import { correctnessPrompt } from "../prompts/correctnessPrompt.js";

import { extractJson } from "../utils/extractJson.js";

export async function runCorrectnessCheck(

  code,

  question,

  language

) {

  try {

    const prompt = correctnessPrompt(

      question,

      code,

      language

    );

    const rawResponse = await askGeminiV2(prompt);

    console.log("Gemini Raw Correctness Response:");

    console.log(rawResponse);

    const jsonText = extractJson(rawResponse);

    if (!jsonText) {

      throw new Error(

        "Failed to extract JSON from Gemini response"

      );

    }

    const parsed = JSON.parse(jsonText);

    const isRelevant =

    typeof parsed.isRelevant === "boolean"

    ? parsed.isRelevant

    : false;

    const isCorrect =

    typeof parsed.isCorrect === "boolean"

    ? parsed.isCorrect

    : false;

    const reason =

    typeof parsed.reason === "string"

    ? parsed.reason

    : "No reason provided";

    return {

      isRelevant,

      isCorrect,

      reason,

      rawResponse

    };

  } catch (error) {

    console.error(

      "Correctness Analyzer Error:",


      error.message

    );

    throw error;

  }

}