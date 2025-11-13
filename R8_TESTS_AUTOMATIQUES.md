# R8 - Tests Automatiques - KRYEZIU Genti

## 🔄 CI/CD - Intégration Continue

### Workflow GitHub Actions

#### Déclenchement
- ✅ À chaque `push` sur `main` et `develop`
- ✅ À chaque `pull request` vers ces branches

#### Environnement de test
- 🐳 MongoDB 7.0 dans un conteneur Docker
- ⚙️ Node.js 20
- 🔒 Variables d'environnement sécurisées

#### Étapes du pipeline
1. **Préparation**
   - Checkout du code
   - Configuration de Node.js 20
   - Mise en cache des dépendances

2. **Tests**
   - Installation des dépendances avec `npm ci`
   - Exécution des tests unitaires et d'intégration
   - Vérification de la couverture de code

#### Badge de statut
```markdown
![CI Status](https://github.com/ton-username/ton-repo/actions/workflows/tests.yml/badge.svg)
```

---

## 📋 Scénarios de tests

| Scénario | Jeu de test | Résultats attendus | Remarques / État actuel |
|----------|-------------|-------------------|------------------------|
| **Authentification** | | | |
| Inscription utilisateur valide | Email: test@example.com<br>Password: Password123!<br>Prénom: Jean<br>Nom: Dupont | ✅ Status 201<br>✅ Token JWT retourné<br>✅ Utilisateur créé en base | ✅ Implémenté |
| Inscription avec email existant | Email déjà en base | ❌ Status 400<br>❌ Message d'erreur | ✅ Implémenté |
| Inscription avec mot de passe faible | Password: 123 | ❌ Status 400<br>❌ Validation échouée | ✅ Implémenté |
| Connexion avec identifiants valides | Email + password corrects | ✅ Status 200<br>✅ Token JWT retourné | ✅ Implémenté |
| Connexion avec mot de passe incorrect | Email valide + mauvais password | ❌ Status 401<br>❌ Authentification refusée | ✅ Implémenté |
| Connexion avec email inexistant | Email non enregistré | ❌ Status 401<br>❌ Utilisateur introuvable | ✅ Implémenté |
| **Gestion des créneaux** | | | |
| Récupération de tous les créneaux | GET /api/creneaux | ✅ Status 200<br>✅ Array de créneaux<br>✅ Format lisible (id, date, heure) | ✅ Implémenté |
| Filtrage par date | GET /api/creneaux?date=2025-10-27 | ✅ Status 200<br>✅ Créneaux du jour uniquement | ✅ Implémenté |
| Création créneau (format local) | date: 2025-10-27<br>start: 14:00<br>end: 14:30 | ✅ Status 201<br>✅ Créneau créé<br>✅ disponible=true | ✅ Implémenté |
| Création créneau (format ISO) | debut/fin en ISO 8601 | ✅ Status 201<br>✅ Créneau créé | ✅ Implémenté |
| Création sans dates | Body vide | ❌ Status 400<br>❌ Validation échouée | ✅ Implémenté |
| Création en masse (bulk) | date + ranges + interval | ✅ Status 201<br>✅ Plusieurs créneaux créés<br>✅ count > 0 | ✅ Implémenté |
| Bulk avec intervalle invalide | intervalMinutes: 0 | ❌ Status 400<br>❌ Erreur validation | ✅ Implémenté |
| Suppression créneau existant | DELETE /api/creneaux/:id | ✅ Status 200<br>✅ Créneau supprimé | ✅ Implémenté |
| Suppression créneau inexistant | ID invalide | ❌ Status 404<br>❌ Créneau introuvable | ✅ Implémenté |
| **Gestion des rendez-vous** | | | |
| Réservation sur créneau disponible | creneauId valide + infos client | ✅ Status 201<br>✅ RDV créé<br>✅ Créneau devient indisponible | ✅ Implémenté |
| Réservation sur créneau indisponible | creneauId déjà réservé | ❌ Status 400<br>❌ "Créneau non disponible" | ✅ Implémenté |
| Réservation sans creneauId | Body sans creneauId | ❌ Status 400<br>❌ "creneauId requis" | ✅ Implémenté |
| Réservation avec ID invalide | creneauId inexistant | ❌ Status 400<br>❌ "Créneau introuvable" | ✅ Implémenté |
| Récupération des RDV | GET /api/rendezvous | ✅ Status 200<br>✅ Array de RDV<br>✅ Populate creneauId | ✅ Implémenté |
| Annulation RDV | PATCH /api/rendezvous/:id/cancel | ✅ Status 200<br>✅ statut=ANNULE<br>✅ Créneau redevient disponible | ✅ Implémenté |
| Annulation RDV inexistant | ID invalide | ❌ Status 404<br>❌ RDV introuvable | ✅ Implémenté |
| Annulation RDV déjà annulé | Double annulation | ✅ Status 200<br>✅ Idempotent | ✅ Implémenté |

## 🚀 Lancer les tests

### Prérequis
```bash
cd api
npm install
```

### Commandes disponibles

```bash
# Lancer tous les tests (une fois)
npm test

# Mode watch (relance automatique)
npm run test:watch

# Tests avec couverture de code
npm run test:coverage
```

### Configuration MongoDB de test

Les tests utilisent une base de données séparée : `rrezhair_test`

Connexion par défaut :
```
mongodb://root:1234@localhost:27017/rrezhair_test?authSource=admin
```

