import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  async function handleRegister() {
    const schoolId = localStorage.getItem("schoolId");
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, schoolId })
    });
    const user = await res.json();
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  }

  return (
    <div className="card">
      <h2>Regisztráció</h2>
      <input placeholder="Neved" value={name} onChange={e => setName(e.target.value)} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">🎓 Diák</option>
        <option value="teacher">🧑‍🏫 Tanár</option>
        <option value="admin">🛠️ Admin</option>
      </select>
      <br /><br />
      <button onClick={handleRegister}>Kész</button>
    </div>
  );
}
