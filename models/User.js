// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

const mongoose = require('mongoose'); // Import de 'mongoose'
const uniqueValidator = require('mongoose-unique-validator'); // Import permettant de valider l'unicité de l'email

// Création d'un schéma mongoose dédié à l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // L'email doit être unique
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // Plugin garantissant que l'email est unique

// Export
module.exports = mongoose.model('User', userSchema);