export default function LanguageBadge({ language }) {
  const displayLanguage = language || "Auto";

  return (
    <div className="language-badge d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill">
      <span className="language-badge-label text-uppercase">Detected</span>
      <span className="language-badge-value fw-semibold">{displayLanguage}</span>
    </div>
  );
}