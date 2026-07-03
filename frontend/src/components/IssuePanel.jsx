const severityBadge = (severity) => {
  const level = String(severity || "").toUpperCase();
  if (level === "CRITICAL") return "danger";
  if (level === "HIGH") return "warning";
  if (level === "MEDIUM") return "secondary";
  return "info";
};

export default function IssuePanel({ issues, open, groups }) {
  if (!open) return null;

  const grouped = groups.reduce((acc, group) => {
    acc[group.key] = [];
    return acc;
  }, {});

  issues.forEach((issue) => {
    const type = String(issue.type || "UNKNOWN").toUpperCase();
    if (grouped[type]) {
      grouped[type].push(issue);
    } else {
      if (!grouped.UNKNOWN) grouped.UNKNOWN = [];
      grouped.UNKNOWN.push(issue);
    }
  });

  return (
    <div className="issue-group">
      {Object.entries(grouped).map(([type, items]) => {
        if (!items.length) return null;
        const group = groups.find((groupItem) => groupItem.key === type);

        return (
          <div key={type} className="card bg-transparent border border-secondary border-opacity-25 rounded-4 mb-4">
            <div className="card-header bg-white bg-opacity-5 border-0 d-flex justify-content-between align-items-center py-3 px-4">
              <div>
                <h5 className="mb-0 text-white">{group ? group.label : type}</h5>
                <small className="text-muted">{items.length} finding{items.length === 1 ? "" : "s"}</small>
              </div>
            </div>
            <div className="list-group list-group-flush">
              {items.map((issue, index) => (
                <div key={index} className="list-group-item bg-transparent border-0 px-4 py-3">
                  <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                    <span className="badge bg-info text-dark">{issue.type}</span>
                    <span className={`badge bg-${severityBadge(issue.severity)} text-dark`}>{issue.severity || "UNKNOWN"}</span>
                    <span className="badge bg-secondary">Line {issue.line ?? "?"}</span>
                  </div>
                  <p className="mb-0 text-white-75">{issue.message || "No details available."}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {issues.length === 0 && (
        <div className="alert alert-success">No issues found. The analyzer returned zero findings.</div>
      )}
    </div>
  );
}
