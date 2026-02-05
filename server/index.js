const subjects = []; // tantárgyak
const grades = [];   // jegyek

// tantárgy létrehozása (iskolához kötve)
app.post("/api/subjects", (req, res) => {
  const { name, schoolId } = req.body;
  if (!name || !schoolId) return res.status(400).json({ error: "Hiányzó adat" });

  const subject = { id: uuid(), name, schoolId };
  subjects.push(subject);
  res.json(subject);
});

// tantárgyak lekérdezése egy iskolához
app.get("/api/subjects/:schoolId", (req, res) => {
  const { schoolId } = req.params;
  res.json(subjects.filter(s => s.schoolId === schoolId));
});

// jegy hozzáadása
app.post("/api/grades", (req, res) => {
  const { userId, subjectId, grade, date } = req.body;
  if (!userId || !subjectId || grade == null || !date)
    return res.status(400).json({ error: "Hiányzó adat" });

  const g = { id: uuid(), userId, subjectId, grade, date };
  grades.push(g);
  res.json(g);
});

// felhasználó jegyei tantárgyak szerint
app.get("/api/grades/:userId", (req, res) => {
  const { userId } = req.params;
  const userGrades = grades
    .filter(g => g.userId === userId)
    .map(g => {
      const subject = subjects.find(s => s.id === g.subjectId);
      return { ...g, subjectName: subject ? subject.name : "Ismeretlen" };
    });
  res.json(userGrades);
});
