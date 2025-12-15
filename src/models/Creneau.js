// models/Creneau.js
const mongoose = require('mongoose');

const creneauSchema = new mongoose.Schema({
  debut: { type: Date, required: true },
  fin: { type: Date, required: true },
  disponible: { type: Boolean, default: true }
}, { versionKey: false });

module.exports = mongoose.model('Creneau', creneauSchema);
