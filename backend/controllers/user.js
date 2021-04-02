//CONTROLLER USER

const bcrypt = require('bcrypt'); //hashage du mot de passe
const jwt = require('jsonwebtoken'); //création des token d'identification pour la session

const User = require('../models/user'); //importation du model User

// Securite de MDP 
var owasp = require('owasp-password-strength-test');
 
// Pass a hash of settings to the `config` method. The settings shown here are
// the defaults.
owasp.config({
  allowPassphrases       : true,
  maxLength              : 128,
  minLength              : 10,
  minPhraseLength        : 20,
  minOptionalTestsToPass : 4,
});

//INSCRIPTION USER
exports.signUpUser = (req, res, next) => {
    //cryptage du mot de passe
    var result = owasp.test(req.body.password)
        if (result.errors.length>0 ) res.status(400).json({ 'error':result.errors })
    //console.log (result)
    bcrypt.hash(req.body.password, 10)
        //creation user et enregistrement dans le base de donnée
        .then(hash => {
            
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


//CONNEXION USER
exports.loginUser = (req, res, next) => {
    //chercher l'adresse mail dans la base de donnée
    User.findOne({ email: req.body.email })
        .then(user => {
            //si l'utilisateur n'est pas dans la base de donnée
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //si l'utilisateur est trouvé alors vérification du mot de passe crypté
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //si le mot de passe ne correspond pas
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //si le mot de passe correspond alors création d'un token d'identification
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            //création d'un token
                            '(process.env.TOKEN)',
                            //valable 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                // erreur serveur
                .catch(error => res.status(500).json({ error }));
        })
        // erreur serveur
        .catch(error => res.status(500).json({ error }));
};