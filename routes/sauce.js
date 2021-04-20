// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

// Création du router contenant les fonctions qui s'appliquent aux différentes routes pour les sauces
// Dans le router il n'y a que la logique de routing
// La logique métier sera enregistrée dans le dossier controllers

const express = require('express'); // Ajout de plugin externe nécessaire pour utiliser le router d'Express
const router = express.Router(); // Appel du router avec la méthode mise à disposition par Express

// Ajout des middlewares
const sauceCtrl = require('../controllers/sauce'); // Import du controller pour utiliser les fonctions
const auth = require('../middleware/auth'); // Import du middleware auth pour sécuriser les routes
const multer = require('../middleware/multer-config'); // Import du middleware multer pour la gestion des images

router.get('/', auth, sauceCtrl.getAllSauces); // Route permettant d'fficher toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Route permettant de créer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route permettant d'fficher une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route permettant de modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Route permettant de supprimer une sauce
router.post('/:id/like',auth, sauceCtrl.rateSauce); // Route permettant de gérer les likes et dislikes des sauces

// Export
module.exports = router;