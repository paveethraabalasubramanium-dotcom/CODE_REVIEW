import LanguageBadge from "./LanguageBadge";

export default function CodeEditor({
  question,
  onQuestionChange,
  code,
  onCodeChange,
  selectedLanguage,
  onLanguageChange,
  displayLanguage,
  languageOptions,
  isLoading,
}) {
  return (
    <section className="code-panel">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h2 className="h5 mb-2">Student Submission</h2>
          <p className="text-muted small mb-0">
            Enter coding question followed by student answer.
          </p>
        </div>

        <div className="d-flex flex-column gap-2 align-items-start align-items-md-end">
          <LanguageBadge language={displayLanguage} />

          <select
            className="form-select form-select-sm"
            value={selectedLanguage}
            onChange={(event) => onLanguageChange(event.target.value)}
            disabled={isLoading}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QUESTION */}
      <div className="mb-4">
        <label htmlFor="question-input" className="form-label editor-label">
          Coding Question
        </label>

        <textarea
          id="question-input"
          className="form-control question-textarea"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          placeholder="Example: Write a program to print Fibonacci series up to N terms"
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* CODE */}
      <div className="mb-3">
        <label htmlFor="code-input" className="form-label editor-label">
          Student Code
        </label>

        <textarea
          id="code-input"
          className="form-control editor-textarea"
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          placeholder="Paste student code here..."
          rows={18}
          disabled={isLoading}
        />
      </div>
    </section>
  );
}