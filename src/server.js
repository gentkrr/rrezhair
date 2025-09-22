const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerSetup = require("../swagger");

dotenv.config();
const app = express();

// Swagger documentation
swaggerSetup(app);

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
