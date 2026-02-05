import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SchoolRegister() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function handleSubmit() {
    if (!name) return;
    localStorage.setItem("school", name);
    navigate("/login");
  }

  return (
    <div className="card">
      <h1>🎨 TemperaNapló</h1>
      <p>Regisztráld az iskolád</p>

      <label>Iskola neve</label>
      <input
        placeholder="pl. József Attila Gimnázium"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />
      <button onClick={handleSubmit}>Tovább</button>
    </div>
  );
}
