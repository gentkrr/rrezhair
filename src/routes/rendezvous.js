const express = require('express');
const router = express.Router();
const Creneau = require('../models/Creneau');
const RendezVous = require('../models/RendezVous');
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
router.post('/', async (req, res) => {
  try {
    const { creneauId, clientPrenom, clientNom, clientEmail } = req.body;
    if (!creneauId) return res.status(400).json({ message: 'creneauId est requis' });

    const creneau = await Creneau.findById(creneauId);
    if (!creneau) return res.status(400).json({ message: 'Créneau introuvable' });
    if (!creneau.disponible) return res.status(400).json({ message: 'Créneau non disponible' });

    const rdv = await RendezVous.create({ creneauId, clientPrenom, clientNom, clientEmail });
   creneau.disponible = false;
   await creneau.save();

    res.status(201).json(rdv);
  } catch (e) {
    res.status(400).json({ message: 'Création impossible', error: e.message });
  }
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
router.get('/', async (req, res) => {
  try {
    const list = await RendezVous.find().sort({ createdAt: -1 }).populate('creneauId');
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error: e.message });
  }
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
router.patch('/:id/cancel', async (req, res) => {
  try {
    const rdv = await RendezVous.findById(req.params.id);
    if (!rdv) return res.status(404).json({ message: 'Rendez-vous non trouvé' });

    if (rdv.statut !== 'ANNULE') {
      rdv.statut = 'ANNULE';
      await rdv.save();
      // Libérer le créneau
      await Creneau.findByIdAndUpdate(rdv.creneauId, { disponible: true });
    }

    res.json({ message: 'Rendez-vous annulé', rdv });
  } catch (e) {
    res.status(400).json({ message: 'Annulation impossible', error: e.message });
  }
});

module.exports = router;
