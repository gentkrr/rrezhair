// models/RendezVous.js
const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  clientNom: { type: String, required: true },
  clientEmail: { type: String, required: true },
  dateHeure: { type: Date, required: true },
  statut: {
    type: String,
    enum: ['CONFIRME', 'ANNULE'],
    default: 'CONFIRME'
  }
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);
