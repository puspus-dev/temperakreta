import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function TemperaLog({ userId }) {
  const [logs, setLogs] = useState([]);
  const [mood, setMood] = useState("😊");
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/logs/${userId}`).then(r => r.json()).then(setLogs);
  }, [userId]);

  const handleSubmit = async () => {
    if (!text) return;
    const res = await fetch(`${API_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        date: new Date().toISOString().split("T")[0],
        mood,
        text
      })
    });
    const newLog = await res.json();
    setLogs([newLog, ...logs]);
    setText("");
  };

  return (
    <div className="card">
      <h3>📓 Tempera Napló</h3>
      <select value={mood} onChange={e => setMood(e.target.value)}>
        <option value="😃">😃 Jó hangulat</option>
        <option value="🙂">🙂 Közepes</option>
        <option value="😐">😐 Semleges</option>
        <option value="😔">😔 Rossz</option>
        <option value="😡">😡 Nagyon rossz</option>
      </select>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Írj röviden a mai napról..." />
      <button onClick={handleSubmit}>Mentés</button>

      <hr />

      {logs.map(l => (
        <div key={l.id} className="card" style={{ background: "#f0f4ff", marginBottom: "0.7rem" }}>
          <strong>{l.date} {l.mood}</strong>
          <p>{l.text}</p>
        </div>
      ))}
    </div>
  );
}
