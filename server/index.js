import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const schools = [];
const users = [];
const subjects = [];
const grades = [];
const logs = [];

// --- Schools ---
app.post("/api/schools", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Iskola neve kötelező" });
  const school = { id: uuid(), name };
  schools.push(school);
  res.json(school);
});

app.get("/api/schools", (req, res) => res.json(schools));

// --- Users ---
app.post("/api/users", (req, res) => {
  const { name, role, schoolId } = req.body;
  if (!name || !role || !schoolId) return res.status(400).json({ error: "Hiányzó adat" });
  const user = { id: uuid(), name, role, schoolId };
  users.push(user);
  res.json(user);
});

app.get("/api/users/:schoolId", (req, res) => {
  const { schoolId } = req.params;
  res.json(users.filter(u => u.schoolId === schoolId));
});

// --- Subjects ---
app.post("/api/subjects", (req, res) => {
  const { name, schoolId } = req.body;
  if (!name || !schoolId) return res.status(400).json({ error: "Hiányzó adat" });
  const subject = { id: uuid(), name, schoolId };
  subjects.push(subject);
  res.json(subject);
});

app.get("/api/subjects/:schoolId", (req, res) => {
  const { schoolId } = req.params;
  res.json(subjects.filter(s => s.schoolId === schoolId));
});

// --- Grades ---
app.post("/api/grades", (req, res) => {
  const { userId, subjectId, grade, date } = req.body;
  if (!userId || !subjectId || grade == null || !date)
    return res.status(400).json({ error: "Hiányzó adat" });
  const g = { id: uuid(), userId, subjectId, grade, date };
  grades.push(g);
  res.json(g);
});

app.get("/api/grades/:userId", (req, res) => {
  const { userId } = req.params;
  const userGrades = grades
    .filter(g => g.userId === userId)
    .map(g => ({ ...g, subjectName: subjects.find(s => s.id === g.subjectId)?.name || "Ismeretlen" }));
  res.json(userGrades);
});

// --- Tempera Log ---
app.post("/api/logs", (req, res) => {
  const { userId, date, mood, text } = req.body;
  if (!userId || !date || !mood || text == null) return res.status(400).json({ error: "Hiányzó adat" });
  const entry = { id: uuid(), userId, date, mood, text };
  logs.push(entry);
  res.json(entry);
});

app.get("/api/logs/:userId", (req, res) => {
  const { userId } = req.params;
  res.json(logs.filter(l => l.userId === userId));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Tempera API fut:", PORT));
