// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

// Création du router contenant les fonctions qui s'appliquent aux différentes routes pour les utilisateurs
// Dans le router il n'y a que la logique de routing
// La logique métier sera enregistrée dans le dossier controllers

const express = require('express'); // Ajout de plugin externe nécessaire pour utiliser le router d'Express
const router = express.Router(); // Appel du router avec la méthode mise à disposition par Express

const userCtrl = require('../controllers/user'); // Import du controller pour utiliser les fonctions

router.post('/signup', userCtrl.signup); // Route permettant de créer un nouvel utilisateur
router.post('/login', userCtrl.login); // Route permettant de à un utiliateur déjà existant de se connecter

// Export
module.exports = router;