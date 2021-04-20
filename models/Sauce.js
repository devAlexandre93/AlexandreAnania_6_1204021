// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

const mongoose = require('mongoose'); // Import de 'mongoose'

// Création d'un schéma mongoose pour que les données de la base MongoDB ne puissent pas différer de celles qu l'on a précisé ici
// L'id est généré automatiquement par MongoDB
const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true},
  name: {type: String, required: true},
  manufacturer: {type: String, required: true},
  description: {type: String, required: true},
  mainPepper: {type: String, required: true},
  imageUrl: {type: String, required: true},
  heat: {type: Number, required: true},
  likes: {type: Number, required: true},
  dislikes: {type: Number, required: true},
  usersLiked: {type: [String], required: true},
  usersDisliked: {type: [String], required: true}
});

// Export
module.exports = mongoose.model('Sauce', sauceSchema);