import { useNavigate } from "react-router-dom";

export default function Login() {
  const school = localStorage.getItem("schoolName");
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>{school}</h2>
      <p>Belépés</p>
      <button onClick={() => navigate("/register")}>➕ Új felhasználó</button>
    </div>
  );
}
