const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email déjà utilisé' });
    const user = await User.create({ nom, prenom, email, password });
    res.status(201).json({ message: 'Utilisateur créé', user: { id: user._id, nom, prenom, email } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '2h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Promotion admin protégée par un secret côté serveur
exports.makeAdmin = async (req, res) => {
  try {
    const { email, secret } = req.body || {};
    if (!email || !secret) return res.status(400).json({ message: 'email et secret requis' });
    if (secret !== (process.env.ADMIN_SECRET || 'admin-dev-secret')) {
      return res.status(403).json({ message: 'Secret invalide' });
    }
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Rôle mis à jour', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
