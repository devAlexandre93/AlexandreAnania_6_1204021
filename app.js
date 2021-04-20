// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

// app.js fait appel aux différentes fonctions implémentées dans l'APi : Accès aux images, aux routes user et sauce

// Import des modules npm - Ajout des plugins externes
const express = require('express'); // Importation d'express => Framework basé sur node.js
// Import du module 'body-parser' permettant d'extraire l'objet JSON de la demande POST provenant de l'application front-end
const bodyParser = require('body-parser'); // Plugin pour extraire l'objet JSON des requêtes POST
// Import de 'mongoose' pour pouvoir utiliser la base de données
const mongoose = require('mongoose'); // Plugin 'mongoose' pour se connecter à la base de données MongoDB
// Import de 'path' pour permettre l'accès au chemin de notre système de fichier
const path = require('path'); // Plugin permettant l'upload des images et de travailler avec les répertoires et chemins de fichier
// Import du module 'helmet' pour protéger l'application de certaines vulnérabilités en configurant de manière appropriée des en-têtes HTTP
// Sécurise les requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// Ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// Fournit entre autres une protection contre le cross-site scripting, le sniffing et le clickjacking
const helmet = require('helmet');
// Import de 'cookie-session' pour garantir que les cookies n’ouvrent pas notre application aux attaques
const session = require('cookie-session')

// Utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données grâce à variables d'environnement
require('dotenv').config();

// Déclaration des routes
const sauceRoutes = require('./routes/sauce'); // Import de la route dédiée aux sauces
const userRoutes = require('./routes/user'); // Import la route dédiée aux utilisateurs

// Connexion à la base de données MongoDB (avec la sécurité vers le fichier .env pour cacher le mot de passe)
// Mongoose permet d'implémenter des schémas de données stricts afin de rendre notre application plus robuste
mongoose.connect(process.env.DB_URI,
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création d'une application express  
const app = express(); // L'application utilise le framework express

// Middleware Header contournant les erreurs en débloquant certains systèmes de sécurité CORS
// Le but est que n'importe quel utilisateur puisse faire des requêtes depuis son navigateur
app.use((req, res, next) => {
    // Les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Les en-têtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Lles méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Options pour sécuriser les cookies
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
app.use(session({
  name: 'session',
  secret: 's3Cur3',
  cookie: { 
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}));

// Transformation des données arrivant de la requête POST en un objet JSON exploitable
app.use(bodyParser.json());

// Sécurisation d'express en définissant diverses en-têtes HTTP - https://expressjs.com/fr/advanced/best-practice-security.html
app.use(helmet());

// Gestion de la ressource image de façon statique
app.use('/images', express.static(path.join(__dirname, 'images'))); // Midleware qui permet de charger les fichiers qui sont dans le repertoire images

// Utilisation des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Export de l'application express pour pourvoir la déclarer dans server.js
module.exports = app;
