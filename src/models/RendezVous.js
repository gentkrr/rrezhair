// models/RendezVous.js
const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema(
  {
    creneauId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creneau', required: true },
    statut: {
      type: String,
      enum: ['CONFIRME', 'ANNULE'],
      default: 'CONFIRME',
    },
    // Optionnel: infos client si pas d'auth
    clientPrenom: { type: String },
    clientNom: { type: String },
    clientEmail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RendezVous', rendezVousSchema);
