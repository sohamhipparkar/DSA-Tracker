const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const FILE = "./data.json";
const PORT = process.env.PORT || 5000;

/* ---------- safe read ---------- */
const readData = () => {
  try {
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, "[]");
      return [];
    }

    const raw = fs.readFileSync(FILE, "utf-8");

    if (!raw) return [];

    return JSON.parse(raw);
  } catch (err) {
    console.log("READ ERROR:", err);
    return [];
  }
};

/* ---------- safe write ---------- */
const writeData = (data) => {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
};

/* ---------- ROUTES ---------- */

app.get("/api/sheet", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "striver-sheet.json");

    console.log("Reading dataset from:", filePath);

    const raw = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(raw);

    res.json(jsonData);
  } catch (err) {
    console.error("DATASET ERROR:", err);
    res.status(500).json({ error: "Dataset could not be read" });
  }
});

app.post("/api/topic", (req, res) => {
  const data = readData();
  const newTopic = req.body;

  data.push(newTopic);
  writeData(data);

  res.json(newTopic);
});

app.delete("/api/topic/:id", (req, res) => {
  let data = readData();

  data = data.filter((t) => t.id !== req.params.id);

  writeData(data);

  res.json({ message: "deleted" });
});

app.put("/api/topic/:id", (req, res) => {
  let data = readData();

  data = data.map((t) => (t.id === req.params.id ? req.body : t));

  writeData(data);

  res.json({ message: "updated" });
});

app.listen(PORT, () =>
  console.log(`✅ API running → http://localhost:${PORT}/api/sheet`)
);
