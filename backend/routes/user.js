//ROUTES USER

const express = require('express');
const userRouter = express.Router(); //appel méthode router de express

const userCtrl = require('../controllers/user');//importation des controllers user

//routes
userRouter.post('/signup',  userCtrl.signUpUser);
userRouter.post('/login', userCtrl.loginUser);

module.exports = userRouter;