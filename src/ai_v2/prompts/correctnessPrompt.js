export function correctnessPrompt(question, code, language) {
  return `
You are an expert programming evaluator.

Your task is to evaluate submitted source code against a programming question.

IMPORTANT:
RELEVANT and CORRECT are NOT the same.

====================================================
SUPPORTED LANGUAGES
====================================================

C
C++
Java
Python
JavaScript

Language:
${language}

====================================================
STRICT RULES
====================================================

1. First determine RELEVANCE.

RELEVANT means:
The submitted code attempts to solve the same problem domain.

Examples:
Question: Print Fibonacci series
Code: Loop attempting sequence generation
=> RELEVANT = true

Question: Binary Search
Code: Merge Sort implementation
=> RELEVANT = false

IMPORTANT:
Wrong logic does NOT mean irrelevant.

Example:
Question: Fibonacci
Code:
for i in range(n):
    print(i)

This is RELEVANT because it attempts sequence generation,
but it is INCORRECT because output is not Fibonacci.

Therefore:
isRelevant = true
isCorrect = false

----------------------------------------------------

2. Determine CORRECTNESS only if relevant.

CORRECT means:
- Algorithm solves problem correctly
- Output matches expected logic
- Core logic is valid

Incorrect cases:
- Wrong algorithm
- Wrong formula
- Off-by-one affecting output
- Incorrect recurrence
- Partial solution missing core logic

----------------------------------------------------

3. DO NOT analyze:
- syntax errors
- runtime bugs
- performance
- maintainability
- style

----------------------------------------------------

4. Return ONLY valid JSON.

No markdown.
No extra explanation.

====================================================
OUTPUT FORMAT
====================================================

{
  "isRelevant": true,
  "isCorrect": true,
  "reason": "Short technical reason"
}

====================================================
QUESTION
====================================================

${question}

====================================================
SOURCE CODE
====================================================

${code}
`;
}