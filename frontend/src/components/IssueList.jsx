import React from "react";

export default function IssueList({ issues, open }) {
  if (!open) return null;

  return (
    <div style={{
      marginTop: 20,
      background: "#0f172a",
      padding: 15,
      borderRadius: 10
    }}>
      <h3>Issues</h3>

      {issues?.map((i, idx) => (
        <div key={idx} style={{ marginBottom: 10 }}>
          <b>{i.type}</b> | {i.severity}
          <p>{i.message}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}