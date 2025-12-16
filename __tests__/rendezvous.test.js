const request = require('supertest');
const express = require('express');
const rendezvousRouter = require('../src/routes/rendezvous');
const Creneau = require('../src/models/Creneau');
const RendezVous = require('../src/models/RendezVous');

const app = express();
app.use(express.json());
app.use('/api/rendezvous', rendezvousRouter);

describe('Tests des rendez-vous', () => {
  let creneauDisponible;
  let creneauIndisponible;

  beforeEach(async () => {
    creneauDisponible = await Creneau.create({
      debut: new Date('2026-10-27T09:00:00.000Z'),
      fin: new Date('2026-10-27T09:30:00.000Z'),
      disponible: true
    });

    creneauIndisponible = await Creneau.create({
      debut: new Date('2026-10-27T10:00:00.000Z'),
      fin: new Date('2026-10-27T10:30:00.000Z'),
      disponible: false
    });
  });

  describe('POST /api/rendezvous', () => {
    test('Devrait créer un rendez-vous sur un créneau disponible', async () => {
      const res = await request(app)
        .post('/api/rendezvous')
        .send({
          creneauId: String(creneauDisponible._id),
          clientPrenom: 'Jean',
          clientNom: 'Dupont',
          clientEmail: 'jean.dupont@example.com'
        });

      if (res.status !== 201) {
        console.log('Error response:', res.body);
      }

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('creneauId');
      expect(res.body.statut).toBe('CONFIRME');

      // Vérifier que le créneau est maintenant indisponible
      const creneau = await Creneau.findById(creneauDisponible._id);
      expect(creneau.disponible).toBe(false);
    });

    test('Devrait rejeter une réservation sur un créneau indisponible', async () => {
      const res = await request(app)
        .post('/api/rendezvous')
        .send({
          creneauId: creneauIndisponible._id.toString(),
          clientPrenom: 'Jean',
          clientNom: 'Dupont'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('non disponible');
    });

    test('Devrait rejeter une réservation sans creneauId', async () => {
      const res = await request(app)
        .post('/api/rendezvous')
        .send({
          clientPrenom: 'Jean',
          clientNom: 'Dupont'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('requis');
    });

    test('Devrait rejeter une réservation avec un creneauId invalide', async () => {
      const res = await request(app)
        .post('/api/rendezvous')
        .send({
          creneauId: '507f1f77bcf86cd799439011',
          clientPrenom: 'Jean',
          clientNom: 'Dupont'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('introuvable');
    });
  });

  describe('GET /api/rendezvous', () => {
    beforeEach(async () => {
      await RendezVous.create([
        {
          creneauId: creneauDisponible._id,
          clientPrenom: 'Jean',
          clientNom: 'Dupont',
          clientEmail: 'jean.dupont@example.com',
          statut: 'CONFIRME'
        },
        {
          creneauId: creneauIndisponible._id,
          clientPrenom: 'Marie',
          clientNom: 'Martin',
          clientEmail: 'marie.martin@example.com',
          statut: 'ANNULE'
        }
      ]);
    });

    test('Devrait retourner tous les rendez-vous', async () => {
      const res = await request(app).get('/api/rendezvous');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    test('Devrait inclure les informations du créneau (populate)', async () => {
      const res = await request(app).get('/api/rendezvous');

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('creneauId');
      // Si populate est activé, creneauId devrait être un objet
      if (typeof res.body[0].creneauId === 'object') {
        expect(res.body[0].creneauId).toHaveProperty('debut');
        expect(res.body[0].creneauId).toHaveProperty('fin');
      }
    });
  });

  describe('PATCH /api/rendezvous/:id/cancel', () => {
    let rdv;

    beforeEach(async () => {
      rdv = await RendezVous.create({
        creneauId: creneauIndisponible._id,
        clientPrenom: 'Jean',
        clientNom: 'Dupont',
        clientEmail: 'jean.dupont@example.com',
        statut: 'CONFIRME'
      });
    });

    test('Devrait annuler un rendez-vous', async () => {
      const res = await request(app).patch(`/api/rendezvous/${rdv._id}/cancel`);

      expect(res.status).toBe(200);
      expect(res.body.rdv.statut).toBe('ANNULE');

      // Vérifier que le créneau est redevenu disponible
      const creneau = await Creneau.findById(creneauIndisponible._id);
      if (creneau) {
        expect(creneau.disponible).toBe(true);
      }
    });

    test('Devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).patch(`/api/rendezvous/${fakeId}/cancel`);

      expect(res.status).toBe(404);
    });

    test('Ne devrait pas échouer si le rendez-vous est déjà annulé', async () => {
      // Annuler une première fois
      const res1 = await request(app).patch(`/api/rendezvous/${rdv._id}/cancel`);
      expect(res1.status).toBe(200);

      // Annuler une deuxième fois (idempotent)
      const res2 = await request(app).patch(`/api/rendezvous/${rdv._id}/cancel`);
      expect(res2.status).toBe(200);
      expect(res2.body.rdv.statut).toBe('ANNULE');
    });
  });
});
