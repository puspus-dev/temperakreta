export default function Login() {
  const school = localStorage.getItem("schoolName");

  return (
    <div className="card">
      <h2>{school}</h2>
      <p>Belépés</p>

      <button onClick={() => window.location.href="/dashboard?role=student"}>
        🎓 Diák
      </button>

      <br /><br />

      <button className="secondary" onClick={() => window.location.href="/dashboard?role=teacher"}>
        🧑‍🏫 Tanár
      </button>
    </div>
  );
}
