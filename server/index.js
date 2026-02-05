import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

// ideiglenes memória (deploy után DB-re cseréljük)
const schools = [];

// iskola regisztráció
app.post("/api/schools", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Iskola neve kötelező" });
  }

  const school = {
    id: uuid(),
    name
  };

  schools.push(school);
  res.json(school);
});

// debug / teszt
app.get("/api/schools", (req, res) => {
  res.json(schools);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Tempera API fut:", PORT)
);

