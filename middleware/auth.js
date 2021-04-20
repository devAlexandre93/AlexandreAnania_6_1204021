// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

// Middleware pour protéger les routes sélectionnées
// Vérifie que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes

const jwt = require('jsonwebtoken'); // Import de 'jsonwebtoken'

// Vérification du token de l'utilisateur
// S'il correspond à l'id de l'utilisateur dans la requête, il sera autorisé à changer les données correspondantes

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupération du token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau grâce à .split)
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // Vérification du token décodé avec la clé secrète initiéé dans le user controller, les clés doivent correspondre
    const userId = decodedToken.userId; // Vérification que le userId envoyé avec la requête correspond au userId encodé dans le token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'UserID non valable !'; // Si le token ne correspond pas au userId : erreur
    } else {
      next(); // Si tout est valide on passe au prochain middleware
    }
  } catch (error) { // Probleme d'authentification si erreur dans les instructions
        res.status(401).json({ error: error || 'Requête non authentifiée !'})
  }
};