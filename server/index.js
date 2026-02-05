import express from "express";
import schools from "./schools.json" assert { type: "json" };

const app = express();
app.use(express.json());

app.get("/api/schools", (req, res) => {
  res.json(schools);
});

app.listen(3000, () => {
  console.log("API fut: http://localhost:3000");
});
