//CONTROLLER USER

const bcrypt = require('bcrypt'); //hashage du mot de passe
const jwt = require('jsonwebtoken'); //création des token d'identification pour la session

const User = require('../models/user'); //importation du model User


//INSCRIPTION USER
exports.signUpUser = (req, res, next) => {
    //cryptage du mot de passe
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
                            'RANDOM_TOKEN_SECRET',
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