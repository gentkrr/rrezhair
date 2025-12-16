// models/RendezVous.js
const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  creneauId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creneau',
    required: true
  },
  clientPrenom: {
    type: String,
    required: true
  },
  clientNom: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['CONFIRME', 'ANNULE'],
    default: 'CONFIRME'
  }
});

module.exports = mongoose.model('RendezVous', rendezVousSchema);
