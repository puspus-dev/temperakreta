import React from "react";

type User = {
  name: string;
  role: "admin" | "user";
};

export default function Admin() {
  // 🛡️ SSR / build védelem
  if (typeof window === "undefined") {
    return null;
  }

  const userRaw = window.localStorage.getItem("user");

  let user: User | null = null;

  try {
    if (userRaw) {
      user = JSON.parse(userRaw) as User;
    }
  } catch {
    user = null;
  }

  // 🔒 jogosultság védelem
  if (!user || user.role !== "admin") {
    return (
      <div className="card">
        <h2>⛔ Nincs admin jogosultság</h2>
      </div>
    );
  }

  const schoolName =
    window.localStorage.getItem("schoolName") ?? "Ismeretlen iskola";

  return (
    <div className="card">
      <h2>🛠️ Admin panel</h2>

      <p>
        <strong>Iskola:</strong> {schoolName}
      </p>

      <ul>
        <li>👥 Felhasználók kezelése</li>
        <li>📚 Tantárgyak létrehozása</li>
        <li>📊 Statisztikák</li>
      </ul>

      <small>Admin: {user.name}</small>
    </div>
  );
}
