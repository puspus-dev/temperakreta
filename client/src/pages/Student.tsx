import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Student() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data } = await supabase
      .from("tempera_entries")
      .select("*")
      .eq("student_id", user.id);

    setEntries(data || []);
  };

  return (
    <div>
      <h2>📊 Saját értékelések</h2>
      {entries.map(e => (
        <div key={e.id} className="card">
          Érték: {e.score} <br />
          {e.note}
        </div>
      ))}
    </div>
  );
}
