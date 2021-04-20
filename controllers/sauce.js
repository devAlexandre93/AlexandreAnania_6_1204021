// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

// Création du controller contenant toute la logique métier s'appliquant aux sauces
// Dans le controller il n'y a que la logique métier
// La logique de routing sera enregistrée dans le dossier routes

const Sauce = require('../models/Sauce'); // Import du modèle 'Sauce' créé grâce à la fonction schéma de mongoose
const fs = require('fs'); // Import du module 'file system' de Node permettant de gérer les téléchargements et les modifications d'images


// Créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // Stockage des données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
  delete sauceObject._id; // Suppression l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par MongoDB lors de la création dans la base de données
  const sauce = new Sauce({ // Création d'une instance du modèle Sauce
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save() // Sauvegarde de la sauce dans la base de données
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'})) // Envoi d'une réponse au front-end avec un statut 201
    .catch(error => res.status(400).json({ error })); // Code erreur en cas de problème
};


// Moddifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { // Stockage des données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  if (req.file) { // Si il y a une modification d'image
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => { // Suppression de l'ancienne image
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Application des paramètres sauceObject
          .then(() => res.status(200).json({ message: 'Sauce et image modifiées !'})) // Envoi d'une réponse au front-end avec un statut 200
          .catch(error => res.status(400).json({ error })); // Code erreur en cas de problème
      });
    })
    .catch(error => res.status(400).json({ error }));
  } else { // Si il n'y a pas une modification d'image
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Application des paramètres sauceObject
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'})) // Envoi d'une réponse au front-end avec un statut 200
    .catch(error => res.status(404).json({ error })); // Code erreur en cas de problème
  }  
};


// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Chercher l'objet pour obtenir l'url de l'image (afin de la supprimer)
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; // Récupérer l'url de l'image de la sauce
      fs.unlink('images/' + filename, () => { // Suppression de l'image
        Sauce.deleteOne({ _id: req.params.id }) // Suppression du document correspondant de la base de données
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'})) // Envoi d'une réponse au front-end avec un statut 200
          .catch(error => res.status(400).json({ error })); // Code erreur en cas de problème
      });
    })
    .catch(error => res.status(500).json({ error })); // Code erreur en cas de problème
};

// Afficher une sauce
exports.getOneSauce = (req, res, next) => { // Utilisation de la méthode findOne avec l'objet de comparaison, il faut que l'id de la sauce soit le même que le paramètre de requête
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce)) // Retourne l'objet et une réponse
    .catch(error => res.status(404).json({ error })); // Code erreur en cas de problème
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => { // Utilisation de la méthode find afin d'obtenir la liste complète des sauces sous forme de tableau depuis la base de données
  Sauce.find()
    .then(sauces => res.status(200).json(sauces)) // Retourne le tableau avec les données et une réponse
    .catch(error => res.status(400).json({ error })); // Code erreur en cas de problème
};

// Liker et disliker les sauces
exports.rateSauce = (req, res, next) => {
  const like = req.body.like // Like présent dans le body
  const userId = req.body.userId
  const sauceId = req.params.id
  if (like === 1) { // L'utilisateur like la sauce
    Sauce.updateOne({ _id: sauceId }, {$push: { usersLiked: userId }, $inc: { likes: +1 }}) // On push (ajoute) l'utilisateur et on incrémente le compteur de 1
      .then(() => res.status(201).json({ message: 'La sauce a été likée !' })) // Envoi d'une réponse au front-end avec un statut 201
      .catch((error) => res.status(400).json({ error })) // Code erreur en cas de problème
  } if (like === -1) { // L'utilisateur dislike la sauce
    Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }}) // On push (ajoute) l'utilisateur et on incrémente le compteur de 1
      .then(() => { res.status(201).json({ message: 'La sauce a été dislikée !' })}) // Envoi d'une réponse au front-end avec un statut 201
      .catch((error) => res.status(400).json({ error })) // Code erreur en cas de problème
  } if (like === 0) { // L'utilisateur retire un like ou un dislike
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Retrait d'un like
          Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }}) // On pull (retire) l'utilisateur et on incrémente le compteur de -1
            .then(() => res.status(201).json({ message: 'Le like a été retiré !' })) // Envoi d'une réponse au front-end avec un statut 201
            .catch((error) => res.status(400).json({ error })) // Code erreur en cas de problème
        } if (sauce.usersDisliked.includes(userId)) { // Retrait d'un dislike
          Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }}) // On pull (retire) l'utilisateur et on incrémente le compteur de -1
            .then(() => res.status(201).json({ message: 'Le dislike a été retiré !' })) // Envoi d'une réponse au front-end avec un statut 201
            .catch((error) => res.status(400).json({ error })) // Code erreur en cas de problème
        }
      })
      .catch((error) => res.status(404).json({ error })) // Code erreur en cas de problème
  }
}



