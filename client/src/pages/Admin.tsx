export default function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="card">
      <h2>🛠️ Admin panel</h2>
      <p>Iskola: {localStorage.getItem("schoolName")}</p>

      <ul>
        <li>👥 Felhasználók kezelése</li>
        <li>📚 Tantárgyak létrehozása</li>
        <li>📊 Statisztikák</li>
      </ul>

      <small>Admin: {user.name}</small>
    </div>
  );
}
