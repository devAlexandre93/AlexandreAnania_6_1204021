// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

const multer = require('multer'); // Import de 'multer' permettant de gérer les fichiers entrants dans les requêtes HTTP

// Création d'un dictionnaire des types MIME pour définir le format des images
// Création d'un objet pour ajouter une extension en fonction du type mime du ficher
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Création d'un objet de configuration pour préciser à multer où enregistrer les fichiers images et les renommer
const storage = multer.diskStorage({
  destination: (req, file, callback) => { // Destination d'enregistrement des images
    callback(null, 'images'); // Dossier "images" du backend
  },
  filename: (req, file, callback) => { // Définir des noms de fichier pour éviter les doublons
    const name = file.originalname.split(' ').join('_').split('.')[0]; // Générer un nouveau nom avec le nom d'origine
    const extension = MIME_TYPES[file.mimetype]; // Générer l'extension
    // Appel du callback, null permet de spécifier qu'il n'y a pas d'erreur
    callback(null, name + Date.now() + '.' + extension); // Genèrer le nom complet du fichier : Nom d'origine + numero unique + . + extension
  }
});

// Export en passant l'objet storage
// La méthode .single permet de préciser que le fichier est unique que c'est une image
module.exports = multer({storage: storage}).single('image');