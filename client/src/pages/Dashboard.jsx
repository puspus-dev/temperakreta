import { useEffect, useState } from "react";
import TemperaLog from "../components/TemperaLog";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/grades/${user.id}`).then(r => r.json()).then(setGrades);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Szia, {user.name} 👋</h1>
      <p>{user.role === "teacher" ? "🧑‍🏫 Tanár" : "🎓 Diák"} mód</p>

      <div className="card">
        <h3>📊 Jegyek</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={grades}>
            <XAxis dataKey="subjectName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="grade" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <TemperaLog userId={user.id} />
    </div>
  );
}
