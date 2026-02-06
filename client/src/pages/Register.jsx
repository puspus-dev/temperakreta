import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");

  const register = async () => {
    // 1. auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error || !data.user) return alert(error?.message);

    // 2. iskola
    const { data: schoolData } = await supabase
      .from("schools")
      .insert({ name: school })
      .select()
      .single();

    // 3. profil
    await supabase.from("users").insert({
      id: data.user.id,
      email,
      name,
      role: "admin",
      school_id: schoolData.id,
    });

    alert("Sikeres regisztráció");
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
