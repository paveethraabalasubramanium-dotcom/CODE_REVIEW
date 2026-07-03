import axios from "axios";

let inFlight = false;

export const analyzeCode = async (
  question,
  code,
  language = "auto"
) => {
  if (inFlight) {
    throw new Error("Analysis already in progress.");
  }

  inFlight = true;

  try {
    const response = await axios.post(
      "http://localhost:5000/api/analyze",
      {
        question,
        code,
        language
      }
    );

    return response.data;
  } finally {
    inFlight = false;
  }
};