//CONTROLLER SAUCE

const Sauce = require('../models/sauce'); //importation du modèle Sauce
const fs = require('fs'); //importation module node fs (intéraction avec le système de fichier)
const bodyParser = require('body-parser'); //importation module body-parser (permet d'extraire des objet JSON)


//AJOUT SAUCE
exports.addSauce = (req, res, next) => {
  //données envoyé par le frontend sous forme form-data, puis transformer en json pour être exploitable
  const sauceObject = JSON.parse(req.body.sauce); //Récupération d'un objet JS
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  console.log(sauce);
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce créée !' }))
    .catch(error => res.status(400).json({ error }));
};


//MODIFICATION SAUCE
exports.modifySauce = (req, res, next) => {
  //vérifie si req.file existe
  const sauceObject = req.file ?
    {
      //il existe : traitement de la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      // il n'existe pas : traitement de l'objet entrant
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};


//VOIR TOUTES LES SAUCES
exports.getAllSauce = (req, res, next) => {
  //Tableau de donnée de sauces
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


//VOIR UNE SAUCE
exports.getOneSauce = (req, res, next) => {
  //Renvoit la sauce avec l'id correspondant
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


//SUPPRIMER UNE SAUCE
exports.deleteSauce = (req, res, next) => {
  //accès à la sauce corrsepondante à l'id
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //récupération du nom de fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      //Supression du fichier
      fs.unlink(`images/${filename}`, () => {
        //supression le Sauce de la DB
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


//GESTION DES LIKES ET DISLIKES
exports.likeStatusSauce = (req, res, next) => {
  //Récupération de l'id de l'utilisateur et de la requête
  const idUser = req.body.userId;
  const likeState = req.body.like;

  //Récupération à partir de l'id de la sauce likée
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //statut des likes ou dislikes 
      switch (likeState) {

        // cas like
        case 1:
          //Ajout +1 like sur la sauce
          //Ajout de l'id user dans le tableau usersLiked
          console.log('l\'utilisateur aime la sauce');
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: idUser }})
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
          break;

        //cas dislike
        case -1:
          //Ajout +1 dislike sur la sauce
          //Ajout de l'idUser dans le tableau userDisliked
          console.log('l\'utilisateur n\'aime pas la sauce');
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: idUser }})
            .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }));
          break;

        //cas nouveau click sur le même like ou dislike
        case 0:
          // Enlève 1 de like ou dislike 
          // Remet à 0 le like ou le dislike pour le user
          // Retire le nom user des tableaux correspondant
          if (sauce.usersDisliked.includes(idUser)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: idUser }})
              .then(() => res.status(200).json({ message: 'Le dislike est supprimé et le nom est enlevé !' }))
              .catch(error => res.status(400).json({ error }));
          } else {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: idUser }})
              .then(() => res.status(200).json({ message: 'Le like est supprimé et le nom est enlevé !' }))
              .catch(error => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch(error => res.status(404).json({ error }));
}