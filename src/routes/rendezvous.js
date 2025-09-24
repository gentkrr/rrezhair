/**
 * @swagger
 * /api/rendezvous:
 *   post:
 *     summary: Prendre un rendez-vous (utilisateur connecté)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               creneauId:
 *                 type: string
 *                 description: ID du créneau à réserver
 *     responses:
 *       201:
 *         description: Rendez-vous créé
 *       400:
 *         description: Données invalides ou créneau indisponible
 *       401:
 *         description: Non autorisé
 */
router.post('/', (req, res) => {
  // À implémenter
  res.status(201).json({ message: 'Rendez-vous créé (simulation)' });
});

/**
 * @swagger
 * /api/rendezvous:
 *   get:
 *     summary: Voir les rendez-vous de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rendez-vous
 *       401:
 *         description: Non autorisé
 */
router.get('/', (req, res) => {
  // À implémenter
  res.json([{ id: '1', creneauId: 'abc', statut: 'CONFIRME' }]);
});

/**
 * @swagger
 * /api/rendezvous/{id}/cancel:
 *   patch:
 *     summary: Annuler un rendez-vous (utilisateur connecté)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du rendez-vous à annuler
 *     responses:
 *       200:
 *         description: Rendez-vous annulé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Rendez-vous non trouvé
 */
router.patch('/:id/cancel', (req, res) => {
  // À implémenter
  res.json({ message: 'Rendez-vous annulé (simulation)' });
});

module.exports = router;
