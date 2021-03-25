//ROUTES SAUCE

const express = require('express');
const sauceRouter = express.Router(); //appel méthode router de express

const auth = require('../middleware/auth'); //importation authentification
const multer = require('../middleware/multer-config'); //importation multer pour la gestion des images

const sauceCtrl = require('../controllers/sauce'); //importation des controllers sauce

//routes
sauceRouter.post('/',auth, multer, sauceCtrl.addSauce);
sauceRouter.put('/:id',auth,multer, sauceCtrl.modifySauce);
sauceRouter.get('/',auth,  sauceCtrl.getAllSauce);
sauceRouter.get('/:id',auth,  sauceCtrl.getOneSauce);
sauceRouter.delete('/:id', auth, sauceCtrl.deleteSauce);
sauceRouter.post('/:id/like', auth, sauceCtrl.likeStatusSauce);


module.exports = sauceRouter;