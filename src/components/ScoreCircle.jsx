import "./scoreCircle.css";

export default function ScoreCircle({ label, score }) {
  const color =
    score >= 80 ? "green" :
    score >= 50 ? "orange" : "red";

  return (
    <div className={`circle ${color}`}>
      <div className="label">{label}</div>
      <div className="score">{score}</div>
    </div>
  );
}