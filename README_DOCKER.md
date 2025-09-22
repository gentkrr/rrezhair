# Déploiement Docker — Rrezhair

## Lancer le projet avec Docker

1. Ouvre un terminal à la racine du projet (là où il y a `docker-compose.yml`)
2. Lance les conteneurs (API + MongoDB) :

```bash
docker-compose up --build
```

- L'API sera dispo sur [http://localhost:3000](http://localhost:3000)
- MongoDB sera dispo sur le port 27017

3. Pour arrêter les conteneurs :
```bash
docker-compose down
```

---

## Explications techniques

- **Dockerfile** (dans `/api`) :
  - Utilise une image Node.js officielle
  - Installe les dépendances et lance l'API sur le port 3000
- **docker-compose.yml** :
  - Lance 2 services :
    - `mongo` (base de données MongoDB)
    - `api` (ton backend Node.js)
  - Les deux services sont sur le même réseau interne Docker
  - Les données MongoDB sont persistées dans un volume `mongo-data`
  - Les variables d'environnement sont passées à l'API (PORT, MONGO_URI)

---

## À l'oral :
- Explique que Docker permet de lancer toute l'appli (API + BDD) en une seule commande, sans rien installer sur la machine à part Docker.
- Tu peux montrer le Dockerfile et le docker-compose, et expliquer chaque ligne si besoin (voir ci-dessus).
