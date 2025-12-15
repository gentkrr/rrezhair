#!/bin/bash

echo "🧪 Lancement des tests automatiques Rrez'hair"
echo "=============================================="
echo ""

# Vérifier si MongoDB est lancé
if ! docker ps | grep -q mongo; then
    echo "⚠️  MongoDB n'est pas lancé. Démarrage..."
    cd "$(dirname "$0")"
    docker-compose up -d mongo
    echo "⏳ Attente du démarrage de MongoDB..."
    sleep 5
fi

echo "✅ MongoDB est prêt"
echo ""

# Charger les variables d'environnement de test
export $(cat .env.test | xargs)

# Lancer les tests
echo "🚀 Exécution des tests..."
echo ""
npm test

# Afficher le résumé
echo ""
echo "=============================================="
echo "✅ Tests terminés"
echo ""
echo "💡 Commandes utiles:"
echo "   npm run test:watch    - Mode watch (relance auto)"
echo "   npm run test:coverage - Rapport de couverture"
