// DOTENV permet de cacher les informations sensibles dans le code grace au fichier '.env' creer a la racine et mis dans le gitignore
require('dotenv').config();


//APPLICATION



const express = require('express'); //ajout du framework express au projet
const helmet = require("helmet"); //sécurisation de l'app en ajoutant divers en-tête http
const bodyParser = require('body-parser'); //ajout de body-parser au projet : permet extraction d'objet JSON
const mongoose = require('mongoose'); //ajout de mongoose au projet : gestion de la DB

//Mongo interceptor: MongoDB operator escaping, prevent NoSQL-injections
var mongoInterceptor = require('mongo-interceptor');


const app = express();
const path = require('path');

//importation des fichiers routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//connexion à la base de données
mongoose.connect((process.env.USER),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//correction des erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//sécurisation de l'application (XSS)
app.use(helmet());

//middleware global : JSON
app.use(bodyParser.json());

//routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


//EXPRESS RATE LIMIT: Limitation des requetes
const rateLimit = require("express-rate-limit");

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

// only apply to requests that begin with /api/
app.use("/api/", apiLimiter);

module.exports = app;