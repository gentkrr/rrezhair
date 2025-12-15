const request = require('supertest');
const express = require('express');
const creneauxRouter = require('../src/routes/creneaux');
const Creneau = require('../src/models/Creneau');

const app = express();
app.use(express.json());
app.use('/api/creneaux', creneauxRouter);

describe('Tests des créneaux', () => {
  describe('GET /api/creneaux', () => {
    test('Devrait retourner tous les créneaux', async () => {
      // Créer des créneaux pour ce test
      await Creneau.create([
        {
          debut: new Date('2025-10-27T09:00:00.000Z'),
          fin: new Date('2025-10-27T09:30:00.000Z'),
          disponible: true
        },
        {
          debut: new Date('2025-10-27T10:00:00.000Z'),
          fin: new Date('2025-10-27T10:30:00.000Z'),
          disponible: false
        },
        {
          debut: new Date('2025-10-28T09:00:00.000Z'),
          fin: new Date('2025-10-28T09:30:00.000Z'),
          disponible: true
        }
      ]);

      const res = await request(app).get('/api/creneaux');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });

    test('Devrait filtrer les créneaux par date', async () => {
      // Créer des créneaux pour ce test
      await Creneau.create([
        {
          debut: new Date('2025-10-27T09:00:00.000Z'),
          fin: new Date('2025-10-27T09:30:00.000Z'),
          disponible: true
        },
        {
          debut: new Date('2025-10-27T10:00:00.000Z'),
          fin: new Date('2025-10-27T10:30:00.000Z'),
          disponible: false
        }
      ]);

      const res = await request(app).get('/api/creneaux?date=2025-10-27');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('date', '2025-10-27');
    });

    test('Devrait retourner les créneaux avec format lisible', async () => {
      // Créer un créneau pour ce test
      await Creneau.create({
        debut: new Date('2025-10-27T09:00:00.000Z'),
        fin: new Date('2025-10-27T09:30:00.000Z'),
        disponible: true
      });

      const res = await request(app).get('/api/creneaux');

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('date');
      expect(res.body[0]).toHaveProperty('heure');
      expect(res.body[0]).toHaveProperty('disponible');
    });
  });

  describe('POST /api/creneaux', () => {
    test('Devrait créer un créneau avec date/heure locale', async () => {
      const res = await request(app)
        .post('/api/creneaux')
        .send({
          date: '2025-10-27',
          start: '14:00',
          end: '14:30'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('debut');
      expect(res.body).toHaveProperty('fin');
      expect(res.body.disponible).toBe(true);
    });

    test('Devrait créer un créneau avec dates ISO', async () => {
      const res = await request(app)
        .post('/api/creneaux')
        .send({
          debut: '2025-10-27T14:00:00.000Z',
          fin: '2025-10-27T14:30:00.000Z'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('debut');
    });

    test('Devrait rejeter un créneau sans dates', async () => {
      const res = await request(app)
        .post('/api/creneaux')
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/creneaux/bulk', () => {
    test('Devrait créer plusieurs créneaux', async () => {
      const res = await request(app)
        .post('/api/creneaux/bulk')
        .send({
          date: '2025-10-27',
          ranges: [
            { start: '09:00', end: '12:00' },
            { start: '14:00', end: '17:00' }
          ],
          intervalMinutes: 30
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('count');
      expect(res.body.count).toBeGreaterThan(0);
    });

    test('Devrait rejeter un intervalle invalide', async () => {
      const res = await request(app)
        .post('/api/creneaux/bulk')
        .send({
          date: '2025-10-27',
          ranges: [{ start: '09:00', end: '12:00' }],
          intervalMinutes: 0
        });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/creneaux/:id', () => {
    test('Devrait supprimer un créneau existant', async () => {
      const creneau = await Creneau.create({
        debut: new Date('2025-10-27T09:00:00.000Z'),
        fin: new Date('2025-10-27T09:30:00.000Z'),
        disponible: true
      });

      const res = await request(app).delete(`/api/creneaux/${creneau._id}`);

      expect(res.status).toBe(200);
      
      const deleted = await Creneau.findById(creneau._id);
      expect(deleted).toBeNull();
    });

    test('Devrait retourner 404 pour un ID inexistant', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/api/creneaux/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });
});
