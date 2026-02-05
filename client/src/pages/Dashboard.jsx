import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetch(`https://tempera-api.onrender.com/api/grades/${user.id}`)
      .then(r => r.json())
      .then(setGrades);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Szia, {user.name} 👋</h1>

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

      <div className="card">
        <p>📓 Tempera napló – hamarosan</p>
      </div>
    </div>
  );
}
