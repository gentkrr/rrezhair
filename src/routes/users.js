const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Email déjà utilisé
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token
 *       400:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/me', auth, userController.me);

/**
 * @swagger
 * /api/users/make-admin:
 *   post:
 *     summary: Promouvoir un utilisateur en administrateur (protégé par un secret serveur)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               secret:
 *                 type: string
 *                 description: Secret côté serveur (ADMIN_SECRET)
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 *       403:
 *         description: Secret invalide
 */
router.post('/make-admin', userController.makeAdmin);

module.exports = router;
