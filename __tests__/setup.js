const mongoose = require('mongoose');

// Setup avant tous les tests
beforeAll(async () => {
  // Connexion à une base de test
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://root:1234@localhost:27017/rrezhair_test?authSource=admin';
  await mongoose.connect(mongoUri);
});

// Nettoyage après tous les tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Nettoyage entre chaque test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
