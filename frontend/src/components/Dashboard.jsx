import ScoreCard from "./ScoreCard";
import IssuePanel from "./IssuePanel";
import LanguageBadge from "./LanguageBadge";
import { normalizeIssues } from "../engine/issueNormalizer.js";

const groups = [
  { key: "BUG", label: "Bug Issues" },
  { key: "LOGIC", label: "Logic Issues" },
  { key: "PERFORMANCE", label: "Performance Issues" },
  { key: "MAINTAINABILITY", label: "Maintainability Issues" },
];

export default function Dashboard({ data, displayLanguage, showIssues, onToggleIssues }) {
  const scores = data?.scores || {};
  const issues = normalizeIssues(Array.isArray(data?.issues) ? data.issues : []);
  const aiResponses = data?.aiResponses || {};
  const totalIssues = issues.length;
  const isUnknownLanguage =
    !displayLanguage ||
    String(displayLanguage).toLowerCase() === "unknown" ||
    String(data?.language || "").toLowerCase() === "unknown";

  const formatResponse = (value) => {
    if (!value) return "No response available.";
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  };

  return (
    <section className="analysis-panel card card-dark shadow-sm border-0 h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h2 className="h5 mb-2">Analysis Summary</h2>
            <p className="text-muted small mb-0">Scores come from backend detection, and language is auto-detected when available.</p>
          </div>
          <LanguageBadge language={displayLanguage} />
        </div>

        {!isUnknownLanguage && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-sm-6 col-lg-3">
              <ScoreCard label="Bug" score={scores.bugScore} />
            </div>
            <div className="col-6 col-sm-6 col-lg-3">
              <ScoreCard label="Logic" score={scores.logicScore} />
            </div>
            <div className="col-6 col-sm-6 col-lg-3">
              <ScoreCard label="Performance" score={scores.performanceScore} />
            </div>
            <div className="col-6 col-sm-6 col-lg-3">
              <ScoreCard label="Maintain" score={scores.maintainabilityScore} />
            </div>
            <div className="col-12">
              <ScoreCard label="Overall Score" score={scores.overallScore} large />
            </div>
          </div>
        )}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h6 className="fw-semibold mb-1">Findings</h6>
            <p className="text-muted small mb-0">{totalIssues} total issue{totalIssues === 1 ? "" : "s"} detected.</p>
          </div>
          <button className="btn btn-outline-light btn-sm" onClick={onToggleIssues}>
            {showIssues ? "Hide issues" : "Show issues"}
          </button>
        </div>

       

        <IssuePanel issues={issues} open={showIssues} groups={groups} />
      </div>
    </section>
  );
}
