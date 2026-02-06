import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");

  const register = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    // Demo: localStorage-be mentés
    localStorage.setItem("user", JSON.stringify({ name, email, role: "admin" }));
    alert("Sikeres regisztráció!");
    window.location.href = "/dashboard";
  };

  return (
    <div className="card">
      <h2>🎓 Iskola regisztráció</h2>
      <input placeholder="Név" onChange={e => setName(e.target.value)} />
      <input placeholder="Iskola" onChange={e => setSchool(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Jelszó" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Regisztrálás</button>
    </div>
  );
}
