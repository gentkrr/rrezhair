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

/**
 * @swagger
 * /api/creneaux:
 *   post:
 *     summary: Ajouter un créneau (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               debut:
 *                 type: string
 *                 format: date-time
 *               fin:
 *                 type: string
 *                 format: date-time
 *               disponible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Créneau créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/', (req, res) => {
  // À implémenter
  res.status(201).json({ message: 'Créneau créé (simulation)' });
});

/**
 * @swagger
 * /api/creneaux/{id}:
 *   patch:
 *     summary: Modifier un créneau (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du créneau
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               debut:
 *                 type: string
 *                 format: date-time
 *               fin:
 *                 type: string
 *                 format: date-time
 *               disponible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Créneau modifié
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Créneau non trouvé
 */
router.patch('/:id', (req, res) => {
  // À implémenter
  res.json({ message: 'Créneau modifié (simulation)' });
});

/**
 * @swagger
 * /api/creneaux/{id}:
 *   delete:
 *     summary: Supprimer un créneau (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du créneau
 *     responses:
 *       200:
 *         description: Créneau supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Créneau non trouvé
 */
router.delete('/:id', (req, res) => {
  // À implémenter
  res.json({ message: 'Créneau supprimé (simulation)' });
});

module.exports = router;