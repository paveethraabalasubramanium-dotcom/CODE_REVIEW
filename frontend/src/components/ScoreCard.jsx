const getColor = (score) => {
  if (typeof score !== "number" || Number.isNaN(score)) return "#60a5fa";
  if (score >= 85) return "#3b82f6";
  if (score >= 60) return "#60a5fa";
  return "#93c5fd";
};

const normalizeScore = (score) => {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score));
};

export default function ScoreCard({ label, score, large }) {
  const numericScore = normalizeScore(score);
  const scoreColor = getColor(numericScore);

  return (
    <div className={`score-card p-3 rounded-4 ${large ? "score-card-large" : ""}`}>
      <div className="score-ring" style={{ "--score": numericScore, "--progress-color": scoreColor }}>
        <div className="score-ring-inner">
          <div className="fs-3 fw-bold text-white">{typeof score === "number" ? score : "--"}</div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="text-muted small text-uppercase letter-spacing-1">{label}</div>
      </div>
    </div>
  );
}
