export default function TemperaLog({ userId }) {
  return (
    <div className="card">
      <h3>📓 Tempera napló</h3>
      <select>
        <option>😃 Jó</option>
        <option>🙂 Oké</option>
        <option>😐 Semleges</option>
        <option>😔 Rossz</option>
        <option>😡 Nagyon rossz</option>
      </select>
      <textarea placeholder="Mi történt ma?" />
      <button>Mentés</button>
    </div>
  );
}
