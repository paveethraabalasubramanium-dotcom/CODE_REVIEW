import React from "react";

export default function CodeUploader({ code, setCode, onAnalyze }) {
  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        style={{
          width: "100%",
          height: 180,
          background: "#111827",
          color: "white",
          padding: 10,
          borderRadius: 10
        }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={onAnalyze}>
          Analyze Code
        </button>
      </div>
    </div>
  );
}