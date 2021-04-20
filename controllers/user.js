// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

// Création du controller contenant toute la logique métier s'appliquant aux utilisateurs
// Dans le controller il n'y a que la logique métier
// La logique de routing sera enregistrée dans le dossier routes

const bcrypt = require('bcrypt'); // Import de l'algorithme 'bcrypt' pour hasher le mot de passe des utilisateurs
const jwt = require('jsonwebtoken'); // Import de 'jsonwebtoken' pour attribuer un token à un utilisateur au moment de sa connexion

const User = require('../models/User'); // Import du modèle 'User' créé grâce à la fonction schéma de mongoose


// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Utilisation de la méthode hash de bcrypt en lui passant le mdp de l'utilisateur
      .then(hash => { // Récupération du hash de mdp et enregistrement en tant que nouvel utilisateur dans la BDD mongoDB
        const user = new User({ // Création du nouvel utilisateur avec le modèle mongoose
          email: req.body.email, // Passer l'email trouvé dans le corps de la requête
          password: hash // Passer le mdp hashé de bcrypt
        });
        user.save() // Enregistrement de l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Envoi d'une réponse au front-end avec un statut 201
          .catch(error => res.status(400).json({ error })); // Code erreur s'il existe déjà un utilisateur avec cette adresse email
      })
      .catch(error => res.status(500).json({ error })); // Code erreur en cas de problème
};

// Connexion d'un utilisateur déjà existant en vérifiant s'il existe dans la base MongoDB
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Utilisation de la méthode findOne pour trouver l'utilisateur correspondant à l'adresse entrée dans la BDD 
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Code erreur si on ne trouve pas l'utilisateur
        }
        bcrypt.compare(req.body.password, user.password) // Utilisation de bcrypt pour comparer les hashs et savoir s'ils ont la même string d'origine
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' }); // Code erreur si ce n'est pas le bon utilisateur ou si le mdp est incorrect
            }
            res.status(200).json({ // Si les informations sont correctes, envoi d'une réponse au front-end avec un statut 200 
                userId: user._id, // Permet de vérifier si la requête est authentifiée
                token: jwt.sign( // Encodage d'un nouveau token avec une chaine de développement temporaire
                  { userId: user._id }, // Encodage de l'userdID
                  'RANDOM_TOKEN_SECRET', // Clé d'encodage du token (peut être rendue plus complexe si nécessaire)
                  { expiresIn: '24h' } // Argument de configuration avec une expiration au bout de 24h
                )
              });
          })
          .catch(error => res.status(500).json({ error })); // Code erreur en cas de problème
      })
      .catch(error => res.status(500).json({ error })); // Code erreur en cas de problème
};