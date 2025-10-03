const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Rrezhair',
      version: '1.0.0',
      description: 'Documentation de l’API de réservation Rrezhair',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./server.js', './routes/*.js'], // <-- ajoute server.js ici
};

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerSetup = require("../swagger");
dotenv.config();

const app = express();

// CORS for Expo Web (http://localhost:8081)
const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);
// Note: No explicit app.options wildcard; CORS middleware handles preflight.

// Swagger documentation
swaggerSetup(app);
app.use(express.json());
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifie si l'API est en ligne
 *     description: Retourne un statut simple pour vérifier que l'API fonctionne.
 *     responses:
 *       200:
 *         description: Statut OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "API en ligne :fusée:"
 */
app.get("/health", (req, res) => {
  res.json({ status: "API en ligne :fusée:" });
});// Routes API
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);
const creneauxRoutes = require("./routes/creneaux");
app.use("/api/creneaux", creneauxRoutes);
const rendezvousRoutes = require("./routes/rendezvous");
app.use("/api/rendezvous", rendezvousRoutes);
// MongoDB + lancement
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`:fusée: API lancée sur http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(":x: Erreur MongoDB :", err));