import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function SchoolRegister() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  async function handleSubmit() {
    if (!name) return;
    const res = await fetch(`${API_URL}/schools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const school = await res.json();
    localStorage.setItem("schoolId", school.id);
    localStorage.setItem("schoolName", school.name);
    navigate("/register");
  }

  return (
    <div className="card">
      <h1>🎨 TemperaNapló</h1>
      <p>Iskola regisztráció</p>
      <input placeholder="Iskola neve" value={name} onChange={e => setName(e.target.value)} />
      <br /><br />
      <button onClick={handleSubmit}>Regisztrálás</button>
    </div>
  );
}
