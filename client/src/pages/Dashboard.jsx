import { useSearchParams } from "react-router-dom";

export default function Dashboard() {
  const [params] = useSearchParams();
  const role = params.get("role");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{role === "teacher" ? "🧑‍🏫 Tanári" : "🎓 Diák"} felület</h1>

      <div className="card">
        <p>📊 Itt lesznek a jegyek</p>
        <p>📓 Tempera napló</p>
        <p>⏰ Közelgő dolgozatok</p>
      </div>
    </div>
  );
}
