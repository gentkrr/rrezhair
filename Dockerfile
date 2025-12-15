# Dockerfile simple pour API Node.js
FROM node:22

# Crée le dossier de l'app
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste du code
COPY . .

# Expose le port (sera utilisé par docker-compose)
EXPOSE 3000

# Commande pour lancer l'API
CMD [ "npm", "start" ]
