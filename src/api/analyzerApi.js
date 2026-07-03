export async function analyzeCode(code, language = "javascript") {
  const res = await fetch("http://localhost:5000/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code, language })
  });

  return res.json();
}