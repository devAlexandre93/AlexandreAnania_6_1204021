// Formation OpenClassrooms - Développeur Web - Projet 6 - Alexandre Anania

// Requêtes http et réponse
const http = require('http'); // Import du package http
const app = require('./app'); // Import de "app" pour utiliser l'application sur le serveur

// La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
// Configure le port de connexion en fonction de l'environnement
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); // Ajout du port de connexion, si aucun port n'est fourni on écoutera sur le port 3000
app.set('port', port); // Configuration du port de connexion

// La fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création d'un serveur avec express utilisant "app"
const server = http.createServer(app); // Constante pour les appels serveur (requêtes et réponses)

// Gestion des évenements serveur + retour console
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Le serveur écoute le port que l'on a défini
server.listen(port);

