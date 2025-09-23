# Déploiement Docker — Rrezhair

## Lancer le projet avec Docker

1. Ouvre un terminal dans le dossier `api/` (là où il y a `docker-compose.yml`)
2. Lance les conteneurs (API + MongoDB) :

```bash
sudo docker-compose up --build
```

- L'API sera dispo sur [http://localhost:3000](http://localhost:3000)
- MongoDB sera dispo sur le port 27017

3. Pour arrêter les conteneurs :
```bash
sudo docker-compose down
```

---

## Sécurité MongoDB
- Un utilisateur `root` et un mot de passe (`1234`) sont définis dans le service MongoDB via les variables d'environnement :
  - `MONGO_INITDB_ROOT_USERNAME=root`
  - `MONGO_INITDB_ROOT_PASSWORD=1234`
- L'API se connecte à MongoDB avec cette URI :
  - `MONGO_URI=mongodb://root:1234@mongo:27017/rrezhair?authSource=admin`
- Cela évite que n'importe qui puisse accéder à la base sans identification.

---

## Healthcheck Docker
- Un healthcheck est configuré sur l'API : Docker vérifie régulièrement que l'API répond bien sur `/health`.
- Si l'API ne répond plus, Docker peut redémarrer automatiquement le conteneur.
- MongoDB a aussi un healthcheck pour vérifier qu'il est bien prêt.

---

## Explication détaillée du docker-compose.yml

- **mongo** :
  - Lance une base MongoDB protégée par un mot de passe.
  - Expose le port 27017 et sauvegarde les données dans un volume Docker.
  - Healthcheck pour s'assurer que la base répond.
- **api** :
  - Construit l'image à partir du Dockerfile du dossier courant.
  - Expose le port 3000.
  - Récupère l'URI MongoDB via les variables d'environnement.
  - Healthcheck sur `/health`.
  - Dépend du service mongo (attend que la base soit prête).

---

## Commandes à retenir

- **Lancer API + MongoDB** :
  ```bash
  sudo docker-compose up --build
  ```
- **Arrêter tous les services** :
  ```bash
  sudo docker-compose down
  ```
- **Lancer l’API seul (hors Docker)** :
  ```bash
  npm run dev
  ```
- **Installer les dépendances (hors Docker)** :
  ```bash
  npm install
  ```

---

## Bonnes pratiques
- Toujours utiliser un mot de passe pour MongoDB en production.
- Utiliser le healthcheck pour surveiller l’état de l’API et de la base.
- Documenter chaque variable importante et chaque service dans le README.

