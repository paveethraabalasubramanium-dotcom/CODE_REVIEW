import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

console.log("Gemini key loaded:", apiKey ? "YES" : "NO");

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_NAME = "gemini-2.5-flash";

export async function askGeminiV2(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME
    });

    const result = await model.generateContent({
  contents: [
    {
      role: "user",
      parts: [{ text: prompt }]
    }
  ],
  generationConfig: {
    temperature: 0.1
  }
});

    const response = result.response;

    if (!response) {
      throw new Error("Empty Gemini response");
    }

    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned blank text");
    }

    return text;
  } catch (error) {
    console.error("Gemini V2 Error:", error.message);
    throw error;
  }
}