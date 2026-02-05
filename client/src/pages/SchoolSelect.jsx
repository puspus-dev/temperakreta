import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SchoolSelect() {
  const [school, setSchool] = useState("");
  const navigate = useNavigate();

  function handleNext() {
    if (!school) return;
    localStorage.setItem("school", school);
    navigate("/login");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎨 TemperaNapló</h1>
      <p>Válaszd ki az iskolád</p>

      <select
        value={school}
        onChange={(e) => setSchool(e.target.value)}
      >
        <option value="">-- iskola kiválasztása --</option>
        <option value="teszt-iskola">Teszt Iskola</option>
        <option value="gimi-1">Gimnázium 1</option>
      </select>

      <br /><br />
      <button onClick={handleNext}>Tovább</button>
    </div>
  );
}
