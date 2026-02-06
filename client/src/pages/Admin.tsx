import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data } = await supabase.from("users").select("*");
    setUsers(data || []);
  };

  return (
    <div>
      <h2>🛠️ Admin – Felhasználók</h2>

      {users.map(u => (
        <div key={u.id} className="card">
          <b>{u.name}</b> – {u.role} <br />
          {u.email}
        </div>
      ))}
    </div>
  );
}
