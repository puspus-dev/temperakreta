import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Teacher() {
  const [score, setScore] = useState(3);
  const [note, setNote] = useState("");

  const save = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    await supabase.from("tempera_entries").insert({
      student_id: user.id,
      subject_id: null,
      score,
      note,
    });

    alert("Mentve");
  };

  return (
    <div className="card">
      <h2>🎨 Tempera bejegyzés</h2>
      <input type="number" min={1} max={5} onChange={e => setScore(+e.target.value)} />
      <textarea onChange={e => setNote(e.target.value)} />
      <button onClick={save}>Mentés</button>
    </div>
  );
}
