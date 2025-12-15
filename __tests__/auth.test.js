const request = require('supertest');
const express = require('express');
const usersRouter = require('../src/routes/users');
const User = require('../src/models/User');

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('Tests d\'authentification', () => {
  describe('POST /api/users/register', () => {
    test('Devrait créer un nouvel utilisateur', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          prenom: 'Jean',
          nom: 'Dupont'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Utilisateur créé');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.user).not.toHaveProperty('password');
    });

    test('Devrait rejeter un email déjà existant', async () => {
      await User.create({
        email: 'existing@example.com',
        password: 'hashedpassword',
        prenom: 'Existing',
        nom: 'User'
      });

      const res = await request(app)
        .post('/api/users/register')
        .send({
          email: 'existing@example.com',
          password: 'Password123!',
          prenom: 'Jean',
          nom: 'Dupont'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('Devrait accepter tout mot de passe (pas de validation côté API)', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          email: 'test2@example.com',
          password: '123',
          prenom: 'Jean',
          nom: 'Dupont'
        });

      // L'API actuelle n'a pas de validation de mot de passe
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'login@example.com',
          password: 'Password123!',
          prenom: 'Test',
          nom: 'User'
        });
    });

    test('Devrait connecter un utilisateur avec des identifiants valides', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      // L'API actuelle ne retourne que le token, pas l'objet user
    });

    test('Devrait rejeter un mot de passe incorrect', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('incorrect');
    });

    test('Devrait rejeter un email inexistant', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('incorrect');
    });
  });
});
