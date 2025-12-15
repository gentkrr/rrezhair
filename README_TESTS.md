# 🧪 Guide des Tests Automatiques - Rrez'hair API

## 📋 Vue d'ensemble

Cette suite de tests couvre **25 scénarios** répartis en 3 catégories :
- **Authentification** (6 tests)
- **Gestion des créneaux** (9 tests)
- **Gestion des rendez-vous** (10 tests)

## 🚀 Démarrage rapide

### 1. Installation
```bash
cd api
npm install
```

### 2. Lancer MongoDB (si pas déjà fait)
```bash
docker-compose up -d mongo
```

### 3. Exécuter les tests

**Option A : Script automatique (recommandé)**
```bash
./run-tests.sh
```

**Option B : Commandes NPM**
```bash
# Tous les tests (une fois)
npm test

# Mode watch (relance auto à chaque modification)
npm run test:watch

# Avec rapport de couverture
npm run test:coverage
```

## 📁 Structure des tests

```
api/
├── __tests__/
│   ├── setup.js              # Configuration globale
│   ├── auth.test.js          # Tests authentification
│   ├── creneaux.test.js      # Tests créneaux
│   └── rendezvous.test.js    # Tests rendez-vous
├── jest.config.js            # Configuration Jest
├── .env.test                 # Variables d'env pour tests
└── run-tests.sh              # Script de lancement
```

## 🎯 Détail des tests

### 1. Tests d'authentification (`auth.test.js`)

#### POST /api/users/register
- ✅ Création d'un nouvel utilisateur
- ❌ Rejet d'un email existant
- ❌ Rejet d'un mot de passe faible

#### POST /api/users/login
- ✅ Connexion avec identifiants valides
- ❌ Rejet d'un mot de passe incorrect
- ❌ Rejet d'un email inexistant

### 2. Tests des créneaux (`creneaux.test.js`)

#### GET /api/creneaux
- ✅ Récupération de tous les créneaux
- ✅ Filtrage par date
- ✅ Format lisible (id, date, heure)

#### POST /api/creneaux
- ✅ Création avec date/heure locale
- ✅ Création avec dates ISO
- ❌ Rejet sans dates

#### POST /api/creneaux/bulk
- ✅ Création en masse
- ❌ Rejet d'un intervalle invalide

#### DELETE /api/creneaux/:id
- ✅ Suppression d'un créneau existant
- ❌ Erreur 404 pour ID inexistant

### 3. Tests des rendez-vous (`rendezvous.test.js`)

#### POST /api/rendezvous
- ✅ Réservation sur créneau disponible
- ❌ Rejet sur créneau indisponible
- ❌ Rejet sans creneauId
- ❌ Rejet avec ID invalide

#### GET /api/rendezvous
- ✅ Récupération de tous les RDV
- ✅ Populate des informations créneau

#### PATCH /api/rendezvous/:id/cancel
- ✅ Annulation d'un RDV
- ❌ Erreur 404 pour ID inexistant
- ✅ Idempotence (double annulation OK)

## 🔧 Configuration

### Base de données de test

Les tests utilisent une base MongoDB séparée : `rrezhair_test`

**Connexion par défaut** (`.env.test`) :
```
MONGO_URI=mongodb://root:1234@localhost:27017/rrezhair_test?authSource=admin
```

### Nettoyage automatique

- **Avant tous les tests** : Connexion à la base de test
- **Après chaque test** : Suppression de toutes les données
- **Après tous les tests** : Suppression de la base + fermeture connexion

Cela garantit l'**isolation** et la **reproductibilité** des tests.

## 📊 Rapport de couverture

```bash
npm run test:coverage
```

Génère un rapport HTML dans `coverage/lcov-report/index.html`

**Objectif** : > 80% de couverture sur les routes critiques

## 🐛 Déboguer un test qui échoue

### 1. Lancer un seul fichier
```bash
npm test auth.test.js
```

### 2. Lancer un seul test
```bash
npm test -- -t "Devrait créer un nouvel utilisateur"
```

### 3. Mode verbose
```bash
npm test -- --verbose
```

### 4. Voir les logs
Ajoutez `console.log()` dans votre test ou dans le code testé.

## ✅ Critères de validation

Un test est considéré comme **réussi** si :
- ✅ Status HTTP attendu
- ✅ Structure de réponse correcte
- ✅ Données en base cohérentes
- ✅ Effets de bord vérifiés (ex: créneau indisponible après réservation)

## 🚨 Problèmes courants

### MongoDB non démarré
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution** : `docker-compose up -d mongo`

### Port déjà utilisé
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution** : Changez le port dans `.env.test` ou arrêtez le processus

### Tests qui échouent aléatoirement
**Cause** : Données résiduelles entre tests
**Solution** : Vérifiez que `afterEach` nettoie bien la base

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Mongoose Testing Guide](https://mongoosejs.com/docs/jest.html)

## 🎓 Pour aller plus loin

### Tests E2E (End-to-End)
Tester l'application complète (front + back) avec **Cypress** ou **Playwright**

### Tests de charge
Simuler des milliers d'utilisateurs avec **Artillery** ou **k6**

### CI/CD
Automatiser les tests à chaque commit avec **GitHub Actions**

Exemple `.github/workflows/tests.yml` :
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: docker-compose up -d mongo
      - run: npm test
```

## 🤝 Contribution

Pour ajouter un nouveau test :
1. Créer le fichier dans `__tests__/`
2. Suivre la structure existante
3. Vérifier que tous les tests passent : `npm test`
4. Ajouter la documentation dans `R8_TESTS_AUTOMATIQUES.md`

---

**Auteur** : KRYEZIU Genti  
**Projet** : Rrez'hair - Application de réservation de rendez-vous  
**Date** : Octobre 2025
