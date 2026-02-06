import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return alert(error.message);

    // a hook majd lekéri a teljes user adatot
    window.location.href = "/dashboard";
  };

  return (
    <div className="card">
      <h2>🔐 Bejelentkezés</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Jelszó" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Belépés</button>
    </div>
  );
}
