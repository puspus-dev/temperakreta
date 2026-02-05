import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const school = localStorage.getItem("school");

  return (
    <div className="card">
      <h2>{school}</h2>
      <p>Hogyan lépsz be?</p>

      <button onClick={() => navigate("/dashboard?role=student")}>
        🎓 Diák
      </button>

      <br /><br />

      <button className="secondary" onClick={() => navigate("/dashboard?role=teacher")}>
        🧑‍🏫 Tanár
      </button>
    </div>
  );
}
