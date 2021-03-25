//MULTER CONFIGURATION

const multer = require('multer'); // Package permettant de gérer les fichiers entrants dans les requêtes http

//type de fichiers acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//indique à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  //indique d'enregistrer les fichiers dans le dossiers images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //indique d'utiliser le nom d'origine, de remplacer les espaces par des _, et d'ajouter un timestamp
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const nameWithoutExtension = name.split('.')[0];
    //Résout l'extension de fichier approprié
    const extension = MIME_TYPES[file.mimetype];
    callback(null, nameWithoutExtension + Date.now() + '.' + extension);
  }
});

//constante storage ajoutée à multer et gestion uniquement des fichiers images
module.exports = multer({ storage: storage }).single('image');