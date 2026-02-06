import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState("");

  const register = async () => {
    // 1️⃣ Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user) return alert(authError?.message);

    // 2️⃣ Iskola létrehozása
    const { data: schoolData } = await supabase
      .from("schools")
      .insert({ name: schoolName })
      .select()
      .single();

    // 3️⃣ Users tábla
    await supabase.from("users").insert({
      id: authData.user.id,
      name,
      role: "admin",
      school_id: schoolData.id,
      email
    });

    alert("Sikeres regisztráció");
    window.location.href = "/dashboard";
  };

  return (
    <div className="card">
      <h2>🎓 Iskola regisztráció</h2>
      <input placeholder="Név" onChange={e => setName(e.target.value)} />
      <input placeholder="Iskola" onChange={e => setSchoolName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Jelszó" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Regisztrálás</button>
    </div>
  );
}
