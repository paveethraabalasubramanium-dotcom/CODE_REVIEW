export function extractJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return null;
  }

  let cleaned = rawText.trim();

  // Remove markdown wrapper
  cleaned = cleaned.replace(/^```json\s*/i, "");
  cleaned = cleaned.replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

  // Direct JSON
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {}

  // Extract first JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  const jsonCandidate = cleaned.slice(start, end + 1);

  try {
    JSON.parse(jsonCandidate);
    return jsonCandidate;
  } catch {
    return null;
  }
}