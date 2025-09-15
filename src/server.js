import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/health", (req, res) => {
  res.json({ status: "API en ligne 🚀" });
});

// MongoDB + lancement
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 API lancée sur http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ Erreur MongoDB :", err));
