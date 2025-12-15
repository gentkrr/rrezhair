const express = require('express');
const router = express.Router();
const Creneau = require('../models/Creneau');

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
router.get('/', async (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD (optionnel)
    let query = {};
    if (date) {
      // Utiliser les bornes en heure locale (sans suffixe Z) pour éviter les décalages de fuseau
      const startLocal = new Date(`${date}T00:00:00`);
      const endLocal = new Date(`${date}T23:59:59.999`);
      query = { debut: { $gte: startLocal, $lte: endLocal } };
    }
    const items = await Creneau.find(query).sort({ debut: 1 });
    const mapped = items.map((x) => {
      const d1 = new Date(x.debut);
      const d2 = new Date(x.fin);
      const dateStr = d1.toISOString().slice(0, 10);
      const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        _id: x._id, // legacy for mobile
        id: String(x._id), // human-friendly
        date: dateStr,
        heure: `${fmt(d1)} - ${fmt(d2)}`,
        debut: x.debut,
        fin: x.fin,
        disponible: x.disponible,
      };
    });
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ message: 'Erreur lors de la récupération des créneaux', error: e.message });
  }
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
 *               # Alternative format (heure locale):
 *               date:
 *                 type: string
 *                 example: "2025-10-02"
 *               start:
 *                 type: string
 *                 example: "10:00"
 *               end:
 *                 type: string
 *                 example: "10:30"
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
router.post('/', async (req, res) => {
  try {
    const { debut, fin, disponible = true, date, start, end } = req.body || {};

    let debutISO = debut;
    let finISO = fin;

    // Si debut/fin non fournis, accepter { date: YYYY-MM-DD, start: HH:mm, end: HH:mm } en heure locale
    if ((!debutISO || !finISO) && date && start && end) {
      const localStart = new Date(`${date}T${start}:00`); // interprété en heure locale du serveur
      const localEnd = new Date(`${date}T${end}:00`);
      if (isNaN(localStart.getTime()) || isNaN(localEnd.getTime())) {
        return res.status(400).json({ message: 'Format invalide pour date/start/end' });
      }
      debutISO = localStart.toISOString();
      finISO = localEnd.toISOString();
    }

    if (!debutISO || !finISO) {
      return res.status(400).json({ message: 'Fournir soit debut/fin en ISO, soit {date,start,end} en heure locale' });
    }

    const created = await Creneau.create({ debut: debutISO, fin: finISO, disponible });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: 'Création impossible', error: e.message });
  }
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
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Creneau.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Créneau non trouvé' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: 'Mise à jour impossible', error: e.message });
  }
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
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Creneau.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Créneau non trouvé' });
    res.json({ message: 'Créneau supprimé', id: req.params.id });
  } catch (e) {
    res.status(400).json({ message: 'Suppression impossible', error: e.message });
  }
});

/**
 * @swagger
 * /api/creneaux/bulk:
 *   post:
 *     summary: Créer en masse des créneaux pour une date (heure locale) à intervalle régulier
 *     description: "Ex: { date: '2025-10-02', ranges: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }], intervalMinutes: 30 }"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2025-10-02"
 *               ranges:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       example: "09:00"
 *                     end:
 *                       type: string
 *                       example: "12:00"
 *               intervalMinutes:
 *                 type: number
 *                 example: 30
 *     responses:
 *       201:
 *         description: Créneaux créés
 */
router.post('/bulk', async (req, res) => {
  try {
    const { date, ranges = [], intervalMinutes = 30 } = req.body || {};
    if (!date || !Array.isArray(ranges) || ranges.length === 0) {
      return res.status(400).json({ message: 'Champs requis: date et ranges[]' });
    }
    if (!intervalMinutes || intervalMinutes <= 0) {
      return res.status(400).json({ message: 'intervalMinutes doit être > 0' });
    }

    const created = [];

    for (const r of ranges) {
      const { start, end } = r || {};
      if (!start || !end) continue;

      let cur = new Date(`${date}T${start}:00`);
      const endDt = new Date(`${date}T${end}:00`);
      if (isNaN(cur.getTime()) || isNaN(endDt.getTime()) || cur >= endDt) continue;

      while (cur < endDt) {
        const next = new Date(cur.getTime() + intervalMinutes * 60 * 1000);
        if (next > endDt) break;

        const debutISO = cur.toISOString();
        const finISO = next.toISOString();

        // éviter les doublons (même début/fin)
        const exists = await Creneau.findOne({ debut: debutISO, fin: finISO });
        if (!exists) {
          const doc = await Creneau.create({ debut: debutISO, fin: finISO, disponible: true });
          created.push(doc);
        }
        cur = next;
      }
    }

    res.status(201).json({ count: created.length, items: created });
  } catch (e) {
    res.status(400).json({ message: 'Création bulk impossible', error: e.message });
  }
});

module.exports = router;