Variable d'environnement (optionnel) :
```bash
export MONGO_URI_TEST="mongodb://root:1234@localhost:27017/rrezhair_test?authSource=admin"
```

## 📊 Résultats attendus

### Exemple de sortie
```
PASS  __tests__/auth.test.js
  Tests d'authentification
    POST /api/users/register
      ✓ Devrait créer un nouvel utilisateur (XXms)
      ✓ Devrait rejeter un email déjà existant (XXms)
      ✓ Devrait rejeter un mot de passe invalide (XXms)
    POST /api/users/login
      ✓ Devrait connecter un utilisateur avec des identifiants valides (XXms)
      ✓ Devrait rejeter un mot de passe incorrect (XXms)
      ✓ Devrait rejeter un email inexistant (XXms)

PASS  __tests__/creneaux.test.js
  Tests des créneaux
    GET /api/creneaux
      ✓ Devrait retourner tous les créneaux (XXms)
      ✓ Devrait filtrer les créneaux par date (XXms)
      ✓ Devrait retourner les créneaux avec format lisible (XXms)
    POST /api/creneaux
      ✓ Devrait créer un créneau avec date/heure locale (XXms)
      ✓ Devrait créer un créneau avec dates ISO (XXms)
      ✓ Devrait rejeter un créneau sans dates (XXms)
    POST /api/creneaux/bulk
      ✓ Devrait créer plusieurs créneaux (XXms)
      ✓ Devrait rejeter un intervalle invalide (XXms)
    DELETE /api/creneaux/:id
      ✓ Devrait supprimer un créneau existant (XXms)
      ✓ Devrait retourner 404 pour un ID inexistant (XXms)

PASS  __tests__/rendezvous.test.js
  Tests des rendez-vous
    POST /api/rendezvous
      ✓ Devrait créer un rendez-vous sur un créneau disponible (XXms)
      ✓ Devrait rejeter une réservation sur un créneau indisponible (XXms)
      ✓ Devrait rejeter une réservation sans creneauId (XXms)
      ✓ Devrait rejeter une réservation avec un creneauId invalide (XXms)
    GET /api/rendezvous
      ✓ Devrait retourner tous les rendez-vous (XXms)
      ✓ Devrait inclure les informations du créneau (populate) (XXms)
    PATCH /api/rendezvous/:id/cancel
      ✓ Devrait annuler un rendez-vous (XXms)
      ✓ Devrait retourner 404 pour un ID inexistant (XXms)
      ✓ Ne devrait pas échouer si le rendez-vous est déjà annulé (XXms)

Test Suites: 3 passed, 3 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        X.XXXs
```

## 🔍 Couverture de code

Avec `npm run test:coverage`, vous obtiendrez :

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.XX |    78.XX |   90.XX |   86.XX |                   
 routes/            |   90.XX |    85.XX |   95.XX |   91.XX |                   
  creneaux.js       |   92.XX |    88.XX |   100   |   93.XX | XX-XX             
  rendezvous.js     |   89.XX |    82.XX |   90.XX |   90.XX | XX-XX             
  users.js          |   91.XX |    86.XX |   95.XX |   92.XX | XX-XX             
--------------------|---------|----------|---------|---------|-------------------
```

## 📝 User Stories testées

### US1 - Authentification
- ✅ En tant qu'utilisateur, je peux m'inscrire avec email/password
- ✅ En tant qu'utilisateur, je peux me connecter
- ✅ Le système valide la force du mot de passe
- ✅ Le système empêche les doublons d'email

### US2 - Gestion des créneaux (Admin)
- ✅ En tant qu'admin, je peux créer un créneau unique
- ✅ En tant qu'admin, je peux créer plusieurs créneaux en masse
- ✅ En tant qu'admin, je peux supprimer un créneau
- ✅ Les créneaux sont formatés de manière lisible (date, heure)

### US3 - Réservation (Client)
- ✅ En tant que client, je peux voir les créneaux disponibles
- ✅ En tant que client, je peux filtrer par date
- ✅ En tant que client, je peux réserver un créneau disponible
- ✅ Le système empêche la réservation d'un créneau indisponible
- ✅ Le créneau devient indisponible après réservation

### US4 - Annulation
- ✅ En tant que client, je peux annuler mon rendez-vous
- ✅ Le créneau redevient disponible après annulation
- ✅ L'annulation est idempotente (pas d'erreur si déjà annulé)

## 🛠️ Technologies utilisées

- **Jest** : Framework de tests
- **Supertest** : Tests d'API HTTP
- **MongoDB Memory Server** : Base de test isolée
- **Mongoose** : ORM MongoDB

## 📚 Ressources

- [Documentation Jest](https://jestjs.io/)
- [Documentation Supertest](https://github.com/visionmedia/supertest)
- [Guide TDD avec Florian Jauffret](https://blog.invivoo.com/tdd-avec-florian-jauffret/)
- [Template GSheet](https://docs.google.com/spreadsheets/d/1234567890/edit)

## ✅ Critères d'acceptation

- [x] Page 8 - Tests créée
- [x] Scénarios décrits sous forme de tableau Confluence
- [x] User Stories du MVP validées
- [x] Tests passés manuellement et validés
- [x] Programme automatisant les tests écrit
- [x] Code générant les tests capable d'être expliqué

## 🎯 Prochaines étapes

1. ✅ Intégration continue (CI/CD) avec GitHub Actions
2. ✅ Tests E2E avec Cypress pour le front mobile
3. ✅ Tests de charge avec Artillery
4. ✅ Monitoring des tests en production
