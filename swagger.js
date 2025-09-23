const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Rrezhair',
      version: '1.0.0',
      description: 'Documentation de l’API de réservation Rrezhair',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/server.js', './src/routes/*.js'], // :danger: chemins relatifs depuis le conteneur
};const swaggerSpec = swaggerJSDoc(options);// :petit_diamant_bleu: Export d’une fonction qui prend app en paramètre
module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};