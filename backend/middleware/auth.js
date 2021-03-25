//AUTHENTIFICATION

// Création du middleware de protection des routes et vérification de l'autentification du user avant l'autorisation de l'envoie des requêtes

const jwt = require('jsonwebtoken'); //token

module.exports = (req, res, next) => {
  //try catch : il peut y avoir des erreurs
  try {
    //extraction du token du header Authorization
    const token = req.headers.authorization.split(' ')[1];
    //verify : décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //comparaison avec l'Id user
    const userId = decodedToken.userId;
    //si invalide alors erreur générée
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
      //si valide alors exécution de la requête
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};

