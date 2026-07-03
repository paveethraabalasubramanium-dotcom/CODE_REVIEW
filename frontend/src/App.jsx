import { useEffect, useMemo, useState } from "react";
import { analyzeCode } from "./api";
import CodeEditor from "./components/CodeEditor";
import Dashboard from "./components/Dashboard";

const languageOptions = [
  { value: "auto", label: "Auto Detect" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
];

const formatLanguageLabel = (language) => {
  if (!language || language === "auto") return "Auto";
  if (language === "cpp") return "C++";
  if (language === "javascript") return "JavaScript";
  if (language === "python") return "Python";
  return language.charAt(0).toUpperCase() + language.slice(1);
};

export default function App() {
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIssues, setShowIssues] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("auto");

  const displayLanguage = useMemo(() => {
    if (selectedLanguage !== "auto") {
      return formatLanguageLabel(selectedLanguage);
    }

    return formatLanguageLabel(
      detectedLanguage || analysisResult?.language || "auto"
    );
  }, [analysisResult, detectedLanguage, selectedLanguage]);

  useEffect(() => {
    if (!toastVisible) return;

    const timer = window.setTimeout(() => {
      setToastVisible(false);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  const runAnalysis = async () => {
    if (!question.trim() || !code.trim() || isLoading) return;

    setIsLoading(true);
    setToastVisible(false);

    try {
      const result = await analyzeCode(
        question,
        code,
        selectedLanguage
      );

      setAnalysisResult(result);
      setDetectedLanguage(result?.language || "auto");
      setShowIssues(true);
      setToastVisible(true);
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid app-shell py-5">
      <header className="hero-banner rounded-4 p-4 p-xl-5 mb-5 shadow-sm">
        <div className="row align-items-center">
          <div className="col-12 col-xl-8">
            <h1 className="display-6 fw-semibold mb-3">
              CODE REVIEW
            </h1>

            <p className="text-muted fs-6 mb-4">
              Enter a coding question and student solution to evaluate
              correctness, bug risk, logic quality, performance, and
              maintainability.
            </p>
          </div>

          <div className="col-12 col-xl-4 mt-4 mt-xl-0"></div>
        </div>
      </header>

      <div className="row gx-4 gy-4">
        <div className="col-12 col-xl-7">
          <CodeEditor
            question={question}
            onQuestionChange={setQuestion}
            code={code}
            onCodeChange={setCode}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            displayLanguage={displayLanguage}
            languageOptions={languageOptions}
            isLoading={isLoading}
          />

          <div className="mt-4 text-end">
            <button
              className="btn btn-primary btn-lg px-4"
              onClick={runAnalysis}
              disabled={
                isLoading ||
                !question.trim() ||
                !code.trim()
              }
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Analyze
            </button>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <Dashboard
            data={analysisResult}
            displayLanguage={displayLanguage}
            showIssues={showIssues}
            onToggleIssues={() =>
              setShowIssues((current) => !current)
            }
          />
        </div>
      </div>

      <div
        className={`toast-overlay ${
          toastVisible ? "toast-visible" : ""
        }`}
      >
        <div
          className="toast align-items-center text-bg-dark border-0 show"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex align-items-center gap-2 p-3">
            <div className="toast-body">
              Analysis completed successfully
            </div>

            <button
              type="button"
              className="btn-close btn-close-white me-1 m-auto"
              aria-label="Close"
              onClick={() => setToastVisible(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}