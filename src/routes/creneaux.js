const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/creneaux:
 *   get:
 *     summary: Récupère la liste des créneaux disponibles
 *     description: Retourne tous les créneaux disponibles pour la réservation.
 *     responses:
 *       200:
 *         description: Liste des créneaux
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   debut:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-22T10:00:00Z"
 *                   fin:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-22T11:00:00Z"
 *                   disponible:
 *                     type: boolean
 *                     example: true
 */
router.get('/', (req, res) => {
  // Exemple de réponse simulée
  res.json([
    {
      debut: "2025-09-22T10:00:00Z",
      fin: "2025-09-22T11:00:00Z",
      disponible: true
    }
  ]);
});

module.exports = router;