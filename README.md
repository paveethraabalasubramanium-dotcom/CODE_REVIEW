# Code_Review

CodePulse AI is an AI-powered code quality analysis platform that evaluates source code across multiple dimensions using static analysis, rule-based detection, and LLM-assisted reasoning.

It accepts source code submissions and produces detailed analysis reports including:

* Bug Risk Score
* Logic Correctness Score
* Performance Score
* Maintainability Score
* Overall Code Health Score
* Detailed issue breakdown with severity levels

---

## Features

### Language Detection

Automatically detects source code language.

Supported languages:

* Python
* JavaScript
* Java
* C
* C++

---

### Correctness Validation

Uses AI-based correctness checking to compare submitted code against the coding question.

Checks:

* Whether submitted code is relevant to the question
* Whether the algorithm solves the problem correctly
* Detects incorrect logic or incomplete solutions

Examples:

* Fibonacci question + sorting solution → Irrelevant
* Fibonacci question + wrong sequence generation → Relevant but incorrect
* Correct Fibonacci implementation → Correct

---

### Code Quality Analysis

Code is analyzed under four categories:

#### Bug Analysis

Detects runtime and safety issues:

* Division by zero
* Null dereference
* Buffer overflow
* Memory leak
* Invalid memory access
* Unsafe APIs

#### Logic Analysis

Detects algorithmic issues:

* Wrong algorithm
* Wrong recurrence
* Incorrect conditions
* Off-by-one errors
* Hardcoded output

#### Performance Analysis

Detects efficiency issues:

* O(n²) complexity
* Nested loops
* Repeated expensive computation
* Excessive I/O

#### Maintainability Analysis

Detects readability issues:

* Magic numbers
* Deep nesting
* Duplicate code
* Poor naming
* Complex conditions

---

## Tech Stack

### Frontend

* React
* Vite
* Axios
* Tailwind CSS (optional)

### Backend

* Node.js
* Express.js

### AI

* Gemini API

### Optional Parsing / Static Analysis

* Tree-sitter
* Custom AST analyzers
* Regex-based rule engines

---

# Project Structure

```bash
codepulse-ai/
│
├── backend/
│   ├── src/
│   │   ├── ai_v2/
│   │   │   ├── analyzers/
│   │   │   │   ├── correctnessAnalyzer.js
│   │   │   │   └── scoreAnalyzer.js
│   │   │   ├── prompts/
│   │   │   │   ├── correctnessPrompt.js
│   │   │   │   └── scoringPrompt.js
│   │   │   ├── utils/
│   │   │   │   └── extractJson.js
│   │   │   └── geminiClientV2.js
│   │   │
│   │   ├── core/
│   │   │   └── languageDetector.js
│   │   │
│   │   ├── controllers/
│   │   │   └── analyze.controller.js
│   │   │
│   │   ├── routes/
│   │   │   └── analyze.routes.js
│   │   │
│   │   ├── engine/
│   │   │   ├── scoreEngine.js
│   │   │   └── reportBuilder.js
│   │   │
│   │   ├── pipeline/
│   │   │   └── analysisPipeline_v2.js
│   │   │
│   │   └── server.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── IssuePanel.jsx
│   │   │   ├── LanguageBadge.jsx
│   │   │   ├── AnalysisSummary.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── engine/
│   │   │   └── issueNormalizer.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

---

# Requirements

Install the following before running:

## Required Software

### Node.js

Recommended:

* Node.js 18+

Verify:

```bash
node --version
npm --version
```

### Git

Install Git for cloning and version control.

Verify:

```bash
git --version
```

### Gemini API Key

Create API key from Google AI Studio.

Store in backend `.env`:

```env
GEMINI_API_KEY=your_api_key_here
PORT=5000
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/codepulse-ai.git
cd codepulse-ai
```

---

## Backend Setup

Move to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Example dependencies:

```bash
npm install express axios cors dotenv
```

Run backend:

```bash
node src/server.js
```

Expected output:

```bash
Server started on port 5000
Gemini key loaded: YES
```

---

## Frontend Setup

Open new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Example dependencies:

```bash
npm install axios react react-dom
```

Start frontend:

```bash
npm run dev
```

Expected output:

```bash
Local: http://localhost:5173
```

---

# API Usage

## Analyze Code

### Endpoint

```http
POST /api/analyze
```

### Request Body

```json
{
  "question": "Write a program to print Fibonacci series",
  "code": "n=5\nfor i in range(n): print(i)",
  "language": "auto"
}
```

---

### Response

```json
{
  "success": true,
  "language": "python",
  "scores": {
    "bugScore": 100,
    "logicScore": 85,
    "performanceScore": 100,
    "maintainabilityScore": 97,
    "overallScore": 94
  },
  "issues": [
    {
      "type": "LOGIC",
      "severity": "HIGH",
      "line": 2,
      "rule": "incorrect-fibonacci",
      "message": "Code prints integers instead of Fibonacci sequence."
    }
  ]
}
```

---

# Scoring Formula

Weighted scoring system:

* Bug Score → 20%
* Logic Score → 50%
* Performance Score → 15%
* Maintainability Score → 15%

Severity penalties:

| Severity | Penalty |
| -------- | ------- |
| CRITICAL | 20      |
| HIGH     | 15      |
| MEDIUM   | 8       |
| LOW      | 3       |

Formula:

```text
Overall Score =
(Bug × 0.20) +
(Logic × 0.50) +
(Performance × 0.15) +
(Maintainability × 0.15)
```

---

# Testing

Recommended test cases:

* Correct solutions
* Wrong logic
* Irrelevant submissions
* Memory leaks
* Buffer overflows
* Magic numbers
* Hardcoded output

---


---


---